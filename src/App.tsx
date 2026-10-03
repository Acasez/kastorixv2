// App.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { routes } from "./routes/config.ts";
import MainHeader from "./components/PageStructure/MainHeader.tsx";
import Footer from "./components/PageStructure/Footer.tsx";
/* import { ErrorBoundary } from "react-error-boundary";
TODO FIX Error Boundary

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-800">
      <p>Something went wrong:</p>
      <pre className="text-sm">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 p-2 bg-red-200 rounded"
      >
        Try again
      </button>
    </div>
  );
} */

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on route change
  }, [pathname]);

  return (
    <>
      <MainHeader />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {routes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}
