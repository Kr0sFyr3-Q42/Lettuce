# Lettuce 🥬
> Lettuce plan your meals.

A self-hosted AI meal planner for your home network. Tell it how many people are eating each day, pick your dietary tags, and let Claude generate a full weekly menu with a consolidated shopping list — zero-waste logic included.

---


## Impression

<img width="2819" height="2042" alt="image" src="https://github.com/user-attachments/assets/b33f7c13-b7f7-4573-b35b-f0967cd97d14" />
<img width="2827" height="2042" alt="image" src="https://github.com/user-attachments/assets/d0bcdb52-0291-4ecc-942e-0d12163db67d" />



https://github.com/user-attachments/assets/b405cd46-4d2a-46c3-968b-e7f028ea27d7

> The video has been fast forwarded (real generation takes around half a minute)
---

## How it works

Lettuce uses a three-step flow:

1. **Configure** — set the number of diners per day (Mon–Sun) and pick your dietary tags per day or for the whole week
2. **Audit** — the AI scans your kliekjes and meal history, then suggests what to use and when
3. **Plan** — Claude generates a full weekly menu with recipes and a supermarket shopping list, grouped by department

---

## Features

- **People Picker** — set the number of diners per day (Mon–Sun)
- **Dietary Tags** — mix and match constraints per day or for the whole week (vegetarian, gluten-free, lactose-free, keto, etc.) or define custom ones with your own prompt rules. Set defaults so your usual preferences are pre-filled every time.
- **AI Auditor** — before generating, the AI scans your kliekjes and meal history and suggests what to use
- **AI Planner** — generates a full week of meals + a shopping list grouped by supermarket department
- **Zero-Waste Logic** — partially used ingredients are carried forward into other meals
- **Pantry Management** — organise staples by location (fridge, freezer, cupboard). Items here are never put on the shopping list.
- **Supermarket-Aware Quantities** — amounts are rounded to realistic pack sizes
- **Saved Menus** — save, browse, and rescale previous menus for a different number of people

---

## Tech Stack

- [Next.js 15](https://nextjs.org) — App Router, TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team) + SQLite — runs locally, no cloud DB needed
- [Anthropic SDK](https://docs.anthropic.com) — Claude Haiku 4.5 (auditor) + Claude Sonnet 4.5 (planner)
- [Motion](https://motion.dev) — animations

---

## API Costs

Lettuce makes two AI calls per meal plan generation:

| Call | Model | Input | Output | Cost/call |
|------|-------|-------|--------|-----------|
| Kliekjes audit | Claude Haiku 4.5 | ~1 000 tokens | ~300 tokens | ~$0.002 |
| Meal plan | Claude Sonnet 4.5 | ~2 000 tokens | ~6 000 tokens | ~$0.10 |

**A full meal plan costs roughly $0.10 per generation.** The audit is skipped entirely when your kliekjes list is empty.

### Annual estimate (52 weeks)

| Usage | Cost/year |
|-------|-----------|
| Light (simple menus) | ~$3 |
| Typical | ~$5 |
| Heavy (culinair tags, full kliekjes) | ~$8 |

About the cost of one coffee per year. Pricing based on Haiku 4.5 at $1.00/$5.00 per 1M tokens and Sonnet 4.5 at ~$3.00/$15.00 per 1M tokens. Current rates via [Anthropic Console](https://console.anthropic.com).

---

## Getting Started

### Prerequisites

- Node.js 24+
- An [Anthropic API key](https://console.anthropic.com) _(optional at setup — can be added later via Settings)_

---

### Option A — Pre-built release _(recommended)_

Download the latest `lettuce-vX.X.X.tar.gz` from the [Releases page](https://github.com/Kr0sFyr3-Q42/lettuce/releases).

```bash
tar -xzf lettuce-vX.X.X.tar.gz   # replace vX.X.X with the actual version number found in Releases
cd lettuce-vX.X.X
npm install
npm start   # runs db:migrate + db:seed automatically, then starts on http://localhost:3000
```

The build is already included — no compilation needed.

---

### Option B — Build from source

```bash
git clone https://github.com/Kr0sFyr3-Q42/lettuce.git
cd lettuce
npm install
```

Optionally set your API key upfront:

```bash
cp .env.example .env.local
# set ANTHROPIC_API_KEY in .env.local (or add it later via Settings)
```

Then seed and run in dev mode:

```bash
npm run db:migrate   # set up the local SQLite database
npm run db:seed      # seed system tags and pantry basics
npm run dev          # http://localhost:3000
```

Or build for production:

```bash
npm run build
npm start
```

---

## Self-Hosting

Lettuce is designed for your local network — no cloud account or auth required. Run it on any machine and access it from any browser on the same network.

For always-on use, run it via PM2 or a systemd service on a home server or NAS.

---

## Security

**Lettuce has no authentication layer.** Anyone who can reach the server can use the app and trigger AI calls billed to your account.

If you store your API key via the Settings page, it is saved as **plaintext in the local SQLite database** (`local.db`) — similar to keeping it in a `.env` file. Treat the database file accordingly.

Only run Lettuce on a network you trust. Do not expose it to the internet without additional protection such as a reverse proxy with authentication, a VPN, or strict firewall rules. Running it on an untrusted or public network is entirely at your own risk — the authors accept no responsibility for unauthorised API usage or any resulting costs.

---

## Contributing

Contributions are welcome. Open an issue first for anything beyond small fixes so we can align on approach before you put in the work.

---

## License

[AGPL-3.0](LICENSE) © 2026 Paul Kros

Free to use and self-host. If you modify and run it as a network service, you must publish your changes under the same license.
