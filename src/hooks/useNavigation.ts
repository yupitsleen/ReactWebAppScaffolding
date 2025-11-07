import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { appConfig } from '../data/configurableData'
import type { NavigationItem } from '../types/portal'
import { useFeature } from './useFeature'

interface UseNavigationReturn {
  currentPage: NavigationItem | null
  navigateTo: (path: string | NavigationItem) => void
  navigateToPage: (pageId: string) => void
  navigateBack: () => void
  isCurrentPage: (path: string) => boolean
  getPageByPath: (path: string) => NavigationItem | null
  getPageById: (id: string) => NavigationItem | null
  getAllPages: () => NavigationItem[]
  getEnabledPages: () => NavigationItem[]
  getBreadcrumbs: () => NavigationItem[]
  getPageTitle: (path?: string) => string
  getPageDescription: (path?: string) => string
}

export const useNavigation = (): UseNavigationReturn => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isPageEnabled } = useFeature()

  const allPages = useMemo(() => appConfig.navigation, [])

  // Filter pages by both navigation.enabled AND feature flags
  const enabledPages = useMemo(
    () => allPages.filter(page => page.enabled && isPageEnabled(page.id)),
    [allPages, isPageEnabled]
  )

  const currentPage = useMemo(
    () => allPages.find(page => page.path === location.pathname) || null,
    [allPages, location.pathname]
  )

  const navigateTo = useCallback((pathOrItem: string | NavigationItem) => {
    const path = typeof pathOrItem === 'string' ? pathOrItem : pathOrItem.path
    navigate(path)
  }, [navigate])

  const navigateToPage = useCallback((pageId: string) => {
    const page = allPages.find(p => p.id === pageId)
    if (page) {
      navigate(page.path)
    } else {
      console.warn(`Page with id "${pageId}" not found`)
    }
  }, [allPages, navigate])

  const navigateBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const isCurrentPage = useCallback((path: string) => {
    return location.pathname === path
  }, [location.pathname])

  const getPageByPath = useCallback((path: string) => {
    return allPages.find(page => page.path === path) || null
  }, [allPages])

  const getPageById = useCallback((id: string) => {
    return allPages.find(page => page.id === id) || null
  }, [allPages])

  const getAllPages = useCallback(() => allPages, [allPages])

  const getEnabledPages = useCallback(() => enabledPages, [enabledPages])

  // Generate breadcrumb navigation based on current path
  const getBreadcrumbs = useCallback((): NavigationItem[] => {
    const breadcrumbs: NavigationItem[] = []
    const pathSegments = location.pathname.split('/').filter(Boolean)

    // Always start with home if not already there
    if (location.pathname !== '/') {
      const home = allPages.find(page => page.path === '/')
      if (home) {
        breadcrumbs.push(home)
      }
    }

    // Build breadcrumbs based on path hierarchy
    let currentPath = ''
    for (const segment of pathSegments) {
      currentPath += `/${segment}`
      const page = allPages.find(p => p.path === currentPath)
      if (page) {
        breadcrumbs.push(page)
      }
    }

    return breadcrumbs
  }, [location.pathname, allPages])

  const getPageTitle = useCallback((path?: string) => {
    const targetPath = path || location.pathname
    const page = getPageByPath(targetPath)
    return page?.label || appConfig.appName
  }, [location.pathname, getPageByPath])

  const getPageDescription = useCallback((path?: string) => {
    const targetPath = path || location.pathname
    const page = getPageByPath(targetPath)
    return page?.description || `${appConfig.appName} - Welcome`
  }, [location.pathname, getPageByPath])

  return {
    currentPage,
    navigateTo,
    navigateToPage,
    navigateBack,
    isCurrentPage,
    getPageByPath,
    getPageById,
    getAllPages,
    getEnabledPages,
    getBreadcrumbs,
    getPageTitle,
    getPageDescription,
  }
}