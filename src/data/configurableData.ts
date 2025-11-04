import type { AppConfig, UserType } from "../types/portal";

export const USER_TYPES: UserType[] = ['Customer', 'Vendor', 'Service Provider', 'Admin'];

// Re-export sample data for demo purposes
export {
  users,
  todoItems,
  payments,
  documents,
  discussions,
  serviceInfo,
  dashboardSummary,
} from "./sampleData";

export const appConfig: AppConfig = {
  appName: "Grandview Portal",
  pageTitle: "Dashboard",
  navigation: [
    {
      id: "home",
      label: "Home",
      path: "/",
      enabled: true,
      description: "",
    },
    {
      id: "tasks",
      label: "Tasks",
      path: "/todos",
      enabled: true,
      description: "",
    },
    {
      id: "payments",
      label: "Payments",
      path: "/payments",
      enabled: true,
      description: "",
    },
    {
      id: "documents",
      label: "Documents",
      path: "/documents",
      enabled: true,
      description: "",
    },
    {
      id: "discussions",
      label: "Discussions",
      path: "/discussions",
      enabled: true,
      description: "",
    },
    {
      id: "table",
      label: "Table Demo",
      path: "/table",
      enabled: true,
      description: "DataTable component demonstration",
    },
    {
      id: "timeline",
      label: "Timeline",
      path: "/timeline",
      enabled: true,
      description: "Visual timeline of task due dates",
    },
    {
      id: "contact",
      label: "Contact",
      path: "/contact",
      enabled: true,
      description: "",
    },
  ],
  dashboardCards: [
    {
      id: "tasks-card",
      title: "Tasks",
      subtitle: "Completed",
      dataSource: "todoItems",
      pageId: "tasks",
      valueType: "ratio",
      icon: "AssignmentTurnedIn",
      color: "primary",
    },
    {
      id: "payments-card",
      title: "Payments",
      subtitle: "Outstanding",
      dataSource: "payments",
      pageId: "payments",
      valueType: "count",
      icon: "Payment",
      color: "warning",
    },
    {
      id: "documents-card",
      title: "Documents",
      subtitle: "Available",
      dataSource: "documents",
      pageId: "documents",
      valueType: "count",
      icon: "Description",
      color: "info",
    },
    {
      id: "discussions-card",
      title: "Discussions",
      subtitle: "Need attention",
      dataSource: "discussions",
      pageId: "discussions",
      valueType: "count",
      icon: "Forum",
      color: "secondary",
    },
  ],
  dashboardSections: [
    {
      id: "priority-tasks",
      title: "Priority Tasks",
      dataSource: "todoItems",
      pageId: "tasks",
      filterCriteria: { priority: "high", status: "!completed" },
      maxItems: 5,
      enabled: true,
    },
    {
      id: "recent-discussions",
      title: "Recent Discussions",
      dataSource: "discussions",
      pageId: "discussions",
      filterCriteria: { resolved: false },
      maxItems: 5,
      enabled: true,
    },
  ],
  theme: {
    primaryColor: "#3B82F6",
    secondaryColor: "#8B5CF6",
    mode: "light",
    borderRadius: 12,
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    iconMappings: {
      AssignmentTurnedIn: "AssignmentTurnedIn",
      Payment: "Payment",
      Description: "Description",
      Forum: "Forum",
      Warning: "Warning",
      CheckCircle: "CheckCircle",
      Download: "Download",
      Share: "Share",
      Edit: "Edit",
      Support: "Support",
    },
  },
  actions: {
    document: [
      {
        id: "download",
        label: "Download",
        icon: "Download",
        variant: "outlined",
        size: "small",
        onClick: "handleDownload",
      },
      {
        id: "share",
        label: "Share",
        icon: "Share",
        variant: "outlined",
        size: "small",
        onClick: "handleShare",
      },
    ],
    contact: [
      {
        id: "update-profile",
        label: "Update Profile",
        icon: "Edit",
        variant: "outlined",
        onClick: "handleUpdateProfile",
      },
      {
        id: "contact-support",
        label: "Contact Support",
        icon: "Support",
        variant: "outlined",
        onClick: "handleContactSupport",
      },
    ],
    account: [],
  },
  statusConfig: {
    // TodoItem entity statuses
    todoItem: {
      priority: {
        high: { color: "error", label: "High Priority", icon: "🔥" },
        medium: { color: "warning", label: "Medium", icon: "⚠️" },
        low: { color: "default", label: "Low", icon: "📋" },
      },
      status: {
        pending: { color: "default", label: "Pending", icon: "⏳" },
        "in-progress": { color: "info", label: "In Progress", icon: "🔄" },
        completed: { color: "success", label: "Completed", icon: "✅" },
      },
    },
    // Payment entity statuses
    payment: {
      status: {
        pending: { color: "warning", label: "Pending Payment", icon: "💳", description: "Payment is awaiting processing" },
        paid: { color: "success", label: "Paid", icon: "✅", description: "Payment has been completed" },
        overdue: { color: "error", label: "Overdue", icon: "⚠️", description: "Payment is past due date" },
      },
    },
    // Document entity statuses
    document: {
      shared: {
        true: { color: "success", label: "Shared", icon: "👥" },
        false: { color: "default", label: "Private", icon: "🔒" },
      },
    },
    // Discussion entity statuses
    discussion: {
      priority: {
        normal: { color: "default", label: "Normal", icon: "💬" },
        urgent: { color: "error", label: "Urgent", icon: "🔥" },
      },
      resolved: {
        true: { color: "success", label: "Resolved", icon: "✅" },
        false: { color: "warning", label: "Open", icon: "💬" },
      },
    },
  },
  fieldConfig: {
    todoItem: {
      primary: "title",
      secondary: ["priority", "status", "dueDate", "category"],
      hidden: ["id", "createdBy", "createdAt"],
    },
    document: {
      primary: "name",
      secondary: ["type", "size", "uploadedBy", "uploadedAt", "shared"],
      hidden: ["id", "url"],
    },
    payment: {
      primary: "description",
      secondary: ["amount", "status", "dueDate", "category"],
      hidden: ["id", "paidDate", "paymentMethod"],
    },
    discussion: {
      primary: "title",
      secondary: ["priority", "resolved", "author", "createdAt"],
      hidden: ["id", "authorRole"],
    },
  },
};
