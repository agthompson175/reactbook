import React, { useContext } from 'react'
import { PostList } from '../components/PostList';
import { useAuth } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataProvider';
import firebase from '../firebase'
import { NotAuthenticated } from './NotAuthenticated';

export const Home = (props) => {
    const { currentUser } = useAuth();
    const { postList, getPosts } = useContext(DataContext);

    const addPost = (e) => {
        e.preventDefault();

        const formData = {
            body: e.target.body.value,
            dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
            dateUpdated: null,
            userId: currentUser.id
        }

        firebase.firestore().collection('posts').add(formData)
            .then((docRef) => {
                // In the db, the posts are already supplied. This is where we will re-render/update our list of posts in the DOM.
                getPosts();
                console.log('New record created');
            })
            .catch(err => console.error(err))


        // console.log(formData);
    }

    return (
        <div>
            {
                !currentUser.loggedIn
                    ?
                    <NotAuthenticated />
                    :
                    <React.Fragment>
                        <h3 style={{ fontSize: '35px' }}>Home</h3>
                        <hr />

                        <form onSubmit={(e) => addPost(e)} action="" method="POST">
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-10">
                                        <input className="form-control" type="text" name='body' placeholder="Your blog post here..." />
                                    </div>
                                    <div className="col-md-2">
                                        <input className="btn btn-info btn-block" type="submit" value="Post" />
                                    </div>
                                </div>
                            </div>
                        </form>

                        <hr />

                        <PostList posts={postList[0]} />
                    </React.Fragment>

            }
        </div>
    )
}