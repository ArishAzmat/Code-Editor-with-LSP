// import { Uri } from 'vscode';
import { useWorkerFactory } from 'monaco-editor-wrapper/workerFactory';
import { RegisteredMemoryFile } from '@codingame/monaco-vscode-files-service-override';

export function disableButton(id, disabled) {
    const button = document.getElementById(id);
    if (button !== null) {
        button.disabled = disabled;
    }
}

export function configureMonacoWorkers(logger) {
    useWorkerFactory({
        workerOverrides: {
            ignoreMapping: true,
            workerLoaders: {
                TextEditorWorker: () => new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), { type: 'module' }),
                TextMateWorker: () => new Worker(new URL('@codingame/monaco-vscode-textmate-service-override/worker', import.meta.url), { type: 'module' })
            }
        },
        logger
    });
}

export function createDefaultWorkspaceFile(workspaceFile, workspacePath) {
    return new RegisteredMemoryFile(
        workspaceFile,
        JSON.stringify(
            {
                folders: [
                    {
                        path: workspacePath
                    }
                ]
            },
            null,
            2
        )
    );
}
