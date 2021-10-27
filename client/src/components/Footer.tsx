import { Legend } from "./Legend";
import { SiNodeDotJs, SiReact, SiTypescript, SiFirebase } from "react-icons/si";
export const Footer = () => {
  return (
    <div className="my-10">
      <hr className="mb-2 border-4 rounded-full border-gray-900" />
      <p className="text-sm text-gray-500 italic">* "All" since August 7, 2021.</p>
      <div className="block mt-4 md:hidden ">
        <Legend />
      </div>
      <div className="inline-block sm:flex justify-between">
        <div className="mt-4 mr-6">
          <p className="text-lg">
            Made by{" "}
            <a className="link" href="https://emre.ca" target="_blank" rel="noopener noreferrer">
              Emre
            </a>
            . The code is on{" "}
            <a className="link" href="https://github.com/EmreYYZ/HN-Paywall-Archiver" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            . HN Paywall Archiver was created to help with my paywall-aware HN reader project,{" "}
            <a className="link" href="https://hn.emre.ca" target="_blank" rel="noopener noreferrer">
              HNN
            </a>
            .
          </p>
          <div className="text-gray-400 text-2xl mt-2 mb-4">
            <SiNodeDotJs className="inline-block mr-4" />
            <SiReact className="inline-block mr-4" />
            <SiTypescript className="inline-block mr-4" />
            <SiFirebase className="inline-block mr-4" />
          </div>
        </div>
        <div className="hidden md:block ">
          <Legend />
        </div>
      </div>
    </div>
  );
};
