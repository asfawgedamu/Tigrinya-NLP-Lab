import React from 'react';
import { LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

/** Compact author/admin sign-in control. Visitors never need it. */
export const AdminChip: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const { user, isAdmin, checking, error, signIn, logOut } = useAdmin();
  const base = `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border font-mono text-xs transition cursor-pointer ${
    isDark ? 'border-slate-700 text-cyan-300 hover:bg-slate-800' : 'border-[#C5CEC8] text-cyan-700 hover:bg-[#E1E6E0]'
  }`;
  return (
    <div className="flex flex-col items-start sm:items-end gap-1 min-w-0">
      {user ? (
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] min-w-0 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
            <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isAdmin ? 'text-emerald-500' : 'text-amber-500'}`} />
            <span className="truncate max-w-[14rem]">
              {checking ? 'Checking access…' : isAdmin ? `Author mode · ${user.email}` : `${user.email} is not the admin account`}
            </span>
          </span>
          <button type="button" onClick={logOut} className={base}><LogOut className="w-3.5 h-3.5" />Sign out</button>
        </div>
      ) : (
        <button type="button" onClick={signIn} className={base}><LogIn className="w-3.5 h-3.5" />Author sign-in</button>
      )}
      {error && <span className="text-[11px] font-mono text-red-500">{error}</span>}
    </div>
  );
};
