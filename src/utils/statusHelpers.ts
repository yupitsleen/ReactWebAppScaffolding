import type { StatusInfo, StatusConfig, LegacyStatusConfig } from '../types/portal'

/**
 * Type guard to check if config is legacy format
 */
export const isLegacyStatusConfig = (
  config: StatusConfig | LegacyStatusConfig
): config is LegacyStatusConfig => {
  return 'priority' in config && 'status' in config && 'paymentStatus' in config
}

/**
 * Get status configuration for a specific entity field
 * @param statusConfig - The application's status configuration
 * @param entityType - The entity type (e.g., 'todoItem', 'payment')
 * @param statusField - The field name (e.g., 'status', 'priority')
 * @param statusValue - The status value to look up
 * @returns StatusInfo object or undefined if not found
 */
export const getStatusConfig = (
  statusConfig: StatusConfig | LegacyStatusConfig,
  entityType: string,
  statusField: string,
  statusValue: string
): StatusInfo | undefined => {
  // Handle legacy flat structure for backward compatibility
  if (isLegacyStatusConfig(statusConfig)) {
    // Map common field names to legacy keys
    const legacyKey = statusField as keyof LegacyStatusConfig
    const mapping = statusConfig[legacyKey]
    return mapping?.[statusValue]
  }

  // Handle new entity-scoped structure
  return statusConfig[entityType]?.[statusField]?.[statusValue]
}

/**
 * Get all possible status values for an entity field
 * @param statusConfig - The application's status configuration
 * @param entityType - The entity type
 * @param statusField - The field name
 * @returns Array of status value strings
 */
export const getAllStatusValues = (
  statusConfig: StatusConfig | LegacyStatusConfig,
  entityType: string,
  statusField: string
): string[] => {
  if (isLegacyStatusConfig(statusConfig)) {
    const legacyKey = statusField as keyof LegacyStatusConfig
    const mapping = statusConfig[legacyKey]
    return mapping ? Object.keys(mapping) : []
  }

  const statusMap = statusConfig[entityType]?.[statusField]
  return statusMap ? Object.keys(statusMap) : []
}

/**
 * Get the display label for a status value
 * @param statusConfig - The application's status configuration
 * @param entityType - The entity type
 * @param statusField - The field name
 * @param statusValue - The status value
 * @returns Display label or the raw value if not configured
 */
export const getStatusLabel = (
  statusConfig: StatusConfig | LegacyStatusConfig,
  entityType: string,
  statusField: string,
  statusValue: string
): string => {
  const config = getStatusConfig(statusConfig, entityType, statusField, statusValue)
  return config?.label || statusValue
}

/**
 * Get the color for a status value
 * @param statusConfig - The application's status configuration
 * @param entityType - The entity type
 * @param statusField - The field name
 * @param statusValue - The status value
 * @returns Color string or 'default' if not configured
 */
export const getStatusColor = (
  statusConfig: StatusConfig | LegacyStatusConfig,
  entityType: string,
  statusField: string,
  statusValue: string
): StatusInfo['color'] => {
  const config = getStatusConfig(statusConfig, entityType, statusField, statusValue)
  return config?.color || 'default'
}

/**
 * Get the icon for a status value (if configured)
 * @param statusConfig - The application's status configuration
 * @param entityType - The entity type
 * @param statusField - The field name
 * @param statusValue - The status value
 * @returns Icon string or undefined if not configured
 */
export const getStatusIcon = (
  statusConfig: StatusConfig | LegacyStatusConfig,
  entityType: string,
  statusField: string,
  statusValue: string
): string | undefined => {
  const config = getStatusConfig(statusConfig, entityType, statusField, statusValue)
  return config?.icon
}

/**
 * Get the variant for a status value
 * @param statusConfig - The application's status configuration
 * @param entityType - The entity type
 * @param statusField - The field name
 * @param statusValue - The status value
 * @returns Variant ('filled' | 'outlined') or 'filled' as default
 */
export const getStatusVariant = (
  statusConfig: StatusConfig | LegacyStatusConfig,
  entityType: string,
  statusField: string,
  statusValue: string
): 'filled' | 'outlined' => {
  const config = getStatusConfig(statusConfig, entityType, statusField, statusValue)
  return config?.variant || 'filled'
}

/**
 * Get the description for a status value (for tooltips)
 * @param statusConfig - The application's status configuration
 * @param entityType - The entity type
 * @param statusField - The field name
 * @param statusValue - The status value
 * @returns Description string or undefined if not configured
 */
export const getStatusDescription = (
  statusConfig: StatusConfig | LegacyStatusConfig,
  entityType: string,
  statusField: string,
  statusValue: string
): string | undefined => {
  const config = getStatusConfig(statusConfig, entityType, statusField, statusValue)
  return config?.description
}

/**
 * Get all status fields configured for an entity type
 * @param statusConfig - The application's status configuration
 * @param entityType - The entity type
 * @returns Array of field names that have status configurations
 */
export const getEntityStatusFields = (
  statusConfig: StatusConfig | LegacyStatusConfig,
  entityType: string
): string[] => {
  if (isLegacyStatusConfig(statusConfig)) {
    return ['priority', 'status', 'paymentStatus', 'documentShared']
  }

  return statusConfig[entityType] ? Object.keys(statusConfig[entityType]) : []
}
