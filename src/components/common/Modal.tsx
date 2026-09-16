import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  titleText?: string; // used for aria-label if title is custom JSX
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
  showCloseButton?: boolean;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  id?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  titleText,
  description,
  children,
  maxWidth = 'lg',
  className = '',
  showCloseButton = true,
  headerContent,
  footerContent,
  id = 'dialog-modal',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const titleId = `${id}-title`;
  const descId = `${id}-desc`;

  // Focus trap and activeElement tracking
  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore focus on close
    triggerRef.current = document.activeElement as HTMLElement | null;

    // Save initial overflow style and lock background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first focusable element inside modal
    const focusableSelectors =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusTimer = setTimeout(() => {
      if (modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(focusableSelectors);
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          modalRef.current.focus();
        }
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
        );

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: if on first element, cycle to last
          if (document.activeElement === firstElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if on last element, cycle to first
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);

      // Restore focus to original trigger element
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div
      id={`${id}-overlay`}
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title && titleText ? titleText : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        dir="rtl"
        className={`bg-white rounded-3xl shadow-2xl border border-stone-200/90 w-full ${maxWidthClasses} overflow-hidden my-auto animate-in zoom-in-95 duration-150 focus:outline-none ${className}`}
      >
        {/* Header if title or custom header provided */}
        {(title || headerContent || showCloseButton) && (
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100 bg-stone-50/50">
            <div className="min-w-0 flex-1">
              {headerContent ? (
                headerContent
              ) : (
                <>
                  {title && (
                    <h2
                      id={titleId}
                      className="text-base font-black text-stone-900 truncate"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id={descId}
                      className="text-xs text-stone-500 mt-0.5"
                    >
                      {description}
                    </p>
                  )}
                </>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="min-w-11 min-h-11 p-2.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white"
                aria-label="بستن پنجره"
              >
                <X size={18} aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Modal body */}
        <div className="max-h-[80vh] overflow-y-auto">
          {children}
        </div>

        {/* Optional Footer */}
        {footerContent && (
          <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/50">
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
};
