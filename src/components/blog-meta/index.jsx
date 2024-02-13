import { Time } from '../time';
import config from '../../config.json';
import style from './style.module.css';

export default function BlogMeta({ meta }) {
	return (
		<div class={style.blogMeta}>
			{meta.date && <Time value={meta.date} />}
			{Array.isArray(meta.authors) && meta.authors.length > 0 && (
				<>
					, written by{' '}
					<address class={style.authors}>
						{meta.authors.map((author, i, arr) => {
							const authorData = config.blogAuthors.find(
								data => data.name === author
							);
							return (
								<AuthorLinks
									authorData={authorData}
									author={author}
									i={i}
									arr={arr}
								/>
							);
						})}
						{(meta.translation_by || []).map((author, i, arr) => {
							const authorData = config.blogAuthors.find(
								data => data.name === author
							);
							return (
								<>
									{', translated by '}
									<AuthorLinks
										authorData={authorData}
										author={author}
										i={i}
										arr={arr}
									/>
								</>
							);
						})}
					</address>
				</>
			)}
		</div>
	);
}

function AuthorLinks({ authorData, author, i, arr }) {
	return (
		<span key={author}>
			{authorData ? (
				<a href={authorData.link} target="_blank" rel="noopener noreferrer">
					{author}
				</a>
			) : (
				<span>{author}</span>
			)}
			{i < arr.length - 2 ? ', ' : i === arr.length - 2 ? ' and ' : null}
		</span>
	);
}
