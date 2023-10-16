import { useDispatch } from "react-redux";
import { reactionAdded } from "./postsSlice";

const reactionEmoji = {
	thumbsUp: '👍',
	wow: '😊',
	heart: '❤️',
	rocket: '🚀',
	coffee: '☕️',
};

const ReactionButtons = ({post}) => {
	const dispatch = useDispatch();

	const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
		return (
			<button
				key={name}
				type='button'
				className='reactionButton'
				onClick={() =>{
					dispatch(reactionAdded(post.id, name));
				}
					
				}>
				{emoji} {post.reactions[name]}
			</button>
		);
	});

	return <div>{reactionButtons}</div>;
  
}

export default ReactionButtons
