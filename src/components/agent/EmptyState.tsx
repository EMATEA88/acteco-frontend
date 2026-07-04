import { Save } from "lucide-react";

export interface SubAgentFormData {

  fullName: string;

  phone: string;

  email: string;

  password?: string;

  workstation: string;

  position: string;

  department: string;

  address: string;

}

interface Props {

  form: SubAgentFormData;

  loading?: boolean;

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

  loading = false,

  isEdit = false,

  onChange,

  onSubmit

}: Props) {

  return (

    <form

      onSubmit={onSubmit}

      className="bg-white rounded-xl shadow p-8 space-y-8"

    >

      {/* =============================
          DADOS PESSOAIS
      ============================== */}

      <section>

        <h2 className="text-lg font-semibold mb-5">

          Dados pessoais

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Input

            label="Nome completo"

            name="fullName"

            value={form.fullName}

            onChange={onChange}

            required

          />

          <Input

            label="Telefone"

            name="phone"

            value={form.phone}

            onChange={onChange}

            required

          />

          <Input

            label="Email"

            name="email"

            type="email"

            value={form.email}

            onChange={onChange}

          />

          {

            !isEdit && (

              <Input

                label="Password"

                name="password"

                type="password"

                value={form.password || ""}

                onChange={onChange}

                required

              />

            )

          }

        </div>

      </section>

      {/* =============================
          DADOS INTERNOS
      ============================== */}

      <section>

        <h2 className="text-lg font-semibold mb-5">

          Informações internas

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Input

            label="Cargo"

            name="position"

            value={form.position}

            onChange={onChange}

          />

          <Input

            label="Departamento"

            name="department"

            value={form.department}

            onChange={onChange}

          />

          <Input

            label="Posto de trabalho"

            name="workstation"

            value={form.workstation}

            onChange={onChange}

          />

          <Input

            label="Endereço"

            name="address"

            value={form.address}

            onChange={onChange}

          />

        </div>

      </section>

      {/* =============================
          BOTÕES
      ============================== */}

      <div className="flex justify-end">

        <button

          type="submit"

          disabled={loading}

          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg px-6 py-3 transition"

        >

          <Save size={18} />

          {

            loading

              ? "A guardar..."

              : isEdit

                ? "Guardar alterações"

                : "Criar Sub-agente"

          }

        </button>

      </div>

    </form>

  );

}

/* =====================================================
INPUT
===================================================== */

interface InputProps {

  label: string;

  name: string;

  value: string;

  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  required?: boolean;

  type?: string;

}

function Input({

  label,

  name,

  value,

  onChange,

  required,

  type = "text"

}: InputProps) {

  return (

    <div>

      <label className="block mb-2 text-sm font-medium">

        {label}

      </label>

      <input

        type={type}

        name={name}

        value={value}

        onChange={onChange}

        required={required}

        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"

      />

    </div>

  );

}