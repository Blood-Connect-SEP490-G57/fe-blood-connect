import React from 'react'
import Footer from './footer.tsx'
import Header from './header.tsx'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      {/* Header */}
      <Header></Header>

      {/* Content */}
      <main className='flex-1'>{children}</main>

      {/* Footer */}
      <Footer></Footer>
    </div>
  )
}

export default MainLayout
