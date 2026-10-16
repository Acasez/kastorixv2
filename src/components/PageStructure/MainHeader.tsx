import { NavLink } from "react-router-dom";
import { routes } from "../../routes/config";

export default function MainHeader() {
  const headerRoutes = routes.filter((route) => route.createHeader);

  return (
    <nav
      className="bg-black text-text-light border-striking border-b-2"
      role="navigation"
    >
      <ul className="flex list-none w-full p-0 m-0 max-md:flex-col max-md:w-full md:flex-wrap md:justify-center xl:flex-nowrap">
        {headerRoutes.map((route) => (
          <li
            key={route.path}
            className="relative grow text-center px-4 py-2.5 text-xl max-md:w-full max-md:text-left md:max-[1080px]:flex-initial md:max-[1080px]:min-w-30 md:max-[1080px]:text-base md:max-[1080px]:px-2.5 md:max-[1080px]:py-2"
          >
            <NavLink
              to={route.path || "/"}
              end={route.path === "" || route.path === "/index"}
              className="block text-text-light no-underline whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 hover:text-gray-300 [&.active]:font-bold"
            >
              {route.header || "Dashboard"}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
