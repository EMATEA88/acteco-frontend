import { type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  back = true,
  action,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold">
          {title}
        </h1>

        {subtitle && (
          <p className="text-gray-500 mt-2">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {action}

        {back && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        )}
      </div>
    </div>
  );
}