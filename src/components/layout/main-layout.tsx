import React from 'react'
import Footer from './footer.tsx'
import Header from './header.tsx'
import { AuthProvider } from '../authContext/AuthContext.tsx'
import { VerificationProvider } from '../verificationContext/VerificationContext.tsx'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <AuthProvider>
        <VerificationProvider>
          <Header></Header>
          <div className='flex flex-col min-h-screen'>
            <main className='flex-1'>{children}</main>
          </div>
          <Footer></Footer>
        </VerificationProvider>
      </AuthProvider>
    </>
  )
}

export default MainLayout
