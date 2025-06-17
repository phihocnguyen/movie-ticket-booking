"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Film, Ticket } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { RiMovie2AiLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { HiOutlineTicket } from "react-icons/hi";
import { LuUsers } from "react-icons/lu";
import { GiTheaterCurtains } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5";

const items = [
  {
    title: "DashBoard",
    url: "/admin",
    icon: RxDashboard,
  },
  {
    title: "Movie Management",
    url: "/admin/movies",
    icon: RiMovie2AiLine,
  },
  {
    title: "Voucher Management",
    url: "/admin/vouchers",
    icon: HiOutlineTicket,
  },
  {
    title: "User Management",
    icon: LuUsers,
    children: [
      { title: "Customer Management", url: "/admin/users/customers" },
      { title: "Staff Management", url: "/admin/users/staff" },
    ],
  },
  {
    title: "Theater Management",
    url: "/admin/theaters",
    icon: GiTheaterCurtains,
  },
  {
    title: "System Management",
    url: "/admin/settings",
    icon: IoSettingsOutline,
  },
];

export function AppSidebar() {
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
            {items.map((item) =>
              item.children ? (
                <Collapsible key={item.title} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-4">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map((child) => (
                        <SidebarMenuSubItem key={child.title}>
                          <SidebarMenuButton asChild>
                            <a className="ml-2" href={child.url}>
                              {child.title}
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
