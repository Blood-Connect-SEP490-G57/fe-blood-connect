import React from 'react'
import HeroSection from '@/components/home/hero-section'
import BloodDonationSlider from '@/components/home/blood-donation-slider.tsx'
import BloodDonationCriteria from '@/components/home/BloodDonationCriteria'
import BloodDonationBenefits from '@/components/home/blood-donation-benefit'
import AdviceSection from '@/components/home/AdviceSection'
import EventDonationSlider from '@/components/home/event-donation-slider'

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

const Home: React.FC = () => {
  return (
    <div className='min-h-screen p-4'>
      <HeroSection />
      <BloodDonationSlider campaigns={Campaign}></BloodDonationSlider>
      <BloodDonationCriteria />
      <BloodDonationBenefits />
      <AdviceSection /> 
      <EventDonationSlider />
    </div>
  )
}

export default Home
