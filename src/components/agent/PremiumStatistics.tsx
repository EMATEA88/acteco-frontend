import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PremiumStatistics({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Cards de Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Volume Total" value={data.overview.totalVolume} />
        <StatCard title="Comissão Total" value={data.overview.totalCommission} />
        <StatCard title="Agentes Ativos" value={data.overview.activeAgentsCount} />
      </div>

      {/* Gráfico de Evolução */}
      <div className="bg-[#0f1115] border border-white/10 p-6 rounded-3xl h-[350px]">
        <h3 className="text-white font-bold mb-4">Tendência de Vendas (Mês Atual)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.timeline}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip contentStyle={{ backgroundColor: '#1a1c1f', border: 'none' }} />
            <Area type="monotone" dataKey="valor" stroke="#06b6d4" fill="url(#colorVal)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-[#161A1E] p-6 rounded-2xl border border-white/5">
      <p className="text-[10px] uppercase text-gray-500 font-bold">{title}</p>
      <h2 className="text-2xl font-black text-white mt-1">{value}</h2>
    </div>
  );
}