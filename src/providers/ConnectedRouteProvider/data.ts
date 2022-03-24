import loadable from "@loadable/component";

const Dashboard = loadable(() => import("../../pages/Dashboard/Dashboard"));
const Portfolio = loadable(() => import("../../pages/Portfolio/Portfolio"));
const PortfolioDetails = loadable(() => import("../../pages/PortfolioDetails/PortfolioDetails"));
const Stake = loadable(() => import("../../pages/Stake/Stake"));
// const OldStake = loadable(() => import("../../pages/OldStake/Stake"));
// const Farms = loadable(() => import("../../pages/OldStake/FarmContainer"));
// const Farm = loadable(() => import("../../pages/OldStake/Farming/Farming"));
// const Farms = loadable(() => import("../../pages/Farms"));
const Farm = loadable(() => import("../../pages/Farms/Detail/Farm"));
// const CommingSoon = loadable(() => import("../../pages/OldStake/ComingSoon"));
export const RouteComponents = [
  // {
  //   key: "Dashboard",
  //   component: ComingSoon,
  //   exact: true,
  //   path: "/"
  // }
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
    component: CommingSoon,
    exact: true,
    path: "/stake"
  },
  // {
  //   key: "Farms",
  //   component: Farms,
  //   exact: true,
  //   path: "/farms"
  // },
  {
    key: "Farm",
    component: Farm,
    exact: false,
    path: "/farm/:id"
  }
];
