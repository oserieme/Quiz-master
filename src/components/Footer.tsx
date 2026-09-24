import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950 py-6 mt-auto">
      <div className="max-w-5xl mx-auto px-4 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-2">
          <span>Quiz Master</span>
          <span aria-hidden="true">·</span>
          <span>General Knowledge Challenge</span>
          <span aria-hidden="true">·</span>
          <span>10 Questions per Round</span>
        </p>
      </div>
    </footer>
  );
};
