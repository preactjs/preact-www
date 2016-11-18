import { h, Component } from 'preact';
import { memoize } from 'decko';

const getRepoInfo = memoize( repo => fetch('https://api.github.com/repos/'+repo).then( r => r.json() ) );

export default class GithubStars extends Component {
	state = {
		stars: localStorage._stars || ''
	};

	setStars = data => {
		let stars = data.stargazers || data.watchers;
		if (stars!=this.state.stars) {
			localStorage._stars = stars;
			this.setState({ stars });
		}
	};

	componentDidMount() {
		let { user, repo } = this.props;
		getRepoInfo(user+'/'+repo).then(this.setStars);
	}

	render({ user, repo, children }, { stars }) {
		let url = `https://github.com/${user}/${repo}/`;
		return (
			<span class="github-btn">
				<a class="gh-btn" href={url} target="_blank" aria-label="Star on GitHub">
					<span class="gh-ico" /> Star
				</a>
				{' '}
				<a class="gh-count" href={url} target="_blank">
					{stars ? Math.round(stars).toLocaleString() : children || '..'}
				</a>
			</span>
		);
	}
}
