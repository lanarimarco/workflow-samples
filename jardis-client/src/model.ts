
export interface JardisSession {
	env: string
	user: string
	password: string
	osUser: string
	enableBackgroundIndexing: boolean
	backgroundIndexingFilePattern: string,
	checkSyntaxOfProgramsIncludingCopyOnCopyChanged: boolean
}

export interface WorkspaceFolder {
	uri: string,
	name: string
}