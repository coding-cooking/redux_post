import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { PostProps } from "./postsSlice";
import { Link } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";
import { RootState } from "app/store";



const PostsExcerpt = ( {postId}: {postId: number}) => {
	const post = useSelector((state: RootState) => selectPostById(state, postId));

	return (
		<>
		{
			post && <article>

				<h2>{post.title}</h2>
				<p className="excerpt">{post.body.substring(0, 75)}</p>
				<p className='postCredit'>
					<Link to={`post/${post.id}`}>View Post</Link>
					<PostAuthor userId={post.userId} />
					<TimeAgo timestamp={post.date} />
				</p>
				<ReactionButtons post={post} />
			</article>
		}
		</>
		
	);
};

export default PostsExcerpt;
