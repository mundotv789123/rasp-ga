## Encurtador de links rasp.ga

Site demo: [rasp.ga](https://rasp.ga).

Projeto simples de encurtador de links

## inicialização via Docker

> Instalando o docker e dependências.

```bash
curl -sSL https://get.docker.com/ | CHANNEL=stable bash
apt install -y docker-compose git
```

> Baixando e inicinando projeto.

```
cd /srv && git clone https://github.com/mundotv789123/rasp-ga.git && cd ./rasp-ga
docker-compose up -d
```

> Para iniciar, parar e reiniciar o projeto

```bash
docker-compose start

docker-compose stop

docker-compose restart
```
