import { createContext } from 'preact';
import { useState } from 'preact/hooks';

/**
 * @typedef SolutionContext
 * @property {boolean} solved
 * @property {(solved: boolean) => void} setSolved
 */

/**
 * @type {import('preact').Context<SolutionContext>}
 */
export const SolutionContext = createContext(
	/** @type {SolutionContext} */ ({})
);

/**
 * @param {object} props
 * @param {import('preact').ComponentChildren} props.children
 */
export function SolutionProvider({ children }) {
	const [solved, setSolved] = useState(false);

	return (
		<SolutionContext.Provider value={{ solved, setSolved }}>
			{children}
		</SolutionContext.Provider>
	);
}

export const TutorialContext = createContext(null);
