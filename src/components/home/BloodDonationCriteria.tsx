import { Card, CardContent } from '@/components/ui/card'
import { FaIdCard, FaUserMd, FaHeartbeat, FaWeight, FaCalendarCheck, FaTint } from 'react-icons/fa'

const BloodDonationCriteria = () => {
  return (
    <div className='bg-red-600 min-h-screen flex items-center justify-center p-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl'>
        {/* Image card (large span) */}
        <Card className='bg-white col-span-1 md:col-span-2 row-span-2 shadow-lg rounded-2xl'>
          <CardContent className='p-8'>
            <img src='/images/landing/blood-donation.jpg' alt='Blood Donation' className='rounded-lg shadow-md' />
            <h2 className='text-3xl font-bold text-red-600 mt-6 text-center'>Tiêu chuẩn tham gia hiến máu</h2>
          </CardContent>
        </Card>

        {/* Criterion cards with varied spans */}
        <Card className='bg-white col-span-1 shadow-md rounded-xl'>
          <CardContent className='flex items-center gap-4 p-6'>
            <FaIdCard className='text-red-600 text-3xl' />
            <p>Mang theo chứng minh nhân dân/hộ chiếu</p>
          </CardContent>
        </Card>

        <Card className='bg-white col-span-1 shadow-md rounded-xl'>
          <CardContent className='flex items-center gap-4 p-6'>
            <FaUserMd className='text-red-600 text-3xl' />
            <p>Không mắc hoặc không có các hành vi nguy cơ lây nhiễm HIV...</p>
          </CardContent>
        </Card>

        <Card className='bg-white col-span-1 md:col-span-2 shadow-md rounded-xl'>
          <CardContent className='flex items-center gap-4 p-6'>
            <FaHeartbeat className='text-red-600 text-3xl' />
            <p>Không nghiện ma túy, rượu bia và các chất kích thích</p>
          </CardContent>
        </Card>

        <Card className='bg-white col-span-1 shadow-md rounded-xl'>
          <CardContent className='flex items-center gap-4 p-6'>
            <FaWeight className='text-red-600 text-3xl' />
            <p>Cân nặng: Nam ≥ 45 kg Nữ ≥ 45 kg</p>
          </CardContent>
        </Card>

        <Card className='bg-white col-span-1 shadow-md rounded-xl'>
          <CardContent className='flex items-center gap-4 p-6'>
            <FaCalendarCheck className='text-red-600 text-3xl' />
            <p>Thời gian tối thiểu giữa 2 lần hiến máu là 12 tuần</p>
          </CardContent>
        </Card>

        <Card className='bg-white col-span-1 md:col-span-2 shadow-md rounded-xl'>
          <CardContent className='flex items-center gap-4 p-6'>
            <FaTint className='text-red-600 text-3xl' />
            <p>Kết quả test nhanh âm tính với kháng nguyên bề mặt của siêu vi B</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BloodDonationCriteria
