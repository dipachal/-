import React, { useState } from 'react';
import { Lock, Shield, X, ArrowRight, UserCheck, KeyRound, CheckCircle2 } from 'lucide-react';
import { SystemUser } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemUsers: SystemUser[];
  onLoginSuccess: (user: SystemUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  systemUsers,
  onLoginSuccess 
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const foundUser = systemUsers.find(
      (u) => u.username.toLowerCase() === cleanUser
    );

    if (foundUser) {
      if (!foundUser.isActive) {
        setError('এই ইউজারের একাউন্ট বর্তমানে নিষ্ক্রিয় অবস্থায় আছে');
        return;
      }
      // Simple verification: if password is set, verify
      if (foundUser.password && foundUser.password !== password.trim()) {
        setError('পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।');
        return;
      }
      onLoginSuccess(foundUser);
      onClose();
    } else {
      // Fallback: create temporary or accept demo admin
      const fallbackUser: SystemUser = systemUsers[0] || {
        id: 'user-admin',
        name: 'সুপার এডমিন (হেড অফিস)',
        username: cleanUser || 'admin',
        role: 'super_admin',
        phone: '০১৭১২-০০০০০০',
        isActive: true,
        isSuperAdmin: true,
        allowedModules: [
          'overview',
          'fleet',
          'staff',
          'release',
          'road',
          'ledger',
          'reports',
          'inquiries',
          'users',
        ],
        createdAt: '2026-01-01',
      };
      onLoginSuccess(fallbackUser);
      onClose();
    }
  };

  const handleQuickSelectUser = (user: SystemUser) => {
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">দিবাচল এন্টারপ্রাইজ</h3>
              <p className="text-[11px] text-slate-400">সফটওয়্যার অপারেটর ও অ্যাডমিন লগইন</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {error && (
              <div className="p-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-md font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ইউজারনেম / আইডি</label>
              <input
                type="text"
                placeholder="যেমন: admin বা kashem"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">গোপন পাসওয়ার্ড</label>
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>নিরাপদ লগইন করুন</span>
            </button>
          </form>

          {/* Quick User Selector for testing RBAC permissions */}
          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
            <span className="text-[11px] font-bold text-slate-500 block">
              💡 টেস্ট করার জন্য দ্রুত ১-ক্লিক সুইচ:
            </span>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {systemUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickSelectUser(user)}
                  className="w-full p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-slate-900 block truncate leading-tight">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">@{user.username}</span>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-white text-slate-700 border border-slate-200 shrink-0">
                    {user.isSuperAdmin ? '👑 সুপার এডমিন' : user.role === 'accountant' ? 'হিসাবরক্ষক' : 'এটেন্ডেন্ট'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
