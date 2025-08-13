import { useState, useEffect } from 'preact/hooks';
import { fetchOrganizationRepos } from '../lib/github.js';
import { usePrerenderData } from '../lib/prerender-data.jsx';

const compare = (a, b) => (a.stargazers_count < b.stargazers_count ? 1 : -1);
export const prepare = repos => repos.sort(compare).slice(0, 5);

export default function GitHubRepos({ org }) {
	const { preactOrgRepos } = usePrerenderData();
	const [items, setItems] = useState(preactOrgRepos);

	useEffect(() => {
		fetchOrganizationRepos(org).then(repos => setItems(prepare(repos)));
	}, []);

	return (
		<div>
			{/* We use a <p> here (roughly) styled as an <h1> here to not disrupt the heading order on the home page */}
			<p class="repo-list-header">Preact Repositories</p>
			<div>
				{items.map(result => (
					<Result {...result} />
				))}
			</div>
		</div>
	);
}

function Result(result) {
	return (
		<div class="repo-list-item">
			<div>
				<a href={result.html_url} target="_blank" rel="noopener noreferrer">
					{result.full_name}
				</a>
				{' - '}
				<strong>⭐️{result.stargazers_count.toLocaleString()}</strong>
			</div>
			<p>{result.description}</p>
		</div>
	);
}
