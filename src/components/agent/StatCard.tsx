import { type ReactNode } from "react";

interface StatCardProps {

  title: string;

  value: string | number;

  icon: ReactNode;

}

export default function StatCard({

  title,

  value,

  icon

}: StatCardProps) {

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500">

            {title}

          </p>

          <h2 className="text-3xl font-bold mt-2">

            {

              typeof value === "number"

                ? value.toLocaleString()

                : value

            }

          </h2>

        </div>

        <div className="text-blue-600">

          {icon}

        </div>

      </div>

    </div>

  );

}