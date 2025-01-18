import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { vi } from 'date-fns/locale'

const formSchema = z.object({
  donationCenter: z.string({
    required_error: "Vui lòng chọn điểm hiến máu",
  }),
  donationDate: z.date({
    required_error: "Vui lòng chọn ngày hiến máu",
  }),
  donationTime: z.string({
    required_error: "Vui lòng chọn giờ hiến máu",
  }),
})

const donationCenters = [
  {
    id: '1',
    name: 'Trung tâm Hiến máu Nhân đạo Hà Nội',
    address: '26 Lương Ngọc Quyến, Hoàn Kiếm, Hà Nội'
  },
  {
    id: '2',
    name: 'Viện Huyết học - Truyền máu Trung ương',
    address: '78 Đường Hải Bà Trưng, Hoàn Kiếm, Hà Nội'
  },
]

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', 
  '10:30', '11:00', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30'
]

const BloodDonationRegistration = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    // TODO: Submit registration
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Đăng ký hiến máu
        </h1>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-red-600">
                Thông tin đăng ký
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Donation Center Selection */}
                  <FormField
                    control={form.control}
                    name="donationCenter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Điểm hiến máu</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn điểm hiến máu" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {donationCenters.map((center) => (
                              <SelectItem key={center.id} value={center.id}>
                                <div className="flex flex-col">
                                  <span>{center.name}</span>
                                  <span className="text-sm text-gray-500">{center.address}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date Selection */}
                  <FormField
                    control={form.control}
                    name="donationDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ngày hiến máu</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: vi })
                                ) : (
                                  <span>Chọn ngày</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 1))
                              }
                              initialFocus
                              locale={vi}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Time Selection */}
                  <FormField
                    control={form.control}
                    name="donationTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giờ hiến máu</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn giờ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      Xác nhận đăng ký
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BloodDonationRegistration 