import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface Props {
  level1: number
  level2: number
  level3: number
}

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa']

export default function TeamChart({ level1, level2, level3 }: Props) {
  const data = [
    { name: 'Level 1', value: level1 },
    { name: 'Level 2', value: level2 },
    { name: 'Level 3', value: level3 },
  ]

  return (
    <div className="bg-white rounded-2xl shadow p-5 mt-6">
      <h2 className="font-semibold text-blue-900 mb-4">
        Network Distribution
      </h2>

      <div className="w-full h-56">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
