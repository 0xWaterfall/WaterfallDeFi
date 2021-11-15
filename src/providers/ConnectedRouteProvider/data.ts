import loadable from "@loadable/component";
import ComingSoon from "../../pages/OldStake/ComingSoon";

const Dashboard = loadable(() => import("../../pages/Dashboard/Dashboard"));
const Portfolio = loadable(() => import("../../pages/Portfolio/Portfolio"));
const PortfolioDetails = loadable(() => import("../../pages/PortfolioDetails/PortfolioDetails"));
const Stake = loadable(() => import("../../pages/Stake/Stake"));
const OldStake = loadable(() => import("../../pages/OldStake/Stake"));
const CommingSoon = loadable(() => import("../../pages/OldStake/ComingSoon"));
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
  }
];
