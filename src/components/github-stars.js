import { h, Component } from 'preact';
import { memoize } from 'decko';
import { localStorageGet, localStorageSet } from '../lib/localstorage';
import { checkStatus } from '../lib/request';

const githubStars = memoize(repo =>
	fetch('https://api.github.com/repos/' + repo)
		.then(checkStatus)
		.then(r => r.json())
		.then(d => d.stargazers || d.watchers)
		.catch(() => 'unknown')
);

// make available to homepage REPL demo
if (typeof window !== 'undefined') window.githubStars = githubStars;

export default class GithubStars extends Component {
	state = {
		stars: localStorageGet('_stars') || ''
	};

	setStars = stars => {
		if (stars && stars != this.state.stars) {
			localStorageSet('_stars', stars);
			this.setState({ stars });
		}
	};

	componentDidMount() {
		let { user, repo } = this.props;
		githubStars(user + '/' + repo).then(this.setStars);
	}

	render({ user, repo, simple, children }, { stars }) {
		let url = `https://github.com/${user}/${repo}/`;
		if (simple)
			return (
				<a href={url} class="stars" target="_blank" rel="noopener noreferrer">
					⭐️ {stars} Stars
				</a>
			);
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
					{stars ? Math.round(stars).toLocaleString() : children || '..'}
				</a>
			</span>
		);
	}
}
