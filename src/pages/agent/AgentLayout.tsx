import { Outlet } from "react-router-dom";

import { useState } from "react";

import AgentDrawer from "../../components/agent/AgentDrawer";
import AgentSidebar from "../../components/agent/AgentSidebar";
import AgentMenuButton from "../../components/agent/AgentMenuButton";

export default function AgentLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] flex flex-col">
      <header className="bg-[#161A1E]/40 backdrop-blur-md border-b border-white/[0.04] px-6 py-5 flex items-center justify-between">
        <h2 className="text-sm font-black tracking-wider uppercase font-mono">
          Painel de Operações
        </h2>

        <AgentMenuButton
          onClick={() => setMenuOpen(true)}
        />
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>

      <AgentDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        <AgentSidebar
          onClose={() => setMenuOpen(false)}
        />
      </AgentDrawer>
    </div>
  );
}