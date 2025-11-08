export type UserType = 'Customer' | 'Vendor' | 'Service Provider' | 'Admin'

export interface User {
  id: string
  name: string
  email: string
  role: string
  userType: UserType
  avatar?: string
  phone?: string
}

export interface AuthUser extends User {
  isAuthenticated: boolean
  token?: string
}

export interface TodoItem {
  id: string
  title: string
  description: string
  assignedTo: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
  dueDate: string
  category: string
  createdBy: string
  createdAt: string
  [key: string]: unknown
}

export interface Payment {
  id: string
  description: string
  amount: number
  dueDate: string
  status: 'pending' | 'paid' | 'overdue'
  paidDate?: string
  paymentMethod?: string
  category: string
}

export interface Document {
  id: string
  name: string
  type: string
  url: string
  uploadedBy: string
  uploadedAt: string
  size: string
  shared: boolean
  [key: string]: unknown
}

export interface Discussion {
  id: string
  title: string
  author: string
  authorRole: string
  content: string
  createdAt: string
  replies: Reply[]
  priority: 'normal' | 'urgent'
  resolved: boolean
  [key: string]: unknown
}

export interface Reply {
  id: string
  author: string
  authorRole: string
  content: string
  createdAt: string
}

export interface ServiceInfo {
  name: string
  tagline: string
  description: string
  contact: {
    email: string
    phone: string
    address: string
  }
}

export interface DashboardSummary {
  totalTodos: number
  completedTodos: number
  pendingPayments: number
  totalDocuments: number
  unreadDiscussions: number
}

export interface NavigationItem {
  id: string
  label: string
  path: string
  enabled: boolean
  description?: string
  component?: string // Optional custom component path override (e.g., 'custom/SpecialPage')
}

export interface ActionButton {
  id: string
  label: string
  icon: string
  variant: 'contained' | 'outlined' | 'text'
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  size?: 'small' | 'medium' | 'large'
  onClick: string
}

export interface DashboardCard {
  id: string
  title: string
  subtitle: string
  dataSource: string // which data array to pull from
  pageId: string // which navigation page this card links to
  valueType: 'count' | 'ratio' | 'custom'
  icon?: string
  color: 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success'
}

export interface DashboardSection {
  id: string
  title: string
  dataSource: string
  pageId: string // which navigation page this section relates to
  filterCriteria?: Record<string, unknown>
  maxItems?: number
  enabled: boolean
}

export interface ThemeConfig {
  name?: 'constructivism' | 'basic' | string // Theme name for extensibility
  primaryColor: string
  secondaryColor: string
  mode: 'light' | 'dark'
  borderRadius: number
  fontFamily: string
  iconMappings: {
    [key: string]: string
  }
}

export interface StatusInfo {
  color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  label: string
  variant?: 'filled' | 'outlined'
  icon?: string
  description?: string
}

export interface StatusMapping {
  [key: string]: StatusInfo
}

// Entity-scoped status configuration
// Each entity type can have multiple status fields with their own mappings
export interface StatusConfig {
  [entityType: string]: {
    [statusField: string]: StatusMapping
  }
}

// Legacy flat status config (maintained for backward compatibility during migration)
export interface LegacyStatusConfig {
  priority: StatusMapping
  status: StatusMapping
  paymentStatus: StatusMapping
  documentShared: StatusMapping
}

export interface FieldConfig {
  [entityType: string]: {
    primary: string // main field to display prominently
    secondary: string[] // fields to show in chips/metadata
    hidden?: string[] // fields to not display
  }
}

// Form Generation Types
export type FormFieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'datetime'
  | 'checkbox'
  | 'radio'
  | 'autocomplete'

export interface FormFieldOption {
  value: string | number
  label: string
}

export interface FormFieldSchema<T = any> {
  name: keyof T
  label: string
  type: FormFieldType
  placeholder?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  defaultValue?: any
  options?: FormFieldOption[] // For select, multiselect, radio
  rows?: number // For textarea
  min?: number // For number/date
  max?: number // For number/date
  step?: number // For number
  fullWidth?: boolean
  grid?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
  }
}

export interface EntityFormSchema<T = any> {
  fields: FormFieldSchema<T>[]
  submitLabel?: string
  cancelLabel?: string
  title?: string
  description?: string
}

export interface FormSchemas {
  [entityKey: string]: EntityFormSchema<any>
}

// Generic Entity Page Configuration
export interface EntityAction {
  id: string
  label: string
  icon?: string
  handler: string
  condition?: string
}

export interface EntityPageConfig {
  entityKey: string
  title?: string
  subtitle?: string
  showFilters?: boolean
  showSort?: boolean
  showCreate?: boolean
  showExport?: boolean
  showRefresh?: boolean
  viewMode?: 'table' | 'cards' | 'both'
  defaultView?: 'table' | 'cards'
  cardRenderer?: string
  tableColumns?: Array<{
    field: string
    header: string
    sortable?: boolean
    render?: (value: any, row: any) => React.ReactNode
  }>
  filters?: Array<{
    field: string
    label: string
    type: 'select' | 'text' | 'date' | 'dateRange' | 'multiselect'
    options?: { value: string; label: string }[]
  }>
  actions?: EntityAction[]
  sortOptions?: Array<{
    value: string
    label: string
  }>
  defaultSort?: {
    field: string
    direction: 'asc' | 'desc'
  }
}

export interface EntityPages {
  [pageId: string]: EntityPageConfig
}

// Feature Flags System
export interface FeatureFlags {
  // UI Features
  darkMode: boolean
  highContrastMode: boolean
  layoutDensity: boolean
  commandPalette: boolean
  pdfExport: boolean
  keyboardShortcuts: boolean
  notifications: boolean

  // Pages (mapped to navigation ids)
  pages: {
    [pageId: string]: boolean
  }

  // Authentication
  authentication: {
    enabled: boolean
    allowGuest: boolean
    rememberMe: boolean
    requireEmailVerification: boolean
  }

  // CRUD Operations (can be overridden per entity)
  crud: {
    create: boolean
    edit: boolean
    delete: boolean
    export: boolean
    import: boolean
  }

  // Dashboard Features
  dashboard: {
    cards: boolean
    sections: boolean
    charts: boolean
    quickActions: boolean
  }

  // Advanced Features
  advancedFiltering: boolean
  advancedSorting: boolean
  bulkOperations: boolean
  customFields: boolean
  webhooks: boolean
  apiAccess: boolean
}

export interface AppConfig {
  appName: string
  navigation: NavigationItem[]
  pageTitle: string
  dashboardCards: DashboardCard[]
  dashboardSections: DashboardSection[]
  theme: ThemeConfig
  actions: {
    document: ActionButton[]
    account: ActionButton[]
    [key: string]: ActionButton[]
  }
  statusConfig: StatusConfig | LegacyStatusConfig // Support both new and legacy formats
  fieldConfig: FieldConfig
  formSchemas?: FormSchemas // Optional form generation schemas
  entityPages?: EntityPages // Optional generic entity page configurations
  features?: FeatureFlags // Optional feature flags configuration
}