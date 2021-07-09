import loadable from "@loadable/component";

const Dashboard = loadable(() => import("./Dashboard/Dashboard"));
const Portfolio = loadable(() => import("./Portfolio/Portfolio"));
const Pool = loadable(() => import("./Pool/Pool"));
const History = loadable(() => import("./History/History"));

export const RouteComponents = [
  {
    key: "Dashboard",
    component: Dashboard,
    exact: true,
    path: "/"
  },
  {
    key: "Portfolio",
    component: Portfolio,
    exact: true,
    path: "/portfolio"
  },
  {
    key: "Pool",
    component: Pool,
    exact: true,
    path: "/pool"
  },
  {
    key: "History",
    component: History,
    exact: true,
    path: "/history"
  }
];

export const loadableComponents = {
  Dashboard,
  Portfolio,
  Pool,
  History
};
