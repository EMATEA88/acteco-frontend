export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  prefixes: string[]; // Códigos exatos ou partes únicas do Provider_Code / Type
}

export const CATEGORIES: Category[] = [
  {
    id: 'telecom',
    name: 'Telecomunicações',
    icon: '📱',
    description: 'Recargas de voz, SMS e dados',
    prefixes: ['UTL_', 'MOV_', 'AFR_', 'TEL_', 'NET_', 'UNITEL', 'MOVICEL', 'AFRICELL', 'NETONE']
  },
  {
    id: 'tv',
    name: 'Televisão',
    icon: '📺',
    description: 'Assinaturas e recargas de TV',
    prefixes: ['DSTV', 'ZAP_', 'TV_', 'ZAD_']
  },
  {
    id: 'games',
    name: 'Jogos & Apostas',
    icon: '🎮',
    description: 'Carregamento de contas de jogo e plataformas',
    prefixes: ['888', 'KWZ', 'ELEPHANT', 'BANTU', 'MOB', 'BET', 'ABET', 'EBET', 'MGM', 'MGMBET', 'NINTENDO', 'PLAYSTATION', 'STEAM', 'XBOX']
  },
  {
    id: 'partners',
    name: 'Parceiros',
    icon: '🤝',
    description: 'Serviços de Seguros e outros parceiros',
    prefixes: ['STA_', 'SEG_', 'PART_', 'STAS']
  },
  {
    id: 'international',
    name: 'Pagamentos Internacionais',
    icon: '🌍',
    description: 'Cartões-presente e serviços globais (Amazon, Google Play, etc.)',
    prefixes: ['INT_VCH2', 'AMZ', 'GLG', 'APL']
  },
  {
    id: 'public',
    name: 'Serviços Públicos',
    icon: '🏛',
    description: 'ENDE, EPAL, impostos e taxas',
    prefixes: ['ENDE', 'EPAL', 'ELE_', 'AGU_', 'GOV_', 'TAX_']
  }
];