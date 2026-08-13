// src/services/printReceipt.ts

export async function printReceipt(transaction: any): Promise<void> {
  // 1. Solicitar o dispositivo Bluetooth (impressora térmica ESC/POS)
 // 1. Solicitar o dispositivo Bluetooth (impressora térmica ESC/POS)
  const device = await (navigator as any).bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [
      '000018f0-0000-1000-8000-00805f9b34fb',
      '00001101-0000-1000-8000-00805f9b34fb', // Perfil Serial padrão (SPP)
      'e7810a71-73ae-499d-8c15-faa9aef0c3f2'
    ]
  });

  const server = await device.gatt.connect();
  
  // Tenta obter o serviço principal de forma segura para evitar falhas de UUID
  const services = await server.getPrimaryServices();
  const service = services[0];
  const characteristics = await service.getCharacteristics();
  const characteristic = characteristics[0];

  // 2. Montar os comandos ESC/POS com os dados atualizados
  const encoder = new TextEncoder();
  let commands: Uint8Array[] = [];
  
  const storedReceipt = transaction?.metadata?.receipt ?? {};
  const serviceRequest = transaction?.serviceRequest ?? {};
  
  const opId = storedReceipt.transactionId || transaction.externalId || serviceRequest.externalProviderRef || transaction.id;
  const ref = storedReceipt.customerReference || serviceRequest.customerReference || transaction.reference || "-";
  
  const rawName = (storedReceipt.provider ?? storedReceipt.partner ?? serviceRequest.providerName ?? serviceRequest.partnerName ?? "EMATEA").toUpperCase();
  const operatorName = rawName.includes("ELEPHANT") ? "ELEPHANT BET" : rawName;
  
  const serviceName = storedReceipt.plan ?? serviceRequest.planName ?? serviceRequest.serviceName ?? "Recarga";
  const amountFormatted = `${Number(transaction.amount || 0).toLocaleString("pt-AO")} AOA`;
  const dateFormatted = new Date(transaction.createdAt || Date.now()).toLocaleString("pt-AO", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
  const custName = storedReceipt.customerName || serviceRequest.customerName || "";
  const voucherPin = storedReceipt.voucherPin || "";

  // Inicializar impressora
  commands.push(new Uint8Array([0x1B, 0x40])); 
  
  // Alinhamento ao centro (Cabeçalho da Empresa)
  commands.push(new Uint8Array([0x1B, 0x61, 0x01])); 
  commands.push(new Uint8Array([0x1B, 0x45, 0x01])); // Negrito ON
  commands.push(encoder.encode("EMATEA COMERCIO GERAL\n"));
  commands.push(new Uint8Array([0x1B, 0x45, 0x00])); // Negrito OFF
  
  commands.push(encoder.encode("NIF: 5002577666\n"));
  commands.push(encoder.encode("Provincia: Malanje\n"));
  commands.push(encoder.encode("Comprovativo de Pagamento\n"));
  commands.push(encoder.encode("--------------------------------\n"));
  
  // Alinhamento à esquerda (Dados da Transação)
  commands.push(new Uint8Array([0x1B, 0x61, 0x00])); 
  
  commands.push(encoder.encode(`ID Operacao: ${opId}\n`));
  commands.push(encoder.encode(`Referencia: ${ref}\n`));
  if (custName) {
    commands.push(encoder.encode(`Cliente: ${custName}\n`));
  }
  commands.push(encoder.encode(`Operadora: ${operatorName}\n`));
  commands.push(encoder.encode(`Servico: ${serviceName}\n`));
  
  // Negrito para o montante
  commands.push(new Uint8Array([0x1B, 0x45, 0x01]));
  commands.push(encoder.encode(`Montante: ${amountFormatted}\n`));
  commands.push(new Uint8Array([0x1B, 0x45, 0x00]));

  commands.push(encoder.encode(`Data: ${dateFormatted}\n`));
  commands.push(encoder.encode(`Estado: CONCLUIDO\n`));

  if (voucherPin) {
    commands.push(encoder.encode("--------------------------------\n"));
    commands.push(new Uint8Array([0x1B, 0x61, 0x01])); 
    commands.push(new Uint8Array([0x1B, 0x45, 0x01])); 
    commands.push(encoder.encode(`PIN: ${voucherPin}\n`));
    commands.push(new Uint8Array([0x1B, 0x45, 0x00]));
    commands.push(new Uint8Array([0x1B, 0x61, 0x00])); 
  }

  commands.push(encoder.encode("--------------------------------\n"));
  
  // Rodapé centralizado
  commands.push(new Uint8Array([0x1B, 0x61, 0x01])); 
  commands.push(encoder.encode("OBRIGADO PELA PREFERENCIA\n\n\n"));
  
  // Corte automático de papel
  commands.push(new Uint8Array([0x1D, 0x56, 0x41, 0x00]));

  // 3. Enviar para a impressora via Bluetooth
  for (let cmd of commands) {
    await characteristic.writeValue(cmd);
  }

  await server.disconnect();
}