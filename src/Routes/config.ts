// routes/config.js
import { lazy } from "react";

export const routes = [
  {
    path: "",
    component: lazy(() => import("../Subpages/RPGOverview")),
  },
  {
    path: "/index",
    component: lazy(() => import("../Subpages/RPGOverview")),
  },
];
