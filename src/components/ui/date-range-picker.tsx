'use client'

import { addDays, format } from 'date-fns'
import { Calendar as CalendarIcon, Loader2Icon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useState } from 'react'
import { useToast } from './use-toast'
import { FileExportType } from '@/schema/file-schema'
import { useMutation } from '@tanstack/react-query'
import {
  exportBankReconcileExcel,
  exportBankTransExcel,
  exportFundTransferExcel,
  exportTransactionExcel
} from '@/api/file'
import { isAxiosError } from 'axios'
import {
  useBankReconcileSearchStore,
  useBankTransactionSearchStore,
  useFundTransferSearchStore,
  useTransactionSearchStore
} from '@/hooks/stores'
import { useSearchParams } from 'react-router-dom'

export function DatePickerWithRange({
  className,
  type
}: {
  className?: React.HTMLAttributes<HTMLDivElement>
  type: string
}) {
  const { toast } = useToast()
  const [fileID, setFileID] = useState('')
  const [searchParams] = useSearchParams()

  const bankTransSearch = useBankTransactionSearchStore((state) => state.searchParams)
  const fundTransSearch = useFundTransferSearchStore((state) => state.searchParams)
  const bankReconcileSearch = useBankReconcileSearchStore((state) => state.searchParams)
  const transSearch = useTransactionSearchStore((state) => state.searchParams)

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 9, 20),
    to: addDays(new Date(2023, 9, 20), 20)
  })

  const exportBankTrans = useMutation(
    (data: FileExportType) =>
      exportBankTransExcel(data, parseInt(searchParams.get('page') || '1'), 10, bankTransSearch),
    {
      onSuccess: (res) => {
        toast({
          title: 'Xuất file excel thành công! Vui lòng vào danh sách file để tải về'
        })
        setFileID(res.id)
      },
      onError: (error: Error) => {
        if (isAxiosError(error)) {
          toast({
            variant: 'destructive',
            title: 'Đã có lỗi xảy ra',
            description: error?.message
          })
        }
      }
    }
  )

  const exportFundTransfer = useMutation(
    (data: FileExportType) =>
      exportFundTransferExcel(data, parseInt(searchParams.get('page') || '1'), 10, fundTransSearch),
    {
      onSuccess: (res) => {
        toast({
          title: 'Xuất file excel thành công! Vui lòng vào danh sách file để tải về'
        })
        setFileID(res.id)
      },
      onError: (error: Error) => {
        if (isAxiosError(error)) {
          toast({
            variant: 'destructive',
            title: 'Đã có lỗi xảy ra',
            description: error?.message
          })
        }
      }
    }
  )

  const exportBankReconcile = useMutation(
    (data: FileExportType) =>
      exportBankReconcileExcel(data, parseInt(searchParams.get('page') || '1'), 10, bankReconcileSearch),
    {
      onSuccess: (res) => {
        toast({
          title: 'Xuất file excel thành công! Vui lòng vào danh sách file để tải về'
        })
        setFileID(res.id)
      },
      onError: (error: Error) => {
        if (isAxiosError(error)) {
          toast({
            variant: 'destructive',
            title: 'Đã có lỗi xảy ra',
            description: error?.message
          })
        }
      }
    }
  )

  const exportDimTrans = useMutation(
    (data: FileExportType) => exportTransactionExcel(data, parseInt(searchParams.get('page') || '1'), 10, transSearch),
    {
      onSuccess: (res) => {
        toast({
          title: 'Xuất file excel thành công! Vui lòng vào danh sách file để tải về'
        })
        setFileID(res.id)
      },
      onError: (error: Error) => {
        if (isAxiosError(error)) {
          toast({
            variant: 'destructive',
            title: 'Đã có lỗi xảy ra',
            description: error?.message
          })
        }
      }
    }
  )

  const handleExport = () => {
    switch (type) {
      case 'bank-reconcile':
        exportBankReconcile.mutate({
          created_at_from: format(date?.from || new Date(2023, 9, 20), 'yyyy-MM-dd HH:mm:ss'),
          created_at_to: format(date?.to || addDays(new Date(2023, 9, 20), 20), 'yyyy-MM-dd HH:mm:ss')
        })
        break
      case 'bank-trans':
        exportBankTrans.mutate({
          created_at_from: format(date?.from || new Date(2023, 9, 20), 'yyyy-MM-dd HH:mm:ss'),
          created_at_to: format(date?.to || addDays(new Date(2023, 9, 20), 20), 'yyyy-MM-dd HH:mm:ss')
        })
        break
      case 'fund-trans':
        exportFundTransfer.mutate({
          created_at_from: format(date?.from || new Date(2023, 9, 20), 'yyyy-MM-dd HH:mm:ss'),
          created_at_to: format(date?.to || addDays(new Date(2023, 9, 20), 20), 'yyyy-MM-dd HH:mm:ss')
        })
        break
      case 'wallet-trans':
        exportDimTrans.mutate({
          created_at_from: format(date?.from || new Date(2023, 9, 20), 'yyyy-MM-dd HH:mm:ss'),
          created_at_to: format(date?.to || addDays(new Date(2023, 9, 20), 20), 'yyyy-MM-dd HH:mm:ss')
        })
        break
    }
  }

  return (
    <div>
      <p className='text-sm text-right'>ID file: {fileID}</p>
      <div className='flex ml-3 gap-2 items-center justify-end'>
        <div className={cn('grid gap-2', className)}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id='date'
                variant={'outline'}
                className={cn('justify-start text-left py-0 h-8', !date && 'text-muted-foreground')}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'yyyy-MM-dd')} - {format(date.to, 'yyyy-MM-dd')}
                    </>
                  ) : (
                    format(date.from, 'yyyy-MM-dd')
                  )
                ) : (
                  <span>Chọn khoảng thời gian tạo giao dịch</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                initialFocus
                mode='range'
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          type='button'
          onClick={handleExport}
          className='h-8'
          disabled={
            exportBankTrans.isLoading ||
            exportFundTransfer.isLoading ||
            exportBankReconcile.isLoading ||
            exportDimTrans.isLoading ||
            !date?.from ||
            !date.to
          }
        >
          {exportBankTrans.isLoading ||
            exportFundTransfer.isLoading ||
            exportBankReconcile.isLoading ||
            (exportDimTrans.isLoading && <Loader2Icon className='mr-2 h-4 w-4 animate-spin text-white' />)}
          Xuất excel
        </Button>
      </div>
    </div>
  )
}
