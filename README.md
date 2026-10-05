# UserWidget Host POC

This is a standalone React 18 + TypeScript application and a separate Git repository. It consumes the remote's `userWidget/UserWidget` React component over Webpack 5 Module Federation; it does not import the remote's source tree.

## Run both applications locally

Terminal 1 — start the remote in `~/Projects/MFPOC`:

```sh
npm ci
BROWSER=none npm start
```

Terminal 2 — start this host:

```sh
cd ~/Projects/MFPOC-Host
npm ci
BROWSER=none npm start
```

Open `http://localhost:3001`. The host uses `React.lazy` and `Suspense` to load the remote asynchronously, then passes `userId`, `tenantId`, and `appTheme` as normal component props. The remote wrapper turns those props into its context and React Query provider.

The host starts synchronously from `src/index.tsx`. Because the host imports React and React DOM at startup, those two shared packages use `eager: true` in the host's Module Federation configuration. This is an alternative to an async `import('./bootstrap')` boundary. The tradeoff is that eager shared dependencies and their local fallbacks are included in the initial download. React Query and styled-components remain non-eager because the host does not use them to start its own UI; the remote widget loads when React renders it.

The production build defaults to the deployed remote at `https://mfpoc-omega.vercel.app`. To point at a different remote, set `USER_WIDGET_REMOTE_URL` to its origin before building. Vercel uses the same override when the variable is configured in the host project's environment settings.

This repository includes `vercel.json`; import it into Vercel with the default build settings. It builds with `npm run build`, publishes `build`, and rewrites application routes to `index.html`.

`src/types/remotes.d.ts` declares the remote component for TypeScript. The declaration belongs to the host because the federated module name is resolved by this host's Webpack configuration.

## Build and typecheck

```sh
npm run build
npm run typecheck
```
