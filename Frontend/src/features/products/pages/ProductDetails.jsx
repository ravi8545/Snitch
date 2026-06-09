import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useProduct } from "../hook/useProduct";


const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const { handleGetProductById } = useProduct();

    async function fetchProductDetails() {
        try {
            setLoading(true);
            const data = await handleGetProductById(productId);
            setProduct(data);
        } catch (error) {
            console.error("Error fetching product details:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-semibold text-gray-700">Product not found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] px-5 py-10 md:px-20 md:py-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Images Section */}
                    <div className="flex flex-col gap-4">
                        {/* Main Image with Navigation */}
                        <div className="relative w-full aspect-square bg-[#1A1A1A] rounded-lg overflow-hidden border border-[#262626] shadow-lg group">
                            <img
                                src={product.images?.[selectedImageIndex]?.url}
                                alt={product.images?.[selectedImageIndex]?.alt || product.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            
                            {/* Left Arrow Button */}
                            {product.images && product.images.length > 1 && (
                                <button
                                    onClick={() => setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#FFD700]/90 hover:bg-[#FFD700] text-[#0D0D0D] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30 active:scale-95"
                                    aria-label="Previous image"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                    </svg>
                                </button>
                            )}
                            
                            {/* Right Arrow Button */}
                            {product.images && product.images.length > 1 && (
                                <button
                                    onClick={() => setSelectedImageIndex((prev) => (prev + 1) % product.images.length)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#FFD700]/90 hover:bg-[#FFD700] text-[#0D0D0D] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30 active:scale-95"
                                    aria-label="Next image"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                    </svg>
                                </button>
                            )}
                            
                            {/* Image Counter */}
                            {product.images && product.images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0D0D0D]/85 backdrop-blur-sm text-[#FFD700] text-sm font-semibold px-3 py-1.5 rounded-full" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {selectedImageIndex + 1} / {product.images.length}
                                </div>
                            )}
                        </div>

                        {/* Image Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={image._id}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                            selectedImageIndex === index
                                                ? "border-[#FFD700] shadow-lg shadow-yellow-500/20"
                                                : "border-[#262626] hover:border-[#FFD700]/50"
                                        }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.alt}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Information Section */}
                    <div className="flex flex-col gap-6">
                        {/* Title and Product ID */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-[#E5E2E1] mb-2 tracking-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                {product.title}
                            </h1>
                            <p className="text-sm text-[#A0A0A0]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Product ID: <span className="text-[#FFD700] font-medium">{product._id}</span>
                            </p>
                        </div>

                        {/* Price Section */}
                        <div className="bg-[#1A1A1A] border border-[#262626] p-6 rounded-lg shadow-lg">
                            <p className="text-sm text-[#A0A0A0] mb-3 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Price</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm text-[#FFD700] font-semibold">₹</span>
                                <span className="text-5xl font-bold text-[#FFD700]">
                                    {product.price?.amount?.toLocaleString('en-IN')}
                                </span>
                                <span className="text-lg text-[#A0A0A0] ml-2">
                                    {product.price?.currency}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-xl font-bold text-[#E5E2E1] mb-3" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                Description
                            </h2>
                            <p className="text-[#A0A0A0] leading-relaxed text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {product.description}
                            </p>
                        </div>

                        {/* Product Metadata */}
                        <div className="border-t border-[#262626] pt-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-[#A0A0A0] uppercase tracking-wider mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Seller ID</p>
                                    <p className="text-[#E5E2E1] font-medium break-all" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        {product.seller}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#A0A0A0] uppercase tracking-wider mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Listed On</p>
                                    <p className="text-[#E5E2E1] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        {new Date(product.createdAt).toLocaleDateString('en-IN')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                className="flex-1 bg-[#1A1A1A] border border-[#262626] text-[#E5E2E1] font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:bg-[#262626] hover:border-[#FFD700]/50 active:scale-95 flex items-center justify-center gap-2"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Add to Cart
                            </button>
                            <button
                                className="flex-1 bg-[#FFD700] text-[#0D0D0D] font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:bg-[#FFC700] hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95 flex items-center justify-center gap-2"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
