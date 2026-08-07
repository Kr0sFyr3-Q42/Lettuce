# Lettuce 🥬
> Lettuce plan your meals.

A self-hosted AI meal planner for your home network. Tell it how many people are eating each day, pick your dietary tags, and let Claude generate a full weekly menu with a consolidated shopping list — zero-waste logic included.

---


## Impression

<img width="2819" height="2042" alt="image" src="https://github.com/user-attachments/assets/b33f7c13-b7f7-4573-b35b-f0967cd97d14" />
<img width="2827" height="2042" alt="image" src="https://github.com/user-attachments/assets/d0bcdb52-0291-4ecc-942e-0d12163db67d" />


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
npm run db:seed      # seed system tags and pantry basics
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
