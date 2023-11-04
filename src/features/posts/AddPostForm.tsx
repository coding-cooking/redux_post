import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";
import { UserProps } from "../users/usersSlice";
import { AppDispatch } from "app/store";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postsSlice";

const AddPostForm = () => {
	const [addNewPost, {isLoading}] = useAddNewPostMutation();
	const navigate = useNavigate();
	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");
	const [userId, setUserId] = useState<number>();

	const users = useSelector(selectAllUsers);

	const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
	const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
	const onAuthorChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setUserId(Number(e.target.value));

	const canSave = [title, content, userId].every(Boolean) && !isLoading;

	const onSavePostClicked = async () => {
		if (canSave) {
			try {
				await addNewPost({ title, body: content, userId }).unwrap();

				setTitle("");
				setContent("");
				setUserId(undefined);
				navigate("/")
			} catch (err) {
				console.error("Failed to save the post", err);
			} 
		}
	};

	const usersOptions = users.map((user: UserProps) => (
		<option key={user.id} value={user.id}>
			{user.name}
		</option>
	));

	return (
		<section>
			<h2>Add a New Post</h2>
			<form>
				<label htmlFor='postTitle'>Post Title:</label>
				<input
					type='text'
					id='postTitle'
					name='postTitle'
					value={title}
					onChange={onTitleChanged}
				/>
				<label htmlFor='postAuthor'>Author:</label>
				<select id='postAuthor' onChange={onAuthorChanged}>
					<option value=''></option>
					{usersOptions}
				</select>
				<label htmlFor='postContent'>Content:</label>
				<textarea
					id='postContent'
					name='postContent'
					value={content}
					onChange={onContentChanged}
				/>
				<button type='button' onClick={onSavePostClicked} disabled={!canSave}>
					Save Post
				</button>
			</form>
		</section>
	);
};

export default AddPostForm;
