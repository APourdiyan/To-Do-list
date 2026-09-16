import React, { useState } from 'react';
import { useStore, store } from '../../store/useStore';
import {
  User,
  Phone,
  Mail,
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
  X,
  ShieldCheck,
  RefreshCw,
  LogOut,
} from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const { userProfile, profileModalOpen } = useStore();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      <div className="bg-white border border-stone-200 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* هدر مدال */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center border border-amber-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">پروفایل کاربری و ذخیره ابری</h2>
              <p className="text-xs text-stone-500">حفظ اطلاعات و انتقال آسان به گوشی جدید</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* سربرگ تب‌ها */}
        <div className="flex border-b border-stone-200 bg-stone-100/60 p-1 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab('profile'); setStatusMsg(null); }}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80 font-bold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <User size={14} />
            <span>حساب و ذخیره ابری</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('restore'); setStatusMsg(null); }}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'restore'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80 font-bold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <Smartphone size={14} />
            <span>انتقال به گوشی جدید</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('export'); setStatusMsg(null); }}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'export'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80 font-bold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <FileDown size={14} />
            <span>فایل پشتیبان</span>
          </button>
        </div>

        {/* پیام وضعیت */}
        {statusMsg && (
          <div
            className={`mx-4 sm:mx-5 mt-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {statusMsg.type === 'success' ? <CheckCircle2 size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
            <span className="leading-relaxed">{statusMsg.text}</span>
          </div>
        )}

        {/* محتوای تب‌ها */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* تب ۱: پروفایل کاربری و ذخیره ابری */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveAndBackup} className="space-y-4">
              <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-3 text-xs text-amber-950 leading-relaxed">
                با ثبت شماره تلفن یا ایمیل، تمام اهداف، وظایف، تقویم و حسابرسی روزانه شما ذخیره شده و با تعویض گوشی یا مرورگر، به راحتی قابل بازیابی خواهد بود.
              </div>

              {/* نام کاربر */}
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1.5">
                  نام و نام خانوادگی (اختیاری)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: علی رضایی"
                    className="w-full pl-3 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:border-stone-800 text-stone-900 bg-white"
                  />
                  <User size={15} className="absolute right-3 top-2.5 text-stone-400" />
                </div>
              </div>

              {/* شماره موبایل یا ایمیل */}
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1.5">
                  شماره تماس همراه یا آدرس ایمیل *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="0912... یا email@example.com"
                    className="w-full pl-3 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:border-stone-800 text-stone-900 bg-white text-left font-mono"
                  />
                  <Phone size={15} className="absolute right-3 top-2.5 text-stone-400" />
                </div>
              </div>

              {/* رمز یا پین اختصاصی */}
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1.5">
                  رمز عبور یا پین ۴ رقمی بازیابی (اختیاری برای امنیت بیشتر)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    dir="ltr"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="مثال: 1234"
                    maxLength={10}
                    className="w-full pl-3 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:border-stone-800 text-stone-900 bg-white text-left font-mono"
                  />
                  <KeyRound size={15} className="absolute right-3 top-2.5 text-stone-400" />
                </div>
              </div>

              {/* نمایش کلید اختصاصی انتقال اگر ساخته شده باشد */}
              {userProfile?.syncKey && (
                <div className="bg-stone-100/90 rounded-xl p-3 border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-500 block">کلید اختصاصی انتقال به گوشی جدید:</span>
                    <span className="font-mono font-bold text-stone-900 text-sm tracking-wider">
                      {userProfile.syncKey}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedSyncKey ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    <span>{copiedSyncKey ? 'کپی شد' : 'کپی کلید'}</span>
                  </button>
                </div>
              )}

              {userProfile?.lastBackupAt && (
                <p className="text-[11px] text-stone-500 text-center">
                  آخرین پشتیبان‌گیری موفق: {userProfile.lastBackupAt}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 bg-stone-900 hover:bg-black text-stone-100 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>در حال ذخیره و پشتیبان‌گیری...</span>
                    </>
                  ) : (
                    <>
                      <CloudUpload size={16} />
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
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 text-xs text-blue-950 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-blue-900">
                  <Smartphone size={15} />
                  <span>گوشی جدید خریده‌اید یا مرورگرتان ریست شده؟</span>
                </div>
                <p className="leading-relaxed">
                  کافیست شماره تماس همراه، ایمیل، یا «کلید اختصاصی انتقال» را وارد کنید تا تمامی اهداف، برنامه‌ها و اطلاعات شما فوراً بارگذاری شوند.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1.5">
                  شماره تماس همراه، ایمیل یا کلید انتقال (مثال: DZ-XXXXX) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={restoreIdentifier}
                    onChange={(e) => setRestoreIdentifier(e.target.value)}
                    placeholder="0912... یا DZ-88492"
                    className="w-full pl-3 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:border-stone-800 text-stone-900 bg-white text-left font-mono"
                  />
                  <KeyRound size={15} className="absolute right-3 top-3 text-stone-400" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1.5">
                  رمز عبور یا پین امنیتی (اگر در گوشی قبلی تعیین کرده بودید)
                </label>
                <input
                  type="password"
                  dir="ltr"
                  value={restorePin}
                  onChange={(e) => setRestorePin(e.target.value)}
                  placeholder="رمز عبور یا پین"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:border-stone-800 text-stone-900 bg-white text-left font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>در حال دریافت و همگام‌سازی اطلاعات...</span>
                    </>
                  ) : (
                    <>
                      <CloudDownload size={16} />
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
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-700 leading-relaxed">
                برای امنیت ۱۰۰٪ می‌توانید یک نسخه کامل از فایل پشتیبان را دانلود کرده و در تلگرام، واتساپ یا ایمیل خود نگه دارید. هر زمان لازم شد، با یک کلیک فایل را آپلود کنید.
              </div>

              {/* دکمه خروجی گرفتن */}
              <div className="p-3.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">دانلود فایل پشتیبان (Export)</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">دریافت فایل متنی امن شامل تمامی وظایف و اهداف</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadBackup}
                    className="px-3.5 py-2 bg-stone-900 hover:bg-black text-stone-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <FileDown size={14} />
                    <span>دانلود فایل</span>
                  </button>
                </div>
              </div>

              {/* بارگذاری فایل */}
              <div className="p-3.5 rounded-xl border border-dashed border-stone-300 bg-stone-50/50 hover:bg-stone-50 transition-colors text-center">
                <FileUp size={24} className="mx-auto text-stone-400 mb-2" />
                <h4 className="text-xs font-bold text-stone-800">بازیابی از فایل قبلی (Import)</h4>
                <p className="text-[11px] text-stone-500 mt-0.5 mb-3">فایل با فرمت .json را انتخاب کنید</p>
                <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                  <FileUp size={14} />
                  <span>انتخاب و خواندن فایل پشتیبان</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

        </div>

        {/* فوتر */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 text-center">
          <span className="text-[11px] text-stone-500">
            دفتر زندگی من • امنیت کامل اطلاعات و عدم وابستگی به سخت‌افزار
          </span>
        </div>

      </div>
    </div>
  );
};
