import jsPDF from 'jspdf';

export const exportToPDF = (messages, projectTitle = 'Research Project') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Title
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text(projectTitle, margin, yPosition);
  yPosition += 15;

  // Date
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 15;

  // Content
  doc.setFontSize(12);
  
  messages.forEach((msg, idx) => {
    if (yPosition > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }

    if (msg.role === 'user') {
      doc.setFont(undefined, 'bold');
      doc.text(`Q${Math.floor(idx / 2) + 1}: `, margin, yPosition);
      doc.setFont(undefined, 'normal');
      
      const lines = doc.splitTextToSize(msg.content, maxWidth - 10);
      doc.text(lines, margin + 10, yPosition);
      yPosition += lines.length * 7 + 5;
    } else {
      doc.setFont(undefined, 'normal');
      const lines = doc.splitTextToSize(msg.content, maxWidth);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 7 + 10;
    }
  });

  doc.save(`${projectTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`);
};