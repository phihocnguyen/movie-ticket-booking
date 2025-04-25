'use client'
import Image from 'next/image';

interface Showtime {
  time: string;
  format: string;
  subtitle: string;
  is3D: boolean;
}

interface TheaterItemProps {
  id: string;
  name: string;
  logo: string;
  address: string;
  showtimes: Showtime[];
  onSelectTime: (time: string, theaterId: string) => void;
}

const TheaterItem: React.FC<TheaterItemProps> = ({
  id,
  name,
  logo,
  address,
  showtimes,
  onSelectTime
}) => {
  return (
    <div className="mb-6 border rounded-lg p-4">
      <div className="flex items-center mb-3">
        <Image
          src={logo}
          alt={name}
          width={40}
          height={40}
          className="mr-3"
        />
        <div>
          <h3 className="font-bold text-black">{name}</h3>
          <p className="text-sm text-black">{address}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {showtimes.map((showtime, index) => (
          <button
            key={index}
            onClick={() => onSelectTime(showtime.time, id)}
            className="border rounded p-2 text-center hover:bg-blue-50"
          >
            <div className="font-medium">{showtime.time}</div>
            <div className="text-sm text-black">
              {showtime.format} {showtime.subtitle}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TheaterItem; 