import { useState, useEffect } from 'preact/hooks';

const compare = (a, b) => (a.stargazers_count < b.stargazers_count ? 1 : -1);

export default function GitHubRepos({ org }) {
	const [items, setItems] = useState([]);

	useEffect(() => {
		fetch(`https://api.github.com/orgs/${org}/repos?per_page=50`)
			.then(res => res.json())
			.then(repos => setItems(repos.sort(compare).slice(0, 5)));
	}, []);

	return (
		<div>
			<h1 class="repo-list-header">Preact Repositories</h1>
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
