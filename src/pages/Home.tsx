import { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
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
import { usePageLoading } from "../hooks/usePageLoading";
import { useAppContext } from "../context/AppContext";

const Home = memo(() => {
  const [loading] = usePageLoading(false);
  const { state } = useAppContext();
  const navigate = useNavigate();

  const dashboardStats = useMemo(() => {
    const completedTodos = state.todos.filter(todo => todo.status === 'completed').length;
    const totalTodos = state.todos.length;
    const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    const unreadDiscussions = state.discussions.filter(d => !d.resolved).length;
    const totalDocuments = state.documents.length;
    const sharedDocuments = state.documents.filter(d => d.shared).length;

    return {
      completedTodos,
      totalTodos,
      completionRate,
      unreadDiscussions,
      totalDocuments,
      sharedDocuments
    };
  }, [state.todos, state.discussions, state.documents]);

  const iconMap = useMemo(
    () => ({
      AssignmentTurnedIn: <Icons.AssignmentTurnedIn />,
      Payment: <Icons.Payment />,
      Description: <Icons.Description />,
      Forum: <Icons.Forum />,
      Warning: <Icons.Warning />,
      CheckCircle: <Icons.CheckCircle />,
    }),
    []
  );

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

  const getNavigationPath = (dataSource: string): string => {
    const dataSourceToPath: Record<string, string> = {
      todoItems: '/todos',
      payments: '/payments',
      documents: '/documents',
      discussions: '/discussions'
    }
    return dataSourceToPath[dataSource] || '/'
  }

  const handleNavigateToPage = (dataSource: string) => {
    const path = getNavigationPath(dataSource)
    navigate(path)
  }

  const getSectionData = useMemo(() => (section: { dataSource: string; filterCriteria?: Record<string, unknown>; maxItems?: number }) => {
    const { dataSource, filterCriteria, maxItems } = section;
    let data: Array<{ id: string; [key: string]: unknown }> = [];

    switch (dataSource) {
      case "todoItems":
        data = state.todos.filter((item) => {
          if (
            filterCriteria?.priority &&
            item.priority !== filterCriteria.priority
          )
            return false;
          if (
            filterCriteria?.status === "!completed" &&
            item.status === "completed"
          )
            return false;
          return true;
        });
        break;
      case "discussions":
        data = state.discussions.filter((item) => {
          if (
            filterCriteria?.resolved !== undefined &&
            item.resolved !== filterCriteria.resolved
          )
            return false;
          return true;
        });
        break;
      default:
        data = [];
    }

    return maxItems ? data.slice(0, maxItems) : data;
  }, [state.todos, state.discussions]);

  return (
    <PageLayout
      title={appConfig.pageTitle}
      description={`Welcome to ${serviceInfo.name} - ${serviceInfo.tagline}`}
    >
      {/* Summary Cards Section */}
      <LoadingWrapper loading={loading} minHeight="200px">
        <Box className="dashboard-section">
          <Typography variant="h5" component="h2">
            Overview
          </Typography>
          <Grid container spacing={3}>
            {appConfig.dashboardCards.map((card) => (
              <Grid item xs={12} sm={6} lg={3} key={card.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: (theme) => theme.shadows[4],
                    }
                  }}
                  onClick={() => handleNavigateToPage(card.dataSource)}
                >
                  <CardContent>
                    <Box className="card-header">
                      <Box
                        className="card-icon"
                        sx={{ color: `${card.color}.main` }}
                      >
                        {card.icon &&
                          iconMap[card.icon as keyof typeof iconMap]}
                      </Box>
                      <Typography
                        variant="h4"
                        component="div"
                        className="card-value"
                      >
                        {getCardValue(card)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.subtitle}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="primary"
                      sx={{
                        mt: 0.5,
                        display: 'block',
                        fontWeight: 500,
                        opacity: 0.7,
                        transition: 'opacity 0.2s ease-in-out'
                      }}
                    >
                      Click to view details
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </LoadingWrapper>

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
                                    <Chip
                                      label={item.priority}
                                      size="small"
                                      color="error"
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
                                    <Chip
                                      label={item.priority}
                                      size="small"
                                      color={
                                        item.priority === "urgent"
                                          ? "error"
                                          : "default"
                                      }
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
