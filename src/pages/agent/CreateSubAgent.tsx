import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import { AgentService } from "../../services/agent.service";

export default function CreateSubAgent() {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      fullName: "",

      phone: "",

      email: "",

      password: "",

      workstation: "",

      position: "",

      department: "",

      address: ""

    });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  }

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      await AgentService.createSubAgent(
        form
      );

      alert(
        "Sub-agente criado com sucesso."
      );

      navigate(
        "/agent/sub-agents"
      );

    } catch (error:any) {

      alert(

        error?.response?.data?.error ||

        "Erro ao criar Sub-agente."

      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="max-w-4xl mx-auto">

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold">

            Novo Sub-agente

          </h1>

          <p className="text-gray-500 mt-2">

            Crie um novo funcionário para
            integrar a sua equipa.

          </p>

        </div>

        <button

          onClick={()=>

            navigate(-1)

          }

          className="flex items-center gap-2 border rounded-lg px-4 py-2"

        >

          <ArrowLeft size={18}/>

          Voltar

        </button>

      </div>

      <form

        onSubmit={handleSubmit}

        className="bg-white rounded-xl shadow p-8 space-y-8"

      >

        <div>

          <h2 className="font-semibold text-lg mb-5">

            Dados pessoais

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <Input

              label="Nome completo"

              name="fullName"

              value={form.fullName}

              onChange={handleChange}

              required

            />

            <Input

              label="Telefone"

              name="phone"

              value={form.phone}

              onChange={handleChange}

              required

            />

            <Input

              label="Email"

              name="email"

              value={form.email}

              onChange={handleChange}

            />

            <Input

              label="Password"

              name="password"

              type="password"

              value={form.password}

              onChange={handleChange}

              required

            />

          </div>

        </div>

        <div>

          <h2 className="font-semibold text-lg mb-5">

            Informações internas

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <Input

              label="Cargo"

              name="position"

              value={form.position}

              onChange={handleChange}

            />

            <Input

              label="Departamento"

              name="department"

              value={form.department}

              onChange={handleChange}

            />

            <Input

              label="Posto de trabalho"

              name="workstation"

              value={form.workstation}

              onChange={handleChange}

            />

            <Input

              label="Endereço"

              name="address"

              value={form.address}

              onChange={handleChange}

            />

          </div>

        </div>

        <div className="flex justify-end">

          <button

            disabled={loading}

            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3"

          >

            <Save size={18}/>

            {

              loading

              ?

              "A guardar..."

              :

              "Criar Sub-agente"

            }

          </button>

        </div>

      </form>

    </div>

  );

}

interface InputProps{

  label:string;

  name:string;

  value:string;

  onChange:any;

  required?:boolean;

  type?:string;

}

function Input({

  label,

  name,

  value,

  onChange,

  required,

  type="text"

}:InputProps){

  return(

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

        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"

      />

    </div>

  );

}