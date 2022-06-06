## Encurtador de links rasp.ga

Site demo: [rasp.ga](https://rasp.ga).

Projeto simples de encurtador de links

### inicialização via Docker
```bash
curl -sSL https://get.docker.com/ | CHANNEL=stable bash
apt install docker-compose
cd /srv
git clone git@github.com:mundotv789123/rasp-ga.git
cd rasp-ga
docker-composer up -d
```
