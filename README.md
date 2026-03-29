# PolyEdge — Polymarket Strategy Playbook

A complete interactive guide to trading Polymarket profitably. 8 strategies, live calculators, and whale-tracking tools — all in a single deployable website.

## What's inside

- **8 trading strategies** (4 core, 4 uncommon) with full step-by-step execution guides
- **Cross-platform arbitrage calculator** — calculates net profit after fees in real time
- **Bond strategy yield calculator** — annualised return and monthly income projections
- **Essential tools directory** — every resource you need to execute
- **Portfolio allocation guide** — recommended bankroll split across strategies
- **Risk management rules** — the fundamentals that separate profitable traders

## Deploy to GitHub Pages (5 minutes)

1. **Create a new GitHub repository**
   ```
   Go to github.com → New repository → Name it anything (e.g. polyedge)
   ```

2. **Upload the files**
   ```
   Upload all four files to the repository:
   - index.html
   - style.css
   - data.js
   - app.js
   ```

3. **Enable GitHub Pages**
   ```
   Repository → Settings → Pages → Source: Deploy from branch → Branch: main → / (root) → Save
   ```

4. **Your site is live at:**
   ```
   https://yourusername.github.io/polyedge
   ```

## Deploy with Git CLI

```bash
git clone https://github.com/yourusername/polyedge
cd polyedge
# copy the four files into this folder
git add .
git commit -m "initial deploy"
git push origin main
```
Then enable GitHub Pages in repository Settings → Pages.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure and layout |
| `style.css` | All styles and responsive design |
| `data.js` | All strategy content, tools, allocations |
| `app.js` | Interactive logic — modals, calculators, filters |

## Customising

All content lives in `data.js`. To add a strategy, add an object to the `STRATEGIES` array following the same structure. To update allocations or tools, edit the `ALLOCATIONS` and `TOOLS` arrays.

---

Built for information purposes only. Prediction market trading involves significant financial risk.
