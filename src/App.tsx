// App.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { routes } from "./routes/config.ts";
import MainHeader from "./components/PageStructure/MainHeader.tsx";
import Footer from "./components/PageStructure/Footer.tsx";

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
