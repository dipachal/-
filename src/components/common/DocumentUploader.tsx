import React, { useRef } from 'react';
import { UploadCloud, CheckCircle2, Trash2, Eye, FileText } from 'lucide-react';
import { fileToDataUrl } from '../../utils/helpers';
import { DocumentImage } from '../../types';

interface DocumentUploaderProps {
  label: string;
  helperText?: string;
  documents?: DocumentImage;
  onChange: (docs: DocumentImage) => void;
  onPreview?: (title: string, front?: string, back?: string) => void;
  allowDoubleSided?: boolean;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  label,
  helperText,
  documents = {},
  onChange,
  onPreview,
  allowDoubleSided = true,
}) => {
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (side: 'front' | 'back', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await fileToDataUrl(file);
      onChange({
        ...documents,
        [side]: dataUrl,
      });
    } catch (err) {
      console.error('File read error', err);
      alert('ছবি আপলোডে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  const removeSide = (side: 'front' | 'back') => {
    const updated = { ...documents };
    delete updated[side];
    onChange(updated);
    if (side === 'front' && frontInputRef.current) frontInputRef.current.value = '';
    if (side === 'back' && backInputRef.current) backInputRef.current.value = '';
  };

  const hasAnyDoc = Boolean(documents.front || documents.back);

  return (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800">{label}</span>
        </div>
        {hasAnyDoc && onPreview && (
          <button
            type="button"
            onClick={() => onPreview(label, documents.front, documents.back)}
            className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>প্রিভিউ দেখুন</span>
          </button>
        )}
      </div>

      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}

      <div className={`grid ${allowDoubleSided ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-2 pt-1`}>
        {/* Front side upload box */}
        <div className="border border-dashed border-slate-300 rounded-lg p-2.5 bg-white text-center flex flex-col items-center justify-center min-h-[90px] relative hover:border-blue-400 transition-colors">
          <input
            type="file"
            ref={frontInputRef}
            accept="image/*"
            onChange={(e) => handleFileUpload('front', e)}
            className="hidden"
          />

          {documents.front ? (
            <div className="w-full flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <img
                  src={documents.front}
                  alt="Front Preview"
                  className="w-12 h-10 object-cover rounded border border-slate-200 shrink-0"
                />
                <div className="text-left truncate">
                  <span className="text-[11px] font-bold text-emerald-700 block flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" /> এপিট আপলোড হয়েছে
                  </span>
                  <span className="text-[10px] text-slate-400">ছবি পরিবর্তন করতে ক্লিক করুন</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => frontInputRef.current?.click()}
                  className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium cursor-pointer"
                >
                  পরিবর্তন
                </button>
                <button
                  type="button"
                  onClick={() => removeSide('front')}
                  className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                  title="মুছুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => frontInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-1 py-1 cursor-pointer text-slate-600 hover:text-blue-600"
            >
              <UploadCloud className="w-5 h-5 text-slate-400" />
              <span className="text-[11px] font-semibold">
                {allowDoubleSided ? 'এপিট (Front Side) ছবি তুলুন/আপলোড' : 'ফাইল/ছবি আপলোড'}
              </span>
              <span className="text-[10px] text-slate-400">JPG, PNG বা স্ক্যান কপি</span>
            </button>
          )}
        </div>

        {/* Back side upload box (if double-sided allowed) */}
        {allowDoubleSided && (
          <div className="border border-dashed border-slate-300 rounded-lg p-2.5 bg-white text-center flex flex-col items-center justify-center min-h-[90px] relative hover:border-blue-400 transition-colors">
            <input
              type="file"
              ref={backInputRef}
              accept="image/*"
              onChange={(e) => handleFileUpload('back', e)}
              className="hidden"
            />

            {documents.back ? (
              <div className="w-full flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <img
                    src={documents.back}
                    alt="Back Preview"
                    className="w-12 h-10 object-cover rounded border border-slate-200 shrink-0"
                  />
                  <div className="text-left truncate">
                    <span className="text-[11px] font-bold text-emerald-700 block flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" /> ওপিট আপলোড হয়েছে
                    </span>
                    <span className="text-[10px] text-slate-400">ছবি পরিবর্তন করতে ক্লিক করুন</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => backInputRef.current?.click()}
                    className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium cursor-pointer"
                  >
                    পরিবর্তন
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSide('back')}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                    title="মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => backInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-1 py-1 cursor-pointer text-slate-600 hover:text-blue-600"
              >
                <UploadCloud className="w-5 h-5 text-slate-400" />
                <span className="text-[11px] font-semibold">ওপিট (Back Side) ছবি তুলুন/আপলোড</span>
                <span className="text-[10px] text-slate-400">পেছনের অংশ</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
