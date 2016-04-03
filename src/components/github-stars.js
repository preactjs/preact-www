import { h } from 'preact';

const EMBED = 'https://ghbtns.com/github-btn.html';

const p = encodeURIComponent;

export default ({ user, repo, large=false, type='star', count=true, ...props }) => (
	<iframe
		src={`${EMBED}?user=${p(user)}&repo=${p(repo)}&type=${p(type)}${count?'&count=true':''}${large?'&size=large':''}`}
		frameborder="0"
		scrolling="0"
		style="vertical-align:sub;"
		width="110px"
		height={`${large ? 30 : 20}px`}
		{...props}
	/>
);
