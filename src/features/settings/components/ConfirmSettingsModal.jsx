import React from 'react';
import { AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';
import { Btn } from './SettingsForm';

/**
 * ConfirmSettingsModal — A high-end glassmorphic dialog to confirm highly critical actions.
 * e.g., entering Maintenance Mode, cache flushing, config resets.
 */
export function ConfirmSettingsModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you absolutely sure?',
  message,
  confirmText = 'Confirm Change',
  cancelText = 'Cancel',
  severity = 'warning',
}) {
  if (!isOpen) return null;

  const getThemeColor = () => {
    if (severity === 'danger') return 'var(--negative)';
    if (severity === 'info') return 'var(--cyan)';
    return 'var(--warning)';
  };

  const getIcon = () => {
    if (severity === 'danger') return <AlertOctagon size={22} className="text-negative" />;
    if (severity === 'info') return <Info size={22} className="text-cyan" />;
    return <AlertTriangle size={22} className="text-warning" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300">
      {/* Dynamic glassmorphic backdrop */}
      <div
        className="absolute inset-0 bg-[#060608]/75 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-md rounded-[10px] border border-border/40 bg-surface-elevated p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10"
      >
        {/* Decorative corner aura */}
        <span
          className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-[48px] opacity-10 pointer-events-none"
          style={{ background: getThemeColor() }}
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
              style={{
                background: `color-mix(in srgb, ${getThemeColor()} 10%, transparent)`,
                border: `1px solid color-mix(in srgb, ${getThemeColor()} 20%, transparent)`,
              }}
            >
              {getIcon()}
            </div>
            <h3 className="text-[14px] font-bold font-heading tracking-[-0.01em] text-text">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-[6px] hover:bg-border/20 flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer transition-colors"
          >
            <X size={13} />
          </button>
        </div>

        {/* Body Message */}
        {message && (
          <p className="text-[12px] text-text-muted/65 font-heading leading-relaxed mb-6 pl-13">
            {message}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 pl-13 border-t border-border/15">
          <Btn label={cancelText} variant="default" onClick={onClose} small />
          <Btn
            label={confirmText}
            variant={severity === 'danger' ? 'danger' : severity === 'info' ? 'cyan' : 'warning'}
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            small
          />
        </div>
      </div>
    </div>
  );
}

export default ConfirmSettingsModal;
