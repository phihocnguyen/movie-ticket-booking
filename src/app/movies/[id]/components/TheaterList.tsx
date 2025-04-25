'use client'
import TheaterItem from './TheaterItem';

interface Showtime {
  time: string;
  format: string;
  subtitle: string;
  is3D: boolean;
}

interface Theater {
  id: string;
  name: string;
  logo: string;
  address: string;
  showtimes: Showtime[];
}

interface TheaterListProps {
  theaters: Theater[];
  onSelectTime: (time: string, theaterId: string) => void;
}

const TheaterList: React.FC<TheaterListProps> = ({ theaters, onSelectTime }) => {
  return (
    <div className="w-full md:w-2/3 p-4 border-r">
      <h2 className="text-xl font-bold mb-4">Rạp chiếu phim</h2>
      {theaters.map((theater) => (
        <TheaterItem
          key={theater.id}
          id={theater.id}
          name={theater.name}
          logo={theater.logo}
          address={theater.address}
          showtimes={theater.showtimes}
          onSelectTime={onSelectTime}
        />
      ))}
    </div>
  );
};

export default TheaterList; 