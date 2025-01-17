import React from 'react';
import { Button } from '@/components/ui/button';

interface MainLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Tin Tức', href: '/news' },
  { name: 'Hỏi đáp', href: '/faq' },
  { name: 'Liên Hệ', href: '/contact' },
]

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-red-600 font-bold text-xl">
                Giọt Máu Hi Vọng
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-red-600 transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <Button variant="default" className="bg-red-600 hover:bg-red-700">
                Đăng nhập
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <span className="sr-only">Open menu</span>
                {/* Add your menu icon here */}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Về chúng tôi</h3>
              <p className="text-gray-400">
                Giọt Máu Hi Vọng là dự án phi lợi nhuận nhằm kết nối những người hiến máu tình nguyện với những người cần máu.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
              <p className="text-gray-400">
                Email: contact@giotmauhivong.vn<br />
                Điện thoại: (84) 123-456-789<br />
                Địa chỉ: Hà Nội, Việt Nam
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Theo dõi chúng tôi</h3>
              <div className="flex space-x-4">
                {/* Add social media icons/links here */}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Giọt Máu Hi Vọng. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
