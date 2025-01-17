import React from 'react'
import HeroSection from '@/components/home/hero-section'
import FeaturesSection from '@/components/home/features-section'
import EventsSection from '@/components/home/events-section'
import BloodDonationSlider from '@/components/home/blood-donation-slider.tsx'

const Home: React.FC = () => {
  const Campaign = [
    {
      id: 1,
      photo: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4',
      name: 'Chủ Nhật Đỏ',
      location: 'Trung tâm văn hoá huyện Yên Khánh(Phố 1 - Thị Trấn Ninh)',
      startDate: '2024-02-01T09:00',
      endDate: '2024-02-01T17:00',
      target: 500,
      registrants: 45
    },
    {
      id: 2,
      photo: 'https://images.unsplash.com/photo-1536856136534-bb679c52a9aa',
      name: 'Hiến Máu Đợt 1',
      location: 'Trung tâm văn hoá Thành Phố Hoa Lư',
      startDate: '2024-02-05T10:00',
      endDate: '2024-02-05T18:00',
      target: 500,
      registrants: 32
    },
    {
      id: 3,
      photo: 'https://images.unsplash.com/photo-1579154204601-01588f351e67',
      name: 'Hiến Máu Đặc Biệt',
      location: 'Bệnh Viện Đa Khoa Tỉnh Ninh Bình',
      startDate: '2024-02-10T08:00',
      endDate: '2024-02-10T16:00',
      target: 500,
      registrants: 28
    }
  ]

  const features = [
    {
      title: 'Hiến máu cứu người',
      description: 'Một giọt máu cho đi, một cuộc đời ở lại',
      icon: '🩸'
    },
    {
      title: 'Tình nguyện viên',
      description: 'Tham gia cộng đồng người hiến máu tình nguyện',
      icon: '❤️'
    },
    {
      title: 'Thông tin cập nhật',
      description: 'Cập nhật thông tin về các đợt hiến máu gần nhất',
      icon: '📅'
    }
  ]

  const upcomingEvents = [
    {
      date: '29/07',
      title: 'Hiến máu tại Đại học Y Hà Nội',
      description: 'Chương trình hiến máu tình nguyện dành cho sinh viên và người dân'
    },
    {
      date: '01/08',
      title: 'Ngày hội hiến máu tình nguyện',
      description: 'Tổ chức tại Viện Huyết học - Truyền máu Trung ương'
    },
    {
      date: '15/08',
      title: 'Hiến máu cứu người - Một nghĩa cử cao đẹp',
      description: 'Chương trình hiến máu tại các bệnh viện trên địa bàn thành phố'
    }
  ]

  return (
    <div className='min-h-screen'>
      <HeroSection />
      <BloodDonationSlider campaigns={Campaign}></BloodDonationSlider>
      <EventsSection events={upcomingEvents} />
      <FeaturesSection features={features} />
    </div>
  )
}

export default Home
