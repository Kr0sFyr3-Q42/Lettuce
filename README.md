# Lettuce 🥬
> Lettuce plan your meals.

A self-hosted AI meal planner for your home network. Tell it how many people are eating each day, pick your dietary tags, and let Claude generate a full weekly menu with a consolidated shopping list — zero-waste logic included.

---

## How it works

Lettuce uses a three-step flow:

1. **Configure** — set the number of diners per day (Mon–Sun) and pick your dietary tags
2. **Audit** — the AI scans your freezer inventory and meal history, then suggests what to use and when
3. **Plan** — Claude generates a full weekly menu with recipes and a supermarket shopping list, grouped by department

---

## Features

- **People Picker** — set the number of diners per day (Mon–Sun)
- **Dietary Tags** — mix and match constraints per day or for the whole week (vegetarian, gluten-free, lactose-free, keto, etc.) or define custom ones with your own prompt rules
- **AI Auditor** — before generating, the AI scans your freezer and meal history and suggests what to use
- **AI Planner** — generates a full week of meals + a shopping list grouped by supermarket department
- **Zero-Waste Logic** — partially used ingredients (half a cabbage, an open can) are carried forward into other meals
- **Pantry Exclusions** — staples you always have (olive oil, salt, flour) never appear on the shopping list
- **Supermarket-Aware Quantities** — amounts are rounded to realistic pack sizes so you're not buying 340g of mince
- **Saved Menus** — save and rescale previous menus for a different number of people

---

## Tech Stack

- [Next.js 15](https://nextjs.org) — App Router, TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team) + SQLite — runs locally, no cloud DB needed
- [Anthropic SDK](https://docs.anthropic.com) — Claude 3.5 Sonnet

---

## Getting Started

### Prerequisites

- Node.js 20+
- An [Anthropic API key](https://console.anthropic.com)

### Install

```bash
git clone https://github.com/Kr0sFyr3-Q42/lettuce.git
cd lettuce
npm install
```

### Configure

```bash
cp .env.example .env.local
# Fill in ANTHROPIC_API_KEY in .env.local
```

### Run

```bash
npm run db:migrate   # set up the local SQLite database
npm run dev          # http://localhost:3000
```

---

## Self-Hosting

Lettuce is designed for your local network — no cloud account or auth required. Run it on any machine and access it from any browser on the same network.

```bash
npm run build
npm start
```

For always-on use, run it via PM2 or a systemd service on a home server or NAS.

---

## Contributing

Contributions are welcome. Open an issue first for anything beyond small fixes so we can align on approach before you put in the work.

---

## License

[AGPL-3.0](LICENSE) © 2026 Paul Kros

Free to use and self-host. If you modify and run it as a network service, you must publish your changes under the same license.
