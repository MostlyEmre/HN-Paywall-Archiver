import React from "react";
import { Legend } from "./Legend";

export const Footer = () => {
  return (
    <div className="my-10">
      <Legend />

      <p className="text-lg">
        Made by{" "}
        <a className="font-extrabold" href="https://emre.la" target="_blank" rel="noopener noreferrer">
          Emre
        </a>
        . The code is on{" "}
        <a className="font-extrabold" href="https://github.com/EmreYYZ/HN-Paywall-Archiver" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </p>
    </div>
  );
};
