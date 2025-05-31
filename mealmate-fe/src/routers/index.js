import AdminDashboardPage from "../pages/AdminPage/AdminDashboardPage";
import AdminRecipePage from "../pages/AdminPage/AdminRecipePage";
import HomePage from "../pages/PublicPage/HomePage";
import LoginSuccessPage from "../pages/PublicPage/LoginSuccessGooglePage";
import AccountPage from "../pages/UserPage/AccountPage";
import DailyMenuPage from "../pages/UserPremiumPage/DailyMenuPage";
import ProfilePage from "../pages/UserPage/ProfilePage";
import ChangePasswordPage from "../pages/UserPage/ChangePasswordPage";
import AdminLoginPage from "../pages/PublicPage/AdminLoginPage";
import AdminLayoutComponent from "../components/Layout/AdminLayoutComponent";
import DefaultLayoutComponent from "../components/Layout/DefaultLayoutComponent";
import AdminMenuPage from "../pages/AdminPage/AdminMenuPage";
import NotFoundPage from "../pages/PublicPage/NotFoundPage";
import AdminLoginRoute from "../components/AdminLoginRoute";
import HomeBlogPage from "../pages/PublicPage/HomeBlogPage";
import AllBlogPage from "../pages/PublicPage/AllBlogPage";
import CategoryBlogPage from "../pages/PublicPage/CategoryBlogPage";

// Các tuyến đường công khai (không cần đăng nhập)
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
  {
    path: "/admin/login",
    page: AdminLoginPage,
    wrapper: AdminLoginRoute,
  },
  {
    path: "/blogs",
    page: HomeBlogPage,
    layout: DefaultLayoutComponent,
  },
  {
    path: "/blogs/all-blogs",
    page: AllBlogPage,
    layout: DefaultLayoutComponent,
  },
  {
    path: "/blogs/category/:slug",
    page: CategoryBlogPage,
    layout: DefaultLayoutComponent,
  },
];

// Các tuyến đường quản trị
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
  {
    path: "/admin/menus",
    page: AdminMenuPage,
    layout: AdminLayoutComponent,
    isPrivate: true,
    allowedRoles: ["ADMIN"],
  },
];

// Các tuyến đường người dùng
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
  {
    path: "/account/change-password",
    page: ChangePasswordPage,
    layout: DefaultLayoutComponent,
    isPrivate: true,
  },
];

// Tuyến đường không tìm thấy
export const notFoundRoute = {
  path: "*",
  page: NotFoundPage,
};

// Kết hợp tất cả các tuyến đường
export const routes = [
  ...publicRoutes,
  ...adminRoutes,
  ...userRoutes,
  notFoundRoute,
];
