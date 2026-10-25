// App.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { routes } from "./routes/config.ts";
import Header from "./components/PageStructure/Header.tsx";
import Footer from "./components/PageStructure/Footer.tsx";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { ModalProvider } from "./components/ModalViews/ModalProvider.tsx";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-800">
      <p>Something went wrong:</p>
      <pre className="text-sm">{String(error)}</pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 p-2 bg-red-200 rounded"
      >
        Try again
      </button>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on route change
  }, [pathname]);

  return (
    <>
      <ModalProvider />
      <HelmetProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Header />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {routes.map(({ path, component: Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
            </Routes>
          </Suspense>
          <Footer />
        </ErrorBoundary>
      </HelmetProvider>
    </>
  );
}
