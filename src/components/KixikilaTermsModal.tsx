import { CheckCircle, Info, ShieldCheck, Warning } from "@phosphor-icons/react"

export default function KixikilaTermsModal({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center z-[9999] p-4">
      <div className="
        bg-[#0f0f0f]
        border border-white/5
        rounded-[2.5rem]
        w-full max-w-[450px]
        max-h-[85vh]
        flex flex-col
        shadow-[0_20px_50px_rgba(0,0,0,0.8)]
        animate-in fade-in slide-in-from-bottom-4 duration-300
      ">
        {/* HEADER */}
        <div className="p-8 pb-4 text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} weight="duotone" className="text-green-500" />
          </div>
          <h2 className="text-xl font-black italic uppercase tracking-tight text-white">
            Protocolo Kixikila
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">
            Termos de Governança e Segurança
          </p>
        </div>

        {/* CONTENT */}
        <div className="
          px-8 py-4
          overflow-y-auto
          text-xs
          text-gray-400
          space-y-6
          scrollbar-hide
        ">
          <Section icon={<Info size={16} />} title="1. Natureza do Serviço">
            <p className="leading-relaxed">
              A Kixikila é um sistema de poupança coletiva rotativa gerenciada pela plataforma. 
              Contribuições mensais fixas geram recebimentos integrais baseados na ordem de ciclo.
            </p>
          </Section>

          <Section icon={<Warning size={16} />} title="2. Pagamentos e Penalidades">
            <Sub title="2.1 Atraso de Contribuição">
              <p>Incorre em taxa de penalização de <span className="text-white font-bold">5%</span> sobre o valor da quota.</p>
            </Sub>

            <Sub title="2.2 Taxa de Segurança">
              <p>Desconto administrativo de <span className="text-white font-bold">3%</span> para manutenção e garantia de fundos.</p>
            </Sub>
          </Section>

          <Section icon={<CheckCircle size={16} />} title="3. Regras e Desistência">
             <ul className="space-y-2 list-none">
              <li className="flex gap-2">
                <span className="text-green-500">•</span> 
                Participação limitada a um ciclo ativo por usuário.
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">•</span> 
                Desistências pós-recebimento implicam em sanções legais e bloqueio total da conta.
              </li>
            </ul>
          </Section>
          
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-[10px] leading-relaxed italic">
              Ao clicar em aceitar, você confirma que leu e concorda com a estrutura de governança do protocolo financeiro EMATEA.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-8 pt-4">
          <button
            onClick={onAccept}
            className="
              w-full
              bg-white
              text-black
              h-14
              rounded-2xl
              font-black
              text-xs
              uppercase
              tracking-widest
              hover:bg-green-500
              hover:text-white
              transition-all
              active:scale-95
              flex items-center justify-center gap-2
            "
          >
            Aceitar Protocolo
            <CheckCircle size={20} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* COMPONENTES AUXILIARES */

function Section({ title, children, icon }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-green-500">{icon}</span>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
          {title}
        </p>
      </div>
      <div className="pl-6 border-l border-white/5">
        {children}
      </div>
    </div>
  )
}

function Sub({ title, children }: any) {
  return (
    <div className="mb-3">
      <p className="text-[9px] font-bold text-gray-500 uppercase mb-1">
        {title}
      </p>
      <div className="text-gray-400">
        {children}
      </div>
    </div>
  )
}