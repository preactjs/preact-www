import { h, Component } from 'preact';
import { memoize } from 'decko';
import { localStorageGet, localStorageSet } from '../lib/localstorage';

const githubStars = memoize( repo => fetch('//api.github.com/repos/'+repo)
	.then( r => r.json() )
	.then( d => d.stargazers || d.watchers )
);

// make available to homepage REPL demo
if (typeof window!=='undefined') window.githubStars = githubStars;

export default class GithubStars extends Component {
	state = {
		stars: localStorageGet('_stars') || ''
	};

	setStars = stars => {
		if (stars && stars!=this.state.stars) {
			localStorageSet('_stars', stars);
			this.setState({ stars });
		}
	};

	componentDidMount() {
		let { user, repo } = this.props;
		githubStars(user+'/'+repo).then(this.setStars);
	}

	render({ user, repo, simple, children }, { stars }) {
		let url = `https://github.com/${user}/${repo}/`;
		if (simple) return (
			<a href={url} class="stars" target="_blank" rel="noopener">⭐️ {stars} Stars</a>
		);
		return (
			<span class="github-btn">
				<a class="gh-btn" href={url} target="_blank" rel="noopener" aria-label="Star on GitHub">
					<span class="gh-ico" /> Star
				</a>
				<a class="gh-count" href={url} target="_blank" rel="noopener">
					{stars ? Math.round(stars).toLocaleString() : children || '..'}
				</a>
			</span>
		);
	}
}
