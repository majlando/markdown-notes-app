import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Configure DOMPurify to allow certain elements and attributes
const purifyConfig = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'strong', 'b', 'em', 'i', 'u', 's', 'del',
    'blockquote', 'q',
    'ul', 'ol', 'li',
    'dl', 'dt', 'dd',
    'pre', 'code',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'a', 'img',
    'div', 'span',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel',
    'src', 'alt', 'title',
    'class', 'id',
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
};

export const parseMarkdown = (markdown: string): string => {
  try {
    // Parse markdown to HTML
    const rawHTML = marked.parse(markdown) as string;
    
    // Sanitize the HTML for security
    const cleanHTML = DOMPurify.sanitize(rawHTML, purifyConfig);
    
    return cleanHTML;
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return '<p>Error parsing markdown content</p>';
  }
};

// Extract title from markdown content (first heading or first line)
export const extractTitle = (content: string): string => {
  if (!content.trim()) return 'Untitled Note';
  
  // Try to find the first heading
  const headingMatch = content.match(/^#+\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }
  
  // Fall back to first non-empty line
  const firstLine = content.split('\n').find(line => line.trim());
  if (firstLine) {
    // Remove markdown formatting from the first line
    return firstLine
      .replace(/^#+\s*/, '') // Remove heading markers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
      .trim()
      .substring(0, 50) + (firstLine.length > 50 ? '...' : '');
  }
  
  return 'Untitled Note';
};

// Format date for display
export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
};
