import React, { useState } from 'react'
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({ name: '', email: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' })) // Xóa lỗi khi người dùng nhập
  }

  const validateForm = () => {
    const newErrors: { name: string; email: string; message: string } = { name: '', email: '', message: '' }
    if (!form.name.trim()) newErrors.name = 'Họ và tên là bắt buộc.'
    if (!form.email.trim()) newErrors.email = 'Email là bắt buộc.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email không hợp lệ.'
    if (!form.message.trim()) newErrors.message = 'Tin nhắn là bắt buộc.'

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error) // Trả về true nếu không có lỗi
  }

  const sendFeedback = async () => {
    const formUrl =
      'https://docs.google.com/forms/d/e/1FAIpQLScHsTIOhR5KQDOMmQhX_ZrKCCJozjytkjoqhD5S83ckttal-w/formResponse'

    const formData = new FormData()
    formData.append('entry.1684913984', form.name)
    formData.append('entry.80640749', form.email)
    formData.append('entry.302640033', form.message)

    await fetch(formUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })

    return { result: 'success' }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const result = await sendFeedback()

      if (result.result === 'success') {
        toast({
          title: 'Thành công!',
          description: 'Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.',
          variant: 'default'
        })
        setForm({ name: '', email: '', message: '' })
      }
    } catch (err) {
      console.error('Error sending feedback:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 '>
      {/* Banner section */}
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <div className='bg-gradient-to-r from-red-600 to-red-400 text-white p-6 relative rounded-xl'>
          <div className='container mx-auto'>
            <div className='flex flex-col items-center'>
              <div className='h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-md mb-4'>
                <MessageCircle className='h-12 w-12 text-red-500' />
              </div>
              <h1 className='text-xl font-bold mb-1'>Liên Hệ Với Chúng Tôi</h1>
              <p className='text-center text-white/80 max-w-2xl text-sm'>
                Gửi phản hồi hoặc liên hệ trực tiếp với chúng tôi để được hỗ trợ tốt nhất!
              </p>
            </div>
          </div>
          {/* Decorative elements */}
          <div className='absolute -bottom-0 left-1/4 w-16 h-16 bg-red-400 rounded-full opacity-20'></div>
          <div className='absolute top-8 right-1/4 w-12 h-12 bg-white rounded-full opacity-10'></div>
          <div className='absolute bottom-6 right-10 w-20 h-20 bg-red-300 rounded-full opacity-15'></div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Contact Info */}
          <Card className='w-full lg:w-1/2 overflow-hidden rounded-xl shadow-sm border-none'>
            <CardContent className='p-6'>
              <h3 className='text-xl font-semibold mb-6 text-gray-800'>Thông Tin Liên Hệ</h3>

              <div className='space-y-6'>
                {[
                  {
                    icon: <MapPin className='text-red-500 w-5 h-5' />,
                    title: 'Địa chỉ',
                    desc: '72 Lương Văn Tụy, Tân Thành, Ninh Bình'
                  },
                  {
                    icon: <Phone className='text-red-500 w-5 h-5' />,
                    title: 'Điện thoại',
                    desc: '0229 3899 505'
                  },
                  {
                    icon: <Mail className='text-red-500 w-5 h-5' />,
                    title: 'Email',
                    desc: 'ctdninhbinh@gmail.com'
                  },
                  {
                    icon: <Clock className='text-red-500 w-5 h-5' />,
                    title: 'Giờ làm việc',
                    desc: 'Thứ 2 - Thứ 6: 8:00 - 17:00'
                  }
                ].map((item, idx) => (
                  <div key={idx} className='flex gap-4 items-start'>
                    <div className='bg-red-100 p-2.5 rounded-full flex-shrink-0'>{item.icon}</div>
                    <div>
                      <p className='font-medium text-gray-800'>{item.title}</p>
                      <p className='text-gray-600 text-sm'>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map preview */}
              <div className='mt-8 rounded-xl overflow-hidden h-48 bg-gray-200 relative'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <p className='text-gray-500 text-sm'>Bản đồ đang tải...</p>
                </div>
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4440.0067890823175!2d105.9697226!3d20.256457599999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313679ffde3d2bef%3A0x82cdd6331184cccc!2zNzIgTMawxqFuZyBWxINuIFThu6V5LCBUw6JuIFRow6BuaCwgTmluaCBCw6xuaA!5e1!3m2!1svi!2s!4v1744236731836!5m2!1svi!2s'
                  width='100%'
                  height='100%'
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  className='absolute inset-0'
                ></iframe>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className='w-full lg:w-1/2 overflow-hidden rounded-xl shadow-sm border-none'>
            <CardContent className='p-6'>
              <h3 className='text-xl font-semibold mb-6 text-gray-800'>Gửi Tin Nhắn</h3>
              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='flex-1'>
                  <label htmlFor='name' className='text-sm font-medium text-gray-700 mb-1 block'>
                    Họ và Tên
                  </label>
                  <Input
                    id='name'
                    type='text'
                    name='name'
                    placeholder='Nhập họ và tên của bạn'
                    value={form.name}
                    onChange={handleChange}
                    className={`rounded-xl bg-gray-100 border-gray-200  ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className='text-sm text-red-500 mt-1'>{errors.name}</p>}
                </div>

                <div className='flex-1'>
                  <label htmlFor='email' className='text-sm font-medium text-gray-700 mb-1 block'>
                    Email
                  </label>
                  <Input
                    id='email'
                    type='email'
                    name='email'
                    placeholder='Nhập email của bạn'
                    value={form.email}
                    onChange={handleChange}
                    className={`rounded-xl bg-gray-100 border-gray-200  ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className='text-sm text-red-500 mt-1'>{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor='message' className='text-sm font-medium text-gray-700 mb-1 block'>
                    Tin nhắn
                  </label>
                  <Textarea
                    id='message'
                    name='message'
                    placeholder='Nhập tin nhắn của bạn...'
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full h-[215px] bg-gray-100 resize-none rounded-xl border-gray-200  ${
                      errors.message ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.message && <p className='text-sm text-red-500 mt-1'>{errors.message}</p>}
                </div>
                <div className='flex justify-end'>
                  <Button
                    type='submit'
                    disabled={isLoading}
                    className='rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-medium py-5 hover:opacity-90 transition'
                  >
                    {isLoading ? (
                      'Đang gửi...'
                    ) : (
                      <span className='flex items-center justify-center'>
                        Gửi Phản Hồi
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
