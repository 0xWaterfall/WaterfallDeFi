import loadable from "@loadable/component";

const Dashboard = loadable(() => import("../../pages/Dashboard/Dashboard"));
const Portfolio = loadable(() => import("../../pages/Portfolio/Portfolio"));
const PortfolioDetails = loadable(() => import("../../pages/PortfolioDetails/PortfolioDetails"));
const Stake = loadable(() => import("../../pages/Stake/Stake"));
const Farm = loadable(() => import("../../pages/Farms/Detail/Farm"));
const Blog = loadable(() => import("../../pages/Blog"));
const BlogDetail = loadable(() => import("../../pages/Blog/Detail"));
const ComingSoon = loadable(() => import("../../pages/OldStake/ComingSoon"));
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
    component: Stake,
    exact: true,
    path: "/stake"
  },
  {
    key: "ComingSoon",
    component: ComingSoon,
    exact: true,
    path: "/comingsoon"
  },
  {
    key: "Farm",
    component: Farm,
    exact: false,
    path: "/farm/:id"
  },
  {
    key: "Blog",
    component: Blog,
    exact: true,
    path: "/blog"
  },
  {
    key: "BlogDetail",
    component: BlogDetail,
    exact: true,
    path: "/blog/:title"
  }
];
