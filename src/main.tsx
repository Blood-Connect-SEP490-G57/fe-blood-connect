import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from '@/pages/Login'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Protected from './components/protected'
import Home from './pages/Home'
import { Toaster } from './components/ui/toaster'
import MainLayout from './components/layout/main-layout'
import RegistrationPage from '@/pages/register.tsx'
import ContactPage from './pages/Contact'
import FAQPage from './pages/FAQ'
import NewsPage from './pages/News'
import BloodDonationRegistration from './pages/BloodDonationRegistration'
import Settings from './pages/Settings'
import UserProfilePage from './pages/UserProfile'
import ForgotPassword from './pages/ForgotPassword'
import NotificationDetail from './pages/NotificationDetail.tsx'
import ScrollToTop from './components/scrollToTop/index.tsx'
import NotificationList from './pages/NotificationList.tsx'
import NewsDetailPage from './pages/NewDetail.tsx'
import Terms from './pages/Tems.tsx'
// import NotFoundPage from '@/pages/404'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 1000 * 60 * 60 * 24
    }
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MainLayout>
          <ScrollToTop />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dang-ky' element={<RegistrationPage />} />
            <Route path='/dang-nhap' element={<Login />} />
            <Route path='/lien-he' element={<ContactPage />} />
            <Route path='/cau-hoi-thuong-gap' element={<FAQPage />} />
            <Route path='/tin-tuc' element={<NewsPage />} />
            <Route path='/tin-tuc/:id' element={<NewsDetailPage />} />
            <Route path='/dieu-khoan-su-dung' element={<Terms />} />
            <Route path='*' element={<Navigate to='/' />} />
            {/* <Route path='*' element={<NotFoundPage />} /> */}
            <Route
              path='/dang-ky-hien-mau'
              element={
                <Protected tokenRequired={true} destination='/dang-nhap'>
                  <BloodDonationRegistration />
                </Protected>
              }
            />
            <Route
              path='/trang-ca-nhan'
              element={
                <Protected tokenRequired={true} destination='/dang-nhap'>
                  <UserProfilePage />
                </Protected>
              }
            />
            <Route
              path='/cai-dat'
              element={
                <Protected tokenRequired={true} destination='/dang-nhap'>
                  <Settings />
                </Protected>
              }
            />
            <Route path='/quen-mat-khau' element={<ForgotPassword />} />
            <Route
              path='/thong-bao'
              element={
                <Protected tokenRequired={true} destination='/dang-nhap'>
                  <NotificationList />
                </Protected>
              }
            />
            <Route
              path='/thong-bao/:id'
              element={
                <Protected tokenRequired={true} destination='/dang-nhap'>
                  <NotificationDetail />
                </Protected>
              }
            />
          </Routes>
        </MainLayout>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>
)
