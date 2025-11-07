# GitHub Actions Workflows

This directory contains CI/CD workflows for the arQ platform.

## Workflows

### 1. `ci.yml` - Continuous Integration

**Triggers:** Push and PR to `main`, `develop`, `staging`

**Jobs:**
- `backend-test`: Run backend tests, linting, type checking
- `frontend-test`: Run frontend tests, linting, type checking
- `e2e-tests`: Run Playwright E2E tests
- `docker-build`: Build Docker images
- `deploy-staging`: Deploy to staging (on `staging` branch)
- `deploy-production`: Deploy to production (on `main` branch)

### 2. `deploy-k8s.yml` - Kubernetes Deployment

**Triggers:**
- Push to `main` or `staging`
- Manual workflow dispatch

**Jobs:**
- `build-and-push`: Build and push Docker images to GitHub Container Registry
- `deploy-staging`: Deploy to staging Kubernetes cluster
- `deploy-production`: Deploy to production Kubernetes cluster

**Features:**
- Multi-platform builds (amd64, arm64)
- Blue-green deployments
- Database migrations
- Health check verification
- Automatic rollback on failure
- Slack notifications

### 3. `e2e-tests.yml` - E2E Tests

**Triggers:** Manual or scheduled

**Jobs:**
- Run Playwright tests
- Upload test results and screenshots

## Required Secrets

### Docker Registry (GitHub Container Registry)
- `GITHUB_TOKEN` (automatically provided)

### Kubernetes Clusters
- `KUBE_CONFIG_STAGING` - Kubeconfig for staging cluster
- `KUBE_CONFIG_PRODUCTION` - Kubeconfig for production cluster

### Staging Environment
- `STAGING_DATABASE_URL`
- `STAGING_JWT_ACCESS_SECRET`
- `STAGING_JWT_REFRESH_SECRET`
- `STAGING_JWT_SECRET`
- `STAGING_REFRESH_TOKEN_SECRET`
- `STAGING_POSTGRES_PASSWORD`

### Production Environment
- `PRODUCTION_DATABASE_URL`
- `PRODUCTION_JWT_ACCESS_SECRET`
- `PRODUCTION_JWT_REFRESH_SECRET`
- `PRODUCTION_JWT_SECRET`
- `PRODUCTION_REFRESH_TOKEN_SECRET`
- `PRODUCTION_POSTGRES_PASSWORD`

### Optional
- `SLACK_WEBHOOK` - For deployment notifications
- `VERCEL_TOKEN` - If using Vercel for frontend
- `DIGITALOCEAN_ACCESS_TOKEN` - If using DigitalOcean

## Setting Up Secrets

### 1. GitHub Container Registry

No setup needed - `GITHUB_TOKEN` is automatically provided.

### 2. Kubernetes Config

Generate kubeconfig:
```bash
# For your cluster
kubectl config view --flatten --minify > kubeconfig.yaml

# Base64 encode (for GitHub secret)
cat kubeconfig.yaml | base64
```

Add to GitHub:
1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `KUBE_CONFIG_STAGING` or `KUBE_CONFIG_PRODUCTION`
4. Value: Paste the base64-encoded kubeconfig

### 3. Database URLs

Format: `postgresql://user:password@host:port/database`

Example:
```
postgresql://postgres:securepassword@db.example.com:5432/arq_production
```

### 4. JWT Secrets

Generate strong secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this 4 times to generate:
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_SECRET`
- `REFRESH_TOKEN_SECRET`

## Manual Deployment

### Trigger Workflow Manually

1. Go to Actions tab
2. Select "Deploy to Kubernetes" workflow
3. Click "Run workflow"
4. Choose environment (staging or production)
5. Click "Run workflow"

### Using GitHub CLI

```bash
# Deploy to staging
gh workflow run deploy-k8s.yml -f environment=staging

# Deploy to production
gh workflow run deploy-k8s.yml -f environment=production
```

## Deployment Process

### Staging

1. Push to `staging` branch
2. CI tests run
3. Docker images built and pushed
4. Deploy to staging cluster:
   - Create namespace and secrets
   - Deploy PostgreSQL and Redis
   - Run database migrations
   - Deploy backend
   - Deploy frontend
   - Run smoke tests

### Production

1. Push to `main` branch (or manual trigger)
2. CI tests run
3. Docker images built and pushed
4. Deploy to production cluster:
   - Create namespace and secrets
   - Deploy PostgreSQL and Redis
   - Backup database
   - Run database migrations
   - Blue-green deploy backend
   - Blue-green deploy frontend
   - Run smoke tests
   - Rollback on failure
   - Send Slack notification

## Rollback

### Automatic Rollback

The workflow automatically rolls back on deployment failure.

### Manual Rollback

```bash
# Rollback backend
kubectl rollout undo deployment/backend -n arq

# Rollback frontend
kubectl rollout undo deployment/frontend -n arq

# Rollback to specific revision
kubectl rollout history deployment/backend -n arq
kubectl rollout undo deployment/backend --to-revision=2 -n arq
```

## Monitoring Deployments

### GitHub Actions UI

1. Go to Actions tab
2. Click on the workflow run
3. View logs for each job

### Kubernetes Cluster

```bash
# Watch deployment progress
kubectl rollout status deployment/backend -n arq --watch

# View pods
kubectl get pods -n arq

# View logs
kubectl logs -f deployment/backend -n arq

# View events
kubectl get events -n arq --sort-by='.lastTimestamp'
```

## Troubleshooting

### Build Failures

1. Check build logs in Actions tab
2. Common issues:
   - Missing dependencies in package.json
   - Type errors
   - Test failures

### Deployment Failures

1. Check deployment logs in Actions tab
2. Check Kubernetes events:
   ```bash
   kubectl get events -n arq --sort-by='.lastTimestamp'
   ```
3. Check pod logs:
   ```bash
   kubectl logs -f deployment/backend -n arq
   ```
4. Common issues:
   - Image pull errors (check registry authentication)
   - CrashLoopBackOff (check environment variables)
   - Database connection errors (check secrets)

### Health Check Failures

1. Check backend logs
2. Verify database and Redis connections
3. Test health endpoints manually:
   ```bash
   kubectl port-forward deployment/backend 3001:3001 -n arq
   curl http://localhost:3001/api/v1/health
   curl http://localhost:3001/api/v1/health/readiness
   ```

## Best Practices

1. **Always test in staging first** before deploying to production
2. **Review PR changes** before merging to main
3. **Monitor deployments** until smoke tests pass
4. **Keep secrets updated** and rotate regularly
5. **Review logs** after each deployment
6. **Set up alerts** for deployment failures
7. **Document changes** in PR descriptions
8. **Tag releases** for easier rollbacks

## Advanced Configuration

### Custom Deployment Steps

Edit `.github/workflows/deploy-k8s.yml` to add custom steps:

```yaml
- name: Custom deployment step
  run: |
    # Your custom logic here
    echo "Running custom deployment step"
```

### Environment-specific Configuration

Add environment-specific steps using conditionals:

```yaml
- name: Production-only step
  if: github.ref == 'refs/heads/main'
  run: |
    echo "This only runs in production"
```

### Slack Notifications

Configure Slack webhook:
1. Create Slack app and incoming webhook
2. Add `SLACK_WEBHOOK` secret to GitHub
3. Notifications will be sent on deployment success/failure

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [kubectl Reference](https://kubernetes.io/docs/reference/kubectl/)
