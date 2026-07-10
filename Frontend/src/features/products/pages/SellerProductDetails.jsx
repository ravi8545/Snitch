import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useProduct } from '../hook/useProduct';

const SellerProductDetails = () => {
    const [product, setProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [variantForm, setVariantForm] = useState({
        stock: '',
        priceAmount: '',
        attributes: [{ key: '', value: '' }],
        images: []
    });
    
    const { productId } = useParams();
    const { handleGetProductById, handleAddProductVariant } = useProduct();

    async function fetchProductDetails() {
        try {
            const data = await handleGetProductById(productId);
            setProduct(data?.product || data);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    const handleAttributeChange = (index, field, value) => {
        const newAttributes = [...variantForm.attributes];
        newAttributes[index][field] = value;
        setVariantForm({ ...variantForm, attributes: newAttributes });
    };

    const addAttributeField = () => {
        setVariantForm({
            ...variantForm,
            attributes: [...variantForm.attributes, { key: '', value: '' }]
        });
    };

    const removeAttributeField = (index) => {
        const newAttributes = variantForm.attributes.filter((_, i) => i !== index);
        setVariantForm({ ...variantForm, attributes: newAttributes });
    };

    const handleImageChange = (e) => {
        // Read file URLs for local preview and keep file object for API
        const files = Array.from(e.target.files);
        const imageUrls = files.map(file => ({
            url: URL.createObjectURL(file),
            file: file
        }));
        setVariantForm({ ...variantForm, images: imageUrls });
    };

    const handleSubmitVariant = async (e) => {
        e.preventDefault();
        
        const attributesObj = {};
        variantForm.attributes.forEach(attr => {
            if (attr.key && attr.value) {
                attributesObj[attr.key] = attr.value;
            }
        });

        try {
            await handleAddProductVariant(productId, {
                images: variantForm.images,
                stock: Number(variantForm.stock) || 0,
                price: Number(variantForm.priceAmount) || product.price.amount,
                attributes: attributesObj
            });
            
            await fetchProductDetails(); // Refresh to get the new variant from the backend
            
            setIsModalOpen(false);
            setVariantForm({
                stock: '',
                priceAmount: '',
                attributes: [{ key: '', value: '' }],
                images: []
            });
        } catch (error) {
            console.error("Error adding variant:", error);
            // Optionally, handle error UI here
        }
    };

    const handleStockChange = (idx, newStock) => {
        const updatedVariants = [...product.variants];
        updatedVariants[idx].stock = Number(newStock) || 0;
        setProduct({ ...product, variants: updatedVariants });
        // NOTE: A real implementation would call an API here to update the stock
    };

    if (!product) return (
        <div className="min-h-screen bg-[#0D0D0D] flex justify-center items-center">
            <p className="text-[#A0A0A0] font-['JetBrains_Mono'] animate-pulse">Loading...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-[#e5e2e1] font-['Inter'] p-6 md:p-12">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="mb-12 border-b border-[#262626] pb-6 flex justify-between items-end">
                    <div>
                        <Link to="/seller/products" className="text-[#A0A0A0] hover:text-[#FFD700] text-sm font-['JetBrains_Mono'] mb-4 inline-block tracking-widest transition-colors">&larr; BACK TO LISTINGS</Link>
                        <h1 className="text-4xl md:text-5xl font-bold font-['Hanken_Grotesk'] tracking-tight">{product.title}</h1>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#FFD700] text-[#0D0D0D] px-6 py-3 rounded text-sm font-medium font-['JetBrains_Mono'] hover:bg-[#e9c400] transition-colors"
                    >
                        + ADD VARIANT
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Product Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#262626]">
                            <h2 className="text-xl font-bold font-['Hanken_Grotesk'] mb-4 text-[#FFD700]">Product Overview</h2>
                            {product.images && product.images.length > 0 && (
                                <img 
                                    src={product.images[0].url} 
                                    alt={product.images[0].alt || product.title} 
                                    className="w-full h-64 object-cover rounded mb-4 border border-[#262626]"
                                />
                            )}
                            <p className="text-[#A0A0A0] text-sm leading-relaxed mb-4">{product.description}</p>
                            <div className="flex justify-between items-center border-t border-[#262626] pt-4 mt-4">
                                <span className="font-['JetBrains_Mono'] text-[#A0A0A0] text-xs">BASE PRICE</span>
                                <span className="font-['JetBrains_Mono'] text-lg text-white">
                                    {product.price?.currency} {product.price?.amount}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Variants Section */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold font-['Hanken_Grotesk'] mb-6">Variants ({product.variants?.length || 0})</h2>
                        
                        {product.variants && product.variants.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {product.variants.map((variant, idx) => (
                                    <div key={idx} className="bg-[#1A1A1A] rounded-lg border border-[#262626] p-5 hover:border-[#FFD700] transition-colors group">
                                        <div className="flex gap-4">
                                            {variant.images && variant.images.length > 0 ? (
                                                <img src={variant.images[0].url} className="w-20 h-20 object-cover rounded bg-[#0D0D0D]" alt="Variant" />
                                            ) : (
                                                <div className="w-20 h-20 bg-[#0D0D0D] rounded border border-[#262626] flex items-center justify-center">
                                                    <span className="text-[#A0A0A0] text-xs font-['JetBrains_Mono']">NO IMG</span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-sm font-['JetBrains_Mono'] text-[#FFD700]">
                                                        {variant.price?.currency || product.price?.currency} {variant.price?.amount}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-xs text-[#A0A0A0] font-['JetBrains_Mono']">STOCK:</label>
                                                        <input 
                                                            type="number" 
                                                            value={variant.stock}
                                                            onChange={(e) => handleStockChange(idx, e.target.value)}
                                                            className="w-16 bg-[#0D0D0D] border border-[#262626] text-white p-1 rounded text-xs focus:outline-none focus:border-[#FFD700]"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    {variant.attributes && Object.keys(variant.attributes).map(key => (
                                                        <div key={key} className="text-sm">
                                                            <span className="text-[#A0A0A0] mr-2">{key}:</span>
                                                            <span className="text-white">{variant.attributes[key]}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#1A1A1A] rounded-lg border border-[#262626] p-12 text-center">
                                <p className="text-[#A0A0A0] mb-4">No variants exist for this product yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#262626] p-6 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold font-['Hanken_Grotesk']">Create New Variant</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#A0A0A0] hover:text-white text-2xl leading-none">&times;</button>
                        </div>
                        
                        <form onSubmit={handleSubmitVariant} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-['JetBrains_Mono'] text-[#A0A0A0] mb-2 tracking-wider">STOCK QUANTITY</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={variantForm.stock}
                                        onChange={(e) => setVariantForm({...variantForm, stock: e.target.value})}
                                        className="w-full bg-[#0D0D0D] border border-[#262626] text-white p-3 rounded focus:outline-none focus:border-[#FFD700] transition-colors"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-['JetBrains_Mono'] text-[#A0A0A0] mb-2 tracking-wider">PRICE OVERRIDE</label>
                                    <input 
                                        type="number" 
                                        value={variantForm.priceAmount}
                                        onChange={(e) => setVariantForm({...variantForm, priceAmount: e.target.value})}
                                        className="w-full bg-[#0D0D0D] border border-[#262626] text-white p-3 rounded focus:outline-none focus:border-[#FFD700] transition-colors"
                                        placeholder={`Default: ${product.price?.amount}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-['JetBrains_Mono'] text-[#A0A0A0] mb-2 tracking-wider">VARIANT IMAGES</label>
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full bg-[#0D0D0D] border border-[#262626] text-[#A0A0A0] p-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#FFD700] file:text-[#0D0D0D] hover:file:bg-[#e9c400] transition-colors"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-['JetBrains_Mono'] text-[#A0A0A0] tracking-wider">ATTRIBUTES</label>
                                    <button 
                                        type="button" 
                                        onClick={addAttributeField}
                                        className="text-[#FFD700] text-xs font-['JetBrains_Mono'] hover:underline"
                                    >
                                        + ADD PAIR
                                    </button>
                                </div>
                                
                                <div className="space-y-3">
                                    {variantForm.attributes.map((attr, idx) => (
                                        <div key={idx} className="flex gap-3">
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Color"
                                                value={attr.key}
                                                onChange={(e) => handleAttributeChange(idx, 'key', e.target.value)}
                                                className="flex-1 bg-[#0D0D0D] border border-[#262626] text-white p-3 rounded text-sm focus:outline-none focus:border-[#FFD700] transition-colors"
                                            />
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Midnight Black"
                                                value={attr.value}
                                                onChange={(e) => handleAttributeChange(idx, 'value', e.target.value)}
                                                className="flex-1 bg-[#0D0D0D] border border-[#262626] text-white p-3 rounded text-sm focus:outline-none focus:border-[#FFD700] transition-colors"
                                            />
                                            {variantForm.attributes.length > 1 && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeAttributeField(idx)}
                                                    className="px-3 border border-[#262626] text-[#A0A0A0] hover:text-red-500 hover:border-red-500 rounded transition-colors"
                                                >
                                                    &times;
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 border border-[#262626] text-white px-4 py-3 rounded font-['JetBrains_Mono'] text-sm hover:border-[#FFD700] transition-colors"
                                >
                                    CANCEL
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 bg-[#FFD700] text-[#0D0D0D] px-4 py-3 rounded font-['JetBrains_Mono'] text-sm font-medium hover:bg-[#e9c400] transition-colors"
                                >
                                    SAVE VARIANT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerProductDetails;