import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { PostProps } from "./postsSlice";

const PostsExcerpt = ({ post }: { post: PostProps }) => {
	return (
		<article>
			<h3>{post.title}</h3>
			<p className='postCredit'>
				<PostAuthor userId={post.userId} />
				<TimeAgo timestamp={post.date} />
			</p>
			<p>{post.body.substring(0, 100)}</p>
			<ReactionButtons post={post} />
		</article>
	);
};

export default PostsExcerpt;
