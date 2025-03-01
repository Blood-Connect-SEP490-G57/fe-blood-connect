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
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<RegistrationPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/faq' element={<FAQPage />} />
            <Route path='/news' element={<NewsPage />} />
            <Route
              path='/blood-donation-registration'
              element={
                <Protected tokenRequired={true} destination='/login'>
                  <BloodDonationRegistration />
                </Protected>} />
            <Route
              path='/user-profile-page' element={
                <Protected tokenRequired={true} destination='/login'>
                  <UserProfilePage />
                </Protected>
              } />
            <Route
              path='/settings'
              element={
                <Protected tokenRequired={false} destination='/login'>
                  <Settings />
                </Protected>
              }
            />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route
              path='/notifications' element={
                <Protected tokenRequired={true} destination='/login'>
                  <NotificationDetail />
                </Protected>
              } />
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>
)
