'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pencil } from 'lucide-react'

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
    <div className='flex items-center justify-end'>
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
              <Button
                variant='outline'
                onClick={() => {
                  setOpen(false)
                  setSelectedBloodType('')
                }}
              >
                Hủy
              </Button>
              <Button onClick={handleConfirm} variant='destructive'>
                Xác nhận
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BloodTypeSelector
