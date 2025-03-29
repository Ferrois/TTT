import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import Home from "./pages/home";
import App from "./App";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/home", element: <Home /> },
    ],
  },
]);
