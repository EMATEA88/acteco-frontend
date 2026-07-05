import { type ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () =>void;
  children: ReactNode;
}

export default function AgentDrawer({
  open,
  onClose,
  children,
}: Props) {

  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className={`
          fixed
          inset-0
          bg-black/60
          z-40
          transition-opacity
          ${open
            ? "opacity-100"
            : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Drawer */}

      <aside
        className={`
          fixed
          top-0
          left-0
          h-full
          w-72
          bg-[#0F1720]
          border-r
          border-white/5
          z-50
          transform
          transition-transform
          duration-300

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {children}
      </aside>
    </>
  );
}