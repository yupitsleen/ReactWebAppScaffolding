import type {
  User,
  TodoItem,
  Payment,
  Document,
  Discussion,
  ServiceInfo,
  DashboardSummary
} from '../types/portal'

export const users: User[] = [
  {
    id: "user-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    role: "Client",
    phone: "(555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e8?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "user-002",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    role: "Client",
    phone: "(555) 765-4321",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "user-003",
    name: "Emily Rodriguez",
    email: "emily@grandviewgardens.com",
    role: "Coordinator",
    phone: "(555) 987-6543",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
]

export const todoItems: TodoItem[] = [
  {
    id: "todo-001",
    title: "Finalize Menu Selection",
    description: "Choose appetizers, main course options, and dessert for the reception",
    assignedTo: "Client",
    priority: "high",
    status: "pending",
    dueDate: "2024-06-01",
    category: "Catering",
    createdBy: "Emily Rodriguez",
    createdAt: "2024-05-15T10:30:00Z"
  },
  {
    id: "todo-002",
    title: "Submit Final Guest Count",
    description: "Provide final headcount for catering and seating arrangements",
    assignedTo: "Client",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-07-01",
    category: "Planning",
    createdBy: "Emily Rodriguez",
    createdAt: "2024-05-10T14:20:00Z"
  },
  {
    id: "todo-003",
    title: "Set Up Tables and Chairs",
    description: "Arrange seating according to the approved floor plan",
    assignedTo: "Venue Staff",
    priority: "medium",
    status: "pending",
    dueDate: "2024-08-15",
    category: "Setup",
    createdBy: "Sarah Johnson",
    createdAt: "2024-05-20T09:15:00Z"
  },
  {
    id: "todo-004",
    title: "Confirm Vendor Access Times",
    description: "Coordinate arrival times for photographer, DJ, and florist",
    assignedTo: "Both",
    priority: "medium",
    status: "completed",
    dueDate: "2024-05-25",
    category: "Coordination",
    createdBy: "Emily Rodriguez",
    createdAt: "2024-05-12T16:45:00Z"
  }
]

export const payments: Payment[] = [
  {
    id: "payment-001",
    description: "Venue Deposit",
    amount: 2500.00,
    dueDate: "2024-03-01",
    status: "paid",
    paidDate: "2024-02-28",
    paymentMethod: "Credit Card",
    category: "Venue"
  },
  {
    id: "payment-002",
    description: "Catering Balance",
    amount: 4800.00,
    dueDate: "2024-07-15",
    status: "pending",
    category: "Catering"
  },
  {
    id: "payment-003",
    description: "Final Service Payment",
    amount: 3200.00,
    dueDate: "2024-08-01",
    status: "pending",
    category: "Services"
  },
  {
    id: "payment-004",
    description: "Decoration & Setup",
    amount: 1500.00,
    dueDate: "2024-08-10",
    status: "pending",
    category: "Decoration"
  }
]

export const documents: Document[] = [
  {
    id: "doc-001",
    name: "Service Agreement",
    type: "Contract",
    url: "/documents/service-agreement.pdf",
    uploadedBy: "Emily Rodriguez",
    uploadedAt: "2024-02-15T10:30:00Z",
    size: "2.3 MB",
    shared: true
  },
  {
    id: "doc-002",
    name: "Menu Options",
    type: "Information",
    url: "/documents/menu-options.pdf",
    uploadedBy: "Emily Rodriguez",
    uploadedAt: "2024-05-10T14:20:00Z",
    size: "1.8 MB",
    shared: true
  },
  {
    id: "doc-003",
    name: "Floor Plan",
    type: "Layout",
    url: "/documents/floor-plan.pdf",
    uploadedBy: "Sarah Johnson",
    uploadedAt: "2024-05-18T09:15:00Z",
    size: "950 KB",
    shared: true
  },
  {
    id: "doc-004",
    name: "Event Timeline",
    type: "Schedule",
    url: "/documents/event-timeline.pdf",
    uploadedBy: "Emily Rodriguez",
    uploadedAt: "2024-05-20T16:45:00Z",
    size: "1.2 MB",
    shared: true
  }
]

export const discussions: Discussion[] = [
  {
    id: "discussion-001",
    title: "Dietary Requirements",
    author: "Sarah Johnson",
    authorRole: "Client",
    content: "Hi Emily, we have several guests with dietary restrictions. Could you share the vegetarian and gluten-free options available?",
    createdAt: "2024-05-16T10:30:00Z",
    priority: "normal",
    resolved: true,
    replies: [
      {
        id: "reply-001",
        author: "Emily Rodriguez",
        authorRole: "Coordinator",
        content: "Of course! We have multiple options for both dietary needs. I'll email you the detailed menu with all alternatives.",
        createdAt: "2024-05-16T14:20:00Z"
      },
      {
        id: "reply-002",
        author: "Sarah Johnson",
        authorRole: "Client",
        content: "Perfect! Thank you for accommodating our guests' needs.",
        createdAt: "2024-05-17T09:15:00Z"
      }
    ]
  },
  {
    id: "discussion-002",
    title: "Setup Timeline",
    author: "Emily Rodriguez",
    authorRole: "Coordinator",
    content: "What time would you like the vendors to arrive for setup? We need to coordinate access with all service providers.",
    createdAt: "2024-05-18T11:00:00Z",
    priority: "urgent",
    resolved: false,
    replies: [
      {
        id: "reply-003",
        author: "Michael Chen",
        authorRole: "Client",
        content: "We were thinking around 10 AM? The event starts at 4 PM, so that should provide adequate setup time.",
        createdAt: "2024-05-19T08:30:00Z"
      }
    ]
  }
]

export const serviceInfo: ServiceInfo = {
  name: "Grandview Gardens",
  tagline: "Creating Unforgettable Moments",
  description: "Premier event venue specializing in weddings and special celebrations",
  contact: {
    email: "hello@grandviewgardens.com",
    phone: "(555) 987-6543",
    address: "456 Garden Lane, Riverside, CA 92501"
  }
}

export const dashboardSummary: DashboardSummary = {
  totalTodos: todoItems.length,
  completedTodos: todoItems.filter(item => item.status === 'completed').length,
  pendingPayments: payments.filter(payment => payment.status === 'pending').length,
  totalDocuments: documents.length,
  unreadDiscussions: discussions.filter(d => !d.resolved).length
}