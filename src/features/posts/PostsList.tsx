import { useSelector, useDispatch } from "react-redux";
import {
	selectPostIds,
	getPostsStatus,
	getPostsError,
	fetchPosts,
} from "./postsSlice";
import { useEffect } from "react";
import PostsExcerpt from "./PostsExcerpt";
import { RootState, AppDispatch } from "app/store";
import { PostProps } from "./postsSlice";

const PostsList = () => {
	// const dispatch: AppDispatch = useDispatch();

	const orderedPostIds = useSelector(selectPostIds);

	const postsStatus = useSelector(getPostsStatus);

	const error = useSelector(getPostsError);

	// useEffect(() => {
	// 	if (postsStatus === "idle") {
	// 		dispatch(fetchPosts());
	// 	}
	// }, [postsStatus, dispatch]);

	let content;
	if (postsStatus === "loading") {
		content = <p>"Loading..."</p>;
	} else if (postsStatus === "succeeded") {
		// const orderedPosts = posts
		// 	.slice()
		// 	.sort((a: PostProps, b: PostProps) => b.date.localeCompare(a.date));
		// content = orderedPosts.map((post: PostProps) => (
		// 	<PostsExcerpt key={post.id} post={post} />
		// ));
		content = orderedPostIds.map(postId => <PostsExcerpt key={postId} postId={Number(postId)}/>)
	} else if (postsStatus === "failed") {
		content = <p>{error}</p>;
	}

	return (
		<section>
			{content}
		</section>
	);
};
export default PostsList;
