// src/services/printReceipt.ts

export async function printReceipt(transaction: any): Promise<void> {
  // 1. Solicitar o dispositivo Bluetooth (o navegador abre uma janela para escolher a impressora)
  const device = await (navigator as any).bluetooth.requestDevice({
    filters: [
      { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }, // UUID comum para impressoras térmicas ESC/POS
      { namePrefix: 'MPT' }, 
      { namePrefix: 'Printer' },
      { namePrefix: 'POS' }
    ],
    optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
  });

  const server = await device.gatt.connect();
  const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
  const characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');

  // 2. Montar os comandos ESC/POS para o talão
  const encoder = new TextEncoder();
  let commands: Uint8Array[] = [];
  
  // Extrair dados seguros do objeto transaction
  const storedReceipt = transaction?.metadata?.receipt ?? {};
  const serviceRequest = transaction?.serviceRequest ?? {};
  
  const opId = storedReceipt.transactionId || transaction.externalId || serviceRequest.externalProviderRef || transaction.id;
  const ref = storedReceipt.customerReference || serviceRequest.customerReference || transaction.reference || "-";
  const amountFormatted = `${Number(transaction.amount || 0).toLocaleString("pt-AO")} ${transaction.currency || "Kz"}`;
  const dateFormatted = new Date(transaction.createdAt || Date.now()).toLocaleString("pt-AO");
  const custName = storedReceipt.customerName || serviceRequest.customerName || "";
  const voucherPin = storedReceipt.voucherPin || "";

  // Inicializar impressora
  commands.push(new Uint8Array([0x1B, 0x40])); 
  
  // Alinhamento ao centro
  commands.push(new Uint8Array([0x1B, 0x61, 0x01])); 
  
  // Negrito ligado (Cabeçalho)
  commands.push(new Uint8Array([0x1B, 0x45, 0x01])); 
  commands.push(encoder.encode("EMATEA - SUB-AGENTE\n"));
  commands.push(new Uint8Array([0x1B, 0x45, 0x00])); // Negrito desligado
  
  commands.push(encoder.encode("Comprovativo de Pagamento\n"));
  commands.push(encoder.encode("--------------------------------\n"));
  
  // Alinhamento à esquerda para os dados
  commands.push(new Uint8Array([0x1B, 0x61, 0x00])); 
  
  commands.push(encoder.encode(`ID Operacao: ${opId}\n`));
  commands.push(encoder.encode(`Referencia: ${ref}\n`));
  
  if (custName) {
    commands.push(encoder.encode(`Cliente: ${custName}\n`));
  }
  
  commands.push(encoder.encode(`Estado: CONCLUIDO\n`));
  
  // Negrito para o montante
  commands.push(new Uint8Array([0x1B, 0x45, 0x01]));
  commands.push(encoder.encode(`Montante: ${amountFormatted}\n`));
  commands.push(new Uint8Array([0x1B, 0x45, 0x00]));

  if (voucherPin) {
    commands.push(encoder.encode("--------------------------------\n"));
    commands.push(new Uint8Array([0x1B, 0x61, 0x01])); // Centro
    commands.push(new Uint8Array([0x1B, 0x45, 0x01])); // Negrito
    commands.push(encoder.encode(`PIN: ${voucherPin}\n`));
    commands.push(new Uint8Array([0x1B, 0x45, 0x00]));
    commands.push(new Uint8Array([0x1B, 0x61, 0x00])); // Esquerda
  }

  commands.push(encoder.encode("--------------------------------\n"));
  commands.push(encoder.encode(`Data: ${dateFormatted}\n`));
  
  // Alinhamento ao centro para o rodapé
  commands.push(new Uint8Array([0x1B, 0x61, 0x01])); 
  commands.push(encoder.encode("\nObrigado pela preferencia!\n\n\n"));
  
  // Comando para corte de papel
  commands.push(new Uint8Array([0x1D, 0x56, 0x41, 0x00]));

  // 3. Enviar os blocos de dados para a impressora via Bluetooth
  for (let cmd of commands) {
    await characteristic.writeValue(cmd);
  }

  // Desconectar o GATT após o envio
  await server.disconnect();
}