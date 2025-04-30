import { Suspense } from "react";
import PaymentClient from "./components/PaymentClient";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PaymentPage({ searchParams }: PageProps) {
  const movieTitle = searchParams.movieTitle as string || "";
  const theaterName = searchParams.theaterName as string || "";
  const showtime = searchParams.showtime as string || "";
  const dateStr = searchParams.date as string || new Date().toISOString();
  const selectedSeats = (searchParams.seats as string || "").split(",").filter(Boolean);
  const selectedFood = (searchParams.food as string || "").split(",").filter(Boolean);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentClient
        movieTitle={movieTitle}
        theaterName={theaterName}
        showtime={showtime}
        dateStr={dateStr}
        selectedSeats={selectedSeats}
        selectedFood={selectedFood}
      />
    </Suspense>
  );
} 