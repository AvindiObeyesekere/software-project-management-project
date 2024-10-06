import { useState, createContext, useContext } from "react";
import {
  FaHome,
  FaBell,
  FaEnvelope,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaTasks,
} from "react-icons/fa";
import { MdChevronLeft, MdChevronRight, MdTask } from "react-icons/md";
import { AiFillFileAdd } from "react-icons/ai";
import { SiFiles } from "react-icons/si";
import { RiDashboardFill } from "react-icons/ri";
import logo from "../assets/logo.png";
import profile from "../assets/profile.png";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex h-screen">
      <aside
        className={`fixed top-0 left-0 h-full transition-all duration-300 ${
          expanded ? "w-[250px]" : "w-[80px]"
        } bg-white border-r shadow-sm z-50`}
      >
        <nav className="h-full flex flex-col">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src={logo}
              className={`overflow-hidden transition-all duration-300 ${
                expanded ? "w-20" : "w-0"
              }`}
              alt="Logo"
            />
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? (
                <MdChevronLeft size={24} />
              ) : (
                <MdChevronRight size={24} />
              )}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3 space-y-2">
              
            <SidebarItem icon={<FaHome />} text="Home" to="/" />
              <SidebarItem
                icon={<FaBell />}
                text="Notifications"
                to="/notifications"
                alert
              />
              
              <SidebarItem
                icon={<FaTasks />}
                text="ShowAllTasks"
                to="/task/showAll"
              />
              
              <SidebarItem
                icon={<AiFillFileAdd />}
                text="Create Project"
                to="/createrepo"
              />
              <SidebarItem
                icon={<SiFiles />}
                text="Display Projects"
                to="/displayproj"
              />
              <SidebarItem
                icon={<RiDashboardFill />}
                text="Repo DashBoard"
                to="/repodashboard"
              />
              <SidebarItem icon={<FaCog />} text="Settings" to="/settings" />
              <SidebarItem icon={<FaQuestionCircle />} text="Help" to="/help" />
              <SidebarItem
                icon={<FaSignOutAlt />}
                text="LogOut"
                to="/log-out"
              />
            </ul>
          </SidebarContext.Provider>

          <div className="border-t flex p-3">
            <img src={profile} className="w-10 h-10 rounded-md" alt="Profile" />
            <div
              className={`flex justify-between items-center overflow-hidden transition-all duration-300 ${
                expanded ? "w-full ml-3" : "w-0"
              }`}
            >
              <div className="leading-4">
                <h4 className="font-semibold">Code Analyzer</h4>
                <span className="text-xs text-gray-600">
                  code.analyzer@gmail.com
                </span>
              </div>
              <div className="flex items-center">
                <FaQuestionCircle size={20} />
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <main
        className={`flex-1 transition-all duration-300 ${
          expanded ? "ml-[250px]" : "ml-[80px]"
        } bg-gray-100`}
      >
        {children}
      </main>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export function SidebarItem({ icon, text, active, alert, to }) {
  const { expanded } = useContext(SidebarContext);
  const navigate = useNavigate();

  return (
    <li
      onClick={() => navigate(to)}
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
      }`}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? "w-full ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        ></div>
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
