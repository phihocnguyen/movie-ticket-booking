"use client";
import { useSearchParams, useRouter } from "next/navigation";
import SeatSelection from "../movies/[id]/components/SeatSelection";
import BookingTimeline from "../movies/[id]/components/BookingTimeline";

const SeatSelectionPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const movieTitle = searchParams.get("movieTitle") || "";
  const theaterName = searchParams.get("theaterName") || "";
  const showtime = searchParams.get("showtime") || "";
  const dateStr = searchParams.get("date") || new Date().toISOString();
  const date = new Date(dateStr);
  const screenName = searchParams.get("screenName") || "";
  const price = searchParams.get("price") || "";

  return (
    <div className="container mx-auto px-4">
      <div className="py-16 z-10 relative">
        <BookingTimeline currentStep={2} />
      </div>
      <SeatSelection
        movieTitle={movieTitle}
        theaterName={theaterName}
        showtime={showtime}
        date={date}
        screenName={screenName}
        price={price}
        onBack={() => router.back()}
      />
    </div>
  );
};

export default SeatSelectionPage; 