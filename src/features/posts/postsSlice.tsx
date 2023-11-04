import { 
	createSelector,
	createEntityAdapter
	} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { RootState } from "app/store";
import { apiSlice } from "../api/apiSlice";

type ReactionsProps = {
	[key: string]: number,
}

type ReactionKeys = keyof ReactionsProps

export type PostProps = {
	userId: number;
	id: number;
	title: string;
	date: string;
	body: string;
	reactions: ReactionsProps,
}

export type InitialStateProps = {
	// posts: PostProps[],
	status: 'idle' | 'loading' | 'succeeded' | 'failed',
	error: undefined | string,
	count: number,
}

const postsAdapter = createEntityAdapter<PostProps>({
	// selectId: (post) => post.id,
	sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState();

type initialPostProps = {
	title?: string,
	body?: string,
	userId?: number,
	id?: number,
	reactions?: ReactionsProps,
}

export const extendedApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getPosts: builder.query({
			query: () => '/posts',
			transformResponse: (responseData: PostProps[]) => {
				let min = 1;
				const loadedPosts = responseData.map(post => {
					if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
					if (!post?.reactions) post.reactions = {
						thumbsUp: 0,
						wow: 0,
						heart: 0,
						rocket: 0,
						coffee: 0
					}
					return post;
				})
				return postsAdapter.setAll(initialState, loadedPosts)
			},
			providesTags: (result, error, arg) => 
				result
					? [
						...result.ids.map(( id ) => ({ type: 'Posts' as const, id })),
						{ type: 'Posts', id: 'LIST' },
					]
					: [{ type: 'Posts', id: 'LIST' }],
				
		}),
		getPostsByUserId: builder.query({
			query: id => `/posts/?userId=${id}`,
			transformResponse: (responseData: PostProps[]) => {
				let min = 1;
				const loadedPosts = responseData.map(post => {
					if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
					if (!post?.reactions) post.reactions = {
						thumbsUp: 0,
						wow: 0,
						heart: 0,
						rocket: 0,
						coffee: 0
					}
					return post;
				});
				return postsAdapter.setAll(initialState, loadedPosts)
			},
			providesTags: (result, error, arg) => {
				if (result) {
					return [{ type: 'Posts' }, 
					...result.ids.map(id => ({ type: 'Posts' as const, id }))];
				}
				return [{ type: 'Posts' }];
			}		
		}),
		addNewPost: builder.mutation({
			query: initialPost => ({
				url: '/posts',
				method: 'POST',
				body: {
					...initialPost,
					userId: Number(initialPost.userId),
					date: new Date().toISOString(),
					reactions: {
						thumbsUp: 0,
						wow: 0,
						heart: 0,
						rocket: 0,
						coffee: 0
					}
				}
			}),
			invalidatesTags: [
				{ type: 'Posts', id: "LIST" }
			]
		}),
		updatePost: builder.mutation({
			query: initialPost => ({
				url: `/posts/${initialPost.id}`,
				method: 'PUT',
				body: {
					...initialPost,
					date: new Date().toISOString()
				}
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Posts', id: arg.id }
			]
		}),
		deletePost: builder.mutation({
			query: ({ id }) => ({
				url: `/posts/${id}`,
				method: 'DELETE',
				body: { id }
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Posts', id: arg.id }
			]
		}),

		addReaction: builder.mutation({
			query: ({ postId, reactions }) => ({
				url: `posts/${postId}`,
				method: 'PATCH',
				// In a real app, we'd probably need to base this on user ID somehow
				// so that a user can't do the same reaction more than once
				body: { reactions }
			}),
			async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }) {
				// `updateQueryData` requires the endpoint name and cache key arguments,
				// so it knows which piece of cache state to update
				const patchResult = dispatch(
					extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {
						// The `draft` is Immer-wrapped and can be "mutated" like in createSlice
						const post = draft.entities[postId]
						if (post) post.reactions = reactions
					})
				)
				try {
					await queryFulfilled
				} catch {
					patchResult.undo()
				}
			}
		})
	})
})

export const {
	useGetPostsQuery,
	useGetPostsByUserIdQuery,
	useAddNewPostMutation,
	useUpdatePostMutation,
	useDeletePostMutation,
	useAddReactionMutation
} = extendedApiSlice;



// returns the query result object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select({})

// Creates memoized selector
const selectPostsData = createSelector(
	selectPostsResult,
	postsResult => postsResult.data // normalized state object with ids & entities
)

export const {
	selectAll: selectAllPosts,
	selectById: selectPostById,
	selectIds: selectPostIds
	// Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => selectPostsData(state as RootState) ?? initialState)


