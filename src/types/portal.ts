// Generic portal interfaces that can be used for any type of portal

export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  phone?: string
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
}

export interface DashboardCard {
  id: string
  title: string
  subtitle: string
  dataSource: string // which data array to pull from
  valueType: 'count' | 'ratio' | 'custom'
  icon?: string
  color: 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success'
}

export interface DashboardSection {
  id: string
  title: string
  dataSource: string
  filterCriteria?: any
  maxItems?: number
  enabled: boolean
}

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  mode: 'light' | 'dark'
  borderRadius: number
  fontFamily: string
}

export interface AppConfig {
  appName: string
  navigation: NavigationItem[]
  pageTitle: string
  dashboardCards: DashboardCard[]
  dashboardSections: DashboardSection[]
  theme: ThemeConfig
}