import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  filename?: string;
  title?: string;
  includeDate?: boolean;
  quality?: number;
}

/**
 * Export a DOM element to PDF
 * @param element - The HTML element to export
 * @param options - Export options
 */
export async function exportElementToPDF(
  element: HTMLElement,
  options: PDFExportOptions = {}
): Promise<void> {
  const {
    filename = 'dashboard-report.pdf',
    title = 'Dashboard Report',
    includeDate = true,
    quality = 2,
  } = options;

  try {
    // Capture the element as a canvas with high quality
    const canvas = await html2canvas(element, {
      scale: quality,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Calculate PDF dimensions (A4 size)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate image dimensions to fit PDF
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30; // Leave space for header

    // Add header
    pdf.setFontSize(20);
    pdf.setTextColor(49, 46, 129); // Primary color
    pdf.text(title, pdfWidth / 2, 15, { align: 'center' });

    if (includeDate) {
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128); // Gray color
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
      pdf.text(
        `Generated on ${date}`,
        pdfWidth / 2,
        22,
        { align: 'center' }
      );
    }

    // Add canvas as image
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(
      imgData,
      'PNG',
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio
    );

    // Add footer
    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175); // Light gray
    pdf.text(
      'Powered by React Web App Scaffold',
      pdfWidth / 2,
      pdfHeight - 10,
      { align: 'center' }
    );

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

/**
 * Export dashboard with charts to PDF
 * @param dashboardElement - The dashboard element containing charts
 * @param options - Export options
 */
export async function exportDashboardToPDF(
  dashboardElement: HTMLElement | null,
  options: PDFExportOptions = {}
): Promise<void> {
  if (!dashboardElement) {
    throw new Error('Dashboard element not found');
  }

  return exportElementToPDF(dashboardElement, {
    filename: 'dashboard-report.pdf',
    title: 'Dashboard Report',
    ...options,
  });
}

/**
 * Export data table to PDF
 * @param tableElement - The table element
 * @param options - Export options
 */
export async function exportTableToPDF(
  tableElement: HTMLElement | null,
  options: PDFExportOptions = {}
): Promise<void> {
  if (!tableElement) {
    throw new Error('Table element not found');
  }

  return exportElementToPDF(tableElement, {
    filename: 'table-export.pdf',
    title: 'Table Data',
    ...options,
  });
}
