# Kubernetes Deployment Guide for arQ

This directory contains Kubernetes manifests for deploying the arQ platform to a Kubernetes cluster.

## Prerequisites

1. **Kubernetes Cluster** (1.24+)
   - Local: Minikube, Kind, Docker Desktop
   - Cloud: GKE, EKS, AKS, DigitalOcean Kubernetes

2. **kubectl** installed and configured

3. **Docker images** built and pushed to a registry:
   ```bash
   # Build and push backend
   docker build -t your-registry/arq-backend:latest ./backend
   docker push your-registry/arq-backend:latest

   # Build and push frontend
   docker build -t your-registry/arq-frontend:latest ./frontend
   docker push your-registry/arq-frontend:latest
   ```

4. **Update image references** in:
   - `backend-deployment.yaml` (line 24)
   - `frontend-deployment.yaml` (line 24)

## Deployment Steps

### 1. Create Namespace

```bash
kubectl apply -f namespace.yaml
```

### 2. Create Secrets

**Important:** Never commit `secret.yaml` to git!

```bash
# Copy the example
cp secret.yaml.example secret.yaml

# Generate base64-encoded secrets
echo -n "your-postgres-password" | base64
echo -n "postgresql://postgres:your-password@postgres-service:5432/arq_production" | base64

# Generate JWT secrets (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Edit secret.yaml with your base64-encoded values
vim secret.yaml

# Apply the secret
kubectl apply -f secret.yaml
```

### 3. Create ConfigMap

Update `configmap.yaml` with your domain names, then apply:

```bash
kubectl apply -f configmap.yaml
```

### 4. Deploy PostgreSQL

```bash
kubectl apply -f postgres-deployment.yaml

# Wait for PostgreSQL to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n arq --timeout=300s

# Run migrations (one-time setup)
kubectl run -it --rm migrate \
  --image=your-registry/arq-backend:latest \
  --restart=Never \
  --namespace=arq \
  --env="DATABASE_URL=$(kubectl get secret arq-secrets -n arq -o jsonpath='{.data.DATABASE_URL}' | base64 -d)" \
  -- npx prisma migrate deploy
```

### 5. Deploy Redis

```bash
kubectl apply -f redis-deployment.yaml

# Wait for Redis to be ready
kubectl wait --for=condition=ready pod -l app=redis -n arq --timeout=300s
```

### 6. Deploy Backend

```bash
kubectl apply -f backend-deployment.yaml

# Check deployment status
kubectl rollout status deployment/backend -n arq

# Check logs
kubectl logs -f deployment/backend -n arq
```

### 7. Deploy Frontend

```bash
kubectl apply -f frontend-deployment.yaml

# Check deployment status
kubectl rollout status deployment/frontend -n arq

# Check logs
kubectl logs -f deployment/frontend -n arq
```

### 8. Setup Ingress (Optional)

If you're using an Ingress controller (e.g., nginx-ingress):

```bash
# Install nginx-ingress (if not already installed)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Update ingress.yaml with your domain names
vim ingress.yaml

# Apply ingress
kubectl apply -f ingress.yaml
```

## Verification

### Check All Resources

```bash
kubectl get all -n arq
```

### Test Health Endpoints

```bash
# Port forward backend
kubectl port-forward -n arq deployment/backend 3001:3001

# Test health endpoints
curl http://localhost:3001/api/v1/health
curl http://localhost:3001/api/v1/health/readiness

# Port forward frontend
kubectl port-forward -n arq deployment/frontend 3000:3000

# Open browser
open http://localhost:3000
```

### Check Logs

```bash
# Backend logs
kubectl logs -f deployment/backend -n arq

# Frontend logs
kubectl logs -f deployment/frontend -n arq

# PostgreSQL logs
kubectl logs -f deployment/postgres -n arq

# Redis logs
kubectl logs -f deployment/redis -n arq
```

### Check HPA (Horizontal Pod Autoscaler)

```bash
kubectl get hpa -n arq

# Watch HPA in real-time
kubectl get hpa -n arq --watch
```

## Scaling

### Manual Scaling

```bash
# Scale backend
kubectl scale deployment/backend --replicas=3 -n arq

# Scale frontend
kubectl scale deployment/frontend --replicas=3 -n arq
```

### Auto-scaling

HPA is configured for both backend and frontend:
- **CPU target:** 70%
- **Memory target:** 80%
- **Min replicas:** 2
- **Max replicas:** 10

## Updates and Rollbacks

### Rolling Update

```bash
# Update image
kubectl set image deployment/backend backend=your-registry/arq-backend:v2 -n arq

# Watch rollout
kubectl rollout status deployment/backend -n arq
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/backend -n arq

# Rollback to specific revision
kubectl rollout history deployment/backend -n arq
kubectl rollout undo deployment/backend --to-revision=2 -n arq
```

## Monitoring

### Resource Usage

```bash
# Pods resource usage
kubectl top pods -n arq

# Nodes resource usage
kubectl top nodes
```

### Events

```bash
kubectl get events -n arq --sort-by='.lastTimestamp'
```

## Troubleshooting

### Pod is CrashLoopBackOff

```bash
# Get pod name
kubectl get pods -n arq

# Describe pod
kubectl describe pod <pod-name> -n arq

# Check logs
kubectl logs <pod-name> -n arq --previous
```

### Database Connection Issues

```bash
# Test database connection from backend pod
kubectl exec -it deployment/backend -n arq -- sh
# Inside pod:
nc -zv postgres-service 5432
```

### Redis Connection Issues

```bash
# Test Redis connection from backend pod
kubectl exec -it deployment/backend -n arq -- sh
# Inside pod:
nc -zv redis-service 6379
```

## Cleanup

### Delete All Resources

```bash
# Delete all resources in namespace
kubectl delete namespace arq

# Or delete individual resources
kubectl delete -f .
```

## Security Best Practices

1. **Never commit `secret.yaml`** - it's in `.gitignore`
2. **Use strong secrets** (32+ characters, random)
3. **Enable RBAC** for service accounts
4. **Use Network Policies** to restrict pod-to-pod communication
5. **Enable Pod Security Policies**
6. **Regular updates** of container images
7. **Scan images** for vulnerabilities
8. **Use read-only root filesystem** where possible

## Production Checklist

- [ ] Secrets are strong and unique
- [ ] Domain names updated in `configmap.yaml` and `ingress.yaml`
- [ ] Docker images built and pushed to registry
- [ ] Image references updated in deployment files
- [ ] SSL/TLS certificates configured (cert-manager or manual)
- [ ] Persistent volumes backed up regularly
- [ ] Monitoring and alerting configured (Prometheus/Grafana)
- [ ] Log aggregation configured (ELK, Loki, CloudWatch)
- [ ] Resource requests/limits tuned based on load testing
- [ ] HPA thresholds adjusted for your workload
- [ ] Ingress rate limiting configured appropriately
- [ ] Database backups automated
- [ ] Disaster recovery plan documented

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Charts](https://helm.sh/) - For more advanced deployments
- [ArgoCD](https://argo-cd.readthedocs.io/) - GitOps continuous delivery
- [Prometheus Operator](https://prometheus-operator.dev/) - Monitoring
