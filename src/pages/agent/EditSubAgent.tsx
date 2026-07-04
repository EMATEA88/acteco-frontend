import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import { AgentService } from "../../services/agent.service";

export default function EditSubAgent() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState({

      fullName: "",

      phone: "",

      email: "",

      workstation: "",

      position: "",

      department: "",

      address: ""

    });

  useEffect(() => {

    if(id){

      loadSubAgent();

    }

  }, [id]);

  async function loadSubAgent(){

    try{

      const data =
        await AgentService.getSubAgent(
          Number(id)
        );

      setForm({

        fullName:
          data.user.fullName || "",

        phone:
          data.user.phone || "",

        email:
          data.user.email || "",

        workstation:
          data.workstation || "",

        position:
          data.position || "",

        department:
          data.department || "",

        address:
          data.address || ""

      });

    }catch(error){

      console.error(error);

      alert("Não foi possível carregar o Sub-agente.");

      navigate("/agent/sub-agents");

    }finally{

      setLoading(false);

    }

  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ){

    setForm({

      ...form,

      [e.target.name]:
        e.target.value

    });

  }

  async function handleSubmit(
    e: React.FormEvent
  ){

    e.preventDefault();

    try{

      setSaving(true);

      await AgentService.updateSubAgent(

        Number(id),

        form

      );

      alert(
        "Sub-agente atualizado com sucesso."
      );

      navigate("/agent/sub-agents");

    }catch(error:any){

      alert(

        error?.response?.data?.error ||

        "Erro ao atualizar."

      );

    }finally{

      setSaving(false);

    }

  }

  if(loading){

    return(

      <div className="text-center py-20">

        Carregando...

      </div>

    );

  }

  return(

    <div className="max-w-4xl mx-auto">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">

            Editar Sub-agente

          </h1>

          <p className="text-gray-500 mt-2">

            Atualize os dados do funcionário.

          </p>

        </div>

        <button

          onClick={()=>navigate(-1)}

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

            disabled={saving}

            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3"

          >

            <Save size={18}/>

            {

              saving

              ?

              "A guardar..."

              :

              "Guardar alterações"

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