import { memo, useMemo } from "react";
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
} from "@mui/material";
import * as Icons from "@mui/icons-material";
import { serviceInfo } from "../data/sampleData";
import { appConfig } from "../data/configurableData";
import PageLayout from "../components/PageLayout";
import LoadingWrapper from "../components/LoadingWrapper";
import DataCard from "../components/DataCard";
import StatusChip from "../components/StatusChip";
import { usePageLoading } from "../hooks/usePageLoading";
import { useEntityActions } from "../hooks/useEntityActions";
import { useDataOperations } from "../hooks/useDataOperations";
import { useData } from "../context/ContextProvider";

const Home = memo(() => {
  const [loading] = usePageLoading(false);
  const { todos, discussions, documents } = useData();
  const { getActionHandler } = useEntityActions();

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

  return (
    <PageLayout
      title={appConfig.pageTitle}
      description={`${serviceInfo.tagline}`}
    >
       {/* Progress Section */}
      <LoadingWrapper loading={loading} minHeight="120px">
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
      
      {/* Summary Cards Section */}
      <LoadingWrapper loading={loading} minHeight="200px">
        <Box className="dashboard-section">
          <Typography variant="h5" component="h2">
            Overview
          </Typography>
          <Grid container spacing={3}>
            {appConfig.dashboardCards.map((card) => (
              <Grid item xs={12} sm={6} lg={3} key={card.id}>
                <DataCard
                  card={card}
                  value={getCardValue(card)}
                  onClick={() => handleNavigateToPage(card.dataSource)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </LoadingWrapper>

     

      {/* Dynamic Sections */}
      <LoadingWrapper loading={loading} minHeight="300px">
        <Box className="dashboard-section">
          <Grid container spacing={3}>
            {appConfig.dashboardSections
              .filter((section) => section.enabled)
              .map((section) => {
                const sectionData = getSectionData(section);
                return (
                  <Grid item xs={12} md={6} key={section.id}>
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
                              <ListItem key={item.id}>
                                {section.dataSource === "todoItems" && (
                                  <>
                                    <Icons.Warning
                                      color="error"
                                      sx={{ mr: 1 }}
                                    />
                                    <ListItemText
                                      primary={item.title}
                                      secondary={`Due: ${new Date(
                                        item.dueDate
                                      ).toLocaleDateString()}`}
                                    />
                                    <StatusChip
                                      type="priority"
                                      value={item.priority as string}
                                      statusConfig={appConfig.statusConfig}
                                      size="small"
                                    />
                                  </>
                                )}
                                {section.dataSource === "discussions" && (
                                  <>
                                    <ListItemText
                                      primary={item.title}
                                      secondary={`${item.author} · ${new Date(
                                        item.createdAt
                                      ).toLocaleDateString()}`}
                                    />
                                    <StatusChip
                                      type="priority"
                                      value={item.priority as string}
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
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      </LoadingWrapper>
    </PageLayout>
  );
});

export default Home;
