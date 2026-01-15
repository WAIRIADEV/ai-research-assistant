export const exportToText = (messages, projectTitle = 'Research Project') => {
  const content = messages
    .filter(m => m.role === 'assistant')
    .map(m => m.content)
    .join('\n\n---\n\n');

  const fullContent = `${projectTitle}\n${'='.repeat(projectTitle.length)}\n\n${content}`;

  const blob = new Blob([fullContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectTitle.replace(/\s+/g, '-').toLowerCase()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToMarkdown = (messages, projectTitle = 'Research Project') => {
  const content = messages
    .map((m, idx) => {
      if (m.role === 'user') {
        return `### Question ${Math.floor(idx / 2) + 1}\n\n${m.content}`;
      } else {
        return `${m.content}`;
      }
    })
    .join('\n\n---\n\n');

  const fullContent = `# ${projectTitle}\n\n${content}`;

  const blob = new Blob([fullContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectTitle.replace(/\s+/g, '-').toLowerCase()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (messages) => {
  const content = messages
    .filter(m => m.role === 'assistant')
    .map(m => m.content)
    .join('\n\n---\n\n');

  try {
    await navigator.clipboard.writeText(content);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};