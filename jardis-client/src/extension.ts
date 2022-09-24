/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import vscode = require('vscode');
import { LanguageClient } from 'vscode-languageclient/node';
import { activateDebug } from './debugAdapter';
import { createLanguageClient } from './languageClient';
import * as config from './config';
import { JardisSession } from './model';

let languageClient: LanguageClient;
let debugActivated: boolean;
let languageClientActivated: boolean;


export function activate(context: vscode.ExtensionContext) {
	connect(context);
	context.subscriptions.push(vscode.commands.registerCommand('jardis.connect', () => {
		if (!languageClientActivated) {
			connect(context);
		}
	}));
	context.subscriptions.push(vscode.commands.registerCommand('jardis.configuration', () => {
		vscode.commands.executeCommand( 'workbench.action.openSettings', 'jardis');
	}));
	context.subscriptions.push(vscode.commands.registerCommand('jardis.osUser', () => {
		return config.getOsUser();
	}));
	context.subscriptions.push(vscode.commands.registerCommand('jardis.workspaceFolders', () => {
		return config.getWorkspaceFolders();
	}));
}

function connect(context: vscode.ExtensionContext) {
	if (config.validate()) {

		const jardisSession: JardisSession = {
			env: config.getEnv(),
			user: config.getUser(),
			password: config.getPassword(),
			osUser: config.getOsUser(),
			enableBackgroundIndexing: config.isEnableBackgroundIndexing(),
			backgroundIndexingFilePattern: config.getBackgroundIndexingFilePattern(),
			checkSyntaxOfProgramsIncludingCopyOnCopyChanged: config.isCheckSyntaxOfProgramsIncludingCopyOnCopyChanged()
		};

		const connectionInfo = {
			port: config.getPort(),
			host: config.getHost()
		};

		// Start lsp client only if client is not yet created
		if (!languageClientActivated) {
			languageClient = createLanguageClient(
				connectionInfo,
				jardisSession,
				() => {
					languageClientActivated = true;
					if (!debugActivated) {
						activateDebug(context, connectionInfo);
						debugActivated = true;
					}
					vscode.window.showInformationMessage("Jardis connected");
				},
				(error) => {
					if (languageClientActivated) {
						vscode.window.showErrorMessage("Jardis connection lost: " + error, { modal: true });
					} else {
						vscode.window.showErrorMessage("Jardis connection failed: " + error, { modal: true });
					}
					languageClientActivated = false;
	
				},
			);
			languageClient.start();
		}

	}

}

function disconnect(): Thenable<void> | undefined {
	if (!languageClient) {
		return undefined;
	}
	languageClientActivated = false;
	return languageClient.stop();
}


export function deactivate(): Thenable<void> | undefined {
	return disconnect();
}
