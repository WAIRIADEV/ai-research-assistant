import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownMessage = ({ content, isUser }) => {
  if (isUser) {
    return (
      <div className="max-w-3xl rounded-lg px-4 py-3 bg-blue-600 text-white">
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl rounded-lg px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-100">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: '0.5rem 0', borderRadius: '0.375rem' }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code 
                  style={{
                    backgroundColor: 'rgba(156, 163, 175, 0.2)',
                    padding: '0.125rem 0.25rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem'
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            h1: ({ children }) => (
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1rem', marginBottom: '0.5rem' }}>
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
                {children}
              </h3>
            ),
            ul: ({ children }) => (
              <ul style={{ listStyleType: 'disc', listStylePosition: 'inside', margin: '0.5rem 0', lineHeight: '1.5' }}>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol style={{ listStyleType: 'decimal', listStylePosition: 'inside', margin: '0.5rem 0', lineHeight: '1.5' }}>
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li style={{ marginLeft: '1rem' }}>{children}</li>
            ),
            p: ({ children }) => (
              <p style={{ margin: '0.5rem 0', lineHeight: '1.625' }}>{children}</p>
            ),
            blockquote: ({ children }) => (
              <blockquote 
                style={{
                  borderLeft: '4px solid #3b82f6',
                  paddingLeft: '1rem',
                  fontStyle: 'italic',
                  margin: '0.5rem 0'
                }}
              >
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
                <table style={{ minWidth: '100%', border: '1px solid #d1d5db' }}>
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th 
                style={{
                  border: '1px solid #d1d5db',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  fontWeight: '600'
                }}
              >
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td 
                style={{
                  border: '1px solid #d1d5db',
                  padding: '0.5rem 1rem'
                }}
              >
                {children}
              </td>
            ),
            strong: ({ children }) => (
              <strong style={{ fontWeight: '700' }}>{children}</strong>
            ),
            em: ({ children }) => (
              <em style={{ fontStyle: 'italic' }}>{children}</em>
            ),
            a: ({ href, children }) => (
              <a 
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3b82f6', textDecoration: 'underline' }}
              >
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownMessage;