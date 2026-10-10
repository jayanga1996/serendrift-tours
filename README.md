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

Uploaded images are stored in `public/uploads`. Tours, page text, and guest requests are stored in MySQL.

## MySQL

Copy `.env.example` to `.env.local` and set the MySQL user, password, and database name. Then create the tables and load the sample journeys:

```bash
npm run db:setup
```

The database name defaults to `serendrift`. The first setup writes the sample site into these tables: `site_profile`, `hero_slides`, `deals`, `destinations`, `stays`, `testimonials`, `stats`, `reasons`, `tours`, and `bookings`.

## API

| Method | Path | Who |
| --- | --- | --- |
| GET | `/api/health` | Anyone. Checks the MySQL connection. |
| GET | `/api/content` | Guests see published tours. A signed-in planner also sees hidden tours. |
| PUT | `/api/content` | Planner. Saves the whole website. |
| GET | `/api/tours` | Anyone. Optional `?type=day` or `?type=multi`, and `?place=sigiriya`. |
| GET | `/api/tours/[slug]` | Anyone. |
| GET | `/api/destinations` | Anyone. |
| GET | `/api/destinations/[slug]` | Anyone. Includes the tours for that place. |
| GET | `/api/stays` | Anyone. |
| POST | `/api/bookings` | Anyone. Saves a guest registration. |
| GET | `/api/bookings` | Planner. |
| PATCH | `/api/bookings/[id]` | Planner. Updates status or the private note. |
| DELETE | `/api/bookings/[id]` | Planner. |
