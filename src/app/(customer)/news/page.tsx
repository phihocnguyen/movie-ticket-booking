import React from 'react';
import Link from 'next/link';

const newsList = [
  {
    id: 1,
    title: 'Rạp chiếu phim có đang bội thực phim kinh dị Việt Nam 2025?',
    category: 'Phim Kinh Dị',
    author: 'Moveek',
    time: '3 giờ trước',
    image: 'https://static.nutscdn.com/vimg/300-0/7a6d6a456fe14c149ea625fd0178d38e.jpg',
    description: 'Phim kinh dị Việt Nam 2025 bùng nổ về số lượng với hàng loạt phim trăm tỷ, nhưng liệu chất lượng có theo kịp?Phim kinh dị Việt Nam 2025 bùng nổ về số lượng với hàng loạt phim trăm tỷ, nhưng liệu chất lượng có theo kịp?',
  },
  {
    id: 2,
    title: 'Phim kinh dị Việt 18+ Út Lan: Oán Linh Giữ Của cán mốc 10 tỷ ngày đầu công chiếu',
    category: 'Phim Kinh Dị',
    author: 'Moveek',
    time: '3 ngày trước',
    image: 'https://static.nutscdn.com/vimg/1920-0/27591bc926452f55a69c18dbf6b6f930.webp',
    description: 'Phim kinh dị Việt 18+ Út Lan: Oán Linh Giữ Của thu 10 tỷ chỉ sau ngày đầu ra mắt. Câu chuyện oán linh giữ của đầy ám ảnh, lấy cảm hứng dân gian miền Tây.',
  },
  {
    id: 3,
    title: 'Elio: Cậu Bé Đến Từ Trái Đất – 6 sự thật thú vị có thể bạn chưa biết',
    category: 'miduynph',
    author: 'miduynph',
    time: '3 ngày trước',
    image: 'https://static.nutscdn.com/vimg/1920-0/27591bc926452f55a69c18dbf6b6f930.webp',
    description: 'Elio: Cậu Bé Đến Từ Trái Đất liệu có thể là cú đột phá tiếp theo của Pixar? Khám phá những bí mật ít ai biết về bộ phim hoạt hình viễn tưởng nhất mùa hè này.',
  },
];

const categories = [
  { name: 'Đánh giá phim', desc: 'Góc nhìn chân thực, khách quan nhất về các bộ phim' },
  { name: 'Tin điện ảnh', desc: 'Tin tức điện ảnh Việt Nam & thế giới' },
  { name: 'Video - Trailer', desc: 'Trailer, video những phim chiếu rạp và truyền hình hot nhất' },
];

export default function NewsPage() {
  return (
    <div className="bg-[#181922] py-22 min-h-screen py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-white font-bold mb-2">Tin điện ảnh</h1>
          <div className="text-lg text-gray-400">Tin tức điện ảnh Việt Nam & thế giới</div>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main news list */}
          <div className="flex-1 bg-[#1f2027] rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-white">Mới nhất</h2>
            <div className="space-y-8">
              {newsList.map(news => (
                <Link href={`/news/${news.id}`} key={news.id} className="block group">
                  <div className="flex flex-col md:flex-row gap-5 border-b border-gray-700 pb-6 last:border-b-0 last:pb-0 group-hover:bg-gray-800 transition-colors duration-200 cursor-pointer rounded-lg p-2 -m-2">
                    <img src={news.image} alt={news.title} className="w-full md:w-56 h-36 object-cover rounded-lg" />
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1 text-white group-hover:text-blue-400 transition-colors duration-200">{news.title}</div>
                      <div className="text-sm text-pink-400 font-medium mb-1">{news.category} <span className="text-gray-500 font-normal">· {news.author} · {news.time}</span></div>
                      <div className="text-gray-300 text-sm line-clamp-2">{news.description}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {/* Sidebar */}
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="bg-[#1f2027] rounded-xl shadow-lg p-6">
              <div className="font-semibold text-lg mb-4 text-white">Chuyên mục</div>
              <div className="divide-y divide-gray-700">
                {categories.map((cat, idx) => (
                  <div key={cat.name} className={`py-4 ${idx === 0 ? '' : 'pt-4'}`}>
                    <div className="font-medium text-base mb-1 text-white">{cat.name}</div>
                    <div className="text-gray-400 text-sm">{cat.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}