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
    primaryColor: "#2D1B35",
    secondaryColor: "#F59E0B",
    mode: "light",
    borderRadius: 16,
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
    priority: {
      high: { color: "error", label: "High Priority" },
      medium: { color: "warning", label: "Medium" },
      low: { color: "default", label: "Low" },
      urgent: { color: "error", label: "Urgent" },
    },
    status: {
      pending: { color: "default", label: "Pending" },
      "in-progress": { color: "info", label: "In Progress" },
      completed: { color: "success", label: "Completed" },
      open: { color: "warning", label: "Open" },
      resolved: { color: "success", label: "Resolved" },
    },
    paymentStatus: {
      pending: { color: "warning", label: "Pending" },
      paid: { color: "success", label: "Paid" },
      overdue: { color: "error", label: "Overdue" },
    },
    documentShared: {
      true: { color: "success", label: "Shared" },
      false: { color: "default", label: "Private" },
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
