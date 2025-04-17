import React from 'react'

interface FormFieldChildProps {
  className?: string
  placeholder?: string
  [key: string]: any
}

interface FormFieldProps {
  error?: string
  children: React.ReactNode
  label?: string
}

const FormField = ({ error, children, label }: FormFieldProps) => (
  <div className='relative mb-6'>
    <div className='relative'>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<FormFieldChildProps>(child)) {
          return React.cloneElement(child, {
            className: `${child.props.className || ''} peer w-full pt-5 pb-2 text-sm rounded-lg focus:outline-none`,
            placeholder: ' '
          })
        }
        return child
      })}
      {label && (
        <label className='absolute left-0 text-gray-500 duration-300 transform -translate-y-6 scale-75 top-6 z-10 origin-[0] peer-focus:text-red-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
          {label}
        </label>
      )}
      {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
    </div>
  </div>
)

export { FormField } 