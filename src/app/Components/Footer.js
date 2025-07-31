import Link from "next/link";

import { FaCalendar, FaUmbrellaBeach, FaMoneyBillAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 -translate-y-24 border border-gray-200/80 py-3 px-2 flex gap-2 shadow-lg rounded-xl bg-white/80 hover:shadow-xl transition-all duration-300">
      <div className="group relative px-3 cursor-pointer">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300">
          <Link href="/">
            <p>
              <FaCalendar size={25} fill="dodgerblue" />
            </p>
          </Link>
        </div>
      </div>
      <div className="group relative px-3 cursor-pointer">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg  transition-colors duration-300">
          <Link href="/ferias">
            <p>
              <FaUmbrellaBeach size={25} fill="orange" />
            </p>
          </Link>
        </div>
      </div>
      <div className="group relative px-3 cursor-pointer">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg  transition-colors duration-300">
          <Link href="/salario">
            <p>
              <FaMoneyBillAlt size={25} fill="forestgreen" />
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
