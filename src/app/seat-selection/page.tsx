"use client";
import { useSearchParams, useRouter } from "next/navigation";
import SeatSelection from "../movies/[id]/components/SeatSelection";

const SeatSelectionPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const movieTitle = searchParams.get("movieTitle") || "";
  const theaterName = searchParams.get("theaterName") || "";
  const showtime = searchParams.get("showtime") || "";
  const dateStr = searchParams.get("date") || new Date().toISOString();
  const date = new Date(dateStr);

  return (
    <SeatSelection
      movieTitle={movieTitle}
      theaterName={theaterName}
      showtime={showtime}
      date={date}
      onBack={() => router.back()}
    />
  );
};

export default SeatSelectionPage; 