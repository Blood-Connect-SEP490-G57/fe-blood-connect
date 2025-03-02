import React from 'react'
import Footer from './footer.tsx'
import Header from './header.tsx'
import { AuthProvider } from '../authContext/AuthContext.tsx'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <AuthProvider>
        <Header></Header>
        <div className='flex flex-col min-h-screen'>
          <main className='flex-1 mt-6'>{children}</main>
        </div>
        <Footer></Footer>
      </AuthProvider>
    </>
  )
}

export default MainLayout
