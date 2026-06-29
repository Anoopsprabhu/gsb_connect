"use client";

import { useState, useEffect, useRef } from "react";
import { Share2, X, Link as LinkIcon, Check } from "lucide-react";
import Button from "./Button";

export default function ShareButton({ title }: { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleShare = async (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    switch (platform) {
      case "whatsapp":
        window.open(`https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, "_blank");
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy", err);
        }
        break;
      case "native":
        if (typeof navigator.share === 'function') {
          navigator.share({
            title: title,
            url: url
          }).catch(console.error);
        }
        break;
    }

    if (platform !== "copy") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={menuRef}>
      <Button
        variant="outline"
        size="large"
        className="w-full mt-3"
        icon={<Share2 size={18} />}
        label="Share Webinar"
        onClick={() => {
          if (typeof navigator.share === 'function' && /Mobi|Android/i.test(navigator.userAgent)) {
            handleShare("native");
          } else {
            setIsOpen(!isOpen);
          }
        }}
      />

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-slate-800 text-sm">Share this webinar</h4>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </div>
              <span className="text-[10px] font-medium text-slate-600">WhatsApp</span>
            </button>
            <button onClick={() => handleShare('facebook')} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 011.141.195v3.325a8.623 8.623 0 00-.653-.036 26.805 26.805 0 00-.733-.009c-1.125 0-2.517.236-2.517 1.428v2.547h3.739l-.473 3.667h-3.266v7.98h-4.564z" /></svg>
              </div>
              <span className="text-[10px] font-medium text-slate-600">Facebook</span>
            </button>
            <button onClick={() => handleShare('twitter')} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </div>
              <span className="text-[10px] font-medium text-slate-600">X</span>
            </button>
            <button onClick={() => handleShare('copy')} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] text-white flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </div>
              <span className="text-[10px] font-medium text-slate-600">Instagram</span>
            </button>
          </div>

          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
            <LinkIcon size={14} className="text-slate-400" />
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 bg-transparent text-xs text-slate-600 outline-none truncate"
            />
            <button
              onClick={() => handleShare('copy')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
