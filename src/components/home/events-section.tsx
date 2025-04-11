import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Users } from 'lucide-react'
import { motion } from 'framer-motion'

interface Event {
  id: string
  date: string
  title: string
  description: string
  location?: string
  attendees?: number
  image?: string
}

interface EventsSectionProps {
  events: Event[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  return (
    <section className='py-16 relative overflow-hidden bg-gradient-to-b from-white to-gray-50'>
      {/* Decorative elements */}
      <div className='absolute top-20 left-10 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-30 -z-10'></div>
      <div className='absolute bottom-20 right-10 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      
      <div className='max-w-7xl mx-auto px-2 sm:px-4 relative'>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='text-center mb-12'
        >
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-4'>Sự Kiện Sắp Diễn Ra</h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Cùng tham gia các sự kiện hiến máu sắp diễn ra và chung tay cứu sống những người cần máu.
          </p>
          <div className='w-24 h-1 bg-red-100 mx-auto mt-6 rounded-full'></div>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className='mt-12 text-center'
        >
          <div className='inline-block bg-gradient-to-r from-red-500 to-pink-500 p-0.5 rounded-full'>
            <motion.button 
              className='bg-white text-red-500 font-medium px-8 py-3 rounded-full hover:bg-transparent hover:text-white transition-colors duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Xem tất cả sự kiện
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className='overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 bg-white rounded-2xl'>
        {event.image && (
          <div className='h-40 w-full overflow-hidden'>
            <img 
              src={event.image} 
              alt={event.title} 
              className='w-full h-full object-cover transform hover:scale-105 transition-transform duration-500'
            />
          </div>
        )}
        
        <CardHeader className='pb-2'>
          <div className='flex items-center text-red-500 gap-1.5 mb-2'>
            <Calendar className='h-4 w-4' />
            <span className='text-sm font-medium'>{event.date}</span>
          </div>
          <CardTitle className='text-xl text-gray-800'>{event.title}</CardTitle>
        </CardHeader>
        
        <CardContent className='space-y-4'>
          <CardDescription className='text-gray-600'>{event.description}</CardDescription>
          
          <div className='flex flex-col gap-2 pt-2 text-sm text-gray-600'>
            {event.location && (
              <div className='flex items-center gap-2'>
                <MapPin className='h-4 w-4 text-red-400' />
                <span>{event.location}</span>
              </div>
            )}
            
            {event.attendees !== undefined && (
              <div className='flex items-center gap-2'>
                <Users className='h-4 w-4 text-red-400' />
                <span>{event.attendees} người tham gia</span>
              </div>
            )}
          </div>
          
          <motion.button
            className='w-full mt-2 bg-gradient-to-r from-red-50 to-red-100 text-red-500 py-2 rounded-lg font-medium text-sm hover:from-red-100 hover:to-red-200 transition-all duration-300'
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Chi tiết
          </motion.button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default EventsSection
