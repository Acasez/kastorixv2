// routes/config.js
import { lazy } from "react";

export const routes = [
  {
    path: "",
    component: lazy(() => import("../pages/RPGOverview")),
    createHeader: false,
  },
  {
    path: "/index",
    component: lazy(() => import("../pages/RPGOverview")),
    createHeader: true,
  },
  {
    path: "/characterSheet",
    component: lazy(() => import("../pages/CharacterSheet")),
    createHeader: true,
  },
];
