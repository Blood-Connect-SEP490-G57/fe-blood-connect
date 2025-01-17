import { Navigate } from 'react-router-dom'

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

  if (!!isAuthenticated != tokenRequired) {
    return <Navigate replace to={`${destination}`} />
  }
  return children
}
