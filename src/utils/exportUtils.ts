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
          @page { margin: 0.65in; }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            color: #172033;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            line-height: 1.55;
            background: #ffffff;
          }
          .document {
            max-width: 820px;
            margin: 0 auto;
            padding: 36px;
          }
          .brand {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            border-bottom: 1px solid #dbe4f0;
            padding-bottom: 18px;
            margin-bottom: 28px;
          }
          .brand-mark {
            display: inline-flex;
            height: 38px;
            width: 38px;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            background: #2563eb;
            color: #ffffff;
            font-weight: 800;
          }
          .brand-title {
            margin: 0;
            color: #2563eb;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }
          .brand-subtitle {
            margin: 4px 0 0;
            color: #64748b;
            font-size: 12px;
          }
          h1 {
            margin: 0 0 22px;
            font-size: 28px;
            line-height: 1.18;
            letter-spacing: -0.01em;
          }
          section {
            break-inside: avoid;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 18px;
            margin: 14px 0;
          }
          h2 {
            margin: 0 0 10px;
            color: #334155;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }
          p, li {
            color: #334155;
            font-size: 13px;
          }
          p { margin: 8px 0 0; }
          ul { margin: 10px 0 0; padding-left: 18px; }
          li { margin: 5px 0; }
          .meta {
            color: #64748b;
            font-size: 11px;
          }
          @media print {
            .document { padding: 0; }
            section { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <main class="document">
          <header class="brand">
            <div style="display:flex;align-items:center;gap:12px;">
              <div class="brand-mark">M</div>
              <div>
                <p class="brand-title">Marketing Ops Hub</p>
                <p class="brand-subtitle">Operational Insights Powered by AI</p>
              </div>
            </div>
            <p class="meta">${escapeHtml(new Date().toLocaleString())}</p>
          </header>
          <h1>${escapeHtml(title)}</h1>
          ${bodyToSectionHtml(body)}
        </main>
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
    .filter(Boolean)
    .map((section) => {
      const [heading, ...rest] = section.split('\n');
      return `## ${heading}\n${rest.join('\n')}`;
    })
    .join('\n\n')}\n`;
}

function bodyToSectionHtml(body: string) {
  return body
    .split('\n\n')
    .filter(Boolean)
    .map((section) => {
      const [heading, ...lines] = section.split('\n').filter(Boolean);
      const bullets = lines.filter((line) => line.trim().startsWith('- '));
      const paragraphs = lines.filter((line) => !line.trim().startsWith('- '));

      return `
        <section>
          <h2>${escapeHtml(heading)}</h2>
          ${paragraphs.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}
          ${
            bullets.length
              ? `<ul>${bullets
                  .map((line) => `<li>${escapeHtml(line.replace(/^- /, ''))}</li>`)
                  .join('')}</ul>`
              : ''
          }
        </section>
      `;
    })
    .join('');
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
