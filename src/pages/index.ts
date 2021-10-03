import loadable from "@loadable/component";

const Dashboard = loadable(() => import("./Dashboard/Dashboard"));
const Portfolio = loadable(() => import("./Portfolio/Portfolio"));
const PortfolioDetails = loadable(() => import("./PortfolioDetails/PortfolioDetails"));
const Stake = loadable(() => import("./Stake/Stake"));
const Farming = loadable(() => import("./Stake/Farming/Farming"));
const Staking = loadable(() => import("./Stake/Staking/Staking"));

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
    key: "Stake",
    component: Stake,
    exact: true,
    path: "/stake"
  },
  {
    key: "Farming",
    component: Farming,
    exact: true,
    path: "/stake/farming/:id"
  },
  {
    key: "Staking",
    component: Staking,
    exact: true,
    path: "/stake/staking/:id"
  }
];

export const loadableComponents = {
  Dashboard,
  Portfolio,
  Stake,
  PortfolioDetails,
  Farming,
  Staking
};
