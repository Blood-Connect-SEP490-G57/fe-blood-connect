import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}
const navigation = [
  { name: 'Trang chủ', href: '#' },
  { name: 'Tin Tức', href: '#' },
  { name: 'Hỏi đáp', href: '#' },
  { name: 'Liên Hệ', href: '#' },
]

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">

          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#" className="text-sm/6 font-semibold text-gray-900">
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 bg-gray-100">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white p-4 text-center">
        My Website Footer ©2025 Created by Me
      </footer>
    </div>
  );
};

export default MainLayout;
