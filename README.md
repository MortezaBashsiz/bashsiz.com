# bashsiz.com

Personal website of Morteza Bashsiz — a static site (HTML/CSS/JS, no build step).

- Site settings, blog post list and videos: `assets/config.js`
- New blog post: copy a file in `blog/`, edit it, and add it to `posts` in `assets/config.js`

## Run locally

```sh
python3 -m http.server 8000      # then open http://localhost:8000
# or with Docker
docker build -t bashsiz.com . && docker run --rm -p 8080:8080 bashsiz.com
```

## Container image

`Dockerfile` serves the site with `nginxinc/nginx-unprivileged` (non-root, port 8080).
Config: `deploy/nginx/default.conf` (health check at `/healthz`).

On every push to `main`, `.github/workflows/main-docker-image.yml` builds and pushes:

```
docker.io/netsudoer/production-bashsiz-com:{latest,<unix-timestamp>,<git-sha>}
```

### GitHub secrets

| Secret | Required | Value |
| --- | --- | --- |
| `DOCKER_USERNAME` | yes | Docker Hub user with push access to `netsudoer` |
| `DOCKER_PASSWORD` | yes | Docker Hub access token for that user (Read & Write) |
| `KUBECONFIG` | only if auto-rollout is enabled | kubeconfig allowed to restart the deployment |

## Kubernetes

`deploy/k8s/bashsiz-com.yaml` — Namespace, Deployment (2 replicas), Service and nginx Ingress
for `bashsiz.com` / `www.bashsiz.com` (www redirects to the apex, TLS via `tls-acme`).

The image is public on Docker Hub, so no image pull secret is needed.

```sh
kubectl apply -f deploy/k8s/bashsiz-com.yaml

# after a new image is pushed
kubectl -n production-bashsiz-com rollout restart deployment/bashsiz-com
```
