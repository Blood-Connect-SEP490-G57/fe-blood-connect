import { FacebookIcon, CopyIcon, ShareIcon } from 'lucide-react'
import { useState, useRef } from 'react'

export default function ShareLink({ campaign }: { campaign: string }) {
  const campaignData = JSON.parse(campaign)
  const question = campaignData.question
  const urlToShare = `https://giotmauhyvong.org/dang-ky-hien-mau?campaignId=${campaignData.id}&questionset=${question}`
  const [showIcons, setShowIcons] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  function shareToFacebook() {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`
    window.open(fbUrl, '_blank')
  }

  function shareToZalo() {
    const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(urlToShare)}`
    window.open(zaloUrl, '_blank')
  }

  function copyToClipboard() {
    navigator.clipboard
      .writeText(urlToShare)
      .then(() => alert('✅ Đã sao chép liên kết!'))
      .catch(() => alert('❌ Lỗi khi sao chép!'))
  }

  function toggleIcons() {
    setShowIcons(!showIcons)
  }

  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (!dropdownRef.current?.contains(event.relatedTarget)) {
      setShowIcons(false)
    }
  }

  return (
    <div className='relative flex flex-col items-center mr-4'>
      <button
        onClick={toggleIcons}
        className='p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-transform transform hover:scale-110 shadow-lg focus:outline-none'
        aria-label='Chia sẻ'
      >
        <ShareIcon size={24} />
      </button>

      {showIcons && (
        <div
          ref={dropdownRef}
          tabIndex={0}
          onBlur={handleBlur}
          className='absolute top-full mt-2 flex space-x-3 p-3 bg-white border border-gray-200 rounded-lg shadow-lg'
        >
          <button
            onClick={shareToFacebook}
            title='Chia sẻ lên Facebook'
            className='p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-transform transform hover:scale-110 shadow-md'
            aria-label='Chia sẻ lên Facebook'
          >
            <FacebookIcon size={20} />
          </button>
          <button
            onClick={shareToZalo}
            title='Chia sẻ lên Zalo'
            className='p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-transform transform hover:scale-110 shadow-md'
            aria-label='Chia sẻ lên Zalo'
          >
            <ShareIcon size={20} />
          </button>
          <button
            onClick={copyToClipboard}
            title='Sao chép liên kết'
            className='p-2 bg-gray-300 text-black rounded-full hover:bg-gray-400 transition-transform transform hover:scale-110 shadow-md'
            aria-label='Sao chép liên kết'
          >
            <CopyIcon size={20} />
          </button>
        </div>
      )}
    </div>
  )
}
