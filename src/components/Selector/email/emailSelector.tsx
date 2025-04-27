import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface EmailSelectorProps {
  onEmailSelect: (email: string) => void
  initialEmail?: string
  trigger?: React.ReactNode
}

const EmailSelector: React.FC<EmailSelectorProps> = ({ onEmailSelect, initialEmail = '', trigger }) => {
  const [email, setEmail] = useState<string>(initialEmail)
  const [open, setOpen] = useState(false)

  const validateEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleConfirm = () => {
    if (!validateEmail(email)) {
      toast({
        title: 'Lỗi',
        description: 'Email không hợp lệ. Vui lòng nhập đúng định dạng email',
        variant: 'destructive'
      })
      return
    }
    onEmailSelect(email)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='outline' className='ml-2 justify-start'>
            <Pencil className='w-4 h-4' />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Nhập email</DialogTitle>
        </DialogHeader>
        <div className='mt-4'>
          <div className='mb-4'>
            <label className='block text-sm text-gray-500 mb-1'>Email</label>
            <Input
              type='email'
              value={email}
              onChange={handleEmailChange}
              placeholder='Nhập email...'
              className='w-full'
            />
            <p className='text-xs text-gray-500 mt-1'>Định dạng: example@domain.com</p>
          </div>

          <div className='mt-4 flex justify-end gap-2'>
            <Button
              onClick={() => {
                setOpen(false)
                setEmail('')
              }}
              variant='outline'
            >
              Hủy
            </Button>
            <Button onClick={handleConfirm} disabled={!email} variant='destructive'>
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EmailSelector
