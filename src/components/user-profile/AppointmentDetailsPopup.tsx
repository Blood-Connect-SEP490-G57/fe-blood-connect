import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClipboardList, Calendar, X, MapPin, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface AppointmentDetailsPopupProps {
  isOpen: boolean
  onClose: () => void
  appointmentItems: { label: string; value: string }[]
  groupedSections: {
    id: number
    name: string
    answers: { id: number; content: string; answer: boolean; detail: string }[]
  }[]
  renderStatusBadge: (status: string) => JSX.Element
  status: string
}

const AppointmentDetailsPopup = ({
  isOpen,
  onClose,
  appointmentItems,
  groupedSections,
  renderStatusBadge,
  status
}: AppointmentDetailsPopupProps) => {
  if (!isOpen) return null

  const navigate = useNavigate()
  return (
    <div className='fixed inset-0 flex flex-col z-50 md:items-center md:justify-center bg-black/50 overflow-y-auto'>
      <div className='bg-gray-100 w-full h-full md:h-auto md:max-h-[90vh] md:w-[90%] md:max-w-2xl md:rounded-2xl shadow-xl overflow-hidden md:my-4'>
        {/* Header */}
        <div className='bg-white p-4 sticky top-0 z-10 border-b flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Chi tiết đăng ký hiến máu</h2>
          <button 
            onClick={onClose} 
            className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200'
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Content */}
        <div className='p-4 overflow-y-auto'>
          {appointmentItems.length > 0 ? (
            <>
              {/* Appointment Information */}
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-700 mb-2 px-2'>Thông tin buổi hiến máu</h3>
                <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
                  <CardContent className='p-0'>
                    <div className='bg-white p-4 flex items-center justify-between'>
                      <span className='text-sm font-medium'>Trạng thái</span>
                      {renderStatusBadge(status)}
                    </div>
                    
                    <div className='divide-y'>
                      {appointmentItems.map((item, index) => (
                        <div key={index} className='p-4 flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            {index === 0 ? (
                              <ClipboardList className='h-5 w-5 text-gray-500' />
                            ) : index === 1 ? (
                              <Calendar className='h-5 w-5 text-gray-500' />
                            ) : (
                              <MapPin className='h-5 w-5 text-gray-500' />
                            )}
                            <span className='text-sm font-medium text-gray-700'>{item.label}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <span className='text-sm text-gray-600'>{item.value}</span>
                            <ChevronRight className='h-4 w-4 text-gray-400' />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Health Questionnaire Details */}
              {groupedSections.length > 0 && (
                <div className='mb-6'>
                  <h3 className='text-lg font-semibold text-gray-700 mb-2 px-2'>Câu hỏi sức khỏe</h3>
                  {groupedSections.map((section) => (
                    <Card key={section.id} className='mb-4 overflow-hidden rounded-xl shadow-sm border-none'>
                      <div className='bg-white p-4 font-medium border-b'>{section.name}</div>
                      <CardContent className='p-0'>
                        <div className='divide-y'>
                          {section.answers.map((answer) => (
                            <div key={answer.id} className='p-4'>
                              <div className='flex items-start justify-between'>
                                <span className='text-sm text-gray-700 pr-4'>{answer.content}</span>
                                <span className={`text-sm font-medium ${answer.answer ? 'text-green-600' : 'text-red-600'}`}>
                                  {answer.answer ? 'Có' : 'Không'}
                                </span>
                              </div>
                              {answer.detail && (
                                <div className='mt-2 text-sm text-gray-500 italic pl-0'>
                                  Chi tiết: {answer.detail}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className='flex flex-col items-center justify-center py-12'>
              <div className='w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4'>
                <Calendar className='w-10 h-10 text-gray-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-800 mb-2'>Chưa có phiếu đăng ký</h3>
              <p className='text-gray-500 text-center mb-6'>Bạn chưa đăng ký hiến máu. Hãy đăng ký ngay để tham gia hiến máu.</p>
              <Button 
                onClick={() => navigate('/dang-ky-hien-mau')} 
                className='bg-red-600 hover:bg-red-700 text-white py-5 px-6 rounded-xl w-full md:w-auto'
              >
                Đăng ký ngay
              </Button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {appointmentItems.length > 0 && (
          <div className='p-4 bg-white border-t sticky bottom-0'>
            <Button 
              onClick={onClose} 
              className='w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-5 rounded-xl'
            >
              Đóng
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentDetailsPopup
