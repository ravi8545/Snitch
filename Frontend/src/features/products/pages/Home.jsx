import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import { useProduct } from "../hook/useProduct";
import "./Home.css";

const Home = () => {    
    const products = useSelector((state) => state.products.products);
    const {handleGetAllProducts} = useProduct();

    useEffect(() => {
        handleGetAllProducts();
    }, []);

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Welcome to Snitch!</h1> 
                <p>Discover the best products from our trusted sellers.</p> 
                <p>Shop with confidence and find what you need today.</p>
            </div>

            {products && products.length > 0 ? (
                <div className="products-section">
                    <h2>All Products</h2>
                    <div className="products-grid">
                        {products.map((product) => (
                            <div key={product._id} className="product-card">
                                <div className="product-image-container">
                                    {product.images && product.images.length > 0 ? (
                                        <img 
                                            src={product.images[0].url} 
                                            alt={product.images[0].alt || product.title}
                                            className="product-image"
                                        />
                                    ) : (
                                        <div className="placeholder-image">No Image</div>
                                    )}
                                </div>
                                <div className="product-details">
                                    <h3 className="product-title">{product.title}</h3>
                                    <p className="product-description">{product.description}</p>
                                    <div className="product-footer">
                                        <div className="product-price">
                                            <span className="currency">₹</span>
                                            <span className="amount">{product.price.amount}</span>
                                        </div>
                                        <button className="btn-view-details">View Details</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="no-products">
                    <p>No products available at the moment. Please check back later!</p>
                </div>
            )}
        </div>
    );
}

export default Home;