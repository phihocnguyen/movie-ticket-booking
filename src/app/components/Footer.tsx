import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Top section with logo and social media */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              Movie Tickets
            </h2>
            <p className="text-gray-400 mt-2">Đặt vé xem phim dễ dàng, nhanh chóng</p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-indigo-600 transition duration-300">
              <Facebook size={20} />
            </a>
            <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-indigo-600 transition duration-300">
              <Instagram size={20} />
            </a>
            <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-indigo-600 transition duration-300">
              <Twitter size={20} />
            </a>
          </div>
        </div>
        
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-6 border-t border-gray-700">
          <div>
            <h3 className="text-lg font-bold mb-4 relative">
              <span className="inline-block pr-2 relative z-10">Về chúng tôi</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-indigo-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition duration-300 flex items-center">
                  <span className="inline-block w-1 h-1 bg-indigo-400 mr-2 rounded-full"></span>
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition duration-300 flex items-center">
                  <span className="inline-block w-1 h-1 bg-indigo-400 mr-2 rounded-full"></span>
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition duration-300 flex items-center">
                  <span className="inline-block w-1 h-1 bg-indigo-400 mr-2 rounded-full"></span>
                  Tuyển dụng
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 relative">
              <span className="inline-block pr-2 relative z-10">Hỗ trợ</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-indigo-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition duration-300 flex items-center">
                  <span className="inline-block w-1 h-1 bg-indigo-400 mr-2 rounded-full"></span>
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition duration-300 flex items-center">
                  <span className="inline-block w-1 h-1 bg-indigo-400 mr-2 rounded-full"></span>
                  Hướng dẫn đặt vé
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition duration-300 flex items-center">
                  <span className="inline-block w-1 h-1 bg-indigo-400 mr-2 rounded-full"></span>
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 relative">
              <span className="inline-block pr-2 relative z-10">Điều khoản</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-indigo-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition duration-300 flex items-center">
                  <span className="inline-block w-1 h-1 bg-indigo-400 mr-2 rounded-full"></span>
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition duration-300 flex items-center">
                  <span className="inline-block w-1 h-1 bg-indigo-400 mr-2 rounded-full"></span>
                  Quy chế hoạt động
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition duration-300 flex items-center">
                  <span className="inline-block w-1 h-1 bg-indigo-400 mr-2 rounded-full"></span>
                  Quy định đổi trả
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 relative">
              <span className="inline-block pr-2 relative z-10">Liên hệ</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-indigo-500"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <MapPin size={16} className="mr-2 text-indigo-400" />
                <span>123 Đường Nguyễn Huệ, TP.HCM</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Phone size={16} className="mr-2 text-indigo-400" />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Mail size={16} className="mr-2 text-indigo-400" />
                <span>info@movietickets.vn</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom copyright section */}
        <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <p className="text-gray-400">© {currentYear} Movie Tickets. Bản quyền thuộc về công ty TNHH Movie Tickets Việt Nam</p>
          <div className="mt-2 text-sm flex justify-center space-x-4 text-gray-500">
            <a href="#" className="hover:text-indigo-400 transition">Chính sách riêng tư</a>
            <span>|</span>
            <a href="#" className="hover:text-indigo-400 transition">Điều khoản sử dụng</a>
            <span>|</span>
            <a href="#" className="hover:text-indigo-400 transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;