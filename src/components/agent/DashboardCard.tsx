import { type ReactNode } from "react";

interface DashboardCardProps {

  title: string;

  value: string | number;

  icon: ReactNode;

}

export default function DashboardCard({

  title,

  value,

  icon

}: DashboardCardProps) {

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-gray-500">

            {title}

          </p>

          <h2 className="text-2xl font-bold mt-2">

            {typeof value === "number"
              ? value.toLocaleString()
              : value}

          </h2>

        </div>

        <div className="text-blue-600">

          {icon}

        </div>

      </div>

    </div>

  );

}