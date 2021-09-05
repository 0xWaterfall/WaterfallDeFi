import loadable from "@loadable/component";

const Dashboard = loadable(() => import("./Dashboard/Dashboard"));
const Portfolio = loadable(() => import("./Portfolio/Portfolio"));
const PortfolioDetails = loadable(() => import("./PortfolioDetails/PortfolioDetails"));
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
    exact: false,
    path: "/portfolio",
    redirect: "/portfolio/markets"
  },
  {
    key: "PortfolioDetails",
    component: PortfolioDetails,
    exact: true,
    path: "/portfolioDetails"
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
  Staking,
  PortfolioDetails
};
