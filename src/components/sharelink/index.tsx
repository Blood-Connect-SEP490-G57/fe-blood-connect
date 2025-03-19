import { FacebookIcon, CopyIcon, ShareIcon, Share2 } from 'lucide-react'
import { useState, useRef } from 'react'
import { toast } from '../ui/use-toast'
import { CampaignResponse } from '@/schema/campaign-schema'
export default function ShareLink({ selectedCampaign }: { selectedCampaign: CampaignResponse }) {
  const [showIcons, setShowIcons] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  // const baseUrl = `http://localhost:3000/dang-ky-hien-mau`
  const baseUrl = `https://giotmauhyvong.org/dang-ky-hien-mau`

  const urlToShare = `${baseUrl}?campaignId=${selectedCampaign?.id}&questionset=${selectedCampaign?.questionSetId}`

  function shareToFacebook() {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`
    window.open(fbUrl, '_blank')
    localStorage.removeItem('selectedCampaign')
  }

  function shareToZalo() {
    const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(urlToShare)}`
    window.open(zaloUrl, '_blank')
    localStorage.removeItem('selectedCampaign')
  }

  function copyToClipboard() {
    navigator.clipboard
      .writeText(urlToShare)
      .then(() =>
        toast({
          title: '✅ Đã sao chép liên kết!',
          description: 'Đã sao chép liên kết thành công!',
          variant: 'default'
        })
      )
      .catch(() =>
        toast({
          title: '❌ Lỗi khi sao chép!',
          description: 'Lỗi khi sao chép liên kết!',
          variant: 'destructive'
        })
      )
    localStorage.removeItem('selectedCampaign')
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
        className='flex items-center gap-2 p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-transform transform hover:scale-110 shadow-lg focus:outline-none'
        aria-label='Chia sẻ'
      >
        <Share2 size={24} />
        <p >Chia sẻ ngay</p>
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
