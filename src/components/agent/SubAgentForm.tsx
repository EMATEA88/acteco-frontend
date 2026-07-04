import React from "react";

interface SubAgentFormProps {
  form: {
    fullName: string;
    phone: string;
    email: string;
    password?: string;
    workstation: string;
    position: string;
    department: string;
    address: string;
  };

  loading: boolean;

  isEdit?: boolean;

  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  onSubmit: (
    e: React.FormEvent
  ) => void;
}

export default function SubAgentForm({
  form,
  loading,
  isEdit = false,
  onChange,
  onSubmit,
}: SubAgentFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-xl shadow p-8 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2">
            Nome Completo
          </label>

          <input
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            required
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Telefone
          </label>

          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            required
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        {!isEdit && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Palavra-passe
            </label>

            <input
              type="password"
              name="password"
              value={form.password || ""}
              onChange={onChange}
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Posto de Trabalho
          </label>

          <input
            name="workstation"
            value={form.workstation}
            onChange={onChange}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Cargo
          </label>

          <input
            name="position"
            value={form.position}
            onChange={onChange}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Departamento
          </label>

          <input
            name="department"
            value={form.department}
            onChange={onChange}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Endereço
          </label>

          <input
            name="address"
            value={form.address}
            onChange={onChange}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "A guardar..."
            : isEdit
            ? "Atualizar Sub-agente"
            : "Criar Sub-agente"}
        </button>
      </div>
    </form>
  );
}