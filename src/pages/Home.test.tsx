import { appConfig } from '../data/configurableData'

describe('Page Visibility Configuration', () => {
  it('filters dashboard cards based on enabled pages', () => {
    const enabledPageIds = new Set(['tasks', 'payments'])
    const filteredCards = appConfig.dashboardCards.filter(card => enabledPageIds.has(card.pageId))

    expect(filteredCards).toHaveLength(2)
    expect(filteredCards.map(card => card.pageId)).toEqual(['tasks', 'payments'])
  })

  it('filters dashboard sections based on enabled pages', () => {
    const enabledPageIds = new Set(['tasks'])
    const filteredSections = appConfig.dashboardSections.filter(section =>
      section.enabled && enabledPageIds.has(section.pageId)
    )

    expect(filteredSections).toHaveLength(1)
    expect(filteredSections[0].pageId).toBe('tasks')
    expect(filteredSections[0].title).toBe('Priority Tasks')
  })

  it('shows all elements when tasks page is enabled', () => {
    const enabledPageIds = new Set(['tasks', 'discussions', 'documents', 'payments'])

    const visibleCards = appConfig.dashboardCards.filter(card => enabledPageIds.has(card.pageId))
    const visibleSections = appConfig.dashboardSections.filter(section =>
      section.enabled && enabledPageIds.has(section.pageId)
    )

    expect(visibleCards.map(card => card.pageId)).toContain('tasks')
    expect(visibleSections.map(section => section.pageId)).toContain('tasks')
  })

  it('hides tasks elements when tasks page is disabled', () => {
    const enabledPageIds = new Set(['discussions', 'documents', 'payments']) // No tasks

    const visibleCards = appConfig.dashboardCards.filter(card => enabledPageIds.has(card.pageId))
    const visibleSections = appConfig.dashboardSections.filter(section =>
      section.enabled && enabledPageIds.has(section.pageId)
    )

    expect(visibleCards.map(card => card.pageId)).not.toContain('tasks')
    expect(visibleSections.map(section => section.pageId)).not.toContain('tasks')
  })

  it('has correct pageId mappings in configuration', () => {
    // Verify dashboard cards have correct pageId references
    const tasksCard = appConfig.dashboardCards.find(card => card.dataSource === 'todoItems')
    const discussionsCard = appConfig.dashboardCards.find(card => card.dataSource === 'discussions')

    expect(tasksCard?.pageId).toBe('tasks')
    expect(discussionsCard?.pageId).toBe('discussions')

    // Verify dashboard sections have correct pageId references
    const priorityTasksSection = appConfig.dashboardSections.find(section => section.dataSource === 'todoItems')
    const discussionsSection = appConfig.dashboardSections.find(section => section.dataSource === 'discussions')

    expect(priorityTasksSection?.pageId).toBe('tasks')
    expect(discussionsSection?.pageId).toBe('discussions')
  })
})