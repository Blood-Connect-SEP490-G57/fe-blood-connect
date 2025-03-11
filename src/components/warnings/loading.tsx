export default function Loading() {
  return (
    <div className='flex max-w-7xl mx-auto py-8 flex-col items-center justify-center space-y-6 mt-8 '>
      <div className='relative flex items-center justify-center'>
        <div className='absolute h-20 w-20 border-4 border-red-300 border-t-red-600 rounded-full animate-spin'></div>
        <svg
          aria-hidden='true'
          className='h-16 w-16 fill-red-600'
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
        Đang tải dữ liệu
        <span className='inline-block animate-bounce'>.</span>
        <span className='inline-block animate-bounce delay-100'>.</span>
        <span className='inline-block animate-bounce delay-200'>.</span>
      </p>
    </div>
  )
}
