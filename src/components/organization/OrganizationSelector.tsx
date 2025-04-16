import React, { useEffect, useState } from 'react'
import { getOrganizationsByType } from '@/api/organization'
import { toast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface Organization {
  id: number
  name: string
  type: string
}

interface OrganizationSelectorProps {
  onOrganizationSelect: (organization: { id: number, name: string }) => void
  initialOrganization?: string
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({ onOrganizationSelect, initialOrganization = '' }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrganization, setSelectedOrganization] = useState<string>(initialOrganization)

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
    onOrganizationSelect({ id: org.id, name: org.name })
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg" id="dialog-org-select">
      <div className="mb-4">
        <label className="block text-sm text-gray-500 mb-1">Tìm kiếm tổ chức</label>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập tên tổ chức..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-red-500"
          aria-describedby="dialog-org-select"
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
      )}
    </div>
  )
}

export default OrganizationSelector