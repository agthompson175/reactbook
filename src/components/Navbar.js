import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataProvider';

export const Navbar = (props) => {
    const { currentUser, logout } = useAuth();
    const { cart } = useContext(DataContext);

    const handleLogin = (e) => {
        e.preventDefault();
        props.signIn();
        console.log('Logged in successfully')
    }

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    }

    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <Link className="navbar-brand" to="/">Reactbook</Link>
            <button className="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId" aria-controls="collapsibleNavId"
                aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="collapsibleNavId">
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/profile">Profile</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/contact">Contact</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="." id="dropdownId" data-toggle="dropdown">Shop</a>
                        <div className="dropdown-menu" aria-labelledby="dropdownId">
                            <Link className="dropdown-item" to="/shop">Products</Link>
                            <Link className="dropdown-item" to="/shop/cart">Cart</Link>
                        </div>
                    </li>
                    <li className="nav-item">

                        <h4>
                            <span className="badge badge-secondary">
                                <i className="fa fa-shopping-cart"> {cart.quantity} | ${cart.subtotal} </i>
                            </span>
                        </h4>
                        {/* <Link className="nav-link" to="/contact">Contact</Link> */}
                    </li>
                </ul>
                {/* <form className="form-inline my-2 my-lg-0">
                    <input className="form-control mr-sm-2" type="text" placeholder="Search" />
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form> */}
                <ul className="navbar-nav ml-auto">
                    {
                        !currentUser.loggedIn
                            ?
                            <li className="nav-item">
                                <Link onClick={(e) => handleLogin(e)} className="nav-link" to="">Login</Link>
                            </li>
                            :
                            <li className="nav-item">
                                <Link onClick={(e) => handleLogout(e)} className="nav-link" to="">Logout</Link>
                            </li>
                    }
                </ul>
            </div>
        </nav>
    )
}