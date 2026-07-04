interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Carregando..."
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />

      <p className="mt-4 text-gray-500">
        {message}
      </p>
    </div>
  );
}