import React, { useState } from 'react';
import { Sparkles, Trophy, ShieldCheck, X, AlertCircle, Loader2, Copy, Check, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueAsGuest?: () => void;
  onSuccess?: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onContinueAsGuest,
  onSuccess,
}) => {
  const [copiedHost, setCopiedHost] = useState(false);
  const {
    signInWithGoogle,
    signInWithGoogleRedirect,
    isSigningIn,
    authError,
    authErrorCode,
    currentHost,
    projectId,
    clearAuthError,
  } = useAuth();

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    sound.playSelect();
    const success = await signInWithGoogle();
    if (success) {
      sound.playCorrect();
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  const handleGuestClick = () => {
    sound.playSelect();
    clearAuthError();
    if (onContinueAsGuest) {
      onContinueAsGuest();
    } else {
      onClose();
    }
  };

  const handleCopyHost = () => {
    if (currentHost && navigator.clipboard) {
      navigator.clipboard.writeText(currentHost);
      setCopiedHost(true);
      setTimeout(() => setCopiedHost(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative overflow-hidden text-center max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-title"
      >
        {/* Ambient background glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={() => {
            sound.playSelect();
            clearAuthError();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-850 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
          aria-label="Close sign in dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Quiz Master Branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/25 mb-3">
            <Sparkles className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>
          <h2 id="signin-title" className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Quiz Master
          </h2>
          <span className="text-xs font-medium text-amber-400 mt-0.5">
            Player Authentication
          </span>
        </div>

        {/* Informative message */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6 text-center space-y-3">
          <p className="text-sm sm:text-base font-semibold text-white leading-snug">
            Sign in to save your scores and participate in the leaderboard.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-1">
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Save Scores
            </span>
            <span className="text-slate-600">·</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Global Leaderboard
            </span>
          </div>
        </div>

        {/* Error notification banner if any */}
        {authError && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs text-left animate-fadeIn space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="flex-1 leading-relaxed">{authError}</span>
            </div>

            {/* Actionable guidance if domain authorization is required */}
            {authErrorCode === 'auth/unauthorized-domain' && currentHost && (
              <div className="mt-2 p-3 rounded-lg bg-slate-900 border border-amber-500/30 text-slate-200 space-y-2">
                <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Domain Setup in Firebase Console</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  Add this domain to Authorized Domains in Firebase:
                </p>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                  <code className="text-[11px] font-mono text-amber-300 flex-1 truncate select-all">
                    {currentHost}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyHost}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium cursor-pointer transition-colors"
                  >
                    {copiedHost ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                {projectId && (
                  <a
                    href={`https://console.firebase.google.com/project/${projectId}/authentication/settings`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 underline font-medium pt-1"
                  >
                    <span>Open Firebase Auth Settings</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {/* Fallback option if popup was blocked */}
            {authErrorCode === 'auth/popup-blocked' && (
              <button
                type="button"
                onClick={() => signInWithGoogleRedirect()}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
              >
                Try Redirect Sign-In
              </button>
            )}
          </div>
        )}

        {/* Continue with Google button */}
        <div className="space-y-3">
          <button
            type="button"
            disabled={isSigningIn}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm sm:text-base shadow-lg shadow-white/5 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-slate-700" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                {/* Official Google Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Continue as Guest option */}
          <button
            type="button"
            onClick={handleGuestClick}
            className="w-full py-3 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 font-medium text-xs sm:text-sm transition-all cursor-pointer"
          >
            Continue as Guest
          </button>
        </div>

        {/* Guest explanation note */}
        <p className="mt-4 text-[11px] text-slate-400 leading-relaxed">
          Guests can play all categories and difficulties freely. You can sign in anytime to link your stats and join the leaderboard.
        </p>
      </div>
    </div>
  );
};
