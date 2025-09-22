import { useLocation } from 'react-router-dom'
import { appConfig } from '../data/configurableData'

export const useCurrentPage = () => {
  const location = useLocation()

  const currentPage = appConfig.navigation.find(nav => nav.path === location.pathname)

  return currentPage
}