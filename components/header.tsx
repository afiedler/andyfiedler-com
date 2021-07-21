import { useState } from "react";
import PageGroup from "./PageGroup";

function Name() {
  return (
    <a href="/" className="flex items-center">
      <p className="font-body font-bold text-2xl text-primary dark:text-white">
        Andy Fiedler
      </p>
    </a>
  );
}

function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
      {/* Hamburger menu*/}
      <div className="flex items-center lg:hidden">
        <svg
          width="24"
          height="15"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fill-current text-primary dark:text-white"
        >
          <g fillRule="evenodd">
            <rect width="24" height="3" rx="1.5" />
            <rect x="8" y="6" width="16" height="3" rx="1.5" />
            <rect x="4" y="12" width="20" height="3" rx="1.5" />
          </g>
        </svg>
      </div>
      <div className="hidden lg:block">
        <ul className="flex items-center">
          {/* <li className="mr-6 relative group mb-1">
            <div className="absolute left-0 bottom-0 w-full transition-all h-0 group-hover:h-2 group-hover:bg-yellow opacity-75 z-20"></div>
            <a
              href="/"
              className="font-body font-medium text-lg text-primary dark:text-white group-hover:text-green dark:group-hover:text-secondary px-2 z-30 block relative transition-colors"
            >
              Intro
            </a>
          </li> */}

          <li className="mr-6 relative group mb-1">
            <div className="absolute left-0 bottom-0 w-full transition-all h-0 group-hover:h-2 group-hover:bg-yellow opacity-75 z-20"></div>
            <a
              href="/posts"
              className="font-body font-medium text-lg text-primary dark:text-white group-hover:text-green dark:group-hover:text-secondary px-2 z-30 block relative transition-colors"
            >
              Posts
            </a>
          </li>

          {/* <li className="mr-6 relative group mb-1">
            <div className="absolute left-0 bottom-0 w-full transition-all h-0 group-hover:h-2 group-hover:bg-yellow opacity-75 z-20"></div>
            <a
              href="/uses"
              className="font-body font-medium text-lg text-primary dark:text-white group-hover:text-green dark:group-hover:text-secondary px-2 z-30 block relative transition-colors"
            >
              Uses
            </a>
          </li> */}

          {/* <li className="mr-6 relative group mb-1">
            <div className="absolute left-0 bottom-0 w-full transition-all h-0 group-hover:h-2 group-hover:bg-yellow opacity-75 z-20"></div>
            <a
              href="/contact"
              className="font-body font-medium text-lg text-primary dark:text-white group-hover:text-green dark:group-hover:text-secondary px-2 z-30 block relative transition-colors"
            >
              Contact
            </a>
          </li> */}

          <li>
            <i className="bx text-3xl text-primary dark:text-white cursor-pointer"></i>
          </li>
        </ul>
      </div>
      <div
        className={`bg-black bg-opacity-80 fixed inset-0 z-20 flex opacity-0 pointer-events-none transition-opacity lg:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : ""
        }`}
      >
        <div className="ml-auto bg-blue-600 w-2/3 md:w-1/3 p-4">
          <svg
            viewBox="0 0 20 20"
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="fill-current text-white absolute top-0 right-0 mt-4 mr-4"
          >
            <path d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
          </svg>
          <i
            className="absolute top-0 right-0 mt-4 mr-4"
            onClick={() => setIsMobileMenuOpen(false)}
          ></i>
          <ul className="flex flex-col mt-8">
            {/* <li className="">
              <a
                href="/"
                className="font-body font-medium text-lg text-white px-2 block mb-3"
              >
                Intro
              </a>
            </li> */}

            <li className="">
              <a
                href="/posts"
                className="font-body font-medium text-lg text-white px-2 block mb-3"
              >
                Posts
              </a>
            </li>

            {/* <li className="">
              <a
                href="/uses"
                className="font-body font-medium text-lg text-white px-2 block mb-3"
              >
                Uses
              </a>
            </li> */}

            {/* <li className="">
              <a
                href="/contact"
                className="font-body font-medium text-lg text-white px-2 block mb-3"
              >
                Contact
              </a>
            </li> */}
          </ul>
        </div>
      </div>
    </>
  );
}

export default function Header() {
  return (
    <>
      <PageGroup>
        <div className="flex items-center justify-between py-6 lg:py-10">
          <Name />
          <Nav />
        </div>
      </PageGroup>
    </>
  );
}
