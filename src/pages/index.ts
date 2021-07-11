import loadable from "@loadable/component";

const Dashboard = loadable(() => import("./Dashboard/Dashboard"));
const Portfolio = loadable(() => import("./Portfolio/Portfolio"));
const Staking = loadable(() => import("./Staking/Staking"));

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
    key: "Staking",
    component: Staking,
    exact: true,
    path: "/staking"
  }
];

export const loadableComponents = {
  Dashboard,
  Portfolio,
  Staking
};
