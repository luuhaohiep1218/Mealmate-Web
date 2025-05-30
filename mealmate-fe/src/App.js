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
            const Layout = route.layout || Fragment;
            const Wrapper = route.wrapper || Fragment;

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
                  <Wrapper>
                    <Layout>
                      <route.page />
                    </Layout>
                  </Wrapper>
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
