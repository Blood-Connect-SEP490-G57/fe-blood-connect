import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

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
    <div className="bg-gray-100 py-16 px-4 min-h-screen">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-red-600">Liên Hệ Với Chúng Tôi</h2>
        <p className="text-gray-600 mt-3 text-lg">
          Gửi phản hồi hoặc liên hệ trực tiếp với chúng tôi để được hỗ trợ tốt nhất!
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Contact Info */}
        <div className="bg-white p-6 rounded-2xl shadow-md w-full lg:w-1/2 space-y-6">
          <h3 className="text-2xl font-semibold mb-2 text-gray-800">Thông Tin Liên Hệ</h3>

          {[
            {
              icon: <MapPin className="text-red-500 w-6 h-6" />,
              title: 'Địa chỉ',
              desc: 'Số 1 Đường ABC, Phường XYZ, TP. Ninh Bình',
            },
            {
              icon: <Phone className="text-red-500 w-6 h-6" />,
              title: 'Điện thoại',
              desc: '0123 456 789',
            },
            {
              icon: <Mail className="text-red-500 w-6 h-6" />,
              title: 'Email',
              desc: 'contact@giotmauhivong.vn',
            },
            {
              icon: <Clock className="text-red-500 w-6 h-6" />,
              title: 'Giờ làm việc',
              desc: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
            },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <div className="bg-red-100 p-3 rounded-full">{item.icon}</div>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md w-full lg:w-1/2">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Gửi Tin Nhắn</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                name="name"
                placeholder="Họ và Tên"
                value={form.name}
                onChange={handleChange}
                required
                className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <textarea
              name="message"
              placeholder="Tin nhắn của bạn"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
            >
              {isLoading ? 'Đang gửi...' : 'Gửi Phản Hồi'}
            </button>

            {status.message && (
              <p className={`text-sm mt-2 ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {status.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
