"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiChevronDown } from "react-icons/fi";

const menuOptions = [
  { id: 0, label: "DTU ChatBot", description: "General DTU inquiries", path: "/" },
  { id: 1, label: "Result'26", description: "ask for result of batch 2k26", path: "/result_26" },
  { id: 2, label: "Result'27", description: "ask for result of batch 2k27", path: "/result_27" },
  { id: 3, label: "DTU Notice", description: "ask for Notice", path: "/notice" },
];

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentButton, setCurrentButton] = useState("DTU-ChatBot");
  const [filteredMenuItems, setFilteredMenuItems] = useState(menuOptions);

  useEffect(() => {
    const currentItem = menuOptions.find(item => item.path === pathname);
    setCurrentButton(currentItem?.label || "DTU-ChatBot");
    setFilteredMenuItems(menuOptions.filter(item => item.path !== pathname));

    // Show toast notification when route changes
    if (currentItem) {
      toast.success(`Switched to ${currentItem.label}`, {
        position: "top-center",
        style: { background: "#2F2F2F", color: "#fff" },
      });
    }
  }, [pathname]);

  const handleMenuItemClick = (path: string) => {
    localStorage.removeItem("chatHistory");
    router.push(path);
  };

  return (
    <>
      <div className="flex items-center justify-between h-16 w-full">
        {/* Grouping dropdown and About Us link together */}
        <div className="flex items-center gap-4">
          <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 bg-[#2F2F2F] hover:bg-primaryGray/50 px-3 py-2 rounded-lg text-primary-foreground/80 font-semibold tracking-wide flex items-center gap-1"
            >
              {currentButton}
              <FiChevronDown size={20} className="text-lg" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-[#2F2F2F] rounded-box z-[1] w-52 p-2 shadow"
            >
              {filteredMenuItems.map((item) => (
                <li key={item.id}>
                  <a onClick={() => handleMenuItemClick(item.path)} className="cursor-pointer">
                    <div className="text-sm">
                      <p className="font-semibold tracking-wide text-white">{item.label}</p>
                      {item.description && (
                        <p className="text-[13px] font-semibold text-gray-400">{item.description}</p>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* About Us Link */}
          <Link
            href="/aboutus"
            className="text-white hover:text-gray-300 font-semibold"
          >
            About Us
          </Link>
        </div>
      </div>
      {/* Divider below header */}
      <div className="w-full border-t border-gray-600" />
    </>
  );
};

export default Header;
