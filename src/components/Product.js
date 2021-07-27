import React, { useContext } from 'react';
import firebase from 'firebase';
import { useAuth } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataProvider';

export const Product = (props) => {
    const { currentUser } = useAuth();
    const { getCart } = useContext(DataContext);

    const db = firebase.firestore();
    let buttonState = 'READY';

    const handleClick = (obj) => {

        buttonState = 'LOADING';

        db.collection('users').doc(currentUser.id).collection('cart').doc(props.product.id).get()
            .then(productRef => {
                // create data variable, because we need to make sure it exists
                let data;
                // if the product.id in the currentUser's cart already exists 
                if (productRef.exists) {
                    // the quantity attribute should already be set by default, so we can increment its total
                    data = productRef.data();
                    data.quantity += 1;
                }
                // otherwise if the product.id has not been found in the currentUser's cart
                else {
                    // The quantity attribute does not yet exist, so we will create it and set its value to 1
                    data = obj;
                    data.quantity = 1;
                }
                // Then we will update the currentUser's cart with the product supplied to us from 'data'
                db.collection('users').doc(currentUser.id).collection('cart').doc(props.product.id).set(data);
                // console.log(data);

                // update the state of our cart
                getCart();

                // 
                buttonState = 'READY';
            })
    }

    return (
        <div className="col-4">
            <div className="card">
                <div className="card-header">
                    <h6>
                        {props.product.name}
                        <span className="float-right">${props.product.metadata.price}</span>
                    </h6>
                </div>
                <div className="card-body">
                    <img className="card-img-top" src={props.product.images[0]} alt={props.product.name} />
                    {
                        buttonState === 'READY'
                            ?
                            <button onClick={() => handleClick(props.product)} className="btn btn-success btn-block" style={{ marginTop: '10px' }}>Add to cart</button>
                            :
                            <button disabled={true} className="btn btn-secondary btn-block" style={{ marginTop: '10px' }}>Please Wait</button>
                    }
                    <p className="card-text" style={{ marginTop: '10px' }}>{props.product.description}</p>
                </div>
            </div>
        </div>
    )
}