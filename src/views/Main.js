import React from 'react';
import { Navbar } from '../components/Navbar';
import { Switch, Route } from 'react-router-dom';
import { Home } from './Home';
import { Profile } from './Profile';
import Contact  from './Contact';
import '../custom.css';
import { Cart } from './Cart';
import { BlogSingle } from './BlogSingle';
import { Shop } from './Shop';
import { useAuth } from '../contexts/AuthContext';
import { NotAuthenticated } from './NotAuthenticated';

export const Main = (props) => {
    const { currentUser } = useAuth();
    return (
        <div>
            <header>
                <Navbar signIn={props.signIn} />
            </header>

            <main className="container">
                {
                    !currentUser.loggedIn
                        ?
                        <React.Fragment>
                            <NotAuthenticated />
                        </React.Fragment>
                        :
                        <Switch>
                            <Route exact path={'/'} render={() => <Home posts={props.posts} />} />
                            {/* BLOG ROUTES */}
                            <Route exact path={'/blog/:id'} render={({ match }) => <BlogSingle match={match} />} />
                            {/* BLOG ROUTES */}
                            <Route exact path={'/profile'} render={() => <Profile />} />
                            <Route exact path={'/contact'} render={() => <Contact />} />
                            {/* SHOP ROUTES */}
                            <Route exact path={'/shop'} render={() => <Shop />} />
                            <Route exact path={'/shop/cart'} render={() => <Cart />} />
                            {/* SHOP ROUTES */}
                        </Switch>
                }
            </main>

            <footer>

            </footer>
        </div>
    )
}