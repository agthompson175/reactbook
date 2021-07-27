import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataProvider';
import { Post } from './Post'

export const PostList = (props) => {
    const { postList } = useContext(DataContext);
    const [posts] = postList;

    return (
        <ul className="list-group">
            {posts.map(p => <Post key={p.postId} post={p} />)}
        </ul>
    )
}