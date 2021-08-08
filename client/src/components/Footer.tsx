import React from "react";
import { Legend } from "./Legend";

export const Footer = () => {
  return (
    <div>
      <p className="text-lg">
        Made by{" "}
        <a href="http://" target="_blank" rel="noopener noreferrer">
          Emre
        </a>
        . Code is on{" "}
        <a href="https://github.com/EmreYYZ/HN-Paywall-Archiver" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </p>
      <Legend />
    </div>
  );
};
