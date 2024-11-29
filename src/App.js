import React, { useEffect, useState } from 'react';
import { RegisteredFileSystemProvider, registerFileSystemOverlay, RegisteredMemoryFile } from '@codingame/monaco-vscode-files-service-override';
import { MonacoEditorReactComp } from '@typefox/monaco-editor-react';
import { createUserConfig } from './config.js';
import badPyCode from './static/bad.py?raw';
import * as vscode from 'vscode';

const App = () => {
  const [wrapperConfig, setWrapperConfig] = useState(null);

  useEffect(() => {
    const setupEditor = async () => {
      const badPyUri = vscode.Uri.file('/workspace/bad.py');
      const fileSystemProvider = new RegisteredFileSystemProvider(false);
      fileSystemProvider.registerFile(new RegisteredMemoryFile(badPyUri, badPyCode));
      registerFileSystemOverlay(1, fileSystemProvider);

      const config = createUserConfig('/workspace', badPyCode, '/workspace/bad.py');
      setWrapperConfig(config);
    };

    setupEditor();
  }, []);

  const onTextChanged = (textChanges) => {
    console.log(`Dirty? ${textChanges.isDirty}\ntext: ${textChanges.text}\ntextOriginal: ${textChanges.textOriginal}`);
  };

  return (
    <div style={{ height: '80vh', padding: '5px' }}>
      {wrapperConfig ? (
        <MonacoEditorReactComp
          wrapperConfig={wrapperConfig}
          style={{
            paddingTop: '5px',
            height: '80vh',
          }}
          onTextChanged={onTextChanged}
        />
      ) : (
        <p>Loading editor...</p>
      )}
    </div>
  );
};

export default App;
