import React from 'react';
import LinkIcon from '@/icons/link.svg';

type TooltipProps = {
  label: string;
  placement?: 'right' | 'left';
  offsetY?: number;
  showLinkIcon?: boolean;
  children: React.ReactNode;
};

export default function Tooltip({ label, placement = 'right', offsetY = 0, showLinkIcon = false, children }: TooltipProps) {
  return (
    <span className="group/tooltip relative inline-flex">
      {children}
      <span
        role="tooltip"
        style={offsetY ? { marginTop: `${8 + offsetY}px` } : undefined}
        className={`pointer-events-none absolute top-full z-20 mt-2 w-max max-w-[320px] rounded bg-[#414141] px-2 py-1 text-left text-sm font-medium leading-5 text-white opacity-0 shadow-[0_8px_20px_rgba(0,0,0,.16)] transition-opacity group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 ${
          placement === 'right' ? 'left-1/2 -translate-x-4' : 'right-1/2 translate-x-4'
        }`}
      >
        {showLinkIcon ? (
          <span className="inline-flex max-w-full items-center gap-1">
            <span className="min-w-0 whitespace-normal">{label}</span>
            <LinkIcon className="h-2 w-2 shrink-0" aria-hidden="true" />
          </span>
        ) : (
          <span className="block max-w-full whitespace-normal">{label}</span>
        )}
        <span
          className={`absolute bottom-full h-0 w-0 border-b-[6px] border-l-[6px] border-r-[6px] border-b-[#414141] border-l-transparent border-r-transparent ${
            placement === 'right' ? 'left-4 -translate-x-1/2' : 'right-4 translate-x-1/2'
          }`}
        />
      </span>
    </span>
  );
}
