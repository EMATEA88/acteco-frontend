export interface CategoryBranding {
  id: string;
  name: string;
  logo: string;
}

export const CATEGORIES: Record<string, CategoryBranding> = {

  TELECOMUNICAÇÕES: {
    id: "telecommunications",
    name: "Telecomunicações",
    logo: "TELECOMUNICACOES.PNG"
  },

  TELECOMUNICACOES: {
    id: "telecommunications",
    name: "Telecomunicações",
    logo: "TELECOMUNICACOES.PNG"
  },

  TELEVISÃO: {
    id: "tv",
    name: "Televisão",
    logo: "TV.PNG"
  },

  TELEVISAO: {
    id: "tv",
    name: "Televisão",
    logo: "TV.PNG"
  },

  "SERVIÇOS PÚBLICOS": {
    id: "public",
    name: "Serviços Públicos",
    logo: "SERVICOSPUBLICOS.PNG"
  },

  "SERVICOS PUBLICOS": {
    id: "public",
    name: "Serviços Públicos",
    logo: "SERVICOSPUBLICOS.PNG"
  },

  "SERVIÇOS INTERNACIONAIS": {
    id: "international",
    name: "Serviços Internacionais",
    logo: "INTERNACIONAIS.PNG"
  },

  "SERVICOS INTERNACIONAIS": {
    id: "international",
    name: "Serviços Internacionais",
    logo: "INTERNACIONAIS.PNG"
  },

  "JOGOS E APOSTAS": {
    id: "games",
    name: "Jogos e Apostas",
    logo: "JOGOS.PNG"
  }

};