// src/utils/operatorsMap.ts

export interface OperatorInfo {
  icon: string;
  bg: string;
  textColor: string;
  label: string;
}

export const brandConfig: Record<string, OperatorInfo> = {
  // Telecom & TV
  'AFRICELL': { icon: '📶', bg: 'bg-purple-900/40 border-purple-500/30 text-purple-300', textColor: 'text-purple-400', label: 'Africell' },
  'DSTV': { icon: '📺', bg: 'bg-blue-900/40 border-blue-500/30 text-blue-300', textColor: 'text-blue-400', label: 'DStv' },
  'MOVICEL': { icon: '📡', bg: 'bg-red-900/40 border-red-500/30 text-red-300', textColor: 'text-red-400', label: 'Movicel' },
  'UNITEL': { icon: '📱', bg: 'bg-blue-950/50 border-blue-500/30 text-blue-300', textColor: 'text-blue-400', label: 'Unitel' },
  
  // Jogos & Apostas (Nomes completos enriquecidos)
  '888BET': { icon: '🎲', bg: 'bg-orange-900/40 border-orange-500/30 text-orange-300', textColor: 'text-orange-400', label: '888bet Angola' },
  'BANTUBET': { icon: '⚽', bg: 'bg-slate-800 border-slate-700 text-slate-300', textColor: 'text-slate-200', label: 'Bantubet' },
  'KWANZABET': { icon: '🎯', bg: 'bg-zinc-900 border-zinc-700 text-zinc-300', textColor: 'text-zinc-200', label: 'Kwanza Bet' },
  'MOBET': { icon: '🎰', bg: 'bg-neutral-900 border-neutral-700 text-neutral-300', textColor: 'text-red-500', label: 'Mobet' },
  'ELEPHANTBET': { icon: '🐘', bg: 'bg-amber-950/50 border-amber-500/30 text-amber-300', textColor: 'text-amber-400', label: 'Elephant Bet' },

  // Serviços Públicos
  'ENDE': { icon: '⚡', bg: 'bg-rose-950/50 border-rose-500/30 text-rose-300', textColor: 'text-rose-400', label: 'ENDE E.P.' },
  'EPAL': { icon: '💧', bg: 'bg-sky-950/50 border-sky-500/30 text-sky-300', textColor: 'text-sky-400', label: 'EPAL E.P.' },
  'AGT': { icon: '🏛️', bg: 'bg-stone-900 border-stone-700 text-stone-300', textColor: 'text-stone-300', label: 'Administração Geral Tributária' },
  'INSS': { icon: '🛡️', bg: 'bg-teal-950/50 border-teal-500/30 text-teal-300', textColor: 'text-teal-400', label: 'Segurança Social (INSS)' },

  // Pagamentos Internacionais & Digitais
  'AMAZON': { icon: '📦', bg: 'bg-amber-950/50 border-amber-500/30 text-amber-300', textColor: 'text-amber-400', label: 'Amazon Gift Card' },
  'APPLE': { icon: '🍎', bg: 'bg-zinc-800 border-zinc-600 text-zinc-200', textColor: 'text-white', label: 'Apple App Store' },
  'GOOGLE': { icon: '▶️', bg: 'bg-blue-950/50 border-blue-500/30 text-blue-300', textColor: 'text-blue-400', label: 'Google Play Store' },
  'NETFLIX': { icon: '🎬', bg: 'bg-red-950/50 border-red-500/30 text-red-300', textColor: 'text-red-400', label: 'Netflix Subscrição' },
  'SPOTIFY': { icon: '🎵', bg: 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300', textColor: 'text-emerald-400', label: 'Spotify Premium' },
  'PLAYSTATION': { icon: '🎮', bg: 'bg-indigo-950/50 border-indigo-500/30 text-indigo-300', textColor: 'text-indigo-400', label: 'PlayStation Network' },
  'XBOX': { icon: '🎮', bg: 'bg-green-950/50 border-green-500/30 text-green-300', textColor: 'text-green-400', label: 'Xbox Live & Game Pass' },
  'STEAM': { icon: '🎮', bg: 'bg-cyan-950/50 border-cyan-500/30 text-cyan-300', textColor: 'text-cyan-400', label: 'Steam Wallet' },
  'BOLT': { icon: '💳', bg: 'bg-yellow-950/50 border-yellow-500/30 text-yellow-300', textColor: 'text-yellow-400', label: 'Bolt Balance' },
  'FLIXBUS': { icon: '💳', bg: 'bg-orange-950/50 border-orange-500/30 text-orange-300', textColor: 'text-orange-400', label: 'FlixBus Tickets' },
};