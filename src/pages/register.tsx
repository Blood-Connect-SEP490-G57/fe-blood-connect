import { Lock, Phone, Check } from 'lucide-react'; // Import icon from lucide-react
import { useNavigate } from 'react-router-dom';
import { RegisterSchema } from '@/schema/auth-schema';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerUser } from '@/api/auth';

interface FormData {
  mobile: string;
  password: string;
  confirmPassword: string;
}

const RegistrationPage = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      mobile: '',
      password: '',
      confirmPassword: '',
    }
  });

  const handleRegister = async (data: FormData): Promise<void> => {
    console.log('Registration completed', data);
    // Call the registerUser function to send the data
    await registerUser(data);
    navigate('/login'); // Redirect after successful registration
  };

  return (
    <div className='min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        {/* Logo */}
        <div className='flex justify-center mb-6'>
          <div className='w-20 h-20 bg-red-600 rounded-full flex items-center justify-center'>
            <span className='text-4xl'>🩸</span>
          </div>
        </div>

        <h2 className='mt-3 text-center text-3xl font-extrabold text-gray-900'>Đăng Ký</h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Chào mừng bạn đến với <span className='font-semibold text-red-600'>Giọt Máu Hi Vọng</span>
        </p>
      </div>
      <div className='max-w-md mx-auto bg-card p-8 rounded-lg shadow-sm'>
        <div className='space-y-6'>
          <h2 className='text-2xl font-heading font-semibold text-foreground'>Đăng ký tài khoản</h2>

          <div className='space-y-4'>
            <div className='relative'>
              <Phone className='absolute left-3 top-3 text-accent' />
              <Controller
                name='mobile'
                control={control}
                render={({ field }) => (
                  <input
                    type='tel'
                    {...field}
                    placeholder='Số điện thoại'
                    className='w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                  />
                )}
              />
              {errors.mobile && <p className='text-red-500 text-sm'>{errors.mobile?.message}</p>}
            </div>

            <div className='relative'>
              <Lock className='absolute left-3 top-3 text-accent' />
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <input
                    type='password'
                    {...field}
                    placeholder='Mật khẩu'
                    className='w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                  />
                )}
              />
              {errors.password && <p className='text-red-500 text-sm'>{errors.password?.message}</p>}
            </div>

            <div className='relative'>
              <Lock className='absolute left-3 top-3 text-accent' />
              <Controller
                name='confirmPassword'
                control={control}
                render={({ field }) => (
                  <input
                    type='password'
                    {...field}
                    placeholder='Xác nhận mật khẩu'
                    className='w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                  />
                )}
              />
              {errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword?.message}</p>}
            </div>

            <ul className='text-sm text-accent space-y-1'>
              <li className='flex items-center'>
                <Check className='mr-2 text-chart-2' /> Ít nhất 8 ký tự
              </li>
              <li className='flex items-center'>
                <Check className='mr-2 text-chart-2' /> Bao gồm chữ hoa và chữ thường
              </li>
              <li className='flex items-center'>
                <Check className='mr-2 text-chart-2' /> Bao gồm số và ký tự đặc biệt
              </li>
            </ul>
          </div>

          <button
            onClick={handleSubmit(handleRegister)}
            className='px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-colors w-full'
          >
            Đăng ký
          </button>

          <p className='mt-4 text-center text-accent'>
            Đã có tài khoản?{' '}
            <button className='text-primary hover:underline' onClick={() => navigate('/login')}>
              Đăng nhập ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
