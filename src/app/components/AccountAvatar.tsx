"use client";
import { ReactNode, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { User, LogOut, FileUser } from "lucide-react";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export function AccountAvatar() {
  const { updateAuthState } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    updateAuthState();
    setOpen(false); // đóng dropdown
    router.push("/");
  };

  const handleNavigateToInfo = () => {
    setOpen(false); // đóng dropdown
    router.push("/admin/personalInformation");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 hover:scale-105 mx-auto cursor-pointer">
          <User size={24} />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleNavigateToInfo}
          className="cursor-pointer"
        >
          <FileUser />
          <span> Personal Information</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut />
          <span> Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
