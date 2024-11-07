import { Component } from 'preact';
import { injectedPrerenderData, repoInfo } from '../lib/github';

const githubStars = repo =>
	repoInfo(repo).then(d => d.stargazers_count);

const formatNumber = num => (num + '').replace(/(\d{3})$/g, ',$1');

// make available to homepage REPL demo
if (typeof window !== 'undefined') window.githubStars = githubStars;

export default class GithubStars extends Component {
	state = {
		stars: globalThis.prerenderPreactStargazers || injectedPrerenderData.preactStargazers()
	};

	setStars = stars => {
		if (stars && stars != this.state.stars) {
			this.setState({ stars });
		}
	};

	componentDidMount() {
		let { user, repo } = this.props;
		githubStars(user + '/' + repo).then(this.setStars);
	}

	render({ user, repo, simple, children }, { stars }) {
		let url = `https://github.com/${user}/${repo}/`;
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
}
