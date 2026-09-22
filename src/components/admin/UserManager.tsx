import React, { useState } from 'react';
import { SystemUser, SystemModuleId, SystemUserRole } from '../../types';
import { SYSTEM_MODULE_LABELS, toBengaliNumber, formatDisplayDate } from '../../utils/helpers';
import { ConfirmModal } from './ConfirmModal';
import { 
  ShieldCheck, 
  UserPlus, 
  Edit3, 
  Trash2, 
  KeyRound, 
  CheckSquare, 
  Square, 
  ShieldAlert, 
  UserCheck, 
  X, 
  Search, 
  Lock, 
  User, 
  Phone, 
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';

interface UserManagerProps {
  users: SystemUser[];
  currentActiveUser: SystemUser;
  onAddUser: (user: Omit<SystemUser, 'id' | 'createdAt'>) => void;
  onUpdateUser: (user: SystemUser) => void;
  onDeleteUser: (userId: string) => void;
  onSwitchUser: (user: SystemUser) => void;
}

const ALL_MODULES: SystemModuleId[] = [
  'overview',
  'fleet',
  'staff',
  'release',
  'road',
  'ledger',
  'reports',
  'inquiries',
  'users',
];

export const UserManager: React.FC<UserManagerProps> = ({
  users,
  currentActiveUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onSwitchUser,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<SystemUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<SystemUserRole>('attendant');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [allowedModules, setAllowedModules] = useState<SystemModuleId[]>([
    'overview',
    'release',
    'road',
    'inquiries',
  ]);
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingUser(null);
    setName('');
    setUsername('');
    setPassword('123456');
    setRole('attendant');
    setPhone('');
    setIsActive(true);
    setIsSuperAdmin(false);
    setAllowedModules(['overview', 'release', 'road', 'inquiries']);
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (user: SystemUser) => {
    setEditingUser(user);
    setName(user.name);
    setUsername(user.username);
    setPassword(user.password || '123456');
    setRole(user.role);
    setPhone(user.phone);
    setIsActive(user.isActive);
    setIsSuperAdmin(user.isSuperAdmin);
    setAllowedModules(user.allowedModules);
    setNotes(user.notes || '');
    setIsModalOpen(true);
  };

  const toggleModule = (modId: SystemModuleId) => {
    if (isSuperAdmin) return; // Super admin has everything
    if (allowedModules.includes(modId)) {
      setAllowedModules(allowedModules.filter((m) => m !== modId));
    } else {
      setAllowedModules([...allowedModules, modId]);
    }
  };

  const handleSelectAllModules = () => {
    setAllowedModules([...ALL_MODULES]);
  };

  const handleDeselectAllModules = () => {
    setAllowedModules(['overview']);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) {
      alert('নাম ও ইউজারনেম আবশ্যক');
      return;
    }

    const finalModules = isSuperAdmin ? [...ALL_MODULES] : allowedModules;

    const payload = {
      name,
      username: username.toLowerCase().trim(),
      password,
      role,
      phone,
      isActive,
      isSuperAdmin,
      allowedModules: finalModules,
      notes: notes || undefined,
    };

    if (editingUser) {
      onUpdateUser({
        ...payload,
        id: editingUser.id,
        createdAt: editingUser.createdAt,
      });
    } else {
      onAddUser(payload);
    }

    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header and action button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span>সফটওয়্যার ইউজার ও পারমিশন কন্ট্রোল (RBAC)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            সুপার অ্যাডমিন, একাউন্টেন্ট, টার্মিনাল এটেন্ডেন্ট ইউজার তৈরি এবং চেকবক্স দিয়ে মডিউল এক্সেস নির্ধারণ
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>নতুন অপারেটর ইউজার তৈরি করুন</span>
        </button>
      </div>

      {/* Active User Notice Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/60 border border-blue-400/30 flex items-center justify-center font-bold text-lg">
            {currentActiveUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-300">বর্তমানে সক্রিয় সেশন:</span>
              <strong className="text-sm font-bold text-white">{currentActiveUser.name}</strong>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">
                {currentActiveUser.isSuperAdmin ? '👑 সুপার অ্যাডমিন' : currentActiveUser.role.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-blue-200 mt-0.5">
              ইউজারনেম: <code className="font-mono text-white bg-blue-800/40 px-1.5 py-0.5 rounded">@{currentActiveUser.username}</code> • 
              অনুমোদিত মডিউল: {currentActiveUser.isSuperAdmin ? 'সকল মডিউল (ফুল পাওয়ার)' : `${toBengaliNumber(currentActiveUser.allowedModules.length)} টি মডিউল`}
            </p>
          </div>
        </div>

        <div className="text-xs text-blue-200 bg-blue-950/40 p-2.5 rounded-xl border border-blue-700/40">
          <span className="block font-semibold text-white">💡 দ্রুত টেস্ট করার সুযোগ:</span>
          নিচের তালিকায় যে কোনো ইউজারের নামের পাশে <strong>"লগইন হিসেবে সুইচ করুন"</strong> বোতামে ক্লিক করে তার পারমিশন টেস্ট করতে পারেন।
        </div>
      </div>

      {/* Users Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="ইউজারনেম, নাম বা মোবাইল দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <span className="text-xs text-slate-500">
          মোট ইউজার: <strong>{toBengaliNumber(users.length)}</strong> জন
        </span>
      </div>

      {/* Users Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map((user) => {
          const isCurrent = user.id === currentActiveUser.id;

          return (
            <div
              key={user.id}
              className={`bg-white rounded-2xl border transition-all shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden ${
                isCurrent ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header */}
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm shadow-2xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-slate-900 leading-tight">{user.name}</h4>
                        {user.isSuperAdmin && (
                          <span title="সুপার অ্যাডমিন">👑</span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-blue-600 font-semibold">
                        @{user.username}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      user.role === 'super_admin'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : user.role === 'accountant'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {user.role === 'super_admin'
                      ? 'সুপার অ্যাডমিন'
                      : user.role === 'accountant'
                      ? 'একাউন্টেন্ট'
                      : user.role === 'attendant'
                      ? 'টার্মিনাল এটেন্ডেন্ট'
                      : 'ম্যানেজার'}
                  </span>
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{user.phone || 'ফোন নম্বর নেই'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span className="font-mono text-slate-500">পাসওয়ার্ড: {user.password ? '••••••' : 'নাই'}</span>
                    </div>
                  </div>

                  {/* Modules Permissions Badges */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">
                        অনুমোদিত মডিউলসমূহ:
                      </span>
                      <span className="text-[10px] text-blue-600 font-semibold font-mono">
                        {user.isSuperAdmin
                          ? 'সব মডিউল (ফুল এক্সেস)'
                          : `${toBengaliNumber(user.allowedModules.length)} টি মডিউল`}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {user.isSuperAdmin ? (
                        <span className="px-2 py-1 bg-purple-50 text-purple-800 rounded border border-purple-200 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-purple-600" />
                          সকল মডিউল ও ফুল প্রশাসনিক ক্ষমতা
                        </span>
                      ) : (
                        user.allowedModules.map((mId) => {
                          const info = SYSTEM_MODULE_LABELS[mId];
                          return (
                            <span
                              key={mId}
                              className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium border border-slate-200"
                            >
                              {info ? info.label : mId}
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {user.notes && (
                    <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {user.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                {isCurrent ? (
                  <span className="flex-1 py-1.5 px-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>বর্তমান সক্রিয় ইউজার</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSwitchUser(user)}
                    className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>লগইন হিসেবে সুইচ করুন</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => openEditModal(user)}
                  className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
                  title="ইউজার সম্পাদনা"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {!user.isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => setUserToDelete(user)}
                    className="p-1.5 bg-white border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* ADD / EDIT USER WITH CHECKBOX PERMISSIONS MODAL */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h4 className="text-base font-bold">
                  {editingUser ? 'ইউজার ও পারমিশন সম্পাদন' : 'নতুন সফটওয়্যার অপারেটর ইউজার তৈরি'}
                </h4>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">অপারেটরের নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মো: আব্দুল্লাহ আল মামুন"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ইউজারনেম (লগইন আইডি) *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: accountant বা kashem"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">গোপন পাসওয়ার্ড *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">পদবী / ভূমিকা</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="super_admin">সুপার অ্যাডমিন (Super Admin)</option>
                    <option value="accountant">হিসাবরক্ষক (Accountant)</option>
                    <option value="attendant">টার্মিনাল অপারেটর (Attendant)</option>
                    <option value="manager">ম্যানেজার (Manager)</option>
                    <option value="custom">কাস্টম ইউজার (Custom)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    placeholder="০১৭১২-০০০০০০"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Super admin toggle */}
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-purple-900 block">সুপার অ্যাডমিন ক্ষমতা (Full Power):</span>
                  <span className="text-[11px] text-purple-700">
                    এটি অন থাকলে ইউজার সকল মডিউল, ইউজার তৈরি এবং সব পরিবর্তন করতে পারবে।
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isSuperAdmin}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsSuperAdmin(checked);
                    if (checked) {
                      setAllowedModules([...ALL_MODULES]);
                    }
                  }}
                  className="w-5 h-5 text-purple-600 rounded cursor-pointer accent-purple-600"
                />
              </div>

              {/* ======================================================== */}
              {/* CHECKBOXES FOR EACH MODULE PERMISSION */}
              {/* ======================================================== */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">
                      মডিউল ভিত্তিক পারমিশন (চেকবক্স দিয়ে নির্বাচন করুন):
                    </label>
                    <span className="text-[11px] text-slate-500">
                      যে মডিউলে টিক দেওয়া থাকবে ইউজার শুধুমাত্র সেই মডিউলেই প্রবেশ করতে পারবে।
                    </span>
                  </div>

                  {!isSuperAdmin && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllModules}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                      >
                        সব নির্বাচন
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={handleDeselectAllModules}
                        className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                      >
                        সব আনচেক
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ALL_MODULES.map((modId) => {
                    const isChecked = isSuperAdmin || allowedModules.includes(modId);
                    const info = SYSTEM_MODULE_LABELS[modId];

                    return (
                      <label
                        key={modId}
                        onClick={() => toggleModule(modId)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border transition-colors cursor-pointer text-xs ${
                          isChecked
                            ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        } ${isSuperAdmin ? 'opacity-80 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="checkbox"
                          disabled={isSuperAdmin}
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 accent-blue-600 shrink-0 cursor-pointer"
                        />
                        <div>
                          <strong className="block font-bold leading-tight">{info.label}</strong>
                          <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                            {info.desc}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="text-xs">
                <label className="block font-semibold text-slate-700 mb-1">মন্তব্য বা দায়িত্বের বিবরণ</label>
                <input
                  type="text"
                  placeholder="যেমন: গাবতলী কাউন্টারের ক্যাশ ও টিকিট দায়িত্বপ্রাপ্ত"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {editingUser ? 'পরিবর্তন সংরক্ষণ করুন' : 'ইউজার সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(userToDelete)}
        title="ইউজার অ্যাকাউন্ট মুছে ফেলার নিশ্চয়তা"
        message={`আপনি কি সত্যিই "${userToDelete?.name}" (${userToDelete?.username}) এর লগইন অ্যাকাউন্টটি মুছে ফেলতে চান? এটি মুছে ফেললে তিনি আর সফটওয়্যারে লগইন করতে পারবেন না।`}
        confirmText="হ্যাঁ, মুছে ফেলুন"
        cancelText="বাতিল"
        isDanger={true}
        onConfirm={() => {
          if (userToDelete) {
            onDeleteUser(userToDelete.id);
            setUserToDelete(null);
          }
        }}
        onClose={() => setUserToDelete(null)}
      />
    </div>
  );
};
