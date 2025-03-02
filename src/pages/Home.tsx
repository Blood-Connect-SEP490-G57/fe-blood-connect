import React from 'react'
import HeroSection from '@/components/home/hero-section'
import BloodDonationSlider from '@/components/home/blood-donation-slider'
import BloodDonationCriteria from '@/components/home/BloodDonationCriteria'
import BloodDonationBenefits from '@/components/home/blood-donation-benefit'
import AdviceSection from '@/components/home/AdviceSection'
import EventDonationSlider from '@/components/home/event-donation-slider'

const Home: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-100'>
      <HeroSection />
      <BloodDonationSlider />
      <BloodDonationCriteria />
      <BloodDonationBenefits />
      <AdviceSection />
      <EventDonationSlider />
    </div>
  )
}

export default Home
