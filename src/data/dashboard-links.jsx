import { ACCOUNT_TYPE } from "../utils/constants";

export const sidebarLinks = [
  {
    id: 1,
    name: "User Management",
    path: "/admin/dashboard/users",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Url Management",
    path: "/admin/dashboard/urls",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "Reports",
    path: "/admin/dashboard/reports",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscVm",
  },
  {
    id: 4,
    name: "Global Variables",
    path: "/admin/dashboard/global-variables",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscMortarBoard",
  },
  {
    id: 5,
    name: "Panel Options",
    path: "/admin/dashboard/panel-options",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscHistory",
  },
  {
    id: 6,
    name: "Manage Urls",
    path: "/dashboard/manage-urls",
    type: ACCOUNT_TYPE.USER,
    icon: "VscHistory",
  },
  {
    id: 7,
    name: "Category",
    path: "/admin/dashboard/category",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscHistory",
  },
];

