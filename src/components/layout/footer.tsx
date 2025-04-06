import { FacebookIcon, Globe, Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className='bg-gray-900 text-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Về chúng tôi</h3>
            <p className='text-gray-400'>
              Giọt Máu Hi Vọng là dự án phi lợi nhuận nhằm kết nối những người hiến máu tình nguyện với những người cần
              máu. Chúng tôi tin rằng mỗi giọt máu đều mang lại hy vọng và sự sống cho những người đang cần.
            </p>
            <br />
            <p className='text-gray-400'>Dự án này được thực hiện dưới sự hợp tác với Hội chữ thập đỏ Tỉnh Ninh Bình</p>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Liên hệ</h3>
            <div className='text-gray-400'>
              <p className='flex items-center'>
                <Mail className='w-5 h-5 mr-2' />
                Email: ctdninhbinh@gmail.com
              </p>
              <p className='flex items-center'>
                <Phone className='w-5 h-5 mr-2' />
                Hotline: (+84)(229)3872.198
              </p>
              <p className='flex items-center'>
                <Phone className='w-5 h-5 mr-2' />
                Fax: (+84)(229)3875.148
              </p>
              <p className='flex items-center'>
                <Phone className='w-5 h-5 mr-2' />
                Điện thoại: 0229 3899 505
              </p>
              <a
                className='flex items-center'
                href='https://maps.app.goo.gl/itVhswxLUjWxUd7t6'
                target='_blank'
                rel='noopener noreferrer'
              >
                <MapPin className='w-5 h-5 mr-2' />
                Địa chỉ: Số 72 - đường Lương Văn Tụy, Ninh Bình, Vietnam
              </a>
            </div>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Theo dõi chúng tôi</h3>
            <div className='flex flex-col space-y-2 gap-2 text-gray-400'>
              <a
                href='https://www.facebook.com/hoichuthapdotinhninhbinh'
                target='_blank'
                rel='noopener noreferrer'
                className='flex flex-row items-center space-x-2'
              >
                <FacebookIcon className='w-6 h-6' />
                <span>Facebook: Giọt Máu Hy Vọng</span>
              </a>
              <a
                href='http://chuthapdoninhbinh.org.vn/'
                className='flex flex-row items-center space-x-2'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Globe className='w-6 h-6' />
                <span>Trang Web chính thức: Hội Chữ Thập Đỏ Ninh Bình</span>
              </a>
            </div>
            <h3 className='text-lg font-semibold mb-4 mt-4'>Điều khoản sử dụng</h3>
            <div className='flex flex-col space-y-2 gap-2 text-gray-400'>
              <a href='/dieu-khoan-su-dung' className='text-gray-400 hover:text-white'>
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </div>
        <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
          <p>&copy; 2025 Giọt Máu Hy Vọng. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer