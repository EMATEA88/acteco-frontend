import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, UserCheck } from "lucide-react";

import { AgentService } from "../../services/agent.service";

export default function EditSubAgent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    workstation: "",
    position: "",
    department: "",
    address: ""
  });

  useEffect(() => {
    if (id) {
      loadSubAgent();
    }
  }, [id]);

  async function loadSubAgent() {
    try {
      const data = await AgentService.getSubAgent(Number(id));
      setForm({
        fullName: data.user.fullName || "",
        phone: data.user.phone || "",
        email: data.user.email || "",
        workstation: data.workstation || "",
        position: data.position || "",
        department: data.department || "",
        address: data.address || ""
      });
    } catch (error) {
      console.error(error);
      alert("Não foi possível carregar o Sub-agente.");
      navigate("/agent/sub-agents");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      await AgentService.updateSubAgent(Number(id), form);
      alert("Sub-agente atualizado com sucesso.");
      navigate("/agent/sub-agents");
    } catch (error: any) {
      alert(
        error?.response?.data?.error ||
        "Erro ao atualizar o Sub-agente."
      );
    } finally {
      setSaving(false);
    }
  }

  // SKELETON LOADING TEMÁTICO CONSISTENTE
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto font-sans text-[#EAECEF] space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-7 bg-[#161A1E] w-48 rounded-lg" />
            <div className="h-4 bg-[#161A1E] w-64 rounded-lg" />
          </div>
          <div className="h-10 bg-[#161A1E] w-24 rounded-xl" />
        </div>
        <div className="h-96 bg-[#161A1E] rounded-[2rem] border border-white/[0.04]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto font-sans antialiased text-[#EAECEF]">
      
      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
            <UserCheck size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-white uppercase font-mono">
              Editar Sub-agente
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
              Modifique e atualize os dados cadastrais da conta
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] text-gray-400 hover:text-white rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all"
        >
          <ArrowLeft size={14} strokeWidth={3} />
          Voltar
        </button>
      </div>

      {/* PAINEL CENTRAL DO FORMULÁRIO */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#161A1E] rounded-[2rem] border border-white/[0.04] p-6 md:p-8 space-y-8 shadow-2xl"
      >
        
        {/* SECÇÃO: DADOS PESSOAIS */}
        <div className="space-y-5">
          <h2 className="text-xs font-black uppercase tracking-widest text-cyan-400/80 border-b border-white/[0.03] pb-2 font-mono">
            Dados Pessoais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Nome completo"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Ex: Manuel António"
              required
            />
            <Input
              label="Telefone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Ex: 923000000"
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nome@ematea.com"
            />
          </div>
        </div>

        {/* SECÇÃO: INFORMAÇÕES INTERNAS */}
        <div className="space-y-5">
          <h2 className="text-xs font-black uppercase tracking-widest text-cyan-400/80 border-b border-white/[0.03] pb-2 font-mono">
            Informações Internas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Cargo"
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="Ex: Operador de Caixa"
            />
            <Input
              label="Departamento"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Ex: Atendimento"
            />
            <Input
              label="Posto de trabalho"
              name="workstation"
              value={form.workstation}
              onChange={handleChange}
              placeholder="Ex: Guiché Central"
            />
            <Input
              label="Endereço"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Cidade, Província"
            />
          </div>
        </div>

        {/* BOTÃO DE CONFIRMAÇÃO */}
        <div className="flex justify-end pt-4 border-t border-white/[0.03]">
          <button
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-800 disabled:text-gray-500 text-black font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.1)] active:scale-[0.98]"
          >
            <Save size={16} strokeWidth={2.5} />
            {saving ? "A guardar..." : "Guardar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}

interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: any;
  required?: boolean;
  type?: string;
  placeholder?: string;
}

function Input({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
  placeholder
}: InputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full bg-[#0B0E11]/60 text-white placeholder:text-gray-600 border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/40 focus:bg-[#0B0E11] transition-all duration-200"
      />
    </div>
  );
}