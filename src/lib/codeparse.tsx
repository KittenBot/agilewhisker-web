import React from "react";

export const parseColoredText = (text) => {
    const regex = /\x1b\[(\d+)m/g;
    const parts = [];
    let lastIndex = 0;
    let match;
  
    const colorMap = {
      90: '#6D6D6D', // bright black
      91: '#FF5555', // bright red
      93: '#F1FA8C', // bright yellow
      96: '#8BE9FD', // bright cyan
    };
  
    while ((match = regex.exec(text)) !== null) {
      const colorCode = match[1];
      const color = colorMap[colorCode] || '#000';
  
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
  
      lastIndex = regex.lastIndex;
      const nextMatch = regex.exec(text);
      const endIndex = nextMatch ? nextMatch.index : text.length;
  
      parts.push(
        <span style={{ color }} key={lastIndex}>
          {text.slice(lastIndex, endIndex)}
        </span>
      );
  
      lastIndex = endIndex;
      regex.lastIndex = endIndex;
    }
  
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
  
    return parts;
  };
  