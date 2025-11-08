import { BaseEntityFactory } from './BaseEntityFactory'
import type { Document } from '../../types/portal'

/**
 * Factory for creating Document test data.
 */
export class DocumentFactory extends BaseEntityFactory<Document> {
  private fileTypes = ['PDF', 'DOCX', 'XLSX', 'PNG', 'JPG', 'TXT']
  private fileSizes = ['124 KB', '2.3 MB', '456 KB', '1.8 MB', '89 KB', '3.2 MB']
  private fileNames = [
    'Project Proposal',
    'Meeting Notes',
    'Budget Report',
    'User Guide',
    'Design Mockup',
    'Technical Specification',
    'Contract Agreement',
    'Invoice',
    'Presentation Slides',
    'Data Analysis'
  ]

  create(overrides?: Partial<Document>): Document {
    const type = overrides?.type || this.getRandomFileType()

    return {
      id: overrides?.id || this.generateId(),
      name: overrides?.name || `${this.getRandomFileName()}.${type.toLowerCase()}`,
      type,
      url: overrides?.url || `/files/sample-${this.generateId()}.${type.toLowerCase()}`,
      uploadedBy: overrides?.uploadedBy || 'user@example.com',
      uploadedAt: overrides?.uploadedAt || this.now(), // Dynamic: current timestamp
      size: overrides?.size || this.getRandomFileSize(),
      shared: overrides?.shared ?? false,
      ...overrides
    }
  }

  protected getPrefix(): string {
    return 'doc'
  }

  createVariant(index: number, overrides?: Partial<Document>): Document {
    const type = this.fileTypes[index % this.fileTypes.length]
    const name = `${this.fileNames[index % this.fileNames.length]}.${type.toLowerCase()}`
    const shared = index % 2 === 0

    return this.create({
      type,
      name,
      shared,
      ...overrides
    })
  }

  /**
   * Creates a shared document
   */
  createShared(overrides?: Partial<Document>): Document {
    return this.create({
      shared: true,
      ...overrides
    })
  }

  /**
   * Creates a PDF document
   */
  createPDF(overrides?: Partial<Document>): Document {
    return this.create({
      type: 'PDF',
      name: overrides?.name || `Document.pdf`,
      ...overrides
    })
  }

  private getRandomFileType(): string {
    return this.fileTypes[Math.floor(Math.random() * this.fileTypes.length)]
  }

  private getRandomFileSize(): string {
    return this.fileSizes[Math.floor(Math.random() * this.fileSizes.length)]
  }

  private getRandomFileName(): string {
    return this.fileNames[Math.floor(Math.random() * this.fileNames.length)]
  }
}

/**
 * Singleton instance for convenient usage throughout the app
 */
export const documentFactory = new DocumentFactory()
