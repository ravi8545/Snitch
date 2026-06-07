import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hook/useProduct';

const MAX_IMAGES = 7;
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];

/* ─── Shared input class ─── */
const inputCls =
  'w-full bg-[#131313] border border-[#262626] px-5 py-3.5 text-sm text-[#E5E2E1] placeholder-[#555] outline-none transition-all duration-200 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/20 rounded-sm';

/* ─── Shared label class ─── */
const labelCls =
  'block text-[11px] font-medium uppercase tracking-widest text-[#A0A0A0] mb-2.5';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
  });

  const [images, setImages] = useState([]);   // [{ file, preview }]
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);              // fixes drag-leave flicker on child elements
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* ─── Field change ─── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ─── Image helpers ─── */
  const addImages = useCallback(
    (files) => {
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;
      const toAdd = Array.from(files)
        .slice(0, remaining)
        .filter((f) => f.type.startsWith('image/'))
        .map((file) => ({ file, preview: URL.createObjectURL(file) }));
      setImages((prev) => [...prev, ...toAdd]);
    },
    [images.length]
  );

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  /* ─── Drag & Drop ─── */
  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current += 1;
    if (dragCounter.current === 1) setIsDragging(true);
  };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    addImages(e.dataTransfer.files);
  };

  /* ─── Submit ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.title.trim()) { setError('Please add a product title.'); return; }
    if (!formData.priceAmount || Number(formData.priceAmount) <= 0) {
      setError('Please enter a valid price.'); return;
    }
    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('description', formData.description.trim());
    payload.append('priceAmount', formData.priceAmount);
    payload.append('priceCurrency', formData.priceCurrency);
    images.forEach(({ file }) => payload.append('images', file));
    try {
      setLoading(true);
      const product = await handleCreateProduct(payload);
      if (product) navigate('/');
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Upload zone ─── */
  const UploadZone = (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative flex flex-col items-center justify-center border-2 border-dashed min-h-[180px] cursor-pointer transition-all duration-300 rounded-sm select-none
        ${isDragging
          ? 'border-[#FFD700] bg-[#FFD700]/5 scale-[1.01]'
          : 'border-[#262626] bg-[#131313] hover:border-[#FFD700]/50 hover:bg-[#1A1919]'
        }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { addImages(e.target.files); e.target.value = ''; }}
      />
      {/* Cloud-upload icon */}
      <svg
        className={`h-9 w-9 mb-3 transition-all duration-300 group-hover:scale-110 ${isDragging ? 'text-[#FFD700] scale-110' : 'text-[#FFD700]/70'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.044 11.095" />
      </svg>
      <p className="text-sm text-[#E5E2E1] text-center px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
        {isDragging ? (
          <span className="text-[#FFD700] font-medium">Drop to add images</span>
        ) : (
          <>Drag &amp; drop or <span className="text-[#FFD700] font-medium">click to upload</span></>
        )}
      </p>
      <p className="mt-1.5 text-[10px] text-[#555] uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        JPEG · PNG · HEIC — up to {MAX_IMAGES} images
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#E5E2E1] pb-32">

      {/* ══════════════ Sticky Top Bar ══════════════ */}
      <header
        className="w-full sticky top-0 z-50 bg-[#0D0D0D]/85 backdrop-blur-md border-b border-[#262626]/40 flex items-center h-16 px-6 lg:px-12"
        style={{ WebkitBackdropFilter: 'blur(14px)' }}
      >
        <div className="flex items-center w-full max-w-7xl mx-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[#FFD700] p-2 -ml-2 hover:bg-[#1C1B1B] rounded-full transition-colors active:opacity-70"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1
            className="ml-4 text-lg lg:text-xl font-semibold tracking-tight text-[#FFD700]"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            New Listing
          </h1>

          {/* Desktop inline CTA */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <button
              type="button"
              className="px-6 py-2.5 border border-[#262626] text-[11px] font-medium uppercase tracking-widest text-[#E5E2E1] hover:border-[#FFD700] transition-all duration-200 rounded-sm cursor-pointer"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Save Draft
            </button>
            <button
              type="submit"
              form="create-product-form"
              disabled={loading}
              className="px-8 py-2.5 bg-[#FFD700] text-[#0D0D0D] text-[11px] font-bold uppercase tracking-[0.18em] shadow-[0_8px_20px_-8px_rgba(255,215,0,0.4)] hover:bg-[#E9C400] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-sm"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {loading ? 'Publishing…' : 'Create Listing'}
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════ Main Canvas ══════════════ */}
      <main className="px-6 lg:px-12 pt-10 lg:pt-14">
        <div className="max-w-7xl mx-auto">
          <form id="create-product-form" onSubmit={handleSubmit}>

            {/* Error banner */}
            {error && (
              <div
                className="mb-8 p-4 rounded-sm border border-red-950 bg-red-950/40 text-red-400 text-sm flex items-start gap-2.5"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* ────────────────────────────────────────
                Desktop: two-column grid
                Mobile:  single column (stacked)
            ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">

              {/* ╔══════════════ LEFT COLUMN ══════════════╗ */}
              <div className="space-y-8">

                {/* ── Product Details card ── */}
                <div className="bg-[#0F0F0F] border border-[#1E1E1E] rounded p-7 lg:p-9 space-y-7">
                  <p
                    className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A0A0A0]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Product Details
                  </p>

                  {/* Title */}
                  <div>
                    <label htmlFor="cp-title" className={labelCls} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      Title
                    </label>
                    <input
                      id="cp-title"
                      name="title"
                      type="text"
                      required
                      placeholder="Enter product name"
                      value={formData.title}
                      onChange={handleChange}
                      className={inputCls}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="cp-description" className={labelCls} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      Description
                    </label>
                    <textarea
                      id="cp-description"
                      name="description"
                      rows={6}
                      placeholder="Describe your item — material, size, condition…"
                      value={formData.description}
                      onChange={handleChange}
                      className={`${inputCls} resize-none leading-relaxed`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    <p
                      className="mt-2 text-[10px] text-[#555] text-right"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {formData.description.length} chars
                    </p>
                  </div>
                </div>

                {/* ── Pricing card ── */}
                <div className="bg-[#0F0F0F] border border-[#1E1E1E] rounded p-7 lg:p-9 space-y-5">
                  <p
                    className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A0A0A0]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Pricing
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Amount */}
                    <div className="flex-1">
                      <label htmlFor="cp-priceAmount" className={labelCls} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        Amount
                      </label>
                      <input
                        id="cp-priceAmount"
                        name="priceAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.priceAmount}
                        onChange={handleChange}
                        className={`${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>

                    {/* Currency */}
                    <div className="sm:w-40">
                      <label htmlFor="cp-priceCurrency" className={labelCls} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        Currency
                      </label>
                      <div className="relative">
                        <select
                          id="cp-priceCurrency"
                          name="priceCurrency"
                          value={formData.priceCurrency}
                          onChange={handleChange}
                          className={`${inputCls} appearance-none cursor-pointer pr-10`}
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {CURRENCIES.map((c) => (
                            <option key={c} value={c} className="bg-[#131313]">{c}</option>
                          ))}
                        </select>
                        <svg
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0A0]"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ╚══════════════ END LEFT ══════════════╝ */}

              {/* ╔══════════════ RIGHT COLUMN ══════════════╗ */}
              <div className="bg-[#0F0F0F] border border-[#1E1E1E] rounded p-7 lg:p-9 space-y-6 lg:sticky lg:top-24">

                {/* Section header */}
                <div className="flex items-end justify-between">
                  <p
                    className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#A0A0A0]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Visuals
                  </p>
                  <span
                    className={`text-[10px] uppercase tracking-widest ${images.length >= MAX_IMAGES ? 'text-[#FFD700]' : 'text-[#555]'}`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {images.length}/{MAX_IMAGES}
                  </span>
                </div>

                {/* Upload zone — always visible until full */}
                {images.length < MAX_IMAGES && UploadZone}

                {/* Full message when at capacity */}
                {images.length >= MAX_IMAGES && (
                  <div className="flex items-center gap-2 text-[#FFD700] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Maximum images reached — remove one to add more.
                  </div>
                )}

                {/* Thumbnail grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2.5">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className="aspect-square relative overflow-hidden bg-[#1A1919] rounded-sm group"
                      >
                        <img
                          src={img.preview}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          draggable={false}
                        />
                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1.5 right-1.5 bg-[#0D0D0D]/85 hover:bg-red-950/90 hover:text-red-400 text-[#E5E2E1] w-6 h-6 flex items-center justify-center transition-colors rounded-sm"
                          aria-label="Remove image"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        {/* Cover badge */}
                        {index === 0 && (
                          <span
                            className="absolute bottom-1.5 left-1.5 text-[8px] px-1.5 py-0.5 bg-[#FFD700] text-[#0D0D0D] font-bold uppercase tracking-wide rounded-sm"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty state hint */}
                {images.length === 0 && (
                  <p
                    className="text-[11px] text-[#444] text-center pt-1"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    The first image will be used as the cover.
                  </p>
                )}
              </div>
              {/* ╚══════════════ END RIGHT ══════════════╝ */}

            </div>
          </form>
        </div>
      </main>

      {/* ══════════════ Fixed Mobile Footer ══════════════ */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#0D0D0D] border-t border-[#262626]/50 px-6 py-4 z-50">
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 py-3.5 border border-[#262626] text-[11px] font-medium uppercase tracking-widest text-[#E5E2E1] hover:border-[#FFD700] transition-all duration-200 rounded-sm cursor-pointer"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Save Draft
          </button>
          <button
            type="submit"
            form="create-product-form"
            disabled={loading}
            className="flex-[2] py-3.5 bg-[#FFD700] text-[#0D0D0D] text-[11px] font-bold uppercase tracking-[0.18em] shadow-[0_8px_20px_-8px_rgba(255,215,0,0.4)] hover:bg-[#E9C400] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-sm"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {loading ? 'Publishing…' : 'Create Listing'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default CreateProduct;
