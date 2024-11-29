import * as vscode from 'vscode';
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
import '@codingame/monaco-vscode-python-default-extension';
import { LogLevel } from 'vscode/services';
// import { MonacoLanguageClient } from 'monaco-languageclient';
// import { createUrl } from 'monaco-languageclient/tools';
import { toSocket, WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc';
// import { configureMonacoWorkers } from './common/utils.js';
import { createUrl } from './common/tool.js';

export function createUserConfig(workspaceRoot, code, codeUri) {
    const url = createUrl({
        secured: false,
        host: 'localhost',
        port: 30001,
        path: 'pyright',
        extraParams: {
            authorization: 'UserAuth'
        }
    });
    const webSocket = new WebSocket(url);
    const iWebSocket = toSocket(webSocket);
    const reader = new WebSocketMessageReader(iWebSocket);
    const writer = new WebSocketMessageWriter(iWebSocket);

    return {
        $type: 'extended',
        htmlContainer: document.getElementById('monaco-editor-root'),
        logLevel: LogLevel.Debug,
        languageClientConfigs: {
            python: {
                name: 'Python Language Server Example',
                connection: {
                    options: {
                        $type: 'WebSocketDirect',
                        webSocket: webSocket,
                        startOptions: {
                            onCall: function (languageClient) {
                                setTimeout(function () {
                                    ['pyright.restartserver', 'pyright.organizeimports'].forEach(function (cmdName) {
                                        vscode.commands.registerCommand(cmdName, function (...args) {
                                            if (languageClient) {
                                                languageClient.sendRequest('workspace/executeCommand', { command: cmdName, arguments: args });
                                            }
                                        });
                                    });
                                }, 250);
                            },
                            reportStatus: true,
                        }
                    },
                    messageTransports: { reader, writer }
                },
                clientOptions: {
                    documentSelector: ['python'],
                    workspaceFolder: {
                        index: 0,
                        name: 'workspace',
                        uri: vscode.Uri.parse(workspaceRoot)
                    },
                }
            }
        },
        vscodeApiConfig: {
            serviceOverrides: {
                ...getKeybindingsServiceOverride()
            },
            userConfiguration: {
                json: JSON.stringify({
                    'workbench.colorTheme': 'Default Dark Modern',
                    'editor.guides.bracketPairsHorizontal': 'active',
                    'editor.wordBasedSuggestions': 'off',
                    'editor.experimental.asyncTokenization': true
                })
            }
        },
        editorAppConfig: {
            codeResources: {
                main: {
                    text: code,
                    uri: codeUri
                }
            },
            // monacoWorkerFactory: configureMonacoWorkers
        }
    };
}
