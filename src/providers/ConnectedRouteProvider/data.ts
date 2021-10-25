import loadable from "@loadable/component";

const Dashboard = loadable(() => import("../../pages/Dashboard/Dashboard"));
const Portfolio = loadable(() => import("../../pages/Portfolio/Portfolio"));
const PortfolioDetails = loadable(() => import("../../pages/PortfolioDetails/PortfolioDetails"));
const Stake = loadable(() => import("../../pages/Stake/Stake"));
const OldStake = loadable(() => import("../../pages/OldStake/Stake"));

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
    exact: false,
    path: "/portfolio"
  },
  {
    key: "PortfolioDetails",
    component: PortfolioDetails,
    exact: true,
    path: "/portfolio-details"
  },
  {
    key: "Stake",
    component: OldStake,
    exact: true,
    path: "/stake"
  }
];
