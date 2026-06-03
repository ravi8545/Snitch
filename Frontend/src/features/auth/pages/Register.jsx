import { useState } from 'react';
import { useAuth } from '../hook/useAuth';
import {useNavigate} from 'react-router';

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    contact: '',
    password: '',
    isSeller: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({
      email:formData.email,
      password:formData.password,
      fullname:formData.fullname,
      contact:formData.contact,
      isSeller:formData.isSeller
    });
    navigate('/')
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] px-5 py-16">
      {/* ── card ── */}
      <div className="w-full max-w-md rounded-lg bg-[#1A1A1A] border border-[#262626] p-10 md:p-12 space-y-10">
        {/* ── header ── */}
        <div className="space-y-3 text-center">
          <h1
            className="text-3xl font-bold tracking-tight text-[#E5E2E1]"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            Create Account
          </h1>
          <p
            className="text-sm text-[#A0A0A0]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Join Snitch — start buying or selling today.
          </p>
        </div>

        {/* ── form ── */}
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Full Name */}
          <div className="space-y-2">
            <label
              htmlFor="register-fullname"
              className="block text-xs font-medium tracking-widest uppercase text-[#A0A0A0]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Full Name
            </label>
            <input
              id="register-fullname"
              name="fullname"
              type="text"
              required
              placeholder="Your full name"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full rounded bg-[#131313] border border-[#262626] px-4 py-3 text-[#E5E2E1] placeholder-[#555] text-sm outline-none transition-colors duration-200 focus:border-[#FFD700]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="register-email"
              className="block text-xs font-medium tracking-widest uppercase text-[#A0A0A0]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Email Address
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              required
              placeholder="your email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded bg-[#131313] border border-[#262626] px-4 py-3 text-[#E5E2E1] placeholder-[#555] text-sm outline-none transition-colors duration-200 focus:border-[#FFD700]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <label
              htmlFor="register-contact"
              className="block text-xs font-medium tracking-widest uppercase text-[#A0A0A0]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Contact Number
            </label>
            <input
              id="register-contact"
              name="contact"
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={formData.contact}
              onChange={handleChange}
              className="w-full rounded bg-[#131313] border border-[#262626] px-4 py-3 text-[#E5E2E1] placeholder-[#555] text-sm outline-none transition-colors duration-200 focus:border-[#FFD700]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="register-password"
              className="block text-xs font-medium tracking-widest uppercase text-[#A0A0A0]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="register-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded bg-[#131313] border border-[#262626] px-4 py-3 pr-12 text-[#E5E2E1] placeholder-[#555] text-sm outline-none transition-colors duration-200 focus:border-[#FFD700]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-[#FFD700] transition-colors duration-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  /* eye-off icon */
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  /* eye icon */
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* ── isSeller checkbox ── */}
          <div className="flex items-start gap-3 pt-2">
            <input
              id="register-isSeller"
              name="isSeller"
              type="checkbox"
              checked={formData.isSeller}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 shrink-0 appearance-none rounded-sm border border-[#262626] bg-[#131313] checked:bg-[#FFD700] checked:border-[#FFD700] cursor-pointer transition-colors duration-200 relative
                after:content-[''] after:absolute after:inset-0 after:m-auto after:h-2 after:w-1.5 after:border-r-2 after:border-b-2 after:border-[#0D0D0D] after:rotate-45 after:opacity-0 checked:after:opacity-100 after:translate-y-[-1px]"
            />
            <label
              htmlFor="register-isSeller"
              className="text-sm text-[#A0A0A0] cursor-pointer leading-snug"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              I want to register as a{' '}
              <span className="text-[#FFD700] font-medium">Seller</span>
            </label>
          </div>

          {/* ── submit ── */}
          <button
            id="register-submit"
            type="submit"
            className="w-full rounded py-3.5 text-sm font-semibold tracking-wider uppercase bg-[#FFD700] text-[#0D0D0D] hover:bg-[#e9c400] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Register Now
          </button>
        </form>

        {/* ── footer link ── */}
        <p
          className="text-center text-sm text-[#A0A0A0]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Already have an account?{' '}
          <a
            href="/login"
            className="text-[#FFD700] hover:underline underline-offset-4 transition-colors duration-200"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
