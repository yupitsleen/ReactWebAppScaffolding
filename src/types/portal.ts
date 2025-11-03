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
  filterCriteria?: unknown
  maxItems?: number
  enabled: boolean
}

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  mode: 'light' | 'dark'
  borderRadius: number
  fontFamily: string
  iconMappings: {
    [key: string]: string
  }
}

export interface StatusMapping {
  [key: string]: {
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
    label: string
    variant?: 'filled' | 'outlined'
  }
}

export interface StatusConfig {
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
  statusConfig: StatusConfig
  fieldConfig: FieldConfig
}