import { useEffect, useState } from 'preact/hooks';
import { repoInfo } from '../lib/github';
import { usePrerenderData } from '../lib/prerender-data.jsx';

const githubStars = repo =>
	repoInfo(repo).then(d => d.stargazers_count);

const formatNumber = num => (num + '').replace(/(\d{3})$/g, ',$1');

// make available to homepage REPL demo
if (typeof window !== 'undefined') window.githubStars = githubStars;

export default function GitHubStars({ user, repo, simple, children }) {
	const { preactStargazers } = usePrerenderData();
	const [stars, setStars] = useState(preactStargazers);

	useEffect(() => {
		githubStars(`${user}/${repo}`).then(setStars);
	}, []);

	const url = `https://github.com/${user}/${repo}/`;
	if (simple) {
		return (
			<a href={url} class="stars" target="_blank" rel="noopener noreferrer">
				⭐️ {stars} Stars
			</a>
		);
	}

	return (
		<span class="github-btn">
			<a
				class="gh-btn"
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Star on GitHub"
			>
				<span class="gh-ico" /> Star
			</a>
			<a
				class="gh-count"
				href={url}
				target="_blank"
				rel="noopener noreferrer"
			>
				{stars ? formatNumber(Math.round(stars)) : children || '..'}
			</a>
		</span>
	);
}
