import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { routes } from "./routers/index";
import "./App.css";
import { MealMateProvider } from "./context/MealMateContext";

function App() {
  return (
    <MealMateProvider>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Layout = route.layout || Fragment; // Sử dụng layout từ route, mặc định là Fragment
            return route.isPrivate ? (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute allowedRoles={route.allowedRoles}>
                    <Layout>
                      <route.page />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            ) : (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Layout>
                    <route.page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </MealMateProvider>
  );
}

export default App;
