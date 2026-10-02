import { lazy, Suspense } from "react";

const UserWidget = lazy(() => import("userWidget/UserWidget"));

export default function App() {
  return (
    <main className="host-shell">
      <header className="host-header">
        <p className="host-kicker">Independent consumer application</p>
        <h1>Host app</h1>
        <p>This page loads UserWidget at runtime from a separately built remote.</p>
      </header>
      <section className="remote-panel" aria-label="Federated UserWidget">
        <Suspense fallback={<div className="remote-status">Loading remote widget…</div>}>
          <UserWidget userId={2} tenantId="host-demo-tenant" appTheme="teal" />
        </Suspense>
      </section>
      <footer>Host origin · localhost:3001 <span>Remote origin · configured at build time</span></footer>
    </main>
  );
}
