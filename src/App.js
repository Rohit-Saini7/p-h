import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Body from "./components/Body";
import Footer from "./components/Footer";
import Error from "./components/Error";
import Contact from "./components/Contact";
import RestaurantMenu from "./components/RestaurantMenu";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

// App Layout
/**
 * Header
 *  - Logo
 *  - Nav Items(Right side)
 *  - Cart
 * Body
 *  - Search bar
 *  - Restaurant List
 *    - RestaurantCard
 *      - Image
 *      - Name
 *      - Rating
 *      - Cusines
 * Footer
 *  - Links
 *  - CopyRights
 */

const About = lazy(() => import("./components/About"));

const AppLayout = () => {
  return (
    <div className="m-auto w-[85%] min-h-screen flex flex-col box-border">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Body />,
      },
      {
        path: "/about",
        element: (
          <Suspense>
            <About />
          </Suspense>
        ),
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/restaurant/:resId",
        element: <RestaurantMenu />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={appRouter} />);
