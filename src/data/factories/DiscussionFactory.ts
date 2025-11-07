import { BaseEntityFactory } from './BaseEntityFactory'
import type { Discussion, Reply } from '../../types/portal'
import { nowISO, daysAgoISO } from '../../utils/demoDateHelpers'

/**
 * Factory for creating Discussion test data.
 */
export class DiscussionFactory extends BaseEntityFactory<Discussion> {
  private titles = [
    'Project kickoff meeting',
    'Budget approval discussion',
    'Technical implementation question',
    'Design feedback needed',
    'Timeline concerns',
    'Resource allocation',
    'Client requirements clarification',
    'Sprint planning notes',
    'Bug fix priority',
    'Feature request review'
  ]

  private authors = [
    { name: 'John Doe', role: 'Project Manager' },
    { name: 'Jane Smith', role: 'Developer' },
    { name: 'Bob Johnson', role: 'Designer' },
    { name: 'Alice Williams', role: 'QA Engineer' },
    { name: 'Charlie Brown', role: 'Product Owner' }
  ]

  private contentTemplates = [
    'I wanted to discuss the upcoming changes to the project timeline.',
    'We need to review the requirements before proceeding.',
    'There are some concerns about the current implementation.',
    'Can we schedule a meeting to address these issues?',
    'I have some suggestions for improving the workflow.',
    'The client has provided feedback on the latest prototype.',
    'We should consider alternative approaches to this problem.',
    'I noticed some inconsistencies in the documentation.',
    'What are your thoughts on the proposed solution?',
    'We need to prioritize this before the next sprint.'
  ]

  create(overrides?: Partial<Discussion>): Discussion {
    const author = this.getRandomAuthor()

    return {
      id: overrides?.id || this.generateId(),
      title: overrides?.title || this.getRandomTitle(),
      author: overrides?.author || author.name,
      authorRole: overrides?.authorRole || author.role,
      content: overrides?.content || this.getRandomContent(),
      createdAt: overrides?.createdAt || nowISO(), // Dynamic: current timestamp
      replies: overrides?.replies || [],
      priority: overrides?.priority || 'normal',
      resolved: overrides?.resolved ?? false,
      ...overrides
    }
  }

  protected getPrefix(): string {
    return 'disc'
  }

  createVariant(index: number, overrides?: Partial<Discussion>): Discussion {
    const priority: Discussion['priority'] = index % 2 === 0 ? 'normal' : 'urgent'
    const resolved = index % 3 === 0
    const author = this.authors[index % this.authors.length]

    return this.create({
      priority,
      resolved,
      author: author.name,
      authorRole: author.role,
      ...overrides
    })
  }

  /**
   * Creates a discussion with replies
   */
  createWithReplies(replyCount: number, overrides?: Partial<Discussion>): Discussion {
    const replies: Reply[] = Array.from({ length: replyCount }, (_, i) => {
      const author = this.authors[i % this.authors.length]
      // Use daysAgoISO to create replies in the past, with each reply 1 hour apart
      const hoursAgo = replyCount - i // Most recent reply is newest
      return {
        id: `reply-${Date.now()}-${i}`,
        author: author.name,
        authorRole: author.role,
        content: `Reply ${i + 1}: ${this.getRandomContent()}`,
        createdAt: daysAgoISO(0, hoursAgo, 0) // Dynamic: hours ago from today
      }
    })

    return this.create({
      replies,
      ...overrides
    })
  }

  /**
   * Creates an urgent discussion
   */
  createUrgent(overrides?: Partial<Discussion>): Discussion {
    return this.create({
      priority: 'urgent',
      ...overrides
    })
  }

  /**
   * Creates a resolved discussion
   */
  createResolved(overrides?: Partial<Discussion>): Discussion {
    return this.create({
      resolved: true,
      ...overrides
    })
  }

  private getRandomTitle(): string {
    return this.titles[Math.floor(Math.random() * this.titles.length)]
  }

  private getRandomContent(): string {
    return this.contentTemplates[Math.floor(Math.random() * this.contentTemplates.length)]
  }

  private getRandomAuthor() {
    return this.authors[Math.floor(Math.random() * this.authors.length)]
  }
}

/**
 * Singleton instance for convenient usage throughout the app
 */
export const discussionFactory = new DiscussionFactory()
