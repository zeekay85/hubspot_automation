export function downloadMarkdown(filename: string, markdown: string) {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = ensureExtension(filename, 'md');
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadPdf(filename: string, title: string, body: string) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');

  if (!printWindow) {
    throw new Error('Pop-up blocked. Allow pop-ups to export PDF.');
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>${escapeHtml(filename)}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #172033; line-height: 1.55; padding: 32px; }
          h1 { font-size: 24px; margin-bottom: 18px; }
          pre { white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 13px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <pre>${escapeHtml(body)}</pre>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export function toMarkdown(title: string, body: string) {
  return `# ${title}\n\n${body
    .split('\n\n')
    .map((section) => {
      const [heading, ...rest] = section.split('\n');
      return `## ${heading}\n${rest.join('\n')}`;
    })
    .join('\n\n')}\n`;
}

function ensureExtension(filename: string, extension: string) {
  return filename.toLowerCase().endsWith(`.${extension}`) ? filename : `${filename}.${extension}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
