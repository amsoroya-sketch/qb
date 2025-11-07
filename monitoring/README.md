# arQ Monitoring Stack

This directory contains the monitoring infrastructure for the arQ platform using Prometheus and Grafana.

## Components

- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **Postgres Exporter**: PostgreSQL metrics
- **Redis Exporter**: Redis metrics
- **Node Exporter**: System metrics

## Quick Start

### 1. Start the monitoring stack

```bash
# From the project root
docker-compose -f docker-compose.yml -f monitoring/docker-compose.monitoring.yml up -d
```

### 2. Access the UIs

- **Grafana**: http://localhost:3002
  - Username: `admin`
  - Password: `admin` (change on first login)

- **Prometheus**: http://localhost:9090

### 3. View Dashboards

In Grafana:
1. Go to Dashboards
2. Open "arQ Platform Overview"
3. View real-time metrics

## Metrics Available

### Backend Metrics

The backend exposes Prometheus metrics at `/api/v1/metrics`:

- **HTTP Metrics**:
  - `http_requests_total` - Total HTTP requests
  - `http_request_duration_seconds` - Request duration histogram
  - `http_request_size_bytes` - Request size histogram
  - `http_response_size_bytes` - Response size histogram

- **Process Metrics**:
  - `process_cpu_seconds_total` - CPU usage
  - `process_resident_memory_bytes` - Memory usage
  - `process_open_fds` - Open file descriptors
  - `process_max_fds` - Maximum file descriptors

- **Node.js Metrics**:
  - `nodejs_eventloop_lag_seconds` - Event loop lag
  - `nodejs_active_handles_total` - Active handles
  - `nodejs_active_requests_total` - Active requests
  - `nodejs_heap_size_total_bytes` - Heap size
  - `nodejs_heap_size_used_bytes` - Heap used
  - `nodejs_external_memory_bytes` - External memory

### Database Metrics

PostgreSQL exporter provides:
- Connection count
- Transaction rate
- Query performance
- Lock statistics
- Replication lag (if applicable)

### Redis Metrics

Redis exporter provides:
- Memory usage
- Key count
- Hit/miss ratio
- Evicted keys
- Connected clients
- Command statistics

### System Metrics

Node exporter provides:
- CPU usage
- Memory usage
- Disk I/O
- Network I/O
- Filesystem usage

## Alerts

Alerts are configured in `prometheus/alerts.yml`:

- **Critical Alerts** (require immediate action):
  - API is down
  - Database is down
  - Redis is down

- **Warning Alerts** (require attention):
  - High CPU usage (>80%)
  - High memory usage (>500MB)
  - High error rate (>5%)
  - Slow response time (>1s p95)
  - PostgreSQL too many connections (>80)
  - Redis memory high (>80%)

## Custom Dashboards

### Creating a New Dashboard

1. Open Grafana (http://localhost:3002)
2. Click "Create" → "Dashboard"
3. Add panels with PromQL queries
4. Save the dashboard
5. Export as JSON
6. Save to `monitoring/grafana/dashboards/`

### Example PromQL Queries

**Request rate:**
```promql
rate(http_requests_total{job="backend"}[5m])
```

**Error rate:**
```promql
rate(http_requests_total{job="backend",status=~"5.."}[5m])
```

**Response time (95th percentile):**
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job="backend"}[5m]))
```

**Memory usage:**
```promql
process_resident_memory_bytes{job="backend"}
```

**Database connections:**
```promql
pg_stat_database_numbackends
```

## Production Deployment

### Kubernetes

For Kubernetes deployments, use the Prometheus Operator:

```bash
# Install Prometheus Operator
kubectl create -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/bundle.yaml

# Create ServiceMonitor for backend
kubectl apply -f k8s/monitoring/service-monitor.yaml
```

### Cloud Providers

- **AWS**: Use Amazon Managed Prometheus and Grafana
- **GCP**: Use Google Cloud Monitoring
- **Azure**: Use Azure Monitor

## Retention and Storage

### Prometheus Retention

Default retention: 15 days

To change retention:
```yaml
# In docker-compose.monitoring.yml
command:
  - '--storage.tsdb.retention.time=30d'  # 30 days
  - '--storage.tsdb.retention.size=10GB' # or 10GB
```

### Grafana Storage

Grafana data is stored in a Docker volume: `grafana_data`

To backup:
```bash
docker run --rm -v monitoring_grafana_data:/data -v $(pwd):/backup alpine tar czf /backup/grafana-backup.tar.gz /data
```

## Troubleshooting

### Prometheus can't scrape backend

Check if backend is exposing metrics:
```bash
curl http://localhost:3001/api/v1/metrics
```

If not, ensure the metrics endpoint is implemented.

### Grafana can't connect to Prometheus

Check Prometheus datasource configuration:
1. Go to Configuration → Data Sources
2. Test the Prometheus connection
3. Ensure URL is `http://prometheus:9090`

### No data in dashboards

1. Check Prometheus targets: http://localhost:9090/targets
2. Ensure all targets are "UP"
3. Check time range in Grafana (top-right corner)

### High memory usage

Reduce Prometheus retention or scrape frequency:
```yaml
# In prometheus.yml
global:
  scrape_interval: 30s  # Increase from 15s
```

## Security

### Production Recommendations

1. **Enable authentication** on all monitoring tools
2. **Use HTTPS** for Grafana
3. **Restrict access** with firewall rules
4. **Rotate passwords** regularly
5. **Enable audit logging** in Grafana
6. **Use secrets management** for credentials

### Grafana Security

```yaml
# In docker-compose.monitoring.yml
environment:
  - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}  # Use env var
  - GF_AUTH_ANONYMOUS_ENABLED=false
  - GF_AUTH_BASIC_ENABLED=true
  - GF_AUTH_DISABLE_LOGIN_FORM=false
```

## Advanced Configuration

### Long-term Storage

For long-term storage, integrate with:
- **Thanos**: Prometheus long-term storage
- **Cortex**: Multi-tenant Prometheus
- **VictoriaMetrics**: Time series database

### Alerting

To enable alerting, configure Alertmanager:

```yaml
# alertmanager.yml
global:
  slack_api_url: 'YOUR_SLACK_WEBHOOK'

route:
  receiver: 'slack-notifications'
  group_by: ['alertname', 'severity']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h

receivers:
  - name: 'slack-notifications'
    slack_configs:
      - channel: '#alerts'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
```

## Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [PromQL Cheat Sheet](https://promlabs.com/promql-cheat-sheet/)
- [Grafana Dashboards](https://grafana.com/grafana/dashboards/)
