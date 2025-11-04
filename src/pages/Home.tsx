import { memo, useMemo, useRef, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Button,
  CircularProgress,
} from "@mui/material";
import { PictureAsPdf as PdfIcon } from "@mui/icons-material";
import * as Icons from "@mui/icons-material";
import { serviceInfo } from "../data/sampleData";
import { appConfig } from "../data/configurableData";
import PageLayout from "../components/PageLayout";
import LoadingWrapper from "../components/LoadingWrapper";
import DataCard from "../components/DataCard";
import StatusChip from "../components/StatusChip";
import AnimatedSection from "../components/AnimatedSection";
import AnimatedGrid, { AnimatedGridItem } from "../components/AnimatedGrid";
import DashboardCharts from "../components/DashboardCharts";
import { usePageLoading } from "../hooks/usePageLoading";
import { useEntityActions } from "../hooks/useEntityActions";
import { useDataOperations } from "../hooks/useDataOperations";
import { useNavigation } from "../hooks/useNavigation";
import { useData } from "../context/ContextProvider";
import { exportDashboardToPDF } from "../utils/pdfExport";

const Home = memo(() => {
  const [loading] = usePageLoading(false);
  const [exporting, setExporting] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { todos, discussions, documents } = useData();
  const { getActionHandler } = useEntityActions();
  const { getEnabledPages } = useNavigation();

  const enabledDashboardCards = useMemo(() => {
    const enabledPageIds = new Set(getEnabledPages().map(page => page.id));
    return appConfig.dashboardCards.filter(card => enabledPageIds.has(card.pageId));
  }, [getEnabledPages]);

  const isTasksPageEnabled = useMemo(() => {
    return getEnabledPages().some(page => page.id === 'tasks');
  }, [getEnabledPages]);

  const dashboardStats = useMemo(() => {
    const completedTodos = todos.filter(todo => todo.status === 'completed').length;
    const totalTodos = todos.length;
    const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    const unreadDiscussions = discussions.filter(d => !d.resolved).length;
    const totalDocuments = documents.length;
    const sharedDocuments = documents.filter(d => d.shared).length;

    return {
      completedTodos,
      totalTodos,
      completionRate,
      unreadDiscussions,
      totalDocuments,
      sharedDocuments
    };
  }, [todos, discussions, documents]);

  // Generate sparkline data for the last 7 days
  const sparklineData = useMemo(() => {
    const today = new Date();
    const todoSparkline = [];
    const discussionSparkline = [];
    const documentSparkline = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Count todos created/updated on this day
      const dayTodos = todos.filter(todo => {
        const todoDate = new Date(todo.createdAt || todo.dueDate);
        return todoDate.toDateString() === date.toDateString();
      }).length;
      todoSparkline.push(dayTodos);

      // Count discussions on this day
      const dayDiscussions = discussions.filter(d => {
        const discussionDate = new Date(d.createdAt);
        return discussionDate.toDateString() === date.toDateString();
      }).length;
      discussionSparkline.push(dayDiscussions);

      // Count documents on this day
      const dayDocuments = documents.filter(doc => {
        if (!doc.uploadedAt) return false;
        const docDate = new Date(doc.uploadedAt);
        return docDate.toDateString() === date.toDateString();
      }).length;
      documentSparkline.push(dayDocuments);
    }

    return {
      todoItems: todoSparkline,
      discussions: discussionSparkline,
      documents: documentSparkline,
      payments: [0, 1, 2, 1, 3, 2, 4] // Mock data for payments
    };
  }, [todos, discussions, documents]);


  const getCardValue = (card: { dataSource: string; valueType?: string }) => {
    switch (card.dataSource) {
      case "todoItems":
        return card.valueType === "ratio"
          ? `${dashboardStats.completedTodos}/${dashboardStats.totalTodos}`
          : dashboardStats.totalTodos;
      case "payments":
        return 0; // TODO: Add payments to shared state
      case "documents":
        return dashboardStats.totalDocuments;
      case "discussions":
        return dashboardStats.unreadDiscussions;
      default:
        return 0;
    }
  };

  const handleNavigateToPage = (dataSource: string) => {
    const navigationMap: Record<string, string> = {
      todoItems: 'navigateToTasks',
      payments: 'navigateToPayments',
      documents: 'navigateToDocuments',
      discussions: 'navigateToDiscussions'
    }

    const actionId = navigationMap[dataSource]
    const handler = getActionHandler(actionId)

    if (handler) {
      handler()
    }
  }

  const { processData } = useDataOperations();

  const getSectionData = useMemo(() => (section: { dataSource: string; filterCriteria?: Record<string, unknown>; maxItems?: number }) => {
    const { dataSource, filterCriteria, maxItems } = section;
    let sourceData: Array<{ id: string; [key: string]: unknown }> = [];

    switch (dataSource) {
      case "todoItems":
        sourceData = todos;
        break;
      case "discussions":
        sourceData = discussions;
        break;
      default:
        sourceData = [];
    }

    const { processedData } = processData({
      data: sourceData,
      filterCriteria,
      maxItems
    });

    return processedData;
  }, [todos, discussions, processData]);

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      await exportDashboardToPDF(dashboardRef.current, {
        filename: `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`,
        title: appConfig.appName + ' Dashboard',
      });
      console.log('Dashboard exported to PDF successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageLayout
      title={appConfig.pageTitle}
      description={`${serviceInfo.tagline}`}
      action={
        <Button
          variant="outlined"
          startIcon={exporting ? <CircularProgress size={16} /> : <PdfIcon />}
          onClick={handleExportPDF}
          disabled={exporting}
        >
          {exporting ? 'Exporting...' : 'Export PDF'}
        </Button>
      }
    >
      <Box ref={dashboardRef}>
       {/* Progress Section - Only show if Tasks page is enabled */}
      {isTasksPageEnabled && (
        <AnimatedSection delay={0.1}>
          <LoadingWrapper loading={loading} minHeight="120px" skeleton skeletonVariant="card" skeletonCount={1}>
            <Box className="dashboard-section">
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Overall Progress
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box sx={{ width: "100%", mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={dashboardStats.completionRate}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">
                        {dashboardStats.completionRate}%
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {dashboardStats.completedTodos} of{" "}
                    {dashboardStats.totalTodos} tasks completed
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </LoadingWrapper>
        </AnimatedSection>
      )}
      
      {/* Summary Cards Section */}
      <AnimatedSection delay={0.2}>
        <LoadingWrapper loading={loading} minHeight="200px" skeleton skeletonVariant="card" skeletonCount={4}>
          <Box className="dashboard-section">
            <Typography variant="h5" component="h2">
              Overview
            </Typography>
            <AnimatedGrid staggerDelay={0.08} initialDelay={0.1}>
              <Grid container spacing={3}>
                {enabledDashboardCards.map((card) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={card.id}>
                    <AnimatedGridItem>
                      <DataCard
                        card={card}
                        value={getCardValue(card)}
                        onClick={() => handleNavigateToPage(card.dataSource)}
                        sparklineData={sparklineData[card.dataSource as keyof typeof sparklineData]}
                        sparklineColor={card.color ? `${card.color}.main` : undefined}
                      />
                    </AnimatedGridItem>
                  </Grid>
                ))}
              </Grid>
            </AnimatedGrid>
          </Box>
        </LoadingWrapper>
      </AnimatedSection>

      {/* Dashboard Charts Section - Only show if Tasks page is enabled */}
      {isTasksPageEnabled && todos.length > 0 && (
        <AnimatedSection delay={0.25}>
          <LoadingWrapper loading={loading} minHeight="300px">
            <Box className="dashboard-section">
              <DashboardCharts todos={todos} />
            </Box>
          </LoadingWrapper>
        </AnimatedSection>
      )}

      {/* Dynamic Sections */}
      <AnimatedSection delay={0.3}>
        <LoadingWrapper loading={loading} minHeight="300px" skeleton skeletonVariant="list" skeletonCount={5}>
          <Box className="dashboard-section">
            <AnimatedGrid staggerDelay={0.15} initialDelay={0.1}>
              <Grid container spacing={3}>
                {appConfig.dashboardSections
                  .filter((section) => {
                    const enabledPageIds = new Set(getEnabledPages().map(page => page.id));
                    return section.enabled && enabledPageIds.has(section.pageId);
                  })
                  .map((section) => {
                    const sectionData = getSectionData(section);
                    return (
                      <Grid size={{ xs: 12, md: 6 }} key={section.id}>
                        <AnimatedGridItem>
                          <Card
                            sx={{
                              cursor: 'pointer',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: (theme) => theme.shadows[4],
                              }
                            }}
                            onClick={() => handleNavigateToPage(section.dataSource)}
                          >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {section.title}
                        </Typography>
                        {sectionData.length > 0 ? (
                          <List dense>
                            {sectionData.map((item) => (
                              <ListItem key={String(item.id)}>
                                {section.dataSource === "todoItems" && (
                                  <>
                                    <Icons.Warning
                                      color="error"
                                      sx={{ mr: 1 }}
                                    />
                                    <ListItemText
                                      primary={String(item.title)}
                                      secondary={`Due: ${new Date(
                                        String(item.dueDate)
                                      ).toLocaleDateString()}`}
                                    />
                                    <StatusChip
                                      type="priority"
                                      value={String(item.priority)}
                                      statusConfig={appConfig.statusConfig}
                                      size="small"
                                    />
                                  </>
                                )}
                                {section.dataSource === "discussions" && (
                                  <>
                                    <ListItemText
                                      primary={String(item.title)}
                                      secondary={`${String(item.author)} · ${new Date(
                                        String(item.createdAt)
                                      ).toLocaleDateString()}`}
                                    />
                                    <StatusChip
                                      type="priority"
                                      value={String(item.priority)}
                                      statusConfig={appConfig.statusConfig}
                                      size="small"
                                    />
                                  </>
                                )}
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 2,
                            }}
                          >
                            <Icons.CheckCircle color="success" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {section.dataSource === "todoItems"
                                ? "No urgent tasks at this time"
                                : "All discussions resolved"}
                            </Typography>
                          </Box>
                        )}
                        <Typography
                          variant="caption"
                          color="primary"
                          sx={{
                            mt: 1,
                            display: 'block',
                            fontWeight: 500,
                            opacity: 0.7,
                            transition: 'opacity 0.2s ease-in-out'
                          }}
                        >
                          Click to view all
                        </Typography>
                      </CardContent>
                    </Card>
                        </AnimatedGridItem>
                      </Grid>
                    );
                  })}
              </Grid>
            </AnimatedGrid>
          </Box>
        </LoadingWrapper>
      </AnimatedSection>
      </Box>
    </PageLayout>
  );
});

export default Home;
