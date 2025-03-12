import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {  Shield, Lock, AlertTriangle } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

const Settings = () => {
  const [isChangingPassword, setIsChangingPassword] = React.useState(false)

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12'>
      <div className='container mx-auto px-4'>
        <h1 className='text-2xl font-bold text-gray-900 mb-8'>Cài đặt</h1>

        <div className='max-w-3xl mx-auto space-y-6'>
          {/* Notification Settings */}
          {/* <Card>
            <CardHeader>
              <CardTitle className='text-xl text-red-600 flex items-center gap-2'>
                <Bell className='w-5 h-5' />
                Cài đặt thông báo
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label className='text-base'>Thông báo qua Email</Label>
                  <p className='text-sm text-muted-foreground'>Nhận thông báo về lịch hẹn qua email</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label className='text-base'>Thông báo qua SMS</Label>
                  <p className='text-sm text-muted-foreground'>Nhận thông báo về lịch hẹn qua tin nhắn</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card> */}

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className='text-xl text-red-600 flex items-center gap-2'>
                <Shield className='w-5 h-5' />
                Bảo mật
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label className='text-base'>Xác thực hai yếu tố</Label>
                    <p className='text-sm text-muted-foreground'>Bảo vệ tài khoản bằng xác thực hai yếu tố</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div>
                  <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                    <DialogTrigger asChild>
                      <Button
                        variant='outline'
                        className='w-full border-red-600 text-red-600 hover:bg-red-50'
                        onClick={() => setIsChangingPassword(true)}
                      >
                        <Lock className='w-4 h-4 mr-2' />
                        Đổi mật khẩu
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Đổi mật khẩu</DialogTitle>
                        <DialogDescription>Vui lòng nhập mật khẩu cũ và mật khẩu mới</DialogDescription>
                      </DialogHeader>
                      <div className='space-y-4 py-4'>
                        <div className='space-y-2'>
                          <Label>Mật khẩu hiện tại</Label>
                          <Input type='password' />
                        </div>
                        <div className='space-y-2'>
                          <Label>Mật khẩu mới</Label>
                          <Input type='password' />
                        </div>
                        <div className='space-y-2'>
                          <Label>Xác nhận mật khẩu mới</Label>
                          <Input type='password' />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant='outline' onClick={() => setIsChangingPassword(false)}>
                          Hủy
                        </Button>
                        <Button type='submit' className='bg-red-600 text-white hover:bg-red-700'>
                          Lưu thay đổi
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card>
            <CardHeader>
              <CardTitle className='text-xl text-red-600 flex items-center gap-2'>
                <AlertTriangle className='w-5 h-5' />
                Vùng nguy hiểm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='destructive' className='w-full'>
                    Xóa tài khoản
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bạn chắc chắn muốn xóa tài khoản?</DialogTitle>
                    <DialogDescription>
                      Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant='outline'>Hủy</Button>
                    <Button variant='destructive'>Xóa tài khoản</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Settings
