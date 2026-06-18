import { useState } from "react";
import { useParams } from "react-router-dom";

export default function PaymentCheckout() {
  const { paymentId } = useParams();

  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);

      console.log({
        paymentId,
        reference,
        amount,
        customerName,
      });

      // TODO:
      // Backend

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white pb-24">

      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold">
          Pagamento
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Preencha os dados
        </p>
      </div>

      <div className="p-4">

        <div className="bg-[#1A1D23] border border-[#2B3139] rounded-2xl p-4">

          <div className="space-y-4">

            <div>
              <label className="text-sm text-gray-400">
                Referência
              </label>

              <input
                value={reference}
                onChange={(e) =>
                  setReference(e.target.value)
                }
                className="
                  w-full
                  mt-2
                  p-3
                  rounded-xl
                  bg-[#0B0E11]
                  border border-[#2B3139]
                "
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">
                Valor
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                className="
                  w-full
                  mt-2
                  p-3
                  rounded-xl
                  bg-[#0B0E11]
                  border border-[#2B3139]
                "
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">
                Nome Cliente
              </label>

              <input
                value={customerName}
                onChange={(e) =>
                  setCustomerName(e.target.value)
                }
                className="
                  w-full
                  mt-2
                  p-3
                  rounded-xl
                  bg-[#0B0E11]
                  border border-[#2B3139]
                "
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                w-full
                bg-green-600
                hover:bg-green-500
                rounded-xl
                p-3
                font-semibold
              "
            >
              {loading
                ? "Processando..."
                : "Confirmar Pagamento"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}