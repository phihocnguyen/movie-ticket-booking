import { Suspense } from "react";
import PaymentClient from "./components/PaymentClient";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PaymentPage({ searchParams }: PageProps) {


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentClient
      />
    </Suspense>
  );
} 