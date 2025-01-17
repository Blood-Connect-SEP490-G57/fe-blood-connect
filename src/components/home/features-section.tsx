import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Feature {
  title: string
  description: string
  icon: string
}

interface FeaturesSectionProps {
  features: Feature[]
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  return (
    <section className='py-20 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold mb-4'>Quyền Lợi Của Người Hiến Máu</h2>
          <p className='text-gray-600'>
            Tham gia hiến máu không chỉ giúp đỡ người khác mà còn mang lại nhiều lợi ích cho chính bạn
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
  return (
    <Card>
      <CardHeader>
        <div className='text-4xl mb-4'>{feature.icon}</div>
        <CardTitle>{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{feature.description}</CardDescription>
      </CardContent>
    </Card>
  )
}

export default FeaturesSection
