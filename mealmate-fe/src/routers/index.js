import AdminDashboardPage from "../pages/AdminPage/AdminDashboardPage";
import AdminRecipePage from "../pages/AdminPage/AdminRecipePage";
import HomePage from "../pages/PublicPage/HomePage";
import LoginSuccessPage from "../pages/PublicPage/LoginSuccessGooglePage";
import AccountPage from "../pages/UserPage/AccountPage";
import DailyMenuPage from "../pages/UserPremiumPage/DailyMenuPage";
import ProfilePage from "../pages/UserPage/ProfilePage";

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
    page: AccountPage,
    layout: DefaultLayoutComponent,
    isPrivate: true,
  },
  {
    path: "/account/daily-menu",
    page: DailyMenuPage,
    layout: DefaultLayoutComponent,
    isPrivate: true,
  },
  {
    path: "/account/profile",
    page: ProfilePage,
    layout: DefaultLayoutComponent,
    isPrivate: true,
  },
];

// Combine all routes
export const routes = [...publicRoutes, ...adminRoutes, ...userRoutes];
