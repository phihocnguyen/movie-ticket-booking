import { use } from 'react';
import TheaterDetailClient from './TheaterDetailClient';
import { TheaterData, Movie } from '../types';

// Mock data storage (would be replaced with a database call in a real app)
const theaters: { [key: string]: TheaterData } = {
  'beta-ung-van-khiem': {
    id: 'beta-ung-van-khiem',
    name: 'Beta Ung Văn Khiêm',
    address: 'Tầng 1, tòa nhà PAX SKY, 26 Ung Văn Khiêm, phường 25, Quận Bình Thạnh, Thành phố Hồ Chí Minh, Việt Nam',
    description: 'Beta Ung Văn Khiêm – Rạp chiếu phim chuẩn Hollywood tại TP.HCM, đặt vé nhanh trên Moveek. Xem lịch chiếu phim Beta Ung Văn Khiêm mới nhất và mua vé xem phim online tiện lợi tại Moveek – nên tặng đặt vé nhanh chóng, đầy đủ lịch chiếu các rạp Beta trên toàn quốc. Rạp Beta Ung Văn Khiêm được xây dựng theo tiêu chuẩn Hollywood, trang bị âm thanh Dolby 7.1, màn hình lớn sắc nét, mang đến trải nghiệm điện ảnh chân thực và sống động. Toạ lạc tại khu vực đông dân cư của TP.HCM, rạp là địa điểm giải trí lý tưởng cho giới trẻ và gia đình vào dịp cuối tuần hay sau giờ học – làm.',
    features: ['Rạp chuẩn Hollywood', 'Âm thanh Dolby 7.1', 'Màn hình lớn sắc nét'],
    logoUrl: '/images/theaters/beta.png',
  },
  'lotte-ung-van-khiem': {
    id: 'lotte-ung-van-khiem',
    name: 'Lotte Ung Văn Khiêm',
    address: 'Tầng Trệt, TTTM TTC Plaza, Số 26, Đường Ung Văn Khiêm, Phường 25, Quận Bình Thạnh, TP.HCM',
    description: 'Lotte Cinema Ung Văn Khiêm tọa lạc tại TTTM TTC Plaza, là một trong những cụm rạp hiện đại nhất của hệ thống Lotte Cinema tại Việt Nam. Với thiết kế sang trọng, âm thanh và hình ảnh chất lượng cao, rạp hứa hẹn mang đến trải nghiệm điện ảnh tuyệt vời cho khán giả.',
    features: ['Âm thanh vòm', 'Màn hình 4K', 'Ghế bọc da cao cấp'],
    logoUrl: '/images/theaters/lotte.png',
  },
  'cgv-saigonres-nguyen-xi': {
    id: 'cgv-saigonres-nguyen-xi',
    name: 'CGV Saigonres Nguyễn Xí',
    address: 'Tầng 4-5, Saigonres Plaza, 79/81 Nguyễn Xí, P 26, Q Bình Thạnh, Tp. Hồ Chí Minh',
    description: 'CGV Saigonres Nguyễn Xí nằm tại tầng 4-5 của TTTM Saigonres Plaza, là một địa điểm giải trí lý tưởng dành cho người dân khu vực Bình Thạnh. Rạp được trang bị công nghệ chiếu phim hiện đại, âm thanh sống động cùng không gian thoải mái, sang trọng.',
    features: ['Công nghệ chiếu phim 3D', 'Âm thanh Dolby Atmos', 'Phòng chờ VIP'],
    logoUrl: '/images/theaters/cgv.png',
  },
};

const movies: Movie[] = [
  {
    id: 'lat-mat-8',
    title: 'Lật Mặt 8: Vòng Tay Nặng',
    poster: '/images/movies/lat-mat-8.jpg',
    duration: '2h15\'',
    rating: 'T13',
    genre: 'Hành động',
    showtimes: [
      {
        date: '29/4',
        times: [
          { time: '10:30', price: '80K' },
          { time: '11:30', price: '60K' },
          { time: '12:30', price: '60K' },
          { time: '13:10', price: '80K' },
          { time: '14:10', price: '60K' },
          { time: '15:10', price: '60K' },
        ]
      },
      {
        date: '30/4',
        times: [
          { time: '15:50', price: '60K' },
          { time: '16:20', price: '60K' },
          { time: '16:50', price: '60K' },
          { time: '17:50', price: '60K' },
          { time: '19:00', price: '70K' },
          { time: '19:30', price: '70K' },
        ]
      },
      {
        date: '1/5',
        times: [
          { time: '20:30', price: '70K' },
          { time: '21:40', price: '70K' },
          { time: '22:10', price: '50K' },
          { time: '23:10', price: '50K' },
        ]
      },
    ]
  },
  {
    id: 'tham-tu-kien',
    title: 'Thám Tử Kiến: Kỳ Án Không Đầu',
    poster: '/images/movies/tham-tu-kien.jpg',
    duration: '2h11\'',
    rating: 'T16',
    genre: 'Kinh dị',
    showtimes: [
      {
        date: '29/4',
        times: [
          { time: '09:30', price: '60K' },
          { time: '11:15', price: '60K' },
          { time: '13:00', price: '60K' },
        ]
      },
      {
        date: '30/4',
        times: [
          { time: '14:50', price: '60K' },
          { time: '16:40', price: '70K' },
          { time: '18:20', price: '70K' },
        ]
      },
    ]
  }
];

// Server-side component to fetch data and pass it to the client component
export default function TheaterPage({ params }: { params: Promise<{ theaterId: string }> }) {
  // Properly unwrap the params promise with React.use()
  const resolvedParams = use(params);
  const { theaterId } = resolvedParams;
  
  const theater = theaters[theaterId];
  const nearbyTheaters = Object.values(theaters)
    .filter(t => t.id !== theaterId)
    .slice(0, 2); // Just show 2 nearby theaters
  
  if (!theater) {
    return <div className="container mx-auto px-4 py-20">Rạp không tồn tại</div>;
  }

  // Pass the data to the client component
  return (
    <TheaterDetailClient 
      theater={theater} 
      movies={movies} 
      nearbyTheaters={nearbyTheaters} 
    />
  );
} 