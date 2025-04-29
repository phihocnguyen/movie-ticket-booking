'use client'
import { useState } from 'react';
import Calendar from './Calendar';
import TheaterList from './TheaterList';
import SeatSelection from './SeatSelection';
import BookingTimeline from './BookingTimeline';
import { useRouter } from 'next/navigation';

interface ShowtimeProps {
  movieId: string;
  movieTitle: string;
}

interface Theater {
  id: string;
  name: string;
  logo: string;
  address: string;
  showtimes: Showtime[];
}

interface Showtime {
  time: string;
  format: string;
  subtitle: string;
  is3D: boolean;
}

const ShowtimeComponent: React.FC<ShowtimeProps> = ({ movieId, movieTitle }) => {
  const router = useRouter();
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showSeatSelection, setShowSeatSelection] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  const theaters: Theater[] = [
    {
      id: 'bhd-star-le-van-viet',
      name: 'BHD Star Lê Văn Việt',
      logo: '/images/bhd-logo.png',
      address: 'Tầng 4, Vincom Plaza Lê Văn Việt, 50 Lê Văn Việt, P.Hiệp Phú, Quận 9, TP.HCM',
      showtimes: [
        { time: '09:00', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '09:55', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '10:35', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '11:25', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '11:55', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '12:20', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '13:00', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '13:50', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '14:45', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '15:10', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '15:45', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '16:15', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '17:10', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '17:40', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '18:10', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '18:40', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '19:05', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '19:35', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '20:05', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '20:35', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
      ]
    },
    {
      id: 'cgv-vincom-thu-duc',
      name: 'CGV Vincom Thủ Đức',
      logo: '/images/cgv-logo.png',
      address: 'Tầng 5, TTTM Vincom Thủ Đức, 216 Võ Văn Ngân, P. Bình Thọ, TP.Thủ Đức, TP.HCM',
      showtimes: [
        { time: '09:30', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '11:45', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '14:00', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '16:30', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '19:15', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '21:30', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
      ]
    }
  ];

  const handleSelectTime = (time: string, theaterId: string) => {
    const theater = theaters.find(t => t.id === theaterId);
    if (!theater) return;
    const params = new URLSearchParams({
      movieTitle,
      theaterName: theater.name,
      showtime: time,
      date: selectedDate.toISOString(),
    });
    router.push(`/seat-selection?${params.toString()}`);
  };

  const handleBackToShowtimes = () => {
    setShowSeatSelection(false);
    setSelectedTime(null);
    setCurrentStep(1);
  };

  if (showSeatSelection && selectedTheater && selectedTime) {
    const theater = theaters.find(t => t.id === selectedTheater);
    if (!theater) return null;

    return (
      <div>
        <BookingTimeline currentStep={currentStep} />
        <SeatSelection
          movieTitle={movieTitle}
          theaterName={theater.name}
          showtime={selectedTime}
          date={selectedDate}
          onBack={handleBackToShowtimes}
        />
      </div>
    );
  }

  return (
    <div>
      <BookingTimeline currentStep={currentStep} />
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <TheaterList
            theaters={theaters}
            onSelectTime={handleSelectTime}
          />
          <div className="w-full md:w-1/3">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowtimeComponent;