/**
 * Sample Data for Development and Testing
 *
 * This file contains demo data for the scaffold's entities.
 * All dates are dynamically calculated based on today's date to ensure
 * timeline graphs and date-based features always show relevant data.
 *
 * **Important:** Dates are calculated using demoDateHelpers utilities.
 * In production, these will be replaced with user-inputted dates.
 */
import type {
  User,
  TodoItem,
  Payment,
  Document,
  Discussion,
  ServiceInfo,
  DashboardSummary,
} from "../types/portal";
import { daysFromNow, daysAgo, daysAgoISO } from "../utils/demoDateHelpers";

export const users: User[] = [
  {
    id: "user-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    role: "Client",
    userType: "Customer",
    phone: "(555) 123-4567",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b1e8?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "user-002",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    role: "Client",
    userType: "Customer",
    phone: "(555) 765-4321",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "user-003",
    name: "Emily Rodriguez",
    email: "emily@grandviewgardens.com",
    role: "Coordinator",
    userType: "Service Provider",
    phone: "(555) 987-6543",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
];

// Mock authentication users (includes passwords for login testing)
export const mockAuthUsers = [
  {
    id: "auth-001",
    name: "John Customer",
    email: "customer@example.com",
    password: "password123",
    role: "Premium Customer",
    userType: "Customer" as const,
    phone: "(555) 123-4567",
  },
  {
    id: "auth-002",
    name: "Jane Vendor",
    email: "vendor@example.com",
    password: "password123",
    role: "Catering Vendor",
    userType: "Vendor" as const,
    phone: "(555) 234-5678",
  },
  {
    id: "auth-003",
    name: "Bob Service",
    email: "service@example.com",
    password: "password123",
    role: "Event Coordinator",
    userType: "Service Provider" as const,
    phone: "(555) 345-6789",
  },
  {
    id: "auth-004",
    name: "Alice Admin",
    email: "admin@example.com",
    password: "password123",
    role: "System Administrator",
    userType: "Admin" as const,
    phone: "(555) 456-7890",
  },
];

export const todoItems: TodoItem[] = [
  {
    id: "todo-001",
    title: "Finalize Menu Selection",
    description:
      "Choose appetizers, main course options, and dessert for the reception",
    assignedTo: "Client",
    priority: "high",
    status: "pending",
    dueDate: daysFromNow(3), // 3 days from today
    category: "Catering",
    createdBy: "Emily Rodriguez",
    createdAt: daysAgoISO(10, 10, 30), // 10 days ago at 10:30
  },
  {
    id: "todo-002",
    title: "Submit Final Guest Count",
    description:
      "Provide final headcount for catering and seating arrangements",
    assignedTo: "Client",
    priority: "high",
    status: "in-progress",
    dueDate: daysFromNow(5), // 5 days from today
    category: "Planning",
    createdBy: "Emily Rodriguez",
    createdAt: daysAgoISO(15, 14, 20), // 15 days ago at 14:20
  },
  {
    id: "todo-003",
    title: "Set Up Tables and Chairs",
    description: "Arrange seating according to the approved floor plan",
    assignedTo: "Venue Staff",
    priority: "medium",
    status: "pending",
    dueDate: daysFromNow(10), // 10 days from today
    category: "Setup",
    createdBy: "Sarah Johnson",
    createdAt: daysAgoISO(5, 9, 15), // 5 days ago at 09:15
  },
  {
    id: "todo-004",
    title: "Confirm Vendor Access Times",
    description: "Coordinate arrival times for photographer, DJ, and florist",
    assignedTo: "Both",
    priority: "medium",
    status: "completed",
    dueDate: daysAgo(2), // 2 days ago (completed task)
    category: "Coordination",
    createdBy: "Emily Rodriguez",
    createdAt: daysAgoISO(12, 16, 45), // 12 days ago at 16:45
  },
];

export const payments: Payment[] = [
  {
    id: "payment-001",
    description: "Venue Deposit",
    amount: 2500.0,
    dueDate: daysAgo(30), // 30 days ago (already paid)
    status: "paid",
    paidDate: daysAgo(31), // Paid 31 days ago (1 day before due)
    paymentMethod: "Credit Card",
    category: "Venue",
  },
  {
    id: "payment-002",
    description: "Catering Balance",
    amount: 4800.0,
    dueDate: daysFromNow(15), // 15 days from today
    status: "pending",
    category: "Catering",
  },
  {
    id: "payment-003",
    description: "Final Service Payment",
    amount: 3200.0,
    dueDate: daysFromNow(30), // 30 days from today
    status: "pending",
    category: "Services",
  },
  {
    id: "payment-004",
    description: "Decoration & Setup",
    amount: 1500.0,
    dueDate: daysFromNow(40), // 40 days from today
    status: "pending",
    category: "Decoration",
  },
];

export const documents: Document[] = [
  {
    id: "doc-001",
    name: "Service Agreement",
    type: "Contract",
    url: "/documents/service-agreement.pdf",
    uploadedBy: "Emily Rodriguez",
    uploadedAt: daysAgoISO(60, 10, 30), // 60 days ago at 10:30
    size: "2.3 MB",
    shared: true,
  },
  {
    id: "doc-002",
    name: "Menu Options",
    type: "Information",
    url: "/documents/menu-options.pdf",
    uploadedBy: "Emily Rodriguez",
    uploadedAt: daysAgoISO(10, 14, 20), // 10 days ago at 14:20
    size: "1.8 MB",
    shared: true,
  },
  {
    id: "doc-003",
    name: "Floor Plan",
    type: "Layout",
    url: "/documents/floor-plan.pdf",
    uploadedBy: "Sarah Johnson",
    uploadedAt: daysAgoISO(8, 9, 15), // 8 days ago at 09:15
    size: "950 KB",
    shared: true,
  },
  {
    id: "doc-004",
    name: "Event Timeline",
    type: "Schedule",
    url: "/documents/event-timeline.pdf",
    uploadedBy: "Emily Rodriguez",
    uploadedAt: daysAgoISO(5, 16, 45), // 5 days ago at 16:45
    size: "1.2 MB",
    shared: true,
  },
];

export const discussions: Discussion[] = [
  {
    id: "discussion-001",
    title: "Dietary Requirements",
    author: "Sarah Johnson",
    authorRole: "Client",
    content:
      "Hi Emily, we have several guests with dietary restrictions. Could you share the vegetarian and gluten-free options available?",
    createdAt: daysAgoISO(9, 10, 30), // 9 days ago at 10:30
    priority: "normal",
    resolved: true,
    replies: [
      {
        id: "reply-001",
        author: "Emily Rodriguez",
        authorRole: "Coordinator",
        content:
          "Of course! We have multiple options for both dietary needs. I'll email you the detailed menu with all alternatives.",
        createdAt: daysAgoISO(9, 14, 20), // Same day at 14:20
      },
      {
        id: "reply-002",
        author: "Sarah Johnson",
        authorRole: "Client",
        content: "Perfect! Thank you for accommodating our guests' needs.",
        createdAt: daysAgoISO(8, 9, 15), // Next day at 09:15
      },
    ],
  },
  {
    id: "discussion-002",
    title: "Setup Timeline",
    author: "Emily Rodriguez",
    authorRole: "Coordinator",
    content:
      "What time would you like the vendors to arrive for setup? We need to coordinate access with all service providers.",
    createdAt: daysAgoISO(7, 11, 0), // 7 days ago at 11:00
    priority: "urgent",
    resolved: false,
    replies: [
      {
        id: "reply-003",
        author: "Michael Chen",
        authorRole: "Client",
        content:
          "We were thinking around 10 AM? The event starts at 4 PM, so that should provide adequate setup time.",
        createdAt: daysAgoISO(6, 8, 30), // Next day at 08:30
      },
    ],
  },
];

export const serviceInfo: ServiceInfo = {
  name: "Grandview Gardens",
  tagline: "",
  description:
    "Premier event venue specializing in weddings and special celebrations",
  contact: {
    email: "hello@grandviewgardens.com",
    phone: "(555) 987-6543",
    address: "456 Garden Lane, Riverside, CA 92501",
  },
};

export const dashboardSummary: DashboardSummary = {
  totalTodos: todoItems.length,
  completedTodos: todoItems.filter((item) => item.status === "completed")
    .length,
  pendingPayments: payments.filter((payment) => payment.status === "pending")
    .length,
  totalDocuments: documents.length,
  unreadDiscussions: discussions.filter((d) => !d.resolved).length,
};
