import { type ReactNode } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: ReactNode;
};

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  icon,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white shadow-xl border border-slate-200 p-5 animate-fadeIn">

        {icon && (
          <div className="flex justify-center mb-3 text-red-500">
            {icon}
          </div>
        )}

        <h2 className="text-base font-semibold text-slate-900 text-center">
          {title}
        </h2>

        <p className="text-sm text-slate-500 text-center mt-2">
          {description}
        </p>

        <div className="flex justify-center gap-3 mt-5">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}