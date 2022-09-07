export type ConsoleMethod = 'info' | 'log' | 'warn' | 'error';

export interface ConsoleItem {
	method: ConsoleMethod;
	args: any[];
	/**
	 * Used to group messages together when it's:
	 * - was called with the same method
	 * - a primitive value
	 * - only 1 arg
	 */
	count: number;
}
