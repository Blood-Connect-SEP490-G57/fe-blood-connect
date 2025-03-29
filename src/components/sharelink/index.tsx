import { FacebookIcon, CopyIcon, Share2 } from 'lucide-react'
import { useState, useRef } from 'react'
import { toast } from '../ui/use-toast'
import { CampaignResponse } from '@/schema/campaign-schema'
import { shortenUrl } from '@/api/sharelink'
export default function ShareLink({ selectedCampaign }: { selectedCampaign: CampaignResponse }) {
  const [showIcons, setShowIcons] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const baseUrl = `https://giotmauhyvong.org/dang-ky-hien-mau`

  const urlToShare = `${baseUrl}?campaignId=${selectedCampaign?.id}&questionset=${selectedCampaign?.questionSetId}`

  async function shareToFacebook() {
    try {
      const shortUrl = await shortenUrl(urlToShare)
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}`
      window.open(fbUrl, '_blank')?.focus()
      localStorage.removeItem('selectedCampaign')
    } catch (error) {
      console.error('Lỗi khi chia sẻ:', error)
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`, '_blank')?.focus()
    }
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
        <p>Chia sẻ ngay</p>
      </button>

      {showIcons && (
        <div
          ref={dropdownRef}
          tabIndex={0}
          onBlur={handleBlur}
          className='absolute top-full mt-2 flex space-x-3 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-10'
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
