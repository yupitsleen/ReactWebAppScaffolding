import { lazy } from 'react'
import type { LazyExoticComponent, ComponentType } from 'react'
import type { AppConfig } from '../types/portal'

/**
 * Generated route configuration
 */
export interface GeneratedRoute {
  id: string
  path: string
  label: string
  Component: LazyExoticComponent<ComponentType<any>>
}

/**
 * Capitalizes the first letter of a string
 * @example capitalizeFirst('home') => 'Home'
 */
const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Generates routes from app configuration using convention-based routing.
 *
 * **Convention:** Page components are expected to be in `src/pages/{PageId}.tsx`
 * where `{PageId}` is the capitalized navigation item ID.
 *
 * **Example:**
 * - Navigation item with id='home' → looks for `src/pages/Home.tsx`
 * - Navigation item with id='orders' → looks for `src/pages/Orders.tsx`
 *
 * **Custom Component Override:**
 * You can override the default convention by providing a `component` field:
 * ```typescript
 * {
 *   id: 'special',
 *   label: 'Special',
 *   path: '/special',
 *   enabled: true,
 *   component: 'custom/SpecialPage' // Uses src/pages/custom/SpecialPage.tsx
 * }
 * ```
 *
 * **Fallback:**
 * If a component is not found, the route generator will log a warning and skip that route.
 * In the future, this could automatically fall back to a GenericEntityPage component.
 *
 * @param config - Application configuration containing navigation items
 * @returns Array of generated routes ready for React Router
 */
export function generateRoutesFromConfig(config: AppConfig): GeneratedRoute[] {
  const routes: GeneratedRoute[] = []

  for (const nav of config.navigation) {
    // Skip disabled navigation items
    if (!nav.enabled) {
      continue
    }

    // Determine component path: explicit override or convention-based
    const componentPath = nav.component || capitalizeFirst(nav.id)

    try {
      // Dynamically import the component
      // Note: File extension is required for Vite's dynamic import
      const Component = lazy(() =>
        import(`../pages/${componentPath}.tsx`).catch((error) => {
          console.warn(
            `RouteGenerator: No page component found for "${nav.id}" at pages/${componentPath}.tsx`,
            `This navigation item will be skipped.`,
            `\nError:`, error
          )
          // Return a fallback that throws so Suspense boundary handles it
          throw error
        })
      )

      routes.push({
        id: nav.id,
        path: nav.path,
        label: nav.label,
        Component
      })
    } catch (error) {
      // Component import failed, skip this route
      console.error(`RouteGenerator: Failed to load component for "${nav.id}"`)
    }
  }

  return routes
}

/**
 * Gets a route by its ID from generated routes
 * @param routes - Generated routes array
 * @param id - Route ID to find
 * @returns The route if found, undefined otherwise
 */
export function getRouteById(routes: GeneratedRoute[], id: string): GeneratedRoute | undefined {
  return routes.find(route => route.id === id)
}

/**
 * Gets a route by its path from generated routes
 * @param routes - Generated routes array
 * @param path - Route path to find
 * @returns The route if found, undefined otherwise
 */
export function getRouteByPath(routes: GeneratedRoute[], path: string): GeneratedRoute | undefined {
  return routes.find(route => route.path === path)
}
