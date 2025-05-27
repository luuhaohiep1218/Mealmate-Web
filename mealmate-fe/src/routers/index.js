import AdminDashboardPage from "../pages/AdminPage/AdminDashboardPage";
import AdminRecipePage from "../pages/AdminPage/AdminRecipePage";
import UserAccountPage from "../pages/UserPage/UserAccountPage";
import HomePage from "../pages/PublicPage/HomePage";
import LoginSuccessPage from "../pages/PublicPage/LoginSuccessGooglePage";

import AdminLayoutComponent from "../components/Layout/AdminLayoutComponent";
import DefaultLayoutComponent from "../components/Layout/DefaultLayoutComponent";

// Public routes (không cần đăng nhập)
export const publicRoutes = [
  {
    path: "/",
    page: HomePage,
    layout: DefaultLayoutComponent,
  },
  {
    path: "/login-success",
    page: LoginSuccessPage,
  },
];

// Admin routes
export const adminRoutes = [
  {
    path: "/admin/dashboard",
    page: AdminDashboardPage,
    layout: AdminLayoutComponent,
    isPrivate: true,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/admin/recipes",
    page: AdminRecipePage,
    layout: AdminLayoutComponent,
    isPrivate: true,
    allowedRoles: ["ADMIN"],
  },
];

// User routes
export const userRoutes = [
  {
    path: "/account",
    page: UserAccountPage,
    layout: DefaultLayoutComponent,
    isPrivate: true,
  },
];

// Combine all routes
export const routes = [...publicRoutes, ...adminRoutes, ...userRoutes];
