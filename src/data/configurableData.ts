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
  formSchemas: {
    todoItem: {
      title: "Task",
      description: "Create a new task to track work items",
      submitLabel: "Create Task",
      cancelLabel: "Cancel",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "text",
          placeholder: "Enter task title",
          required: true,
          fullWidth: true,
          grid: { xs: 12 },
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Enter task description",
          rows: 3,
          fullWidth: true,
          grid: { xs: 12 },
        },
        {
          name: "assignedTo",
          label: "Assigned To",
          type: "text",
          placeholder: "Enter assignee email",
          required: true,
          fullWidth: true,
          grid: { xs: 12, md: 6 },
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          required: true,
          fullWidth: true,
          grid: { xs: 12, md: 6 },
          options: [
            { value: "maintenance", label: "Maintenance" },
            { value: "repair", label: "Repair" },
            { value: "inspection", label: "Inspection" },
            { value: "general", label: "General" },
          ],
        },
        {
          name: "priority",
          label: "Priority",
          type: "select",
          required: true,
          defaultValue: "medium",
          fullWidth: true,
          grid: { xs: 12, md: 6 },
          options: [
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ],
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          required: true,
          defaultValue: "pending",
          fullWidth: true,
          grid: { xs: 12, md: 6 },
          options: [
            { value: "pending", label: "Pending" },
            { value: "in-progress", label: "In Progress" },
            { value: "completed", label: "Completed" },
          ],
        },
        {
          name: "dueDate",
          label: "Due Date",
          type: "date",
          required: true,
          fullWidth: true,
          grid: { xs: 12 },
        },
      ],
    },
    document: {
      title: "Document",
      description: "Upload a new document",
      submitLabel: "Upload",
      cancelLabel: "Cancel",
      fields: [
        {
          name: "name",
          label: "Document Name",
          type: "text",
          placeholder: "Enter document name",
          required: true,
          fullWidth: true,
          grid: { xs: 12 },
        },
        {
          name: "type",
          label: "Document Type",
          type: "select",
          required: true,
          fullWidth: true,
          grid: { xs: 12, md: 6 },
          options: [
            { value: "contract", label: "Contract" },
            { value: "invoice", label: "Invoice" },
            { value: "report", label: "Report" },
            { value: "other", label: "Other" },
          ],
        },
        {
          name: "shared",
          label: "Share Document",
          type: "checkbox",
          defaultValue: false,
          grid: { xs: 12, md: 6 },
        },
      ],
    },
    discussion: {
      title: "Discussion",
      description: "Start a new discussion thread",
      submitLabel: "Post",
      cancelLabel: "Cancel",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "text",
          placeholder: "Enter discussion title",
          required: true,
          fullWidth: true,
          grid: { xs: 12 },
        },
        {
          name: "content",
          label: "Content",
          type: "textarea",
          placeholder: "Enter your message",
          required: true,
          rows: 5,
          fullWidth: true,
          grid: { xs: 12 },
        },
        {
          name: "priority",
          label: "Priority",
          type: "select",
          required: true,
          defaultValue: "normal",
          fullWidth: true,
          grid: { xs: 12, md: 6 },
          options: [
            { value: "normal", label: "Normal" },
            { value: "urgent", label: "Urgent" },
          ],
        },
      ],
    },
  },
  features: {
    // UI Features - Control which UI enhancements are available
    darkMode: true,
    highContrastMode: true,
    layoutDensity: true,
    commandPalette: true,
    pdfExport: true,
    keyboardShortcuts: true,
    notifications: true,

    // Pages - Control which pages are available (overrides navigation.enabled)
    // Set to false to completely disable a page and remove from app
    pages: {
      home: true,
      tasks: true,
      payments: true,
      documents: true,
      discussions: true,  // Set to false to disable discussions
      table: true,
      timeline: true,
      contact: true,
    },

    // Authentication - Control login/auth features
    authentication: {
      enabled: true,          // Set to false to disable login entirely (auto-login as guest)
      allowGuest: false,       // Allow guest access without login
      rememberMe: true,        // Show "Remember Me" checkbox
      requireEmailVerification: false,  // Require email verification for new accounts
    },

    // CRUD Operations - Global defaults (can be overridden per entity)
    crud: {
      create: true,   // Allow creating new entities
      edit: true,     // Allow editing existing entities
      delete: true,   // Allow deleting entities
      export: true,   // Allow exporting data to CSV/PDF
      import: false,  // Allow importing data from files
    },

    // Dashboard Features - Control what appears on dashboard
    dashboard: {
      cards: true,          // Show summary cards
      sections: true,       // Show data sections (Recent Discussions, etc.)
      charts: false,        // Show charts/graphs (if implemented)
      quickActions: true,   // Show quick action buttons
    },

    // Advanced Features - Premium/enterprise features
    advancedFiltering: true,   // Multi-field filtering
    advancedSorting: true,     // Multi-column sorting
    bulkOperations: false,     // Bulk edit/delete
    customFields: false,       // User-defined custom fields
    webhooks: false,           // Webhook integrations
    apiAccess: false,          // REST API access
  },
};
