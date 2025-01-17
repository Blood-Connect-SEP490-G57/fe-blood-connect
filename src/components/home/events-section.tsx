import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Event {
  date: string
  title: string
  description: string
}

interface EventsSectionProps {
  events: Event[]
}

const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  return (
    <section className='py-20'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold mb-12 text-center'>Sự Kiện Sắp Diễn Ra</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </section>
  )
}

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <Card className='hover:shadow-lg transition-shadow'>
      <CardHeader>
        <div className='text-red-600 font-semibold mb-2'>{event.date}</div>
        <CardTitle className='text-xl'>{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{event.description}</CardDescription>
      </CardContent>
    </Card>
  )
}

export default EventsSection
