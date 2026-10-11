'use client';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { IconButton } from './Button';
import { cn } from './cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
  /** `sheet` = painel lateral (menus no celular). */
  variant?: 'center' | 'sheet';
  className?: string;
}

/** Usa o elemento nativo <dialog>: foco preso, Esc fecha e fundo inerte sem bibliotecas. */
export function Modal({ open, onClose, title, closeLabel, children, variant = 'center', className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={cn(
        'backdrop:bg-ink/50 backdrop:backdrop-blur-sm m-auto max-h-[90dvh] w-[min(92vw,34rem)] overflow-hidden rounded-lg bg-paper p-0 text-ink shadow-lift',
        variant === 'sheet' && 'mr-0 ml-auto h-dvh max-h-none w-[min(88vw,22rem)] rounded-none rounded-l-xl',
        className,
      )}
    >
      <div className="flex max-h-[inherit] flex-col">
        <div className="flex items-center justify-between gap-4 px-5 pt-4">
          <h2 className="text-xl">{title}</h2>
          <IconButton label={closeLabel} onClick={onClose}><X aria-hidden size={20} /></IconButton>
        </div>
        <div className="overflow-y-auto px-5 pt-2 pb-6">{children}</div>
      </div>
    </dialog>
  );
}
