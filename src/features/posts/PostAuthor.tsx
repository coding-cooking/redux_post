import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice"; 
import { UserProps } from "../users/usersSlice";

type PostAuthorProps = {
	userId: number;
}

const PostAuthor = ({ userId }: PostAuthorProps ) => {
	const users = useSelector(selectAllUsers);
	const author = users.find((user: UserProps) => user.id === userId);

	return <span> {author ? author.name : "Unknown author"}</span>;
};

export default PostAuthor
