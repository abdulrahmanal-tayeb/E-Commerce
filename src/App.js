import './App.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React, { Suspense, useContext, useEffect, useState } from "react";
import ItemCard from './components/ItemCard';
import CardsContainer from './components/CardsContainer';
import Products from './components/Products';
import ItemDetail from './components/ItemDetails';
import { ToastContainer } from 'react-toastify';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ProductAddition from './components/ProductAddition';
import BasicExample from './components/shared/Navbar';

const App = () => {


    return (
        <Suspense fallback={<h1 children="Loading" />}>
            <BasicExample/>
            <Router>
                <Routes>
                    <Route index element={<Products/>} />
                    <Route path="/products/" element={<Products />} />
                    <Route path="/cart/" element={<Cart />} />
                    <Route path="/products/add/" element={<ProductAddition />} />
                    <Route path="/checkout/" element={<Checkout />} />
                    <Route path="/products/details/" element={<ItemDetail />} />
                </Routes>
            </Router>
            <div style={{marginTop: "5em", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <h3><strong>2024 HappyShopping By Abdulrahman M. Al-Tayeb - Github at @abdulrahmanal-tayeb</strong></h3>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={true}
                theme="colored"
                style={{
                    zIndex: 999999999999999,
                }}
            />
        </Suspense>
    )
}
export default App;

