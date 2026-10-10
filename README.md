# Serendrift

A private Sri Lanka travel site built with Next.js. Tourists can browse journeys and register a trip. The planner desk lets you change tours, photos, stays, and read those registrations.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Planner desk

Open [http://localhost:3000/admin](http://localhost:3000/admin).

- Email: `admin@serendrift.lk`
- Password: `Serendrift@2026`

Change those in `.env.local` before the site is public. Copy `.env.example` and set `AUTH_SECRET` to a long random string.

From the desk you can:

- Edit, hide, or add tours, including prices, itineraries, and photos
- Replace homepage slides, destination photos, stays, and the about story
- Read guest registrations from the website form, and mark them contacted or confirmed

Uploaded images are stored in `public/uploads`. Tour and page text is stored in `data/content.json`. Guest requests are stored in `data/bookings.json`.
