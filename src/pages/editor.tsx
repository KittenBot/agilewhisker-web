// A code snippet editor for devicescript
import React, { useEffect, useState } from 'react';
import Wrapper from "@theme/Layout";
import CodeEditor from "../components/codeEditor";

const DevsEditor = () => {
  const [code, setCode] = useState('// Write your code here')
  const handleChanges = (code: string) => {

  }
  return (
    <Wrapper title="Skill Builder">
      <CodeEditor
        defaultCode={code}
        onChange={handleChanges}
      />
    </Wrapper>
  );



}

export default DevsEditor;
