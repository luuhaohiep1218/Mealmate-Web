import AdminDashboardPage from "../pages/AdminPage/AdminDashboardPage";
import AdminRecipePage from "../pages/AdminPage/AdminRecipePage";
import UserAccountPage from "../pages/UserPage/UserAccountPage";

import AdminLayoutComponent from "../components/Layout/AdminLayoutComponent";
import DefaultLayoutComponent from "../components/Layout/DefaultLayoutComponent";

export const routes = [
  {
    path: "/admin/dashboard",
    page: AdminDashboardPage,
    layout: AdminLayoutComponent, // Sử dụng layout admin
    isPrivate: true,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/admin/recipes",
    page: AdminRecipePage,
    layout: AdminLayoutComponent, // Sử dụng layout admin
    isPrivate: true,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/account",
    page: UserAccountPage,
    layout: DefaultLayoutComponent, // Sử dụng layout admin
    isPrivate: true,
    allowedRoles: ["USER"],
  },
];
