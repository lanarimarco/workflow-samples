import {
	LanguageClient,
	LanguageClientOptions,
	StreamInfo
} from 'vscode-languageclient/node';

import * as net from 'net';
import { window, workspace } from 'vscode';
import { JardisSession } from './model';

export function createLanguageClient(connectionInfo: net.TcpNetConnectOpts, 
    jardisSession: JardisSession, onStarted?: () => void, onError?: (error: Error) => void) : LanguageClient {
    const serverOptions = () => {
        // Connect to language server via socket
        const socket = net.connect(connectionInfo, onStarted).
        on("error", (error) => {
            onError?.call(undefined, error);
        });
        const result: StreamInfo = {
            writer: socket,
            reader: socket
        };
        return Promise.resolve(result);
    };

    const clientOptions: LanguageClientOptions = {
        // Register the server for rpgle  documents
        documentSelector: [{ scheme: 'file', language: 'rpgle' }],
        initializationOptions: { 
            user: jardisSession.user, 
            password: jardisSession.password,
            env: jardisSession.env,
            osUser: jardisSession.osUser,
            enableBackgroundIndexing: jardisSession.enableBackgroundIndexing,
            backgroundIndexingFilePattern: jardisSession.backgroundIndexingFilePattern,
            checkSyntaxOfProgramsIncludingCopyOnCopyChanged: jardisSession.checkSyntaxOfProgramsIncludingCopyOnCopyChanged
        },
        synchronize: {
            // Notify the server about file changes contained in the workspace
            // For some reason even if I register watcher server side
            // if I don't pass this property deletion event are not fired
            fileEvents: workspace.createFileSystemWatcher('**/*.rpgle')
        }
    };

    // Create the language client and start the client.
    return new LanguageClient(
        'jardis',
        'Jardis',
        serverOptions,
        clientOptions
    );

}