// A code snippet editor for devicescript
import React, { useEffect, useState } from 'react';
import Wrapper from "@theme/Layout";
import CodeEditor from "../components/CodeEditor";
import {JDConnection} from '../components/DevsDownload';

const DevsEditor = () => {
  const [code, setCode] = useState('// Write your code here')
  return (
    <Wrapper title="Skill Builder">
      <JDConnection />
      <CodeEditor
        code={code}
        onChange={c => setCode(c)}
      />
    </Wrapper>
  );



}

export default DevsEditor;
