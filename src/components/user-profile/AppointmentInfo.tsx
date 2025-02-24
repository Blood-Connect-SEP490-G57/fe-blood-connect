import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Building,
  CreditCard,
  Baby,
  Briefcase,
  Droplet,
  Contact
} from 'lucide-react'

interface PersonalInfo {
  fullName: string
  idNumber: string
  birthDate: string
  gender: string
  occupation: string
  organization: string
  contactAddress: string
  permanentAddress: string
  phone: string
  email: string
  idIssuePlace: string
  studentMilitaryId: string
  bloodType: string
}

const RegistrationIcon = () => (
  <svg
    width='128'
    height='128'
    viewBox='0 0 128 128'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='text-red-600'
  >
    <rect x='24' y='16' width='80' height='96' rx='8' className='fill-red-50' stroke='currentColor' strokeWidth='4' />
    <path d='M44 48H84' stroke='currentColor' strokeWidth='4' strokeLinecap='round' />
    <path d='M44 64H84' stroke='currentColor' strokeWidth='4' strokeLinecap='round' />
    <path d='M44 80H64' stroke='currentColor' strokeWidth='4' strokeLinecap='round' />
    <circle cx='64' cy='32' r='4' fill='currentColor' />
  </svg>
)

const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className='flex justify-between items-center'>
    <div className='flex items-center gap-2 text-gray-600'>
      <Icon className='w-4 h-4' />
      <span>{label}:</span>
    </div>
    <span className='font-medium'>{value}</span>
  </div>
)

const ContactItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className='flex items-start gap-2'>
    <Icon className='w-5 h-5 text-gray-500 mt-1' />
    <div>
      <span className='text-gray-600'>{label}:</span>
      <p className='font-medium'>{value || '-'}</p>
    </div>
  </div>
)

const AppointmentInfo = () => {
  const personalInfo: PersonalInfo = {
    fullName: 'Bế Minh',
    birthDate: '01/01/2000',
    gender: 'Nam',
    occupation: 'Sinh viên',
    organization: 'Đại học ABC',
    contactAddress: 'Hà Nội, Việt Nam',
    permanentAddress: 'Hà Nội, Việt Nam',
    phone: '0123456789',
    email: 'be.minh@example.com',
    idNumber: '123456789',
    idIssuePlace: 'Hà Nội',
    studentMilitaryId: 'HS123456',
    bloodType: 'A+'
  }

  const personalInfoItems = [
    { icon: User, label: 'Họ và tên', value: personalInfo.fullName },
    { icon: CreditCard, label: 'Số CCCD', value: personalInfo.idNumber },
    { icon: Calendar, label: 'Ngày sinh', value: personalInfo.birthDate },
    { icon: Baby, label: 'Giới tính', value: personalInfo.gender },
    { icon: Briefcase, label: 'Nghề nghiệp', value: personalInfo.occupation },
    { icon: Building, label: 'Đơn vị', value: personalInfo.organization },
    { icon: Droplet, label: 'Nhóm máu', value: personalInfo.bloodType },
    { icon: MapPin, label: 'Địa chỉ thường trú', value: personalInfo.permanentAddress },
    { icon: CreditCard, label: 'Nơi cấp CCCD', value: personalInfo.idIssuePlace },
    { icon: CreditCard, label: 'Mã số sinh viên/quân nhân', value: personalInfo.studentMilitaryId },
  ]

  const contactInfoItems = [
    { icon: MapPin, label: 'Địa chỉ liên hệ', value: personalInfo.contactAddress },
    { icon: Phone, label: 'Số điện thoại', value: personalInfo.phone },
    { icon: Mail, label: 'Email', value: personalInfo.email }
  ]

  return (
    <div className='min-h-screen bg-white py-12'>
      <div className='container mx-auto px-4'>
        <h1 className='text-2xl font-bold text-gray-900 mb-8'>Thông tin đăng ký hiến máu</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className='text-xl text-red-600 flex items-center gap-2'>
                <User className='w-5 h-5' />
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4'>
                {personalInfoItems.map((item, index) => (
                  <InfoItem key={index} {...item} />
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Contact Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className='text-xl text-red-600 flex items-center gap-2'>
                <Contact className='w-5 h-5' />
                Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {contactInfoItems.map((item, index) => (
                  <ContactItem key={index} {...item} />
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Appointment Registration Card */}
          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle className='text-xl text-red-600 flex items-center gap-2'>
                <Calendar className='w-5 h-5' />
                Phiếu đăng ký hiến máu
              </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col items-center justify-center space-y-6'>
              <div className='w-32 h-32'>
                <RegistrationIcon />
              </div>
              <p className='text-lg text-gray-600 text-center'>Chưa có phiếu đăng ký hiến máu</p>
              <Button
                className='bg-red-600 hover:bg-red-700 text-white'
                onClick={() => console.log('Navigate to registration')}
              >
                Đăng ký hiến máu
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AppointmentInfo
