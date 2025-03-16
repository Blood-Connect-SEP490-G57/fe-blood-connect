import AdviceItem from './AdviceItem'

const AdviceSection = () => {
  return (
    <div className='py-16 sm:py-24 bg-red-600'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <h1 className='text-2xl font-bold text-center mb-6 text-white'>Những lời khuyên trước và sau khi hiến máu</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <AdviceItem
            title='Nên:'
            type='should'
            items={[
              'Ăn nhẹ và uống nhiều nước (300-500ml) trước khi hiến máu.',
              'Đè chặt miếng bông gòn cầm máu nơi kim chích 10 phút, giữ băng keo cá nhân trong 4-6 giờ.',
              'Nằm và ngồi nghỉ tại chỗ 10 phút sau khi hiến máu.',
              'Nằm nghỉ đầu thấp, kê chân cao nếu thấy chóng mặt, mệt, buồn nôn.',
              'Chườm lạnh (túi chườm chuyên dụng hoặc cho đá vào khăn) chườm vết chích nếu bị sưng, bầm tím.'
            ]}
            doctor=''
            position=''
            hospital=''
          />
          <AdviceItem
            title='Không nên:'
            type='shouldNot'
            items={[
              'Uống sữa, rượu bia trước khi hiến máu.',
              'Lái xe đi xa, khuân vác, làm việc nặng hoặc luyện tập thể thao gắng sức trong ngày lấy máu.'
            ]}
            doctor=''
            position=''
            hospital=''
          />
          <AdviceItem
            title='Lưu ý:'
            type='note'
            items={[
              'Nếu phát hiện chảy máu tại chỗ chích:',
              'Giơ tay cao.',
              'Lấy tay kia ấn nhẹ vào miếng bông hoặc băng dính.',
              'Liên hệ nhân viên y tế để được hỗ trợ khi cần thiết.'
            ]}
            doctor=''
            position=''
            hospital=''
          />
        </div>
      </div>
    </div>
  )
}

export default AdviceSection
