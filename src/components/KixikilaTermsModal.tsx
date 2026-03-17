export default function KixikilaTermsModal({ onAccept }: any){

  return(

    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="
        bg-[#14181D]
        border border-[#2B3139]
        rounded-2xl
        w-[95%] max-w-[420px]
        max-h-[90vh]
        flex flex-col
        shadow-[0_10px_40px_rgba(0,0,0,0.6)]
      ">

        {/* HEADER */}
        <div className="p-4 border-b border-[#2B3139] flex items-center justify-between">

          <div>
            <p className="font-semibold text-lg text-white">
              KIXIKILA
            </p>
            <p className="text-xs text-[#848E9C]">
              Termos e Condições
            </p>
          </div>

        </div>

        {/* CONTENT */}
        <div className="
          p-4
          overflow-y-auto
          text-sm
          text-[#B7BDC6]
          space-y-5
        ">

          <Section title="1. Natureza do Serviço">
            <p>
              A Kixikila é um sistema de poupança coletiva rotativa,
              onde os participantes contribuem mensalmente com um valor fixo
              e recebem o montante total conforme a sua posição no ciclo.
            </p>
          </Section>

          <Section title="2. Pagamentos e Penalidades">

            <Sub title="2.1 Atraso de Contribuição">
              <ul className="list-disc pl-4 space-y-1">
                <li>Taxa de penalização de <b>5%</b> sobre a contribuição mensal</li>
                <li>Pagamento obrigatório para permanência no grupo</li>
              </ul>
            </Sub>

            <Sub title="2.2 Taxa de Segurança de Fundos">
              <ul className="list-disc pl-4 space-y-1">
                <li>Desconto automático de <b>3%</b> após recebimento</li>
                <li>Saldo disponível para saque a qualquer momento</li>
              </ul>
            </Sub>

          </Section>

          <Section title="3. Regras de Participação">
            <ul className="list-disc pl-4 space-y-1">
              <li>Apenas 1 participação por ciclo</li>
              <li>A participação implica aceitação integral destes termos</li>
            </ul>
          </Section>

          <Section title="4. Desistência">

            <Sub title="4.1 Antes de Receber">
              <ul className="list-disc pl-4 space-y-1">
                <li>Deve permanecer até o fim do ciclo</li>
                <li>Sem reembolso antecipado</li>
              </ul>
            </Sub>

            <Sub title="4.2 Após Receber">
              <ul className="list-disc pl-4 space-y-1">
                <li>Obrigatório reembolsar valores pendentes</li>
                <li>Pode resultar em medidas legais</li>
              </ul>
            </Sub>

          </Section>

          <Section title="5. Responsabilidade do Usuário">
            <ul className="list-disc pl-4 space-y-1">
              <li>Cumprir todos os pagamentos dentro dos prazos</li>
              <li>O não cumprimento pode gerar sanções</li>
            </ul>
          </Section>

          <Section title="6. Aceitação dos Termos">
            <ul className="list-disc pl-4 space-y-1">
              <li>Leu e compreendeu todas as regras</li>
              <li>Aceita cumprir integralmente</li>
              <li>Assume total responsabilidade</li>
            </ul>
          </Section>

        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-[#2B3139]">

          <button
            onClick={onAccept}
            className="
              w-full
              bg-[#FCD535]
              text-black
              py-3
              rounded-xl
              font-semibold
              hover:opacity-90
              transition
            "
          >
            Concordo
          </button>

        </div>

      </div>

    </div>

  )

}


/* COMPONENTES AUXILIARES */

function Section({ title, children }: any){
  return(
    <div>
      <p className="text-white font-semibold mb-2">
        {title}
      </p>
      {children}
    </div>
  )
}

function Sub({ title, children }: any){
  return(
    <div className="mt-2">
      <p className="text-[#FCD535] font-medium mb-1">
        {title}
      </p>
      {children}
    </div>
  )
}