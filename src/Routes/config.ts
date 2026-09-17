// routes/config.js
import { lazy } from "react";

export const routes = [
  {
    path: "/kastorixv2",
    component: lazy(() => import("../pages/RPGOverview")),
    createHeader: false,
  },
  {
    path: "/kastorixv2/index",
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
];
