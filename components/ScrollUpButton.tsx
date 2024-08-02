import React from "react";
import { IoMdArrowDropup } from "react-icons/io";
import ScrollToTop from "react-scroll-up";

export const ScrollUpButton = () => {
  return (
    <div>
      <ScrollToTop showUnder={200} easing="easeOutCubic" duration={2000}>
        <div className="bg-white p-3 rounded-full drop-shadow-md text-3xl">
          <IoMdArrowDropup />
        </div>
      </ScrollToTop>
    </div>
  );
};
