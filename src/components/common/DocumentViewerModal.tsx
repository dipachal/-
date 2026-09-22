import React, { useState } from 'react';
import { X, Image as ImageIcon, ZoomIn, Download, ExternalLink } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  frontImage?: string;
  backImage?: string;
  documentTypeLabel?: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  title,
  frontImage,
  backImage,
  documentTypeLabel = 'ডকুমেন্ট ও পেপার্স',
}) => {
  const [activeSide, setActiveSide] = useState<'front' | 'back'>(frontImage ? 'front' : 'back');

  if (!isOpen) return null;

  const currentImage = activeSide === 'front' ? frontImage : backImage;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-400" />
            <div>
              <h4 className="text-sm font-bold">{title}</h4>
              <p className="text-[11px] text-slate-400">{documentTypeLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Side switcher tabs if both sides available */}
          <div className="flex items-center justify-center gap-2">
            {frontImage && (
              <button
                type="button"
                onClick={() => setActiveSide('front')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSide === 'front'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                এপিট (Front Side)
              </button>
            )}
            {backImage && (
              <button
                type="button"
                onClick={() => setActiveSide('back')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSide === 'back'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ওপিট (Back Side)
              </button>
            )}
          </div>

          {/* Image Display Canvas */}
          <div className="relative min-h-[300px] max-h-[500px] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-slate-200">
            {currentImage ? (
              <img
                src={currentImage}
                alt={`${title} - ${activeSide}`}
                className="max-h-[460px] max-w-full object-contain rounded-lg"
              />
            ) : (
              <div className="text-center p-8 text-slate-400 text-xs">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <span>কোনো ছবি আপলোড করা হয়নি</span>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500">
              {activeSide === 'front' ? 'সামনের পাতার ছবি প্রদর্শিত' : 'পেছনের পাতার ছবি প্রদর্শিত'}
            </span>
            <div className="flex items-center gap-2">
              {currentImage && (
                <a
                  href={currentImage}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>নতুন ট্যাবে দেখুন</span>
                </a>
              )}
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-900 text-white hover:bg-slate-800 font-semibold rounded-lg transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
