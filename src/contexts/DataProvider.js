import React, { useEffect, useState, createContext, useCallback } from 'react';
import firebase from '../firebase';
import { useAuth } from './AuthContext';

export const DataContext = createContext();

export const DataProvider = (props) => {
    const db = firebase.firestore();
    const [posts, setPosts] = useState([]);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({ items: {}, quantity: 0, subtotal: 0, grandtotal: 0 });
    const { currentUser } = useAuth();

    function getCart() {
        // show their database copy of the cart
        let data = {};
        let quantity = 0;
        let subtotal = 0;
        let grandtotal = 0;
        let taxes = 0;

        db.collection('users').doc(currentUser.id).collection('cart').get()
            .then(snapshot => {
                snapshot.forEach(ref => {
                    let product = ref.data();
                    data[ref.id] = product

                    // update cart values
                    quantity += product.quantity;
                    subtotal += parseFloat(product.price) * quantity;
                    taxes += parseFloat(product.tax) * quantity;
                    grandtotal += subtotal + taxes;
                })
                setCart({
                    items: data,
                    quantity,
                    subtotal: (subtotal / 100).toFixed(2),
                    taxes: (taxes / 100).toFixed(2),
                    grandtotal: (grandtotal / 100).toFixed(2)
                });
            })
    }

    useEffect(() => {
        if (currentUser.loggedIn) {
            // console.log(currentUser);
            // if they have items in their cart
            if (cart.hasOwnProperty('items')) {
                getCart()
            }
        }
        // eslint-disable-next-line
    }, [db, currentUser.loggedIn])

    // const getCartItems = () => {
    //     if (currentUser.loggedIn)
    //     {
    //         console.log(currentUser);
    //         // if they have items in their cart
    //         if (cart.hasOwnProperty('items'))
    //         {
    //             function getCart()
    //             {
    //                 // show their database copy of the cart
    //                 let data = {};
    //                 db.collection('users').doc(currentUser.id).collection('cart').get()
    //                     .then(snapshot =>
    //                     {
    //                         snapshot.forEach(ref =>
    //                         {
    //                             data[ ref.id ] = ref.data()
    //                             // .push(ref.data());
    //                         })
    //                         setCart({ items: data, quantity: 0, subtotal: 0, grandtotal: 0 });
    //                     })
    //             }
    //             getCart()
    //         }
    //     }
    // }

    useEffect(() => {
        var newProducts = []
        fetch('/api/shop/products')
            .then(res => res.json())
            .then(products => {
                // console.log(products.data)
                newProducts = [...products.data];

                // Need to pull penny values of price and tax attributes from each product (only because I want a quick reference to it.)
                // Don't normally want to do any heavy lifting once you're trying to focus on building things in the lower level components 
                let productList = [];
                for (const p of newProducts) {
                    let newP = {
                        ...p,
                        price: parseInt(parseFloat(p.metadata.price) * 100),
                        tax: parseInt(parseFloat(p.metadata.tax) * 100)
                    }
                    productList.push(newP);
                }
                setProducts(productList)
            })
    }, [])

    const getPosts = useCallback(() => {
        let newPosts = [];

        // connect to our posts collection
        db.collection('posts').orderBy('dateCreated', 'desc').get().then(ourPosts => {
            // loop over the posts in the collection
            ourPosts.forEach(post => {
                // add the new document + the document's key into the list
                newPosts.push({ ...post.data(), postId: post.id, })
            })
            // set the state of the posts equal to newPosts
            setPosts(newPosts);
        })
    }, [db])

    useEffect(() => {
        if (currentUser.loggedIn) {
            getPosts();
        }
    }, [currentUser.loggedIn, getPosts])

    return (
        <DataContext.Provider value={{ postList: [posts, setPosts], getPosts, products, getCart, cart, setCart }}>
            {props.children}
        </DataContext.Provider>
    )
}