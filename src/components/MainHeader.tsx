import { NavLink } from "react-router-dom";
import { routes } from "../routes/config";
import "../CSS/headerStyle.css";

export default function MainHeader() {
  // Filter routes that should appear in the header
  const headerRoutes = routes.filter((route) => route.createHeader);

  return (
    <nav className="bg-bg-header text-text-light h-15 topnav" role="navigation">
      <ul className="flex justify-center gap-5 text-3xl">
        {headerRoutes.map((route) => {
          // Extract the path for display (e.g., "/login" → "Login")

          return (
            <li key={route.path}>
              <NavLink
                to={route.path || "/"} // Handle empty path
                end={route.path === "" || route.path === "/index"}
                className={"text-2xl"}
              >
                {route.header || "Dashboard"} {/* Fallback for empty path */}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
