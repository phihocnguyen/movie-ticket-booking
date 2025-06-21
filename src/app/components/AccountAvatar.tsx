import { ReactNode } from "react";
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 hover:scale-105 mx-auto">
          <User size={24} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link
            href="/admin/personalInformation"
            className="flex items-center justify-center gap-2.5 flex-row"
          >
            <FileUser />
            <p> Personal Information</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            className="flex items-center justify-center gap-2.5 flex-row"
            onClick={() => {
              authService.logout();
              updateAuthState();
              router.push("/");
            }}
          >
            <LogOut />
            <p> Log out</p>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
