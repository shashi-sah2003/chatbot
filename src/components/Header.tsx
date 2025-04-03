"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiChevronDown, FiPlus } from "react-icons/fi";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";

interface MenuOption {
  id: number;
  label: string;
  description: string;
  path: string;
}

const menuOptions: MenuOption[] = [
  {
    id: 0,
    label: "DTU Assistant",
    description: "General DTU inquiries",
    path: "/",
  },
  {
    id: 1,
    label: "Result",
    description: "ask for result of B.tech",
    path: "/result",
  },
  {
    id: 2,
    label: "DTU Notice",
    description: "ask for Notice",
    path: "/notice",
  },
  {
    id: 3,
    label: "PYQ's",
    description: "get previous year papers",
    path: "/pyq_solutions",
  },
];

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentButton, setCurrentButton] = useState<string>("DTU ChatBot");
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuOption[]>(menuOptions);
  const [conversationOpen, setConversationOpen] = useState<boolean>(false);
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // Listen for conversation state changes dispatched from ChatPage.
  useEffect(() => {
    const handler = (e: Event): void => {
      const customEvent = e as CustomEvent<{ conversationOpen: boolean }>;
      setConversationOpen(customEvent.detail.conversationOpen);
    };
    window.addEventListener("conversation-changed", handler);
    return () => window.removeEventListener("conversation-changed", handler);
  }, []);
  
  useEffect(() => {
    // Reset conversationOpen on every route change
    setConversationOpen(false);
  
   if (pathname === "/result_26" || pathname === "/result_27") {
      const label = pathname === "/result_26" ? "Result-26" : "Result-27";
      setCurrentButton(label);
      setFilteredMenuItems(menuOptions.filter((item) => item.path !== "/result"));
      toast.success(`Switched to ${label}`, {
        position: "top-center",
        style: { 
          background: "linear-gradient(to right, #2F2F2F, #3a3a3a)", 
          color: "#fff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          borderLeft: "4px solid #4f46e5"
        },
      });
    } else {
      const currentItem = menuOptions.find((item) => item.path === pathname);
      setCurrentButton(currentItem?.label || "DTU ChatBot");
      setFilteredMenuItems(menuOptions.filter((item) => item.path !== pathname));
      if (currentItem) {
        toast.success(`Switched to ${currentItem.label}`, {
          position: "top-center",
          style: { 
            background: "linear-gradient(to right, #2F2F2F, #3a3a3a)", 
            color: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            borderLeft: "4px solid #4f46e5"
          },
        });
      }
    }
    // Optionally, you can also close the dropdown on route change
    setDropdownOpen(false);
  }, [pathname]);
  
  const handleMenuItemClick = (path: string): void => {
    localStorage.removeItem("chatHistory");
    router.push(path);
    setDropdownOpen(false);
  };

  const toggleDropdown = (): void => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <div className="flex items-center justify-between h-16 w-full px-3 sm:px-6 bg-gradient-to-r from-[#1a1a1a] to-[#2F2F2F]">
        <div className="flex items-center gap-4">
          {/* Mobile: Dropdown Menu (visible below md breakpoint) */}
          <div className="relative md:hidden">
            <div
              tabIndex={0}
              role="button"
              onClick={toggleDropdown}
              className="btn m-1 bg-[#2F2F2F] hover:bg-[#3a3a3a] px-4 py-2 rounded-lg text-white font-medium tracking-wide flex items-center gap-2 border border-gray-700 shadow-md transition-all duration-300 cursor-pointer"
            >
              <span
                className={`transition-all duration-300 overflow-hidden ${
                  currentButton === ""
                    ? "max-w-0 opacity-0"
                    : "max-w-xs opacity-100"
                }`}
              >
                {currentButton || "Menu"}
              </span>
              <FiChevronDown size={18} className="text-indigo-400" />
            </div>
            {isDropdownOpen && (
              <ul className="absolute top-full mt-2 dropdown-content menu bg-gradient-to-b from-[#2d2d2d] to-[#222222] rounded-lg z-[1] w-60 p-3 shadow-lg border border-gray-700 transition-all duration-300">
                {filteredMenuItems.map((item) => (
                  <li key={item.id} className="mb-1">
                    <a
                      onClick={() => handleMenuItemClick(item.path)}
                      className="cursor-pointer rounded-md hover:bg-[#3d3d3d] transition-all duration-200"
                    >
                      <div className="text-sm py-1">
                        <p className="font-semibold tracking-wide text-white">
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="text-[13px] font-medium text-indigo-300">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Tablet & Laptop: Inline Navigation (visible on md and above) */}
          <nav className="hidden md:flex items-center gap-8">
            {menuOptions.map((item) => {
              const isActive =
                pathname === item.path ||
                (item.path === "/result" &&
                  (pathname === "/result_26" || pathname === "/result_27"));
              return (
                <div key={item.id}>
                  {isActive ? (
                    <Link
                      href={item.path}
                      className="text-white font-bold relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[3px] after:bg-indigo-500 after:rounded-full hover:text-indigo-300 transition-colors duration-200"
                    >
                      {item.path === "/result" &&
                      (pathname === "/result_26" || pathname === "/result_27")
                        ? currentButton
                        : item.label}
                    </Link>
                  ) : (
                    <HoverCard openDelay={100} closeDelay={200}>
                      <HoverCardTrigger asChild>
                        <Link
                          href={item.path}
                          onClick={() => handleMenuItemClick(item.path)}
                          className="text-gray-300 hover:text-indigo-300 transition-colors duration-200 font-medium"
                        >
                          {item.label}
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent className="bg-gradient-to-b from-[#2F2F2F] to-[#222222] text-white p-3 rounded-lg shadow-xl border border-indigo-900/40 w-56">
                        <div className="flex flex-col gap-1">
                          <h3 className="font-bold text-indigo-400">{item.label}</h3>
                          <p className="text-sm text-gray-300">
                            {item.description}
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
        
        {/* New Session button */}
        <div>
          {conversationOpen && (
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("new-session"))
              }
              className="flex items-center gap-1 sm:gap-2 text-white bg-indigo-600 hover:bg-indigo-700 font-medium py-2 px-2 rounded-md transition-all duration-200 shadow-md text-xs sm:text-sm"
            >
              <FiPlus size={16} />
              <span className="text-white hover:text-gray-300 font-semibold py-1 px-3 rounded-md transition-colors duration-200">New</span>
            </button>
          )}
        </div>
      </div>
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
    </>
  );
};

export default Header;