"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Ticket } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PiNewspaperClippingLight } from "react-icons/pi";
import { RiMovie2AiLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { HiOutlineTicket } from "react-icons/hi";
import { LuUsers } from "react-icons/lu";
import { GiTheaterCurtains } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5";

const items = [
  {
    title: "DashBoard",
    url: "/owner",
    icon: RxDashboard,
  },
  {
    title: "Showtime Management",
    url: "/owner/showtimes",
    icon: RiMovie2AiLine,
  },
  {
    title: "Room Management",
    url: "/owner/rooms",
    icon: HiOutlineTicket,
  },
  {
    title: "Food Management",
    url: "/owner/foods",
    icon: HiOutlineTicket,
  },
  {
    title: "Ticket Management",
    url: "/owner/tickets",
    icon: GiTheaterCurtains,
  },
  {
    title: "Theater Management",
    url: "/owner/theaters",
    icon: PiNewspaperClippingLight,
  },
  {
    title: "System Management",
    url: "/owner/settings",
    icon: IoSettingsOutline,
  },
];

export function AppSidebar({
  setTitleHeader,
}: {
  setTitleHeader: (title: string) => void;
}) {
  const pathname = usePathname();
  return (
    <Sidebar>
      <div className="bg-white h-full px-1.5">
        <SidebarContent>
          {/* Logo thương hiệu */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-center bg-white">
            <div className="flex items-center space-x-3 z-10">
              <Link href="/admin" className="flex items-center group">
                <div className="relative mr-2">
                  <Ticket
                    size={28}
                    className="text-indigo-500 group-hover:text-indigo-600 transition-colors duration-300"
                  />
                  <Film
                    size={20}
                    className="absolute -top-1 -right-1 text-gray-500 group-hover:text-indigo-500 transition-colors duration-300"
                  />
                </div>
                <span className="text-2xl font-bold text-gray-800 tracking-tight flex items-center">
                  MOVIE
                  <span className="text-indigo-500 relative ">
                    TICKETS
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </span>
              </Link>
            </div>
          </div>
          {/* Menu */}

          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`transition-all bg-transparent hover:bg-[#C8C2EF] focus:bg-[#C8C2EF] ${
                    pathname === item.url ? "bg-[#C8C2EF]" : ""
                  }`}
                >
                  <Link
                    href={item.url}
                    onClick={() => setTitleHeader(item.title)}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
