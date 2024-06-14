import React, { useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import styles from './styles.module.css';


const CodeEditor = ({code, onChange}) => {
  return (
    <div className='editorContainer'>
      <Editor
        className={`${styles.editor}`}
        value={code}
        lang='ts'
        onValueChange={code => {
          onChange(code)
        }}
        highlight={code => highlight(code, languages.typescript)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
        }}
      />

    </div>
  );
};

export default CodeEditor;
