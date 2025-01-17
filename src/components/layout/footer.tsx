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
              máu.
            </p>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Liên hệ</h3>
            <p className='text-gray-400'>
              Email: contact@giotmauhivong.vn
              <br />
              Điện thoại: (84) 123-456-789
              <br />
              Địa chỉ: Hà Nội, Việt Nam
            </p>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Theo dõi chúng tôi</h3>
            <div className='flex space-x-4'>{/* Add social media icons/links here */}</div>
          </div>
        </div>
        <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
          <p>&copy; 2024 Giọt Máu Hi Vọng. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
