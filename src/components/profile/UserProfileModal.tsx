import React, { useState } from 'react';
import { useStore, store } from '../../store/useStore';
import { Modal } from '../common/Modal';
import {
  User,
  Phone,
  KeyRound,
  CloudUpload,
  CloudDownload,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  FileDown,
  FileUp,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const userProfile = useStore((s) => s.userProfile);
  const profileModalOpen = useStore((s) => s.profileModalOpen);

  const [activeTab, setActiveTab] = useState<'profile' | 'restore' | 'export'>('profile');

  // فرم پروفایل / پشتیبان
  const [name, setName] = useState(userProfile?.name || '');
  const [phoneOrEmail, setPhoneOrEmail] = useState(userProfile?.phoneOrEmail || '');
  const [pin, setPin] = useState(userProfile?.pinOrPassword || '');

  // فرم بازیابی
  const [restoreIdentifier, setRestoreIdentifier] = useState('');
  const [restorePin, setRestorePin] = useState('');

  // پیام‌ها و وضعیت
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [copiedSyncKey, setCopiedSyncKey] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!profileModalOpen) return null;

  const handleClose = () => {
    store.setProfileModalOpen(false);
    setStatusMsg(null);
  };

  const handleSaveAndBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      setStatusMsg({ text: 'لطفاً شماره تلفن همراه یا ایمیل خود را وارد کنید.', type: 'error' });
      return;
    }

    setIsProcessing(true);
    setStatusMsg(null);

    // ذخیره در پروفایل
    store.updateUserProfile({
      name: name.trim() || 'کاربر گرامی',
      phoneOrEmail: phoneOrEmail.trim(),
      pinOrPassword: pin.trim(),
    });

    // پشتیبان‌گیری ابری
    const res = await store.backupDataToCloud(phoneOrEmail.trim(), pin.trim());
    setIsProcessing(false);

    if (res.success) {
      setStatusMsg({ text: res.message, type: 'success' });
    } else {
      setStatusMsg({ text: res.message, type: 'error' });
    }
  };

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreIdentifier.trim()) {
      setStatusMsg({ text: 'لطفاً شماره تلفن، ایمیل یا کلید انتقال را وارد نمایید.', type: 'error' });
      return;
    }

    setIsProcessing(true);
    setStatusMsg(null);

    const res = await store.restoreDataFromCloud(restoreIdentifier.trim(), restorePin.trim());
    setIsProcessing(false);

    if (res.success) {
      setStatusMsg({ text: res.message, type: 'success' });
    } else {
      setStatusMsg({ text: res.message, type: 'error' });
    }
  };

  const handleCopyKey = () => {
    if (userProfile?.syncKey) {
      navigator.clipboard.writeText(userProfile.syncKey);
      setCopiedSyncKey(true);
      setTimeout(() => setCopiedSyncKey(false), 2000);
    }
  };

  const handleDownloadBackup = () => {
    const jsonStr = store.exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daftar-zendegi-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMsg({ text: 'فایل پشتیبان با موفقیت دانلود شد. آن را در پیام‌رسان یا ایمیل خود ذخیره کنید.', type: 'success' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = store.importAllDataJSON(content);
        if (res.success) {
          setStatusMsg({ text: res.message, type: 'success' });
        } else {
          setStatusMsg({ text: res.message, type: 'error' });
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <Modal
      id="user-profile-modal"
      isOpen={profileModalOpen}
      onClose={handleClose}
      maxWidth="lg"
      title="پروفایل کاربری و ذخیره ابری"
      subtitle="حفظ اطلاعات و انتقال آسان به گوشی جدید"
    >
      <div className="flex flex-col">
        {/* سربرگ تب‌ها */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 p-1.5 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab('profile'); setStatusMsg(null); }}
            className={`min-h-11 flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
              activeTab === 'profile'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/90 font-bold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <User size={15} aria-hidden="true" />
            <span>حساب و ذخیره ابری</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('restore'); setStatusMsg(null); }}
            className={`min-h-11 flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
              activeTab === 'restore'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/90 font-bold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <Smartphone size={15} aria-hidden="true" />
            <span>انتقال به گوشی جدید</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('export'); setStatusMsg(null); }}
            className={`min-h-11 flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
              activeTab === 'export'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/90 font-bold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <FileDown size={15} aria-hidden="true" />
            <span>فایل پشتیبان</span>
          </button>
        </div>

        {/* پیام وضعیت */}
        {statusMsg && (
          <div
            className={`mx-4 sm:mx-5 mt-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 size={17} className="shrink-0 text-emerald-700" aria-hidden="true" />
            ) : (
              <AlertCircle size={17} className="shrink-0 text-rose-700" aria-hidden="true" />
            )}
            <span className="leading-relaxed font-medium">{statusMsg.text}</span>
          </div>
        )}

        {/* محتوای تب‌ها */}
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* تب ۱: پروفایل کاربری و ذخیره ابری */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveAndBackup} className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-950 leading-relaxed font-medium">
                با ثبت شماره تلفن یا ایمیل، تمام اهداف، وظایف، تقویم و حسابرسی روزانه شما ذخیره شده و با تعویض گوشی یا مرورگر، به راحتی قابل بازیابی خواهد بود.
              </div>

              {/* نام کاربر */}
              <div>
                <label htmlFor="user-profile-name" className="text-xs font-bold text-stone-800 block mb-1.5">
                  نام و نام خانوادگی (اختیاری)
                </label>
                <div className="relative">
                  <input
                    id="user-profile-name"
                    type="text"
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: علی رضایی"
                    className="w-full pl-3 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800/70 text-stone-900 bg-white"
                  />
                  <User size={16} className="absolute right-3 top-3 text-stone-500" aria-hidden="true" />
                </div>
              </div>

              {/* شماره موبایل یا ایمیل */}
              <div>
                <label htmlFor="user-profile-phone-email" className="text-xs font-bold text-stone-800 block mb-1.5">
                  شماره تماس همراه یا آدرس ایمیل *
                </label>
                <div className="relative">
                  <input
                    id="user-profile-phone-email"
                    type="text"
                    required
                    maxLength={100}
                    dir="ltr"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="0912... یا email@example.com"
                    className="w-full pl-3 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800/70 text-stone-900 bg-white text-left font-mono"
                  />
                  <Phone size={16} className="absolute right-3 top-3 text-stone-500" aria-hidden="true" />
                </div>
              </div>

              {/* رمز یا پین اختصاصی */}
              <div>
                <label htmlFor="user-profile-pin" className="text-xs font-bold text-stone-800 block mb-1.5">
                  رمز عبور یا پین ۴ رقمی بازیابی (اختیاری برای امنیت بیشتر)
                </label>
                <div className="relative">
                  <input
                    id="user-profile-pin"
                    type="password"
                    dir="ltr"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="مثال: 1234"
                    maxLength={20}
                    className="w-full pl-3 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800/70 text-stone-900 bg-white text-left font-mono"
                  />
                  <KeyRound size={16} className="absolute right-3 top-3 text-stone-500" aria-hidden="true" />
                </div>
              </div>

              {/* نمایش کلید اختصاصی انتقال اگر ساخته شده باشد */}
              {userProfile?.syncKey && (
                <div className="bg-stone-100/90 rounded-xl p-3 border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-600 block">کلید اختصاصی انتقال به گوشی جدید:</span>
                    <span className="font-mono font-bold text-stone-900 text-sm tracking-wider">
                      {userProfile.syncKey}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="min-h-10 px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-xs font-bold text-stone-800 flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                    aria-label="کپی کلید انتقال"
                  >
                    {copiedSyncKey ? (
                      <Check size={14} className="text-emerald-700" aria-hidden="true" />
                    ) : (
                      <Copy size={14} aria-hidden="true" />
                    )}
                    <span>{copiedSyncKey ? 'کپی شد' : 'کپی کلید'}</span>
                  </button>
                </div>
              )}

              {userProfile?.lastBackupAt && (
                <p className="text-[11px] text-stone-600 text-center">
                  آخرین پشتیبان‌گیری موفق: {userProfile.lastBackupAt}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="min-h-11 w-full py-2.5 px-4 bg-stone-900 hover:bg-black text-stone-100 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" aria-hidden="true" />
                      <span>در حال ذخیره و پشتیبان‌گیری...</span>
                    </>
                  ) : (
                    <>
                      <CloudUpload size={17} aria-hidden="true" />
                      <span>ذخیره پروفایل و پشتیبان‌گیری ابری</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* تب ۲: بازیابی در گوشی جدید */}
          {activeTab === 'restore' && (
            <form onSubmit={handleRestore} className="space-y-4">
              <div className="bg-blue-50/70 border border-blue-200/90 rounded-xl p-3.5 text-xs text-blue-950 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-blue-900">
                  <Smartphone size={16} aria-hidden="true" />
                  <span>گوشی جدید خریده‌اید یا مرورگرتان ریست شده؟</span>
                </div>
                <p className="leading-relaxed">
                  کافیست شماره تماس همراه، ایمیل، یا «کلید اختصاصی انتقال» را وارد کنید تا تمامی اهداف، برنامه‌ها و اطلاعات شما فوراً بارگذاری شوند.
                </p>
              </div>

              <div>
                <label htmlFor="restore-identifier-input" className="text-xs font-bold text-stone-800 block mb-1.5">
                  شماره تماس همراه، ایمیل یا کلید انتقال (مثال: DZ-XXXXX) *
                </label>
                <div className="relative">
                  <input
                    id="restore-identifier-input"
                    type="text"
                    required
                    maxLength={100}
                    dir="ltr"
                    value={restoreIdentifier}
                    onChange={(e) => setRestoreIdentifier(e.target.value)}
                    placeholder="0912... یا DZ-88492"
                    className="w-full pl-3 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800/70 text-stone-900 bg-white text-left font-mono"
                  />
                  <KeyRound size={16} className="absolute right-3 top-3.5 text-stone-500" aria-hidden="true" />
                </div>
              </div>

              <div>
                <label htmlFor="restore-pin-input" className="text-xs font-bold text-stone-800 block mb-1.5">
                  رمز عبور یا پین امنیتی (اگر در گوشی قبلی تعیین کرده بودید)
                </label>
                <input
                  id="restore-pin-input"
                  type="password"
                  dir="ltr"
                  maxLength={20}
                  value={restorePin}
                  onChange={(e) => setRestorePin(e.target.value)}
                  placeholder="رمز عبور یا پین"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800/70 text-stone-900 bg-white text-left font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="min-h-11 w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-800"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" aria-hidden="true" />
                      <span>در حال دریافت و همگام‌سازی اطلاعات...</span>
                    </>
                  ) : (
                    <>
                      <CloudDownload size={17} aria-hidden="true" />
                      <span>بازیابی کامل اطلاعات در این گوشی</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* تب ۳: دانلود و آپلود فایل پشتیبان آفلاین */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-800 leading-relaxed font-medium">
                برای امنیت ۱۰۰٪ می‌توانید یک نسخه کامل از فایل پشتیبان را دانلود کرده و در تلگرام، واتساپ یا ایمیل خود نگه دارید. هر زمان لازم شد، با یک کلیک فایل را آپلود کنید.
              </div>

              {/* دکمه خروجی گرفتن */}
              <div className="p-3.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">دانلود فایل پشتیبان (Export)</h4>
                    <p className="text-[11px] text-stone-600 mt-0.5">دریافت فایل متنی امن شامل تمامی وظایف و اهداف</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadBackup}
                    className="min-h-11 px-4 py-2 bg-stone-900 hover:bg-black text-stone-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                  >
                    <FileDown size={15} aria-hidden="true" />
                    <span>دانلود فایل</span>
                  </button>
                </div>
              </div>

              {/* بارگذاری فایل */}
              <div className="p-4 rounded-xl border border-dashed border-stone-300 bg-stone-50/50 hover:bg-stone-50 transition-colors text-center">
                <FileUp size={26} className="mx-auto text-stone-500 mb-2" aria-hidden="true" />
                <h4 className="text-xs font-bold text-stone-900">بازیابی از فایل قبلی (Import)</h4>
                <p className="text-[11px] text-stone-600 mt-0.5 mb-3">فایل با فرمت .json را انتخاب کنید</p>
                <label className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-900 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs focus-within:ring-2 focus-within:ring-stone-800/70 min-h-11">
                  <FileUp size={15} aria-hidden="true" />
                  <span>انتخاب و خواندن فایل پشتیبان</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
          )}

        </div>

        {/* فوتر */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 text-center">
          <span className="text-[11px] text-stone-600">
            دفتر زندگی من • امنیت کامل اطلاعات و عدم وابستگی به سخت‌افزار
          </span>
        </div>
      </div>
    </Modal>
  );
};
