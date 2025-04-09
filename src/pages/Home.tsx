import React from 'react'
import HeroSection from '@/components/home/hero-section'
import BloodDonationSlider from '@/components/home/blood-donation-slider'
import BloodDonationCriteria from '@/components/home/BloodDonationCriteria'
import BloodDonationBenefits from '@/components/home/blood-donation-benefit'
import AdviceSection from '@/components/home/AdviceSection'
import EventDonationSlider from '@/components/home/event-donation-slider'
import { motion } from 'framer-motion'

const Home: React.FC = () => {
  return (
    <motion.div 
      className='min-h-screen bg-gray-50'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className='fixed top-[20%] left-[5%] w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-30 -z-10'></div>
      <div className='fixed top-[70%] right-[10%] w-40 h-40 bg-red-200 rounded-full blur-3xl opacity-20 -z-10'></div>
      
      <HeroSection />
      
      <div className='h-2 bg-gradient-to-r from-red-50 via-gray-100 to-red-50'></div>
      
      <BloodDonationSlider />
      
      <div className='h-2 bg-gradient-to-r from-red-50 via-gray-100 to-red-50'></div>
      
      <BloodDonationCriteria />
      
      <div className='h-2 bg-gradient-to-r from-red-50 via-gray-100 to-red-50'></div>
      
      <BloodDonationBenefits />
      
      <div className='h-2 bg-gradient-to-r from-red-50 via-gray-100 to-red-50'></div>
      
      <AdviceSection />
      
      <div className='h-2 bg-gradient-to-r from-red-50 via-gray-100 to-red-50'></div>
      
      <EventDonationSlider />
      
    </motion.div>
  )
}

export default Home
