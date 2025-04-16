import React, { useEffect, useState } from 'react'
import { getOrganizationsByType } from '@/api/organization'

interface Organization {
  id: string
  name: string
  type: string
}

interface OrganizationSelectorProps {
  initialOrganization?: string
  onOrganizationSelect: (organizationId: string) => void
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({ initialOrganization, onOrganizationSelect }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await getOrganizationsByType()
        const orgs = Array.isArray(response.data) ? response.data : []
        setOrganizations([{ id: '', name: 'Tự do', type: 'OTHER' }, ...orgs])
      } catch (err) {
        console.error('Error fetching organizations:', err)
        setOrganizations([])
      }
    }

    fetchOrganizations()
  }, [])

  const filteredOrganizations = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-gray-50 px-2" id="dialog-org-select">
      <div className="mt-1">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm tổ chức..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-red-500"
          aria-describedby="dialog-org-select"
        />
      </div>

      <div className="mt-2 max-h-60 overflow-y-auto text-sm">
        {searchTerm && (
          <div className="px-2 py-1 text-gray-500 text-xs">
            Kết quả tìm kiếm cho "{searchTerm}"
          </div>
        )}
        
        {filteredOrganizations.length === 0 ? (
          <div className="px-2 py-4 text-center text-gray-500">
            Không tìm thấy tổ chức nào
          </div>
        ) : (
          filteredOrganizations.map((org) => (
            <div
              key={org.id}
              onClick={() => onOrganizationSelect(org.id)}
              className={`px-2 py-2 hover:bg-gray-100 cursor-pointer ${
                org.id === initialOrganization ? 'bg-red-50' : ''
              }`}
            >
              {org.name}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default OrganizationSelector