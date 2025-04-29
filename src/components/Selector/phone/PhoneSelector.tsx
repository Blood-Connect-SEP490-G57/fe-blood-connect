import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Pencil } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface PhoneSelectorProps {
  onPhoneSelect: (phone: string) => void
  initialPhone?: string
  trigger?: React.ReactNode
}

const PhoneSelector: React.FC<PhoneSelectorProps> = ({
  onPhoneSelect,
  initialPhone = '',
  trigger
}) => {
  const [phone, setPhone] = useState<string>(initialPhone)
  const [open, setOpen] = useState(false)

  const validatePhoneNumber = (phone: string): boolean => {
    // Vietnamese phone number regex
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b$/
    return phoneRegex.test(phone)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Remove non-digit characters
    if (value.length <= 10) {
      setPhone(value)
    }
  }

  const handleConfirm = () => {
    if (!validatePhoneNumber(phone)) {
      toast({
        title: 'Lỗi',
        description: 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10 chữ số)',
        variant: 'destructive'
      })
      return
    }
    onPhoneSelect(phone)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='outline' size='sm' className='ml-2 justify-start'>
            <Pencil className='w-4 h-4' />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nhập số điện thoại</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">Số điện thoại</label>
            <Input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Nhập số điện thoại..."
              className="w-full"
              maxLength={10}
            />
            <p className="text-xs text-gray-500 mt-1">
              Định dạng: 0[3|5|7|8|9] + 8 số
            </p>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={() => {
                setOpen(false)
                setPhone('')
              }}
              variant='outline'
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!phone}
              variant='destructive'
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PhoneSelector
