import { NavLink } from "react-router-dom";
import { routes } from "../../routes/config";
import type { RouteNode } from "../../routes/config";

function isVisible(node: RouteNode): boolean {
  return node.createHeader !== false;
}

interface NavItemProps {
  item: RouteNode;
  depth: number;
}

function NavItem({ item, depth }: NavItemProps) {
  const visibleChildren = (item.children ?? []).filter(isVisible);
  const hasChildren = visibleChildren.length > 0;
  const header = item.header || "Dashboard";
  const linkClassName = `block text-text-light no-underline whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 hover:text-gray-300 [&.active]:font-bold ${
    depth === 0 ? "" : "px-4 py-2 hover:bg-gray-800"
  }`;

  return (
    <li
      className={`relative ${
        depth === 0
          ? "grow text-center px-4 py-2.5 text-xl max-md:w-full max-md:text-left md:max-[1080px]:flex-initial md:max-[1080px]:min-w-30 md:max-[1080px]:text-base md:max-[1080px]:px-2.5 md:max-[1080px]:py-2"
          : "w-full text-left text-base"
      } ${hasChildren ? "[&:hover>ul]:block [&:focus-within>ul]:block" : ""}`}
    >
      {hasChildren ? (
        <div className="flex items-center justify-center gap-1 max-md:justify-start">
          {item.path ? (
            <NavLink
              to={item.path || "/"}
              end={item.path === "" || item.path === "/index"}
              className={linkClassName}
            >
              {item.underline ? <u>{header}</u> : header}
            </NavLink>
          ) : (
            <span
              tabIndex={0}
              aria-haspopup="true"
              className={`cursor-pointer text-text-light hover:text-gray-300 ${
                depth === 0
                  ? "w-full text-left"
                  : "w-full px-4 py-2 hover:bg-gray-800"
              }`}
            >
              {header}
            </span>
          )}
          <span aria-hidden="true" className="shrink-0 text-text-light">
            {depth === 0 ? "▼" : "◀"}
          </span>
        </div>
      ) : (
        <NavLink
          to={item.path || "/"}
          end={item.path === "" || item.path === "/index"}
          className={linkClassName}
        >
          {item.underline ? <u>{header}</u> : header}
        </NavLink>
      )}
      {hasChildren ? (
        <ul
          className={`absolute hidden ${
            depth === 0 ? "left-0 top-full" : "right-full top-0"
          } z-50 m-0 min-w-full list-none border border-striking bg-black p-0 text-text-light shadow-lg max-md:static max-md:w-full max-md:border-0 max-md:shadow-none`}
        >
          {visibleChildren.map((child) => (
            <NavItem
              key={child.path ?? child.header}
              item={child}
              depth={depth + 1}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function Header() {
  return (
    <nav
      className="bg-black text-text-light border-striking border-b-2"
      role="navigation"
    >
      <ul className="flex list-none w-full p-0 m-0 max-md:flex-col max-md:w-full md:flex-wrap md:justify-center xl:flex-nowrap">
        {routes.filter(isVisible).map((item) => (
          <NavItem key={item.path ?? item.header} item={item} depth={0} />
        ))}
      </ul>
    </nav>
  );
}
