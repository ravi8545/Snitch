import React, { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

/* ─── tiny helpers ─── */
const fmt = (amount, currency) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

/* ─── is the URL a video? ─── */
const isVideo = (url = "") =>
    /\.(mp4|mov|webm|ogg)(\?|$)/i.test(url);

/* ─── Media thumbnail (image or video poster) ─── */
const MediaThumb = ({ url, alt, className }) =>
    isVideo(url) ? (
        <video
            src={url}
            className={className}
            muted
            playsInline
            preload="metadata"
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
        />
    ) : (
        <img src={url} alt={alt || "Product"} className={className} />
    );

/* ─── Product Card ─── */
const ProductCard = ({ product, index }) => {
    const [hovered, setHovered] = useState(false);
    const coverMedia = product.images?.[0];
    const secondMedia = product.images?.[1];
    const shownMedia = hovered && secondMedia ? secondMedia : coverMedia;
    const title = product.title || "Untitled Product";
    const price = product.price;

    return (
        <div
            className="group relative bg-[#0F0F0F] border border-[#1E1E1E] rounded overflow-hidden flex flex-col transition-all duration-300 hover:border-[#FFD700]/30 hover:shadow-[0_0_40px_-10px_rgba(255,215,0,0.12)]"
            style={{ animationDelay: `${index * 60}ms` }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Media */}
            <div className="relative aspect-[4/3] bg-[#141414] overflow-hidden">
                {shownMedia ? (
                    <MediaThumb
                        url={shownMedia.url}
                        alt={shownMedia.alt || title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-[#2A2A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                        </svg>
                    </div>
                )}

                {/* Image count badge */}
                {product.images?.length > 1 && (
                    <span
                        className="absolute bottom-2 right-2 bg-[#0D0D0D]/85 backdrop-blur-sm text-[#A0A0A0] text-[9px] uppercase tracking-wider px-2 py-1 rounded-sm flex items-center gap-1"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M3.75 3h16.5" />
                        </svg>
                        {product.images.length}
                    </span>
                )}

                {/* Hover overlay for video indicator */}
                {coverMedia && isVideo(coverMedia.url) && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-10 h-10 rounded-full bg-[#FFD700]/90 flex items-center justify-center shadow-lg">
                            <svg className="w-4 h-4 text-[#0D0D0D] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <h3
                    className="text-sm font-medium text-[#E5E2E1] truncate leading-tight"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                    title={title}
                >
                    {title}
                </h3>

                {product.description && (
                    <p
                        className="text-[11px] text-[#555] line-clamp-2 leading-relaxed"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        {product.description}
                    </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1E1E1E]">
                    <span
                        className="text-[#FFD700] font-semibold text-sm tracking-tight"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                    >
                        {price ? fmt(price.amount, price.currency) : "—"}
                    </span>
                    <span
                        className="text-[#444] text-[9px] uppercase tracking-wider"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        {timeAgo(product.createdAt)}
                    </span>
                </div>
            </div>

            {/* Hover quick-actions */}
            <div className="absolute top-2 left-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                <button
                    className="w-7 h-7 rounded-sm bg-[#0D0D0D]/90 backdrop-blur-sm border border-[#2A2A2A] flex items-center justify-center text-[#A0A0A0] hover:text-[#FFD700] hover:border-[#FFD700]/40 transition-colors"
                    title="Edit product"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    </svg>
                </button>
                <button
                    className="w-7 h-7 rounded-sm bg-[#0D0D0D]/90 backdrop-blur-sm border border-[#2A2A2A] flex items-center justify-center text-[#A0A0A0] hover:text-red-400 hover:border-red-900/60 transition-colors"
                    title="Delete product"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

/* ─── Stat pill ─── */
const StatPill = ({ label, value, accent }) => (
    <div className="flex flex-col gap-0.5">
        <span
            className={`text-lg font-semibold tracking-tight ${accent ? "text-[#FFD700]" : "text-[#E5E2E1]"}`}
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
        >
            {value}
        </span>
        <span
            className="text-[10px] uppercase tracking-widest text-[#555]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            {label}
        </span>
    </div>
);

/* ─── Empty state ─── */
const EmptyState = ({ onAdd }) => (
    <div className="flex flex-col items-center justify-center py-28 gap-5">
        <div className="w-20 h-20 rounded-full bg-[#FFD700]/5 border border-[#FFD700]/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#FFD700]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
        </div>
        <div className="text-center space-y-1.5">
            <p className="text-[#E5E2E1] font-medium" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                No listings yet
            </p>
            <p className="text-[#555] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                Add your first product to start selling.
            </p>
        </div>
        <button
            onClick={onAdd}
            className="mt-2 px-7 py-2.5 bg-[#FFD700] text-[#0D0D0D] text-[11px] font-bold uppercase tracking-[0.18em] shadow-[0_8px_20px_-8px_rgba(255,215,0,0.4)] hover:bg-[#E9C400] active:scale-[0.98] transition-all duration-200 rounded-sm cursor-pointer"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            + New Listing
        </button>
    </div>
);

/* ═══════════════════════════════════════
   MAIN Dashboard
═══════════════════════════════════════ */
const Dashboard = () => {
    const navigate = useNavigate();
    const { handleGetSellerProduct } = useProduct();
    const sellerProducts = useSelector((state) => state.products.sellerProducts);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        (async () => {
            await handleGetSellerProduct();
            setLoading(false);
        })();
    }, []);

    /* derived */
    const products = sellerProducts || [];

    const filtered = products
        .filter((p) => {
            const q = search.toLowerCase();
            return (
                (p.title || "").toLowerCase().includes(q) ||
                (p.description || "").toLowerCase().includes(q)
            );
        })
        .sort((a, b) => {
            if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === "price-asc") return (a.price?.amount ?? 0) - (b.price?.amount ?? 0);
            if (sortBy === "price-desc") return (b.price?.amount ?? 0) - (a.price?.amount ?? 0);
            return 0;
        });

    const totalValue = products.reduce((acc, p) => acc + (p.price?.amount ?? 0), 0);
    const currency = products[0]?.price?.currency ?? "INR";
    const mediaCount = products.reduce((acc, p) => acc + (p.images?.length ?? 0), 0);

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-[#E5E2E1]">

            {/* ── Sticky Header ── */}
            <header
                className="w-full sticky top-0 z-50 bg-[#0D0D0D]/85 backdrop-blur-md border-b border-[#262626]/40 flex items-center h-16 px-6 lg:px-12"
                style={{ WebkitBackdropFilter: "blur(14px)" }}
            >
                <div className="flex items-center w-full max-w-7xl mx-auto gap-4">
                    {/* Logo / wordmark */}
                    <span
                        className="text-[#FFD700] text-lg font-bold tracking-tight mr-2"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                    >
                        snitch
                    </span>

                    <span className="text-[#2A2A2A] text-lg select-none">/</span>

                    <h1
                        className="text-sm font-medium text-[#A0A0A0] tracking-tight"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                    >
                        Seller Dashboard
                    </h1>

                    <div className="ml-auto flex items-center gap-3">
                        <button
                            onClick={() => navigate("/seller/create-product")}
                            className="flex items-center gap-2 px-5 py-2 bg-[#FFD700] text-[#0D0D0D] text-[11px] font-bold uppercase tracking-[0.18em] shadow-[0_6px_16px_-6px_rgba(255,215,0,0.35)] hover:bg-[#E9C400] active:scale-[0.97] transition-all duration-200 rounded-sm cursor-pointer"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            New Listing
                        </button>
                    </div>
                </div>
            </header>

            <main className="px-6 lg:px-12 pt-10 pb-20 max-w-7xl mx-auto">

                {/* ── Stats Bar ── */}
                {!loading && products.length > 0 && (
                    <div className="flex flex-wrap items-center gap-8 mb-10 pb-8 border-b border-[#1E1E1E]">
                        <StatPill label="Total Listings" value={products.length} accent />
                        <div className="w-px h-8 bg-[#1E1E1E]" />
                        <StatPill label="Portfolio Value" value={fmt(totalValue, currency)} />
                        <div className="w-px h-8 bg-[#1E1E1E]" />
                        <StatPill label="Media Files" value={mediaCount} />
                        <div className="w-px h-8 bg-[#1E1E1E]" />
                        <StatPill
                            label="Avg Price"
                            value={products.length ? fmt(Math.round(totalValue / products.length), currency) : "—"}
                        />
                    </div>
                )}

                {/* ── Toolbar ── */}
                {!loading && products.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
                        {/* Search */}
                        <div className="relative flex-1 w-full sm:max-w-xs">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] pointer-events-none"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search listings…"
                                className="w-full bg-[#131313] border border-[#262626] pl-9 pr-4 py-2.5 text-sm text-[#E5E2E1] placeholder-[#444] outline-none transition-all duration-200 focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/10 rounded-sm"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            />
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                            {/* Result count */}
                            <span
                                className="text-[10px] text-[#444] uppercase tracking-widest hidden sm:inline"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                {filtered.length} of {products.length}
                            </span>

                            {/* Sort */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-[#131313] border border-[#262626] text-[11px] text-[#A0A0A0] pl-3 pr-8 py-2.5 outline-none focus:border-[#FFD700]/50 transition-all duration-200 rounded-sm cursor-pointer uppercase tracking-widest"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    <option value="newest">Newest</option>
                                    <option value="oldest">Oldest</option>
                                    <option value="price-desc">Price ↓</option>
                                    <option value="price-asc">Price ↑</option>
                                </select>
                                <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#555]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Loading skeleton ── */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-[#0F0F0F] border border-[#1E1E1E] rounded overflow-hidden animate-pulse">
                                <div className="aspect-[4/3] bg-[#1A1A1A]" />
                                <div className="p-4 space-y-3">
                                    <div className="h-3 bg-[#1A1A1A] rounded w-3/4" />
                                    <div className="h-2 bg-[#1A1A1A] rounded w-full" />
                                    <div className="h-2 bg-[#1A1A1A] rounded w-2/3" />
                                    <div className="pt-2 flex justify-between">
                                        <div className="h-3 bg-[#1A1A1A] rounded w-1/4" />
                                        <div className="h-2 bg-[#1A1A1A] rounded w-1/5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Empty state ── */}
                {!loading && products.length === 0 && (
                    <EmptyState onAdd={() => navigate("/seller/create-product")} />
                )}

                {/* ── No search results ── */}
                {!loading && products.length > 0 && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <svg className="w-10 h-10 text-[#2A2A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
                        </svg>
                        <p className="text-[#555] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                            No listings match <span className="text-[#A0A0A0]">"{search}"</span>
                        </p>
                        <button
                            onClick={() => setSearch("")}
                            className="text-[10px] text-[#FFD700] uppercase tracking-widest hover:underline"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                            Clear search
                        </button>
                    </div>
                )}

                {/* ── Product Grid ── */}
                {!loading && filtered.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filtered.map((product, i) => (
                            <ProductCard key={product._id} product={product} index={i} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
