import React, { useContext, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataProvider';
import firebase from '../firebase';

export const CartItem = (props) => {
    const db = firebase.firestore();
    const qty = useRef();
    const { currentUser } = useAuth();
    const { getCart } = useContext(DataContext);

    const handleDelete = (prod) => {
        db.collection('users').doc(currentUser.id).collection('cart').doc(prod).delete()
            .then(() => {
                getCart();
            });
    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12 col-sm-12 col-md-2 text-center">
                    <img className="img-responsive" src={props.data.images[0]} alt={props.data.name} width="120" height="80" />
                </div>
                <div className="col-12 text-sm-center col-sm-12 text-md-left col-md-6">
                    <h4 className="product-name"><strong>{props.data.name}</strong></h4>
                    <h4>
                        <small>{props.data.description}</small>
                    </h4>
                </div>
                <div className="col-12 col-sm-12 text-sm-center col-md-4 text-md-right row">
                    <div className="col-3 col-sm-3 col-md-6 text-md-right" style={{ paddingTop: "5px" }}>
                        <h6><strong>${props.data.metadata.price} <span className="text-muted">x</span></strong></h6>
                    </div>
                    <div className="col-4 col-sm-4 col-md-4">
                        <div className="quantity">
                            <input type="number" step="1" max="99" min="1" ref={qty} onChange={() => { props.handleUpdate({ id: props.data.id, quantity: parseInt(qty.current.value) }) }} defaultValue={props.data.quantity} title="Qty" className="qty" size="4" />
                        </div>
                    </div>
                    <div className="col-2 col-sm-2 col-md-2 text-right">
                        <button onClick={() => handleDelete(props.data.id)} type="button" className="btn btn-outline-danger btn-xs">
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
            <hr />
        </React.Fragment>
    )
}