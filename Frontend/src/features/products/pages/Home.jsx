import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import { useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct";

const Home = () => {    
    const products = useSelector((state) => state.products.products);
    const navigate = useNavigate();
    const {handleGetAllProducts} = useProduct();

    useEffect(() => {
        handleGetAllProducts();
    }, []);

    return (
        <div className="min-h-screen bg-[#0D0D0D] px-5 py-10 md:px-20 md:py-10">
            {/* Hero Section */}
            <div className="text-center mb-16 md:mb-24 animate-in fade-in slide-in-from-top-6 duration-600">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#E5E2E1] mb-4 tracking-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                    Welcome to Snitch!
                </h1> 
                <p className="text-lg md:text-xl text-[#A0A0A0] mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Discover the best products from our trusted sellers.
                </p> 
                <p className="text-lg md:text-xl text-[#A0A0A0]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Shop with confidence and find what you need today.
                </p>
            </div>

            {/* Products Section */}
            {products && products.length > 0 ? (
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#E5E2E1] mb-12 text-center tracking-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                        All Products
                    </h2>
                    
                    <div
                     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                onClick={() => navigate(`/product/${product._id}`)}
                                className="bg-[#1A1A1A] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#262626] hover:border-[#FFD700] flex flex-col h-full cursor-pointer"
                            >
                                {/* Product Image */}
                                <div className="relative w-full h-56 bg-[#0D0D0D] border-b border-[#262626] flex items-center justify-center overflow-hidden group">
                                    {product.images && product.images.length > 0 ? (
                                        <img 
                                            src={product.images[0].url} 
                                            alt={product.images[0].alt || product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#262626] flex items-center justify-center text-[#555] text-base">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* Product Details */}

                                <div className="px-5 py-5 flex flex-col flex-grow">
                                    <h3 className="text-base md:text-lg font-semibold text-[#E5E2E1] mb-2 line-clamp-2 leading-snug" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                        {product.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-[#A0A0A0] mb-4 flex-grow line-clamp-2 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        {product.description}
                                    </p>

                                    {/* Footer with Price and Button */}
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#262626]">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-base md:text-lg text-[#FFD700] font-semibold">₹</span>
                                            <span className="text-lg md:text-2xl text-[#FFD700] font-bold">
                                                {product.price.amount}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                navigate(`/product/${product._id}`);
                                            }}
                                            className="px-4 py-2 bg-[#FFD700] text-[#0D0D0D] rounded-md font-semibold text-sm md:text-base transition-all duration-300 hover:bg-[#FFC700] hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95"
                                            style={{ fontFamily: "'Inter', sans-serif" }}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="max-w-2xl mx-auto bg-[#1A1A1A] rounded-lg border border-[#262626] shadow-lg p-12 md:p-16 text-center">
                    <p className="text-lg md:text-xl text-[#A0A0A0]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        No products available at the moment. Please check back later!
                    </p>
                </div>
            )}
        </div>
    );
}

export default Home;