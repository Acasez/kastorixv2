// routes/config.js
import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

/** A lazy-loaded page component */
export type LazyPage = LazyExoticComponent<ComponentType>;

/** One node of the route tree */
export interface RouteNode {
  /** Real routable path. Omitted on pure dropdown triggers. */
  path?: string;
  /** Lazy page component. Required for the node to be navigable. */
  component?: LazyPage;
  /** Text shown in the nav bar */
  header?: string;
  /** Wrap the header text in <u> (used on your name) */
  underline?: boolean;
  /** false → hidden from the header, still routable */
  createHeader?: boolean;
  /** Nested items → rendered as a dropdown menu */
  children?: RouteNode[];
}

/** A node guaranteed to be a real route (path + component) */
export interface RoutableRoute {
  path: string;
  component: LazyPage;
}

/** Type guard: node is a real route */
function isRoutable(node: RouteNode): node is RouteNode & RoutableRoute {
  return typeof node.path === "string" && typeof node.component !== "undefined";
}

/** Recursively flattens the tree, keeping only real routes */
export function flattenRoutes(nodes: RouteNode[]): RoutableRoute[] {
  return nodes.flatMap((node): RoutableRoute[] => {
    const self: RoutableRoute[] = isRoutable(node)
      ? [{ path: node.path, component: node.component }]
      : [];
    const nested: RoutableRoute[] = flattenRoutes(node.children ?? []);
    return [...self, ...nested];
  });
}

export const routes: RouteNode[] = [
  {
    path: "/kastorixv2/",
    component: lazy(() => import("../pages/RPGOverview")),
    header: "Overview",
    createHeader: true,
  },
  {
    path: "/kastorixv2/characterSheet",
    component: lazy(() => import("../pages/CharacterSheet")),
    header: "Character Sheet",
    createHeader: true,
  },
  {
    path: "/kastorixv2/DMScreen",
    component: lazy(() => import("../pages/DMScreen")),
    header: "DM Screen",
    createHeader: true,
  },
  {
    path: "/kastorixv2/WorldMap",
    component: lazy(() => import("../pages/WorldMap")),
    header: "World Map",
    createHeader: true,
  },
];
