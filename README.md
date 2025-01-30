# BuddyTrading WebSocket Server

## Development usage

### Requirements

- Node.js > 20.x
- pnpm > 9.x

### Configuration

Copy `.env.example` to `.env` and set the correct values.
Update `config.dev.json` if needed.

```bash
pnpm install && pnpm dev
```

## Production usage

### Requirements

- Docker > 27.x
- Helm v3.x

### Configuration

Copy `helm/config/config.prod.json.example` to `helm/config/config.prod.json` and set the correct values.
Copy `helm/values.yaml.example` to `helm/values.yaml` and set the correct values.

### Installation or Upgrade

```bash
helm dep up
helm upgrade --install buddytrading-ws-server helm
```

### Monitoring

#### Grafana

![alt text](/doc/grafana.png)
![alt text](/doc/grafana-1.png)
Use `grafana-rule.json` to create a rule for high CPU usage

## Features

- [x] Websocket server
  - [x] Binance integration
  - [x] Bybit integration
  - [x] Config.json integration
  - [x] Zod request validation
  - [x] Error handling
  - [x] Logging
- [x] DevOps
  - [x] Github Actions: build and push image to ghcr.io
  - [x] Dockerfile with multi-stage build
  - [x] Helm
    - [x] Websocket server chart template
    - [x] Grafana
      - [x] Alert for CPU
      - [ ] Alert for Memory usage
      - [ ] Alert for Pod restarts
    - [x] Prometheus
      - [x] Track number of connections,
      - [x] Track errors rate
      - [ ] Track messages latency
    - [x] Rolling updates
    - [x] Readiness and Liveness probes
    - [x] Auto pull new image
