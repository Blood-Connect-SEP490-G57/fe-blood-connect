import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getUnreadCount } from '@/api/notification'
import { useAuth } from '@/components/authContext/AuthContext'

export const UNREAD_COUNT_KEY = ['unreadCount'] as const

export function useUnreadNotifications() {
  const { isLoggedIn } = useAuth()
  const queryClient = useQueryClient()

  const { data: unreadCount = 0, ...rest } = useQuery({
    queryKey: UNREAD_COUNT_KEY,
    queryFn: getUnreadCount,
    enabled: isLoggedIn,
    staleTime: 30000, // Consider data fresh for 30 seconds
    cacheTime: 1000 * 60 * 5 // Keep in cache for 5 minutes
  })

  const invalidateUnreadCount = () => {
    return queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY })
  }

  return {
    unreadCount,
    invalidateUnreadCount,
    ...rest
  }
}