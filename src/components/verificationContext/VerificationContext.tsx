import React, { createContext, useContext, useState, useEffect } from 'react'
import { CheckExtractStatus } from '@/api/extract'
import { useAuth } from '@/components/authContext/AuthContext'

interface VerificationContextType {
  isVerified: string
  setIsVerified: React.Dispatch<React.SetStateAction<string>>
}

const VerificationContext = createContext<VerificationContextType>({
  isVerified: '',
  setIsVerified: () => {}
})

export const useVerification = () => {
  const context = useContext(VerificationContext)
  if (!context) {
    throw new Error('useVerification must be used within a VerificationProvider')
  }
  return context
}

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVerified, setIsVerified] = useState<string>('')
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const response = await CheckExtractStatus()
        if (response.success && response.data?.status) {
          setIsVerified(response.data.status)
        } else {
          setIsVerified('NONE')
        }
      } catch (error) {
        console.error('Error checking verification status:', error)
      }
    }

    if (isLoggedIn) {
      checkVerificationStatus()
    } else {
      setIsVerified('')
    }
  }, [isLoggedIn])

  return <VerificationContext.Provider value={{ isVerified, setIsVerified }}>{children}</VerificationContext.Provider>
}

export default VerificationContext
