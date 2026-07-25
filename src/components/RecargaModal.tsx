import { useState } from 'react';
import { akiService } from '../services/akiService';

interface RecargaModalProps {
  product: any;
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RecargaModal({ product, userId, onClose, onSuccess }: RecargaModalProps) {
  const [destination, setDestination] = useState('');
  // Se o produto tiver valor 0 ou nulo, permite ao utilizador digitar o valor
  const [customValue, setCustomValue] = useState(product.Value_Transaction ? product.Value_Transaction.toString() : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isVariableValue = !product.Value_Transaction || product.Value_Transaction <= 0;
  const finalValue = isVariableValue ? Number(customValue) : product.Value_Transaction;

  const handleConfirm = async () => {
    if (!destination) {
      setError('Por favor, insira o número de destino ou contador.');
      return;
    }

    if (isVariableValue && (!finalValue || finalValue <= 0)) {
      setError('Por favor, insira um valor válido para a transação.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const merchantTransactionId = `EMATEA-${Date.now()}`;

      const response = await akiService.makePurchase({
        userId,
        productCode: product.Code,
        destination,
        value: finalValue,
        merchantTransactionId
      });

      console.log('Recarga efetuada com sucesso:', response);
      alert('Recarga processada com sucesso!');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Erro na compra:', err);
      setError(err.response?.data?.error || 'Erro ao processar a recarga. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-5 w-full max-w-sm shadow-2xl text-white">
        <h3 className="font-bold text-base mb-1 text-center uppercase tracking-wide">
          {product.Description_Public || product.Code}
        </h3>
        
        <p className="text-emerald-400 text-center font-bold text-lg mb-4">
          {!isVariableValue ? `${finalValue.toLocaleString()} Kz` : 'Insira o Valor Desejado'}
        </p>

        {error && (
          <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Destino (Telefone / Contador)</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Ex: 934096717"
              className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {isVariableValue && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Valor (Kz)</label>
              <input
                type="number"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Ex: 5000"
                className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] rounded-xl text-xs font-semibold transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
          >
            {loading ? 'A processar...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}