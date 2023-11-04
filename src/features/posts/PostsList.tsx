import { useSelector, useDispatch } from "react-redux";
import {
	selectPostIds,
} from "./postsSlice";
import { useGetPostsQuery } from "./postsSlice";
import { useEffect } from "react";
import PostsExcerpt from "./PostsExcerpt";
import { RootState, AppDispatch } from "app/store";
import { PostProps } from "./postsSlice";

const PostsList = () => {
	const { isLoading, isSuccess, isError, error } = useGetPostsQuery({});

	const orderedPostIds = useSelector(selectPostIds);

	let content;
	if ( isLoading ) {
		content = <p>"Loading..."</p>;
	} else if ( isSuccess ) {
		// const orderedPosts = posts
		// 	.slice()
		// 	.sort((a: PostProps, b: PostProps) => b.date.localeCompare(a.date));
		// content = orderedPosts.map((post: PostProps) => (
		// 	<PostsExcerpt key={post.id} post={post} />
		// ));
		content = orderedPostIds.map(postId => <PostsExcerpt key={postId} postId={Number(postId)}/>)
	} else if ( isError ) {
		content = <p>{error.toString()}</p>;
	}

	return (
		<section>
			{content}
		</section>
	);
};
export default PostsList;
