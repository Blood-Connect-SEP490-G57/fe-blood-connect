import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClipboardList, Calendar } from 'lucide-react'

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

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 max-h-[100vh] overflow-y-auto'>
        <div className='flex justify-end items-center mb-4'>
          <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
            Đóng
          </button>
        </div>
        <div className='space-y-6'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg text-red-600 flex items-center gap-2'>
                <Calendar className='w-5 h-5' />
                Phiếu đăng ký hiến máu
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-2'>
              {appointmentItems.length > 0 ? (
                <div className='w-full space-y-3'>
                  <div className='flex justify-between items-center border-b pb-2'>
                    <h3 className='font-medium'>Thông tin buổi hiến máu</h3>
                    {renderStatusBadge(status)}
                  </div>
                  <div className='flex flex-col gap-3'>
                    {appointmentItems.map((item, index) => (
                      <div key={index} className='flex items-start gap-2'>
                        <div>
                          <span className='text-gray-600 font-blod'>{item.label}:</span>
                          <p className='font-medium'>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className='flex justify-center'>
                  <p className='text-gray-600 text-center'>Chưa có phiếu đăng ký hiến máu</p>
                  <Button onClick={onClose} className='bg-red-600 hover:bg-red-700 text-white'>
                    Đăng ký ngay
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Questionnaire Details */}
          {groupedSections.length > 0 && (
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg text-red-600 flex items-center gap-2'>
                  <ClipboardList className='w-5 h-5' />
                  Chi tiết câu hỏi sức khỏe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='bg-gray-50 rounded-lg p-4 space-y-6'>
                  {groupedSections.map((section) => (
                    <div key={section.id} className='border-b pb-4 last:border-b-0 last:pb-0'>
                      <h3 className='font-medium text-gray-800 mb-3'>{section.name}</h3>
                      <div className='space-y-3'>
                        {section.answers.map((answer) => (
                          <div key={answer.id} className='flex flex-col gap-1'>
                            <div className='flex gap-2 items-start'>
                              <div className={`w-2 h-2 rounded-full mt-2 bg-red-600`}></div>
                              <div className='flex-1'>
                                <div className='flex justify-between items-start'>
                                  <span className='text-gray-700'>{answer.content}</span>
                                  <span className={`ml-4 font-medium`}>{answer.answer ? 'Có' : 'Không'}</span>
                                </div>
                                {answer.detail && (
                                  <p className='text-sm text-gray-500 mt-1 ml-4'>Chi tiết: {answer.detail}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className='flex justify-end mt-4'>
          <Button onClick={onClose} className='bg-gray-300 hover:bg-gray-400 text-gray-800'>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AppointmentDetailsPopup
