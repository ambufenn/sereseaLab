import React, { useState } from 'react';
import { UserRole, UserProfile } from '../../types';
import { ShoppingBag, Truck, ArrowRight, Anchor, CheckCircle2, ShieldCheck, Snowflake, LogIn } from 'lucide-react';
import { signInWithGoogle, auth } from '../../lib/firebase';
import heroImage from '../../assets/images/seafood_logistics_hero_1792035022885.jpg';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  const [userName, setUserName] = useState<string>('Sarah Lin');
  const [companyName, setCompanyName] = useState<string>('Oceanic Procurement Co.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'buyer') {
      setUserName('Sarah Lin');
      setCompanyName('Oceanic Procurement Co.');
    } else {
      setUserName('Marcus Vance');
      setCompanyName('Nordic Cold-Chain Fleet');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const fbUser = await signInWithGoogle();
      if (fbUser) {
        onLogin({
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Authenticated User',
          role: selectedRole,
          organization: companyName.trim() || (selectedRole === 'buyer' ? 'Oceanic Procurement Co.' : 'Nordic Cold-Chain Fleet'),
          avatarUrl: fbUser.photoURL || undefined
        });
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Failed to authenticate with Google. You can also use Instant Demo Access.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setIsLoading(true);
    // Smooth transition within login layout
    setTimeout(() => {
      onLogin({
        name: userName.trim(),
        role: selectedRole,
        organization: companyName.trim() || (selectedRole === 'buyer' ? 'Oceanic Procurement Co.' : 'Nordic Cold-Chain Fleet')
      });
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Column: Visual Seafood Logistics Presentation */}
        <div className="lg:col-span-5 relative bg-slate-900 text-white flex flex-col justify-between p-8 sm:p-10 overflow-hidden">
          {/* Background Image with Scrim */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt="Cold-chain reefer vessel at port"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />
          </div>

          {/* Top Brand Marker */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 backdrop-blur-md border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Anchor className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">SereSeaShip Guard</span>
              <span className="text-xs text-teal-200/80 block">Supply Intelligence Platform</span>
            </div>
          </div>

          {/* Center Editorial Quote & Context */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-300 bg-teal-950/60 backdrop-blur-sm border border-teal-500/30 px-3 py-1.5 rounded-lg">
              <Snowflake className="w-3.5 h-3.5" />
              <span>Zero-Spoilage Cold-Chain Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-snug tracking-tight text-white text-balance">
              Safeguarding global seafood freshness from ocean catch to plate.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Real-time reefer container telemetry, predictive demand intelligence, and AI-driven food waste mitigation for modern aquaculture and commercial fisheries.
            </p>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>ISO 22000 & HACCP Compliant</span>
            </div>
            <span className="text-slate-400">v2.4 Commercial</span>
          </div>
        </div>

        {/* Right Column: Clean, Modern Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Welcome to SereSeaShip Guard
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                Select your operational role to access your dedicated supply chain workspace.
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                Select Operational Workspace
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Buyer Option */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('buyer')}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between relative ${
                    selectedRole === 'buyer'
                      ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      selectedRole === 'buyer' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    {selectedRole === 'buyer' && (
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    )}
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900">Seafood Buyer</span>
                    <span className="block text-xs text-slate-500 mt-0.5">Purchasing, Suppliers & Freshness</span>
                  </div>
                </button>

                {/* Logistics Option */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('logistics')}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between relative ${
                    selectedRole === 'logistics'
                      ? 'border-sky-600 bg-sky-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      selectedRole === 'logistics' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Truck className="w-4 h-4" />
                    </div>
                    {selectedRole === 'logistics' && (
                      <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    )}
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900">Logistics & Fleet</span>
                    <span className="block text-xs text-slate-500 mt-0.5">Cold-Chain, Reefer & Routing</span>
                  </div>
                </button>
              </div>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                {authError}
              </div>
            )}

            {/* Real Google Authentication */}
            <div className="mb-5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 flex items-center justify-center gap-2.5 shadow-xs transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign in with Google ({selectedRole === 'buyer' ? 'Buyer' : 'Logistics'})</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-400">or enter with custom credentials</span>
                </div>
              </div>
            </div>

            {/* Login Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="user-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Full Name
                </label>
                <input
                  id="user-name"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g., Sarah Lin"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label htmlFor="company-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Organization / Entity
                </label>
                <input
                  id="company-name"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Oceanic Procurement Co."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !userName.trim()}
                  className={`w-full py-3 px-5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-70 ${
                    selectedRole === 'buyer'
                      ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20'
                      : 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/20'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Opening Workspace...</span>
                    </div>
                  ) : (
                    <>
                      <span>Enter {selectedRole === 'buyer' ? 'Buyer' : 'Logistics'} Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Passwordless Demo Tag */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Passwordless Demo Environment</span>
              <span className="font-mono text-slate-500">Instant Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
