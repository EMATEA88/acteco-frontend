import { type ReactNode } from "react";

interface Props {

  title: string;

  value: string | number;

  subtitle?: string;

  icon: ReactNode;

}

export default function SummaryCard({

  title,

  value,

  subtitle,

  icon

}: Props) {

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between">

        <div>

          <p className="text-gray-500">

            {title}

          </p>

          <h2 className="text-2xl font-bold mt-2">

            {typeof value === "number"
              ? value.toLocaleString()
              : value}

          </h2>

          {subtitle && (

            <p className="text-sm text-gray-400 mt-2">

              {subtitle}

            </p>

          )}

        </div>

        <div className="text-blue-600">

          {icon}

        </div>

      </div>

    </div>

  );

}