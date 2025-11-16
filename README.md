# Net Link Planner

This Vite + React app helps network technicians model up to two switches, pair their ports, and print a physical label for the connection using an Xprinter XP-460B thermal label printer.

## Features

- Create and remove up to two switch/device cards with custom metadata.
- Select two ports to propose a link, commit the link, and keep a history of committed pairs.
- Persist devices and links to `localStorage` so the UI survives refreshes.
- One-click printing flow that isolates the "Committed links" card on a 100 mm × 150 mm label layout tailored to the XP-460B.

## Getting started

```bash
npm install
npm run dev
```

- `npm run dev` – start the Vite dev server with HMR.
- `npm run build` – generate a production build in `dist/`.
- `npm run preview` – serve the production build locally.
- `npm run lint` – run ESLint over the project.

## Usage

1. Click **Insert device** to add a switch, name it, and configure ports/order.
2. Select ports on each device; once two ports are selected, either undo or commit the link.
3. Review committed links in the summary card.
4. Press **Print label** to open the browser print dialog with only the committed links content visible.

### Printing on the XP-460B

The stylesheet includes a print media query that:

- Sets the page size to 100 mm × 150 mm (4"×6") with 4 mm margins.
- Hides the rest of the UI so the label only shows the committed links.
- Repositions the card to fill the printable page.

In the system print dialog select the **Xprinter XP-460B**, make sure the page size matches 100 mm × 150 mm, and confirm the print.
