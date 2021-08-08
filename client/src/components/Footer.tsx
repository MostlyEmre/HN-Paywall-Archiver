import { Legend } from "./Legend";
import { SiNodeDotJs, SiReact, SiTypescript, SiFirebase } from "react-icons/si";
export const Footer = () => {
  return (
    <div className="my-10">
      <hr className="mb-2 border-4 rounded-full border-gray-900" />
      <p className="text-sm text-gray-500 italic">* "All" since August 7, 2021.</p>
      <div className="inline-block sm:flex justify-between">
        <div className="mt-4">
          <p className="text-lg text-center">
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
          <div className="text-gray-400 text-2xl mt-2">
            <SiNodeDotJs className="inline-block mr-4" />
            <SiReact className="inline-block mr-4" />
            <SiTypescript className="inline-block mr-4" />
            <SiFirebase className="inline-block mr-4" />
          </div>
        </div>
        <div>
          <Legend />
        </div>
      </div>
    </div>
  );
};
