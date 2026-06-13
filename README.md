# nataCONNECT

A desktop-first security and finance dashboard that runs entirely in the browser with no paid platform, account, API key, or backend required.

The current release combines SentinelAI security with a self-contained finance advisor adapted from the public [nataCONNECT](https://github.com/lordofpastitsio/nataCONNECT) concept. A compact product switch moves between both experiences.

**Live site:** https://chrispitsillides.github.io/Sentinel_AI/

The site is deployed automatically from `main` with GitHub Pages.

## Features

- Explainable on-device risk scoring with evidence for every verdict
- Twelve behavioral and domain-structure scam detection models
- One-tap judge demo with bank impersonation, investment, and safe-link scenarios
- Actionable safety guidance and private scan history
- Combined security and finance workspaces under Sentinel Connect
- Payment guardrails, finance guide, practice decisions, bounded-growth simulation, and savings goals
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

## Validation

Run `npm test` to verify the core scam, safe-link, and platform comparison scenarios.
