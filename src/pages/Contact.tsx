import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  content: string;
}

const ContactPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState({ message: '', type: '' });

  const sendFeedback = async (formData: { name: string; email: string; message: string }) => {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbydWW2q9OSbwSQw6Ua2XGmNZ4OXL_PTcw1C4hRYt3mZF_ObPxsu44WiaMnnCY1BLotu/exec',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send feedback');
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ message: '', type: '' });

    try {
      const data = await sendFeedback({
        name: form.name,
        email: form.email,
        message: form.message,
      });

      if (data.result === 'success') {
        setStatus({ message: 'Feedback sent successfully!', type: 'success' });
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus({ message: 'Something went wrong. Please try again.', type: 'error' });
      }
    } catch (err) {
      setStatus({ 
        message: err instanceof Error ? err.message : 'Error sending feedback.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const contactInfo: ContactInfo[] = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Địa chỉ',
      content: 'Số 1 Đường ABC, Phường XYZ, Thành phố Ninh Bình',
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Điện thoại',
      content: '0123 456 789',
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      content: 'contact@giotmauhivong.vn',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào. Chúng tôi sẽ phản hồi sớm nhất có thể.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Thông Tin Liên Hệ</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-red-100 rounded-lg text-red-600">{info.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{info.title}</h3>
                      <p className="mt-1 text-gray-600">{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Gửi Tin Nhắn</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Họ và Tên"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <textarea
                  name="message"
                  placeholder="Tin nhắn của bạn"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  rows={4}
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? 'Đang gửi...' : 'Gửi phản hồi'}
                </button>
                {status.message && (
                  <p className={`text-sm ${
                    status.type === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {status.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;