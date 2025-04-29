import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'

interface NumberDonateSelectorProps {
  onNumberSelect: (number: number) => void
  initialNumber?: number
  trigger?: React.ReactNode
  min?: number
  max?: number
}

const NumberDonateSelector: React.FC<NumberDonateSelectorProps> = ({
  onNumberSelect,
  initialNumber = 0,
  trigger,
  min = 0,
  max = 100
}) => {
  const [number, setNumber] = useState<number>(initialNumber)
  const [open, setOpen] = useState(false)

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= min && value <= max) {
      setNumber(value)
    }
  }

  const handleConfirm = () => {
    onNumberSelect(number)
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
      <DialogContent className='sm:max-w-[425px] max-w-[90%] rounded-xl mx-auto sm:mx-auto'>
        <DialogHeader>
          <DialogTitle>Nhập số lần hiến máu</DialogTitle>
        </DialogHeader>
        <div className='mt-4'>
          <div className='mb-4'>
            <label className='block text-sm text-gray-500 mb-1'>Số lần hiến máu</label>
            <Input
              type='number'
              value={number}
              onChange={handleNumberChange}
              min={min}
              max={max}
              placeholder='Nhập số lần hiến máu...'
              className='w-full'
            />
            <p className='text-xs text-gray-500 mt-1'>
              Giới hạn: {min} - {max} lần
            </p>
          </div>

          <div className='mt-4 flex justify-end'>
            <Button
              onClick={() => {
                setOpen(false)
                setNumber(0)
              }}
              variant='outline'
            >
              Hủy
            </Button>
            <Button onClick={handleConfirm} disabled={number < min || number > max} variant='destructive'>
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NumberDonateSelector
