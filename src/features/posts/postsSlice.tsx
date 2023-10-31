import { createSlice, nanoid, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";
import { RootState } from "app/store";


const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

type ReactionsProps = {
	[key: string]: number,
}

type ReactionKeys = keyof ReactionsProps

export type PostProps = {
	userId: string;
	id: string;
	title: string;
	date: string;
	body: string;
	reactions: ReactionsProps,
}

export type InitialStateProps = {
	posts: PostProps[],
	status: 'idle' | 'loading' | 'succeeded' | 'failed',
	error: undefined | string
}

const initialState: InitialStateProps = {
	posts: [],
	status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
	error: undefined,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
	try {
		const response = await axios.get(POSTS_URL);
		return [...response.data];
	} catch (error) {
		return (error as Error).message;
	}
});

type initialPostProps = {
	title?: string,
	body?: string,
	userId?: string,
	id?: string,
	reactions?: ReactionsProps,
}

export const addNewPost = createAsyncThunk("posts/addNewPost", async (initialPost: initialPostProps) => {
	try {
		const response = await axios.post(POSTS_URL, initialPost);
		return response.data;
	} catch (error) {
		return (error as Error).message;
	}
}
);

export const updatePost = createAsyncThunk("posts/updatePost", async (initialPost: initialPostProps) => {
	const { id } = initialPost;
	try {
		const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
		return response.data;
	} catch (error) {
		// return (error as Error).message;
		return initialPost;
	}
})

export const deletePost = createAsyncThunk("posts/deletePost", async (initialPost: initialPostProps) => {
	const { id } = initialPost;
	try {
		const response = await axios.delete(`${POSTS_URL}/${id}`);
		if (response?.status === 200) return initialPost;
		return `${response?.status}:${response?.statusText}`;
	} catch (error) {
		return (error as Error).message;
	}
})

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		//简单用法
		// postAdded(state, action) {
		//     state.push(action.payload)
		// }
		//复杂用法
		postAdded: {
			reducer(state, action: PayloadAction<PostProps>) {
				state.posts.push(action.payload);
			},
			prepare(title: string, body: string, userId: string): { payload: PostProps } {
				return {
					payload: {
						title,
						body,
						userId,
						id: nanoid(),
						date: new Date().toISOString(),
						reactions: {
							thumbsUp: 0,
							wow: 0,
							heart: 0,
							rocket: 0,
							coffee: 0,
						},
					},
				};
			},
		},
		// reactionAdded(state, action) {
		// 	const { postId, reaction } = action.payload;
		// 		const existingPost = state.posts.find((post) => post.id === postId);
		// 		if (existingPost) {
		// 			existingPost.reactions[reaction]++;
		// 		}
		// },

		reactionAdded: {
			reducer: (state, action: PayloadAction<{
				postId: string,
				reaction: keyof ReactionsProps
			}>) => {
				const { postId, reaction } = action.payload;
				const existingPost = state.posts.find((post: PostProps) => post.id === postId);
				if (existingPost) {
					existingPost.reactions[reaction]++;
				}
			},
			prepare(postId, reaction) {
				return {
					payload: {
						postId,
						reaction,
					},
				};
			},
		},
	},
	extraReducers(builder) {
		builder
			.addCase(fetchPosts.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchPosts.fulfilled, (state, action) => {
				state.status = "succeeded";
				// Adding date and reactions
				let min = 1;

				const loadedPosts = (action.payload as PostProps[]).map((post: PostProps) => {
					post.date = sub(new Date(), { minutes: min++ }).toISOString();
					post.id = `${post.id}`;
					post.reactions = {
						thumbsUp: 0,
						wow: 0,
						heart: 0,
						rocket: 0,
						coffee: 0,
					};
					return post;
				});
				// Add any fetched posts to the array
				state.posts = [...loadedPosts];

			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(addNewPost.fulfilled, (state, action) => {
				// Fix for API post IDs:
				// Creating sortedPosts & assigning the id 
				// would be not be needed if the fake API 
				// returned accurate new post IDs
				const sortedPosts = state.posts.sort((a, b) => {
					if (a.id > b.id) return 1
					if (a.id < b.id) return -1
					return 0
				})
				action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
				// End fix for fake API post IDs 

				action.payload.userId = Number(action.payload.userId)
				action.payload.date = new Date().toISOString();
				action.payload.reactions = {
					thumbsUp: 0,
					wow: 0,
					heart: 0,
					rocket: 0,
					coffee: 0,
				};
				console.log(action.payload)
				state.posts.push(action.payload)
			})
			.addCase(updatePost.fulfilled, (state, action) => {
				if (!action.payload?.id) {
					console.log('Update could not complete')
					console.log(action.payload)
					return;
				}
				action.payload.date = new Date().toISOString();
				const _posts = state.posts.filter(post => post.id !== `${action.payload?.id}`);
				console.log('action.payload 是', action.payload)
				state.posts = [..._posts, action.payload];
			})
			.addCase(deletePost.fulfilled, (state, action) => {
				if (!(action.payload as initialPostProps)?.id) {
					console.log('Delete could not complete')
					console.log(action.payload)
					return;
				}
				// console.log("payload is:",action.payload);
				const { id } = action.payload as initialPostProps;
				const posts = state.posts.filter(post => post.id !== id);
				state.posts = posts;
			})
	},
});

export const selectAllPosts = (state: RootState) => state.posts.posts;

export const getPostsStatus = (state: RootState) => state.posts.status;

export const getPostsError = (state: RootState) => state.posts.error;

export const selectPostById = (state: RootState, postId: string | undefined) =>
	state.posts.posts.find(post => post.id === postId);

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
