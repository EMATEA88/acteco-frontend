import RecargasList from '../../components/RecargasList';

export default function RecargasPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Ematea - Recargas</h1>
        <RecargasList />
      </div>
    </div>
  );
}