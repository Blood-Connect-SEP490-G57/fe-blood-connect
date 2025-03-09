export default function Loading() {
  return (
    <div className='flex h-32 flex-col items-center justify-center space-y-6 mt-6'>
      <div className="relative">
        {/* Hiệu ứng pulse nền */}
        <div className="absolute -inset-2 rounded-full bg-red-200 animate-pulse opacity-70"></div>

        {/* SVG biểu tượng giọt máu */}
        <svg
          aria-hidden='true'
          className='h-16 w-16 animate-spin fill-red-600 text-white/20'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M12 2C12 2 5 10 5 15C5 19.4183 8.58172 23 12 23C15.4183 23 19 19.4183 19 15C19 10 12 2 12 2Z'
            fill='currentFill'
          />
        </svg>
      </div>

      <p className='animate-pulse text-center text-xl font-medium text-red-700'>
        Đang tải dữ liệu<span className="inline-block animate-bounce">.</span><span className="inline-block animate-bounce delay-100">.</span><span className="inline-block animate-bounce delay-200">.</span>
      </p>
    </div>
  );
}
