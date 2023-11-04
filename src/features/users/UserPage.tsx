import { useSelector } from 'react-redux'
import { selectUserById } from '../users/usersSlice'
import { Link, useParams } from 'react-router-dom'
import { RootState } from "app/store"; 
import { useGetPostsByUserIdQuery } from '../posts/postsSlice';


const UserPage = () => {
    const { userId } = useParams()
    const user = useSelector((state: RootState) => selectUserById(state, Number(userId)))

    const {
        data: postsForUser,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsByUserIdQuery(userId);

    console.log("postsForUser is",postsForUser)

    let content;
    if (isLoading) {
        content = <p>Loading...</p>
    } else if (isSuccess) {
        const { ids, entities } = postsForUser
        content = ids.map(id => (
            <li key={id}>
                <Link to={`/post/${id}`}>{entities[id]?.title}</Link>  
            </li>
        ))
    } else if (isError) {
        content = <p>{error.toString()}</p>;
    }


    return (
        <section>
            <h2>{user?.name}</h2>

            <ol>{content}</ol>
        </section>
    )
}

export default UserPage