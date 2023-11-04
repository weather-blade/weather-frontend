# weather-frontend

Frontend web app used for displaying data from [backend API](https://github.com/weather-blade/weather-server)

Github action automatically builds and deploys the static files to github pages on every commit.

The whole app is SPA and is cached with service worker, so it can work offline and it can be installed as PWA.

The dashboard displays all sorts of data from the last 24 hours. You get real-time updates on the dashboard whenever new reading is received by backend API. This is done with server-sent events.

In history tab, you can look at all the data collected from each month.

The forecast tab displays forecast from [Met.no API](https://api.met.no/). You can opt-in to receive notifications every morning with forecast for that day (temperature, precipitation and a nice icon) - this is handled by the service worker. The notifications are sent out by [this script](https://github.com/weather-blade/weather-notifications).

## How to run this

- Clone the repository, then install packages:

```bash
pnpm install
```

- Run dev server:

```bash
pnpm run dev
```

- Or run dev server in docker:

```bash
pnpm run docker
```
