const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Về chúng tôi</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[var(--color-indigo-600)] transition">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-[var(--color-indigo-600)] transition">Liên hệ</a></li>
              <li><a href="#" className="hover:text-[var(--color-indigo-600)] transition">Tuyển dụng</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[var(--color-indigo-600)] transition">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="hover:text-[var(--color-indigo-600)] transition">Hướng dẫn đặt vé</a></li>
              <li><a href="#" className="hover:text-[var(--color-indigo-600)] transition">Chính sách bảo mật</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Điều khoản</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[var(--color-indigo-600)] transition">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-[var(--color-indigo-600)] transition">Quy chế hoạt động</a></li>
              <li><a href="#" className="hover:text-[var(--color-indigo-600)] transition">Quy định đổi trả</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Kết nối với chúng tôi</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[var(--color-indigo-600)] transition">Facebook</a>
              <a href="#" className="hover:text-[var(--color-indigo-600)] transition">Instagram</a>
              <a href="#" className="hover:text-[var(--color-indigo-600)] transition">Twitter</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© 2023 Movie Tickets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;