import vscode = require('vscode');
import os = require('os');

export function getHost(): string { 
    return vscode.workspace.getConfiguration().get('jardis.host')!!;
}

export function getPort(): number {
    return vscode.workspace.getConfiguration().get('jardis.port')!!;
}
export function getEnv(): string {
    return vscode.workspace.getConfiguration().get('jardis.env')!!;
}

export function getUser(): string { 
    return vscode.workspace.getConfiguration().get('jardis.user')!!;
}

export function getPassword(): string { 
    return vscode.workspace.getConfiguration().get('jardis.password')!!;
}

export function getOsUser(): string {
    return "you-dont-must-fuck-me:" + os.userInfo().username;
}

export function getWorkspaceFolders(): string {
    if (vscode.workspace.workspaceFolders) {
        return vscode.workspace.workspaceFolders.map((folder) => {
            return folder.uri.toString();
        }).join(",");
    } else {
        return "";
    }
}

export function isEnableBackgroundIndexing(): boolean {
    return vscode.workspace.getConfiguration().get('jardis.enableBackgroundIndexing')!!;
}

export function getBackgroundIndexingFilePattern(): string {
    return vscode.workspace.getConfiguration().get('jardis.backgroundIndexingFilePattern')!!;
}

export function isCheckSyntaxOfProgramsIncludingCopyOnCopyChanged(): boolean {
    return vscode.workspace.getConfiguration().get('jardis.checkSyntaxOfProgramsIncludingCopyOnCopyChanged')!!;
}

export function validate() : boolean {
    if (getHost() === '') {
        vscode.window.showErrorMessage(
            "Prop: jardis.host is mandatory", 
            { modal : true}, 
            "Set"
        ).then((value) => {
            if (value === "Set") {
                vscode.commands.executeCommand('workbench.action.openSettings', 'jardis.host');
            }
        });
        return false;
    } else {
        return true;
    }
}