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
import { useEffect, useState, useRef } from 'react'
import { User as fetchUser } from '@/api/user'

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

const AppointmentInfo = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    idNumber: '',
    birthDate: '',
    gender: '',
    occupation: '',
    organization: '',
    contactAddress: '',
    permanentAddress: '',
    phone: '',
    email: '',
    idIssuePlace: '',
    studentMilitaryId: '',
    bloodType: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchUserData = async () => {
      try {
        const response = await fetchUser()

        setPersonalInfo({
          fullName: response.full_name || '',
          idNumber: response.card_id || '',
          birthDate: response.dob ? `${response.dob[2]}/${response.dob[1]}/${response.dob[0]}` : '',
          gender: response.gender || '',
          occupation: response.job_name || '',
          organization: '', // Không có trường này trong API
          contactAddress: response.address_contact || '',
          permanentAddress: response.address || '',
          phone: response.mobile || '',
          email: response.email || '',
          idIssuePlace: response.issue_loc || '',
          studentMilitaryId: response.student_id || response.military_id || '',
          bloodType: response.blood_group || ''
        })

        console.log(response)
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError('Không thể tải thông tin người dùng')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

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
    { icon: CreditCard, label: 'Mã số sinh viên/quân nhân', value: personalInfo.studentMilitaryId }
  ]

  const contactInfoItems = [
    { icon: MapPin, label: 'Địa chỉ liên hệ', value: personalInfo.contactAddress },
    { icon: Phone, label: 'Số điện thoại', value: personalInfo.phone },
    { icon: Mail, label: 'Email', value: personalInfo.email }
  ]

  if (loading) {
    return (
      <div className='min-h-screen bg-white py-12'>
        <div className='container mx-auto px-4'>Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-white py-12'>
        <div className='container mx-auto px-4 text-red-600'>{error}</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white py-12'>
      <div className='container mx-auto px-4'>
        <h1 className='text-2xl font-bold text-gray-900 mb-8'>Thông tin đăng ký hiến máu</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 ml-4 mr-4'>
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
                  <div key={index} className='flex justify-between items-center'>
                    <div className='flex items-center gap-2 text-gray-600'>
                      <item.icon className='w-4 h-4' />
                      <span>{item.label}:</span>
                    </div>
                    <span className='font-medium'>{item.value || '-'}</span>
                  </div>
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
                  <div key={index} className='flex items-start gap-2'>
                    <item.icon className='w-5 h-5 text-gray-500 mt-1' />
                    <div>
                      <span className='text-gray-600'>{item.label}:</span>
                      <p className='font-medium'>{item.value || '-'}</p>
                    </div>
                  </div>
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
