import React from 'react'
import Footer from './footer.tsx'
import Header from './header.tsx'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      {/* Header */}
      <Header></Header>
      <div className='flex flex-col min-h-screen'>
        {/* Content */}
        <main className='flex-1 mt-6'>{children}</main>
      </div>
      {/* Footer */}
      <Footer></Footer>

    </>
  )
}

export default MainLayout
