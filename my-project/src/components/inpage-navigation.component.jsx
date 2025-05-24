import { useEffect, useRef, useState } from "react";

const InPageNavigation = ({ routes  }) => {
  const [inPageNavIndex, setInPageNavIndex] = useState(0);
  const activeTabLineRef = useRef();
  const buttonsRef = useRef([]);

  const changePageState = (i) => {
    setInPageNavIndex(i);
  };

  useEffect(() => {
    const btn = buttonsRef.current[inPageNavIndex];
    if (btn && activeTabLineRef.current) {
      const { offsetWidth, offsetLeft } = btn;
      activeTabLineRef.current.style.width = offsetWidth + "px";
      activeTabLineRef.current.style.left = offsetLeft + "px";
    }
  }, [inPageNavIndex]);

  return (
    <div className="relative mb-8 bg-white border-b border-gray-50 flex flex-nowrap  overflow-x-scroll scrollbar-hidden">
      {routes.map((route, i) => (
        <button
          key={i}
          ref={(el) => (buttonsRef.current[i] = el)}
          onClick={() => changePageState(i)}
          className={`p-4 px-5 capitalize ${
            inPageNavIndex === i ? "text-black" : "text-gray-400"
          }`}
        >
          {route}
        </button>
      ))}
      <hr
        ref={activeTabLineRef}
        className="absolute bottom-0 h-[2px] bg-black duration-300 transition-all"
      />
    </div>
  );
};

export default InPageNavigation;
