
#
# run this container on your server to use traefik as a reverse proxy
#
docker run -d \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $PWD/traefik.toml:/traefik.toml \
  -p 80:80 \
  -p 443:443 \
  --restart unless-stopped \
  --network web \
  --name traefik \
  traefik:v2.10
