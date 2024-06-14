// A code snippet editor for devicescript
import React, { useEffect, useState } from 'react';
import Wrapper from "@theme/Layout";
import CodeEditor from "../components/codeEditor";
import { useDevsStore } from '../store/devsStore';
import {JDConnection} from '../components/DevsDownload';
import { Button } from 'antd';

const DevsEditor = () => {
  const [code, setCode] = useState('// Write your code here')
  const {
    compileWithHost
  } = useDevsStore()

  const handleCompile = async () => {
    const ret = await compileWithHost(code)
    console.log('Compiling code', ret)
  }

  return (
    <Wrapper title="Skill Builder">
      <JDConnection />
      <CodeEditor
        code={code}
        onChange={c => setCode(c)}
      />
      <Button onClick={handleCompile}>Compile</Button>
    </Wrapper>
  );



}

export default DevsEditor;
