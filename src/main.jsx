import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
// import { theme } from "./chakra/theme";
// import Fonts from "./chakra/Fonts";
// import { system } from "@chakra-ui/react/preset";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  // <ChakraProvider theme={theme}>
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
  // </React.StrictMode>
);
