import React, { useEffect, useState } from 'react'
import { getOrganizationsByType } from '@/api/organization'
import { toast } from '@/components/ui/use-toast'
import { Building2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Organization {
  id: number
  name: string
  type: string
}

interface OrganizationSelectorProps {
  onOrganizationSelect: (organization: { id: number, name: string }) => void
  initialOrganization?: string
  trigger?: React.ReactNode
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({ 
  onOrganizationSelect, 
  initialOrganization = '',
  trigger
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrganization, setSelectedOrganization] = useState<string>(initialOrganization)
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchOrganizations = async () => {
      setIsLoading(true)
      try {
        const response = await getOrganizationsByType()
        if (response && response.data) {
          setOrganizations([{ id: 0, name: 'Tự do', type: 'OTHER' }, ...response.data])
        } else {
          console.error('Invalid organization data response:', response)
          toast({
            title: 'Lỗi',
            description: 'Không thể tải danh sách tổ chức',
            variant: 'destructive'
          })
        }
      } catch (error) {
        console.error('Error fetching organizations:', error)
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách tổ chức',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganizations()
  }, [])

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOrganizationSelect = (org: Organization) => {
    setSelectedOrganization(org.name)
    setSelectedOrgId(org.id)
  }

  const handleConfirm = () => {
    if (selectedOrgId !== null) {
      onOrganizationSelect({ id: selectedOrgId, name: selectedOrganization })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='outline' className='ml-2 justify-start'>
            <Building2 className='w-4 h-4' />
            <span className='text-sm hidden sm:block text-gray-600 text-start ml-2'>Chọn tổ chức</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chọn tổ chức</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">Tìm kiếm tổ chức</label>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên tổ chức..."
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="mt-2">
            <div className="text-sm text-gray-500 mb-1">Tổ chức đã chọn</div>
            <div className="font-medium">{selectedOrganization || "Chưa chọn tổ chức"}</div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-red-500" />
            </div>
          ) : (
            <>
              <div className="mt-4 max-h-60 overflow-y-auto">
                {filteredOrganizations.length > 0 ? (
                  filteredOrganizations.map((org) => (
                    <div
                      key={org.id}
                      onClick={() => handleOrganizationSelect(org)}
                      className={`px-3 py-2 cursor-pointer transition-colors ${
                        selectedOrganization === org.name
                          ? 'bg-red-50 text-red-600'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {org.name}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Không tìm thấy tổ chức phù hợp
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={handleConfirm}
                  disabled={!selectedOrganization}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Xác nhận
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OrganizationSelector