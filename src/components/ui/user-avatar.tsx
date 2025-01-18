import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  user?: {
    name: string
    image?: string
  }
  editable?: boolean
  onImageChange?: (file: File) => Promise<void> | void
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  size = 'md',
  user = { name: 'User' },
  editable = false,
  onImageChange,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    user.image || '/images/user/user.svg'
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-24 w-24',
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setError(null)
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước file không được vượt quá 5MB')
        return
      }

      try {
        setIsLoading(true)
        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Call onImageChange if provided
        if (onImageChange) {
          await onImageChange(file)
        }
        setIsOpen(false)
      } catch (err) {
        setError('Có lỗi xảy ra khi tải ảnh lên')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative inline-block">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={previewUrl} alt={user.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      {editable && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-white bg-white shadow-sm"
              disabled={isLoading}
            >
              <Camera className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-center">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={previewUrl} alt={user.name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </div>
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  disabled={isLoading}
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                    <Loader2 className="h-6 w-6 animate-spin text-red-600" />
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default UserAvatar 