import { Suspense } from "react";
import FoodSelectionClient from "./components/FoodSelectionClient";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function FoodSelectionPage({ searchParams }: PageProps) {
  const movieTitle = searchParams.movieTitle as string || "";
  const theaterName = searchParams.theaterName as string || "";
  const showtime = searchParams.showtime as string || "";
  const dateStr = searchParams.date as string || new Date().toISOString();
  const selectedSeats = (searchParams.seats as string || "").split(",").filter(Boolean);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FoodSelectionClient
        movieTitle={movieTitle}
        theaterName={theaterName}
        showtime={showtime}
        dateStr={dateStr}
        selectedSeats={selectedSeats}
      />
    </Suspense>
  );
} 