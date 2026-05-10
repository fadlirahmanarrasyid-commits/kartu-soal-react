import React, { useMemo } from 'react';
import katex from 'katex';

/**
 * Component to render text (or HTML) containing LaTeX math formulas.
 * Supports inline math with $ ... $ and display math with $$ ... $$.
 * Designed to work with both plain text and TinyMCE HTML output.
 */
const MathText = ({ text, style }) => {
  const renderedHTML = useMemo(() => {
    if (!text) return '';
    
    // 1. First, handle display math $$ ... $$
    // We use a temporary placeholder or direct replacement
    let processed = text.replace(/\$\$(.*?)\$\$/gs, (match, formula) => {
      try {
        return `<div class="math-display" style="margin: 12px 0; overflow-x: auto; overflow-y: hidden;">${katex.renderToString(formula, { displayMode: true, throwOnError: false })}</div>`;
      } catch (e) {
        return `<span class="math-error">${match}</span>`;
      }
    });

    // 2. Then, handle inline math $ ... $
    processed = processed.replace(/\$(.*?)\$/gs, (match, formula) => {
      try {
        return `<span class="math-inline" style="white-space: nowrap;">${katex.renderToString(formula, { displayMode: false, throwOnError: false })}</span>`;
      } catch (e) {
        return `<span class="math-error">${match}</span>`;
      }
    });

    return processed;
  }, [text]);

  // Use dangerouslySetInnerHTML to support HTML from TinyMCE and the rendered KaTeX
  return (
    <div 
      className="math-text-container"
      style={{ 
        whiteSpace: 'pre-wrap', 
        lineHeight: '1.6',
        ...style 
      }} 
      dangerouslySetInnerHTML={{ __html: renderedHTML }} 
    />
  );
};

export default MathText;
