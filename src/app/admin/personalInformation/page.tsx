// "use-client";
import { ReactNode } from "react";
import InforForm from "./components/InforForm";
import ChangePasswordForm from "./components/ChangePasswordForm";
export interface User {
  id: number;
  name: string;
  email: string;
  password: string | null;
  phone_number: string;
  username: string;
  full_name: string;
  date_of_birth: string;
}
export default function PesonalInfor() {
  return (
    <div>
      <InforForm />
      <ChangePasswordForm />
    </div>
  );
}
