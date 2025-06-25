import React from 'react';

const mockArticle = {
  id: 1,
  title: 'Rạp chiếu phim có đang bội thực phim kinh dị Việt Nam 2025?',
  category: 'Phim Kinh Dị',
  author: 'Moveek',
  time: '3 giờ trước',
  image: 'https://images.unsplash.com/photo-1489599511905-5ad6e2b10b8d?w=800&h=400&fit=crop',
  content: `Phim kinh dị Việt Nam 2025 bùng nổ về số lượng với hàng loạt phim trăm tỷ, nhưng liệu chất lượng có theo kịp? Phim kinh dị Việt Nam 2025 bùng nổ về số lượng với hàng loạt phim trăm tỷ, nhưng liệu chất lượng có theo kịp?

Trong vài năm trở lại đây, đặc biệt là giai đoạn 2024 - 2025, thị trường điện ảnh Việt Nam chứng kiến sự gia tăng vượt bậc của thể loại phim kinh dị. Nếu trước đây, những bộ phim Việt thường dạng xem là "giá rẻ" trong mùa Halloween hay dịp lễ, thì nay, dạng phim này đã trở thành lực lượng chính yếu, thậm chí đóng vai trò dẫn dắt thị trường điện ảnh Việt Nam.

Cú hiên từ Quỷ Cẩu và làn sóng bứt phá

Có thể dạng thứ ra phải thừa nhận cho phim kinh dị Việt là thành công rạng rỡ của bộ Quỷ Cẩu năm 2024. Đây là bộ phim đầu tiên của dòng kinh dị Việt đạt mức 100 tỷ đồng, tạo tiền lệ điều chỉnh hướng thầm mặt thị của cả hoài hóa bản từ Tết Tân Sửu.

Từ đó, mặt báo dự báo từ kinh là dạng chạng rồ và đã rập rồ là Ma Lai, Linh Miêu: Quỷ Nhập Tràng, Cám, Đàn Ông Lạnh, Đường Lý, Oán Đây Hà, Thể Mộc... đã không đều bị Lý Lần Oán Linh Giữ Của.`
};

const relatedArticles = [
  {
    id: 2,
    title: 'Phim kinh dị Việt 18+ Út Lan: Oán Linh Giữ Của cán mốc 10 tỷ ngày đầu công chiếu',
    category: 'Phim Kinh Dị',
    time: '3 ngày trước',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
  },
  {
    id: 3,
    title: 'Review Út Lan: Oán Linh Giữ Của - Có thực sự đáng xem như lời đồn?',
    category: 'Review Phim',
    time: '1 ngày trước',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=200&fit=crop',
  },
  {
    id: 4,
    title: 'Khám phá bí ẩn đằng sau Út Lan: Oán Linh Giữ Của - Câu chuyện có thật?',
    category: 'Góc Nhìn',
    time: '1 ngày trước',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
  },
  {
    id: 5,
    title: 'Út Lan: Oán Linh Giữ Của - Gây tranh cai với việt bạo lực',
    category: 'Tin Tức',
    time: '2 ngày trước',
    image: 'https://images.unsplash.com/photo-1489599511905-5ad6e2b10b8d?w=300&h=200&fit=crop',
  },
  {
    id: 6,
    title: 'Top 12 phim nhận hay đang gây chú ý đầu năm 2025',
    category: 'Top Phim',
    time: '4 ngày trước',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=200&fit=crop',
  }
];

const featuredMovies = [
  {
    title: 'Ma Lai',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=280&fit=crop',
  },
  {
    title: 'Cẩm',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=280&fit=crop',
  },
  {
    title: 'Lắm Chuyện',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=280&fit=crop',
  },
  {
    title: 'Thái Hòa',
    image: 'https://images.unsplash.com/photo-1489599511905-5ad6e2b10b8d?w=200&h=280&fit=crop',
  }
];

const bottomMovies = [
  {
    title: 'Quý Cậu',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=250&fit=crop',
  },
  {
    title: 'Tết Ở Làng Địa Ngục',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop',
  }
];

export default function NewsDetailPage() {
  return (
    <div className="bg-[#181922] min-h-screen py-22">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-black leading-tight">
                {mockArticle.title}
              </h1>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="text-red-500 font-medium">{mockArticle.category}</span>
                <span className="mx-2">•</span>
                <span>{mockArticle.author}</span>
                <span className="mx-2">•</span>
                <span>{mockArticle.time}</span>
              </div>

              <img 
                src={mockArticle.image} 
                alt={mockArticle.title} 
                className="w-full h-64 md:h-80 object-cover rounded-lg mb-6" 
              />

              <div className="prose max-w-none">
                <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                  {mockArticle.content}
                </div>
              </div>
            </div>

            {/* Featured Movies Grid */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold mb-4 text-black">Có hiệu trụ Quỷ Cẩu và làn sóng bứt phá</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featuredMovies.map((movie, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <img 
                      src={movie.image} 
                      alt={movie.title}
                      className="w-full h-40 md:h-52 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Movies */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bottomMovies.map((movie, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <img 
                      src={movie.image} 
                      alt={movie.title}
                      className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-lg">
                      <h4 className="text-white font-bold text-lg">{movie.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <div className="border-l-4 border-red-500 pl-4">
                <p className="text-lg font-medium text-gray-800 italic">
                  "Con gì để trúng vàng" mới của nhà làm phim Việt
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Những bộ phim đỉnh này đã tạo được tiếng vang mạnh mẽ, phản hồi tích cực của khán giả, doanh thu khá cao, đặc biệt với số lượng khán giả trẻ tuổi.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-black">Bài viết liên quan</h3>
                  <button className="text-red-500 text-sm hover:underline">Xem tất cả</button>
                </div>
                
                <div className="space-y-4">
                  {relatedArticles.map((article) => (
                    <div key={article.id} className="flex gap-3 group cursor-pointer">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-black line-clamp-2 group-hover:text-red-500 transition-colors">
                          {article.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span className="text-red-500">{article.category}</span>
                          <span className="mx-1">•</span>
                          <span>{article.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}