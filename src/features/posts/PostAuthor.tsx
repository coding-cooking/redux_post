import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice"; 
import { UserProps } from "../users/usersSlice";
import { Link } from "react-router-dom";

type PostAuthorProps = {
	userId: number;
}

const PostAuthor = ({ userId }: PostAuthorProps ) => {
	const users = useSelector(selectAllUsers);
	const author = users.find((user: UserProps) => user.id === userId);

	return <span> by {author 
		? <Link to={`/user/${userId}`}>{author.name}</Link>
		: "Unknown author"}</span>;
};

export default PostAuthor
