import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  serviceRequestService,
  type ServiceRequest
} from "../../services/serviceRequest.service";

export default function MyRecharges() {
  const [requests, setRequests] =
    useState<ServiceRequest[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      const data =
        await serviceRequestService.myRequests();

      setRequests(data);

    } catch (error) {
      console.error(error);

      toast.error(
        "Erro ao carregar histórico"
      );

    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] text-white flex items-center justify-center">
        Carregando histórico...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white pb-24">

      <div className="px-4 pt-6">

        <h1 className="text-2xl font-bold">
          Minhas Recargas
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Histórico de serviços
        </p>

      </div>

      <div className="p-4 space-y-4">

        {requests.length === 0 && (
          <div
            className="
              bg-[#1A1D23]
              border border-[#2B3139]
              rounded-2xl
              p-6
              text-center
              text-gray-400
            "
          >
            Nenhuma recarga encontrada
          </div>
        )}

        {requests.map((request) => (
          <div
            key={request.id}
            className="
              bg-[#1A1D23]
              border border-[#2B3139]
              rounded-2xl
              p-4
            "
          >
            <div className="flex justify-between">

              <div>

                <h3 className="font-semibold">
                 {request.serviceName || "Serviço"}
            </h3>

                <p className="text-sm text-gray-400">
                 {request.planName || "-"}
            </p>

              </div>

              <span
                className="
                  text-xs
                  px-3
                  py-1
                  rounded-full
                  bg-[#2B3139]
                "
              >
                {
  request.status === "COMPLETED"
    ? "Concluído"
    : request.status === "IN_PROGRESS"
    ? "Em processamento"
    : request.status === "FAILED"
    ? "Falhou"
    : request.status
}
              </span>

            </div>

            <div className="mt-4 space-y-1 text-sm">

              <p>
                Número:
                {" "}
                {request.customerReference}
              </p>

              <p>
                Categoria:
                {" "}
                {request.serviceGroupName}
              </p>

              <p>
                Valor:
                {" "}
                {Number(
                  request.amount
                ).toLocaleString()}
                {" "}
                Kz
              </p>

              <p className="text-gray-400">
                {new Date(
                  request.createdAt
                ).toLocaleString()}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}