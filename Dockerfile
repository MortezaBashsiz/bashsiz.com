# 1.30.7 (nginx security fixes) is published on GHCR before Docker Hub.
FROM ghcr.io/nginx/nginx-unprivileged:1.30.7-alpine

# Unique per build (CI passes the git SHA). Appended to CSS/JS URLs so browsers
# and CDNs (Cloudflare) fetch fresh files after every deploy.
ARG VERSION=dev

# Site configuration (listens on 8080, runs as non-root user 101)
COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf

# Static site
COPY --chown=101:101 index.html blog.html github.html youtube.html sudoer.html about.html /usr/share/nginx/html/
COPY --chown=101:101 assets/ /usr/share/nginx/html/assets/
COPY --chown=101:101 blog/   /usr/share/nginx/html/blog/
COPY --chown=101:101 fa/     /usr/share/nginx/html/fa/

# Cache-bust: assets/style.css -> assets/style.css?v=<VERSION> (same for .js)
USER root
RUN apk upgrade --no-cache \
 && find /usr/share/nginx/html -name '*.html' -exec \
      sed -i -E "s#(assets/[A-Za-z0-9_-]+\.(css|js))\"#\1?v=${VERSION}\"#g" {} + \
 && grep -q "?v=${VERSION}" /usr/share/nginx/html/index.html
USER 101

EXPOSE 8080
