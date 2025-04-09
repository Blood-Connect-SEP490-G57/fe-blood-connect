import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const sendFeedback = async () => {
    const formUrl =
      'https://docs.google.com/forms/d/e/1FAIpQLScHsTIOhR5KQDOMmQhX_ZrKCCJozjytkjoqhD5S83ckttal-w/formResponse';

    const formData = new FormData();
    formData.append('entry.1684913984', form.name);
    formData.append('entry.80640749', form.email);
    formData.append('entry.302640033', form.message);

    await fetch(formUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    });

    return { result: 'success' };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ message: '', type: '' });

    try {
      const result = await sendFeedback();
      if (result.result === 'success') {
        setStatus({ message: 'Phản hồi đã được gửi thành công!', type: 'success' });
        setForm({ name: '', email: '', message: '' });
      }
    } catch (err) {
      setStatus({ message: 'Lỗi khi gửi phản hồi.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner section */}
      <div className='bg-gradient-to-r from-red-600 to-red-400 text-white p-8 relative'>
        <div className='container mx-auto'>
          <div className='flex flex-col items-center'>
            <div className='h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-md mb-4'>
              <MessageCircle className='h-12 w-12 text-red-500' />
            </div>
            <h1 className='text-2xl font-bold mb-1'>Liên Hệ Với Chúng Tôi</h1>
            <p className='text-center text-white/80 max-w-2xl'>
              Gửi phản hồi hoặc liên hệ trực tiếp với chúng tôi để được hỗ trợ tốt nhất!
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className='absolute -bottom-4 left-1/4 w-16 h-16 bg-red-400 rounded-full opacity-20'></div>
        <div className='absolute top-8 right-1/4 w-12 h-12 bg-white rounded-full opacity-10'></div>
        <div className='absolute bottom-6 right-10 w-20 h-20 bg-red-300 rounded-full opacity-15'></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
          {/* Contact Info */}
          <Card className="w-full lg:w-1/2 overflow-hidden rounded-xl shadow-sm border-none">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Thông Tin Liên Hệ</h3>

              <div className="space-y-6">
                {[
                  {
                    icon: <MapPin className="text-red-500 w-5 h-5" />,
                    title: 'Địa chỉ',
                    desc: 'Số 1 Đường ABC, Phường XYZ, TP. Ninh Bình',
                  },
                  {
                    icon: <Phone className="text-red-500 w-5 h-5" />,
                    title: 'Điện thoại',
                    desc: '0123 456 789',
                  },
                  {
                    icon: <Mail className="text-red-500 w-5 h-5" />,
                    title: 'Email',
                    desc: 'contact@giotmauhivong.vn',
                  },
                  {
                    icon: <Clock className="text-red-500 w-5 h-5" />,
                    title: 'Giờ làm việc',
                    desc: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="bg-red-100 p-2.5 rounded-full flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map preview */}
              <div className="mt-8 rounded-xl overflow-hidden h-48 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Bản đồ đang tải...</p>
                </div>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8758248756525!2d105.82632551488289!3d21.037478392833113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab145bf89bd7%3A0xd94a869b494c04b6!2zMSDEkMOgbyBUYW5oIELDrG5oLCDEkOG7kW5nIMSQ4buTLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1659518356176!5m2!1svi!2s" 
                  width="100%" 
                  height="100%" 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="w-full lg:w-1/2 overflow-hidden rounded-xl shadow-sm border-none">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Gửi Tin Nhắn</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">Họ và Tên</label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Nhập họ và tên của bạn"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="rounded-xl border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Nhập email của bạn"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="rounded-xl border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-gray-700 mb-1 block">Tin nhắn</label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Nhập tin nhắn của bạn..."
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full rounded-xl border-gray-200 resize-none focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-medium py-5 hover:opacity-90 transition"
                >
                  {isLoading ? 'Đang gửi...' : (
                    <span className="flex items-center justify-center">
                      Gửi Phản Hồi
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>

                {status.message && (
                  <div className={`flex items-center gap-2 mt-2 ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {status.type === 'success' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-red-100 border border-red-400"></div>
                    )}
                    <p className="text-sm">{status.message}</p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick links */}
        <div className="max-w-6xl mx-auto mt-8">
          <Card className="overflow-hidden rounded-xl shadow-sm border-none bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold">Cần trợ giúp nhanh?</h3>
                  <p className="text-white/80 text-sm mt-1">Gọi ngay đường dây nóng hỗ trợ 24/7</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white/10"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Gọi: 0123 456 789
                  </Button>
                  <Button
                    variant="default"
                    className="bg-white text-red-600 hover:bg-gray-100"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Gửi Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
