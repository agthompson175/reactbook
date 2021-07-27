import React, { useContext, useEffect, useState } from 'react'
import { CartItem } from '../components/CartItem'
import { useAuth } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataProvider';
import firebase from '../firebase';

export const Cart = () => {
    const db = firebase.firestore();
    const { currentUser } = useAuth();
    const { cart, getCart } = useContext(DataContext);
    const [newCart, setNewCart] = useState({});

    const handleUpdate = (infoObj) => {
        if (infoObj.id in newCart) {
            let newDict = { ...newCart };
            newDict[infoObj.id] = infoObj.quantity;
            setNewCart(newDict);
        }
        else {
            let newDict = {};
            newDict[infoObj.id] = infoObj.quantity;
            setNewCart({ ...newCart, ...newDict })
        }
    }
    useEffect(() => {
        Object.keys(newCart).forEach(prod => {
            db.collection('users').doc(currentUser.id).collection('cart').doc(prod).update({
                quantity: newCart[prod]
            }).catch(err => console.error(err))
        })
        getCart()
    }, [newCart, currentUser.id, db, getCart])

    return (
        <div>
            <h3>Cart</h3>
            <hr />

            <div className="card shopping-cart">
                <div className="card-header bg-dark text-light">
                    <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                    Shopping Cart
                    <a href="." className="btn btn-outline-info btn-sm pull-right">Continue Shopping</a>
                    <div className="clearfix"></div>
                </div>
                <div className="card-body">

                    {/* <!-- PRODUCTS --> */}
                    {Object.values(cart.items).map(productInfo => <CartItem handleUpdate={handleUpdate} key={productInfo.id} data={productInfo} />)}
                    {/* <!-- END PRODUCTS --> */}

                    
                </div>
                <div className="card-footer">
                    {/* <!-- <div className="coupon col-md-5 col-sm-5 no-padding-left pull-left">
                                        <div className="row">
                                            <div className="col-6">
                                                <input type="text" className="form-control" placeholder="cupone code">
                    </div>
                                                <div className="col-6">
                                                    <input type="submit" className="btn btn-default" value="Use cupone">
                    </div>
                                                </div>
                                            </div> --> */}
                    <div className="text-right">
                        <div className="cart-totals">
                            Subtotal: <b>${cart.subtotal}</b>
                        </div>
                        <div className="cart-totals">
                            Tax: <b>${cart.taxes}</b>
                        </div>
                        <div className="cart-totals">
                            Grand total: <b>${cart.grandtotal}</b>
                        </div>
                    </div>
                    <div className="pull-right" style={{ margin: "10px" }}>
                        <form id="checkout-form" action="" method="POST">
                            <input type="submit" className="btn btn-success pull-right" value="Checkout" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}