FROM nginxinc/nginx-unprivileged:1.27-alpine

# Site configuration (listens on 8080, runs as non-root user 101)
COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf

# Static site
COPY --chown=101:101 index.html blog.html github.html youtube.html sudoer.html about.html /usr/share/nginx/html/
COPY --chown=101:101 assets/ /usr/share/nginx/html/assets/
COPY --chown=101:101 blog/   /usr/share/nginx/html/blog/

EXPOSE 8080
