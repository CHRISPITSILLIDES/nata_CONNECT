# SentinelAI

A standalone, mobile-first fraud defense dashboard rebuilt from a Base44 prototype. It runs entirely in the browser with no paid platform, account, API key, or backend required.

## Features

- Security dashboard and live threat feed
- Multi-format threat scanner with local risk heuristics
- Broker and investment platform trust analysis
- Persistent personal protection rules
- Identity exposure and transaction simulations
- Community threat reports stored locally
- Guided emergency fraud recovery plan

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## Privacy

SentinelAI does not upload scan content. Demo analysis happens in your browser and preferences are stored in `localStorage`. For production-grade reputation or breach data, connect a trusted provider through your own server-side API.
