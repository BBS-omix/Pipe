import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Router } from "wouter";

// GitHub Pages provides BASE_URL as "/Pipe/"; Wouter is happier without trailing slash.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

console.log("[Pipe] BASE_URL =", import.meta.env.BASE_URL, "-> Router base =", BASE);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router base={BASE}>
      <App />
    </Router>
  </React.StrictMode>
);
