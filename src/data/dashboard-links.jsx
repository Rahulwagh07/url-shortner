import { ACCOUNT_TYPE } from "../utils/constants";

export const sidebarLinks = [
  {
    id: 1,
    name: "Manage Urls",
    path: "/dashboard/manage-urls",
    type: ACCOUNT_TYPE.USER,
    icon: "VscLink",
  }, 
  {
    id: 2,
    name: "Reports",
    path: "/dashboard/reports",
    type: ACCOUNT_TYPE.USER,
    icon: "VscReport",
  },
  {
    id: 3,
    name: "Analytics",
    path: "/dashboard/analytics",
    type: ACCOUNT_TYPE.USER,
    icon: "VscGraph",
  },
  {
    id: 4,
    name: "User Management",
    path: "/admin/dashboard/users",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscAccount",
  },
  {
    id: 5,
    name: "Url Management",
    path: "/admin/dashboard/urls",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscLink",
  },
  {
    id: 6,
    name: "Reports",
    path: "/admin/dashboard/reports",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscReport",
  },
  {
    id: 7,
    name: "Analytics",
    path: "/admin/dashboard/analytics",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscGraph",
  },
  {
    id: 8,
    name: "Global Variables",
    path: "/admin/dashboard/global-variables",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscWorkspaceTrusted",
  },
  {
    id: 9,
    name: "Panel Options",
    path: "/admin/dashboard/panel-options",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscThreeBars",
  },
];

