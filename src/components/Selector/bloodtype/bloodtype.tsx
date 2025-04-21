'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Heart } from 'lucide-react'

interface BloodTypeSelectorProps {
  value: string
  onChange: (value: string) => void
  trigger?: React.ReactNode
  className?: string
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

const BloodTypeSelector: React.FC<BloodTypeSelectorProps> = ({ value, onChange, trigger }) => {
  const [selectedBloodType, setSelectedBloodType] = useState(value)
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onChange(selectedBloodType)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='outline' className='ml-2 justify-start w-1/2'>
            <Heart className='w-4 h-4' />
            <span className='text-sm hidden sm:block text-gray-600 text-start'>Chọn nhóm máu</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Chọn nhóm máu</DialogTitle>
        </DialogHeader>
        <div className='mt-4'>
          <div className='grid grid-cols-2 gap-3 p-4'>
            {bloodTypes.map((bloodType) => (
              <button
                key={bloodType}
                onClick={() => setSelectedBloodType(bloodType)}
                className={`p-3 rounded-lg text-center transition-colors
                  ${
                    selectedBloodType === bloodType
                      ? 'bg-red-500 text-white'
                      : 'bg-white border border-gray-200 hover:bg-red-50 text-gray-800'
                  }`}
              >
                {bloodType}
              </button>
            ))}
          </div>

          <div className='flex justify-end gap-2 mt-4'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirm}>Xác nhận</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BloodTypeSelector
