import { Navigate, useLocation } from 'react-router-dom'

export default function Protected({
  children,
  tokenRequired,
  destination
}: {
  children: any
  tokenRequired: boolean
  destination: string
}) {
  const isAuthenticated = localStorage.getItem('access_token')
  const location = useLocation()

  if (!!isAuthenticated !== tokenRequired) {
    return <Navigate replace to={`${destination}?redirect=${encodeURIComponent(location.pathname)}`} />
  }
  return children
}
