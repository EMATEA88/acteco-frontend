import { FileText, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function Lucro() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const dadosComissoes = [
    { provedor: "888Bets", produto: "888Bets: Recarga", preco: "De 50 Kz até 100.000 Kz", lucro: "Variável", comissao: "1.94%" },
    { provedor: "Afribet", produto: "Afribet: Recarga", preco: "De 100 Kz até 300.000 Kz", lucro: "Variável", comissao: "5.82%" },
    { provedor: "BantuBet", produto: "BantuBet: Recarga", preco: "De 100 Kz até 300.000 Kz", lucro: "Variável", comissao: "1.94%" },
    { provedor: "BantuBet", produto: "BantuBet: Voucher 200 Kz", preco: "200,00", lucro: "3,88", comissao: "1.94%" },
    { provedor: "BantuBet", produto: "BantuBet: Voucher 500 Kz", preco: "500,00", lucro: "9,70", comissao: "1.94%" },
    { provedor: "BantuBet", produto: "BantuBet: Voucher 1.000 Kz", preco: "1.000,00", lucro: "19,40", comissao: "1.94%" },
    { provedor: "BantuBet", produto: "BantuBet: Voucher 2.500 Kz", preco: "2.500,00", lucro: "48,50", comissao: "1.94%" },
    { provedor: "BantuBet", produto: "BantuBet: Voucher 5.000 Kz", preco: "5.000,00", lucro: "97,00", comissao: "1.94%" },
    { provedor: "BantuBet", produto: "BantuBet: Voucher 10.000 Kz", preco: "10.000,00", lucro: "194,00", comissao: "1.94%" },
    { provedor: "KwanzaBet", produto: "KwanzaBet: Recarga", preco: "De 100 Kz até 300.000 Kz", lucro: "Variável", comissao: "1.94%" },
    { provedor: "Mobet", produto: "MOBET: Recarga", preco: "De 100 Kz até 300.000 Kz", lucro: "Variável", comissao: "0.97%" },
    { provedor: "PremierBet", produto: "PremierBet: Recarga", preco: "De 100 Kz até 200.000 Kz", lucro: "Variável", comissao: "0.97%" },
    { provedor: "Africell", produto: "Africell: Fala Todos 130min/130sms/3D", preco: "500,00", lucro: "24,25", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Fala Todos 140min/140sms/7D", preco: "700,00", lucro: "33,95", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Fala Todos 200min/200sms/7D", preco: "1.000,00", lucro: "47,50", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Fala Todos 400min/400sms/30D", preco: "2.000,00", lucro: "97,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Fala Todos 40min/40sms/3D", preco: "200,00", lucro: "9,70", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Fala Todos 50min/50sms/1D", preco: "200,00", lucro: "9,70", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Fala Todos 70min/70sms/3D", preco: "300,00", lucro: "14,55", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Fala Todos 720min/720sms/30D", preco: "3.600,00", lucro: "174,60", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Fala Todos 90min/90sms/7D", preco: "500,00", lucro: "24,25", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Socializa 1.5GB/7D", preco: "500,00", lucro: "24,25", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Socializa 1GB/3D", preco: "400,00", lucro: "19,40", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Socializa 2GB/7D", preco: "750,00", lucro: "36,37", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Socializa 4GB/30D", preco: "1.500,00", lucro: "72,75", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Socializa 500MB/1D", preco: "200,00", lucro: "9,70", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Socializa 500MB/3D", preco: "300,00", lucro: "14,55", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 110min/110sms/1.2GB/3D", preco: "700,00", lucro: "33,95", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 120min/120sms/1.6GB/7D", preco: "1.000,00", lucro: "47,50", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 130min/130sms/2.5GB/7D", preco: "1.200,00", lucro: "58,20", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 1400min/20GB/7D", preco: "10.000,00", lucro: "485,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 1500min/22GB/30D", preco: "18.000,00", lucro: "873,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 1600min/24GB/7D", preco: "12.500,00", lucro: "606,25", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 2000min/12GB/30D", preco: "20.000,00", lucro: "970,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 20min/20sms/400MB/3D", preco: "200,00", lucro: "9,70", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 2300min/35GB/30D", preco: "30.000,00", lucro: "1.455,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 260min/130sms/5GB/7D", preco: "2.500,00", lucro: "121,25", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 300min/6.5GB/30D", preco: "5.000,00", lucro: "242,50", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 30min/30sms/500MB/1D", preco: "200,00", lucro: "9,70", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 3500min/50GB/30D", preco: "40.000,00", lucro: "1.940,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 40min/40sms/400MB/3D", preco: "300,00", lucro: "14,55", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 50min/25sms/1GB/7D", preco: "500,00", lucro: "24,25", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 600min/150sms/12GB/7D", preco: "6.000,00", lucro: "291,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 700min/13GB/30D", preco: "10.000,00", lucro: "485,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 70min/35sms/900MB/3D", preco: "500,00", lucro: "24,25", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 70min/60sms/500MB/30D", preco: "2.000,00", lucro: "97,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 80min/40sms/1.2GB/7D", preco: "600,00", lucro: "29,10", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Tudo e Todos 90min/45sms/1.2GB/3D", preco: "600,00", lucro: "29,10", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Saldo Voz", preco: "De 100 Kz até 200.000 Kz", lucro: "Variável", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: 200Kz", preco: "200,00", lucro: "9,70", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: 500Kz", preco: "500,00", lucro: "24,25", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: 1.000Kz", preco: "1.000,00", lucro: "48,50", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: 2.000Kz", preco: "2.000,00", lucro: "97,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: 5.000Kz", preco: "5.000,00", lucro: "242,50", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: 10.000Kz", preco: "10.000,00", lucro: "485,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrimix 200MB/1D", preco: "200,00", lucro: "9,70", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrimix 300MB/3D", preco: "300,00", lucro: "14,55", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrimix 600MB/3D", preco: "500,00", lucro: "24,25", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrimix 1.25GB/7D", preco: "1.000,00", lucro: "48,50", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrinet 1GB/1D", preco: "600,00", lucro: "29,10", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrinet 1.5GB/1D", preco: "800,00", lucro: "38,80", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrinet 1GB/3D", preco: "800,00", lucro: "38,80", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrinet 400MB/1D", preco: "300,00", lucro: "14,55", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrinet 600MB/1D", preco: "200,00", lucro: "9,70", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrinet 750MB/7D", preco: "500,00", lucro: "24,25", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrinet 800MB/1D", preco: "500,00", lucro: "24,25", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrinet 2GB/7D", preco: "1.000,00", lucro: "48,50", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrinet 5GB/7D", preco: "2.000,00", lucro: "97,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrinet 1.5GB/30D", preco: "1.500,00", lucro: "72,75", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrinet 2.5GB/30D", preco: "2.000,00", lucro: "97,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrinet 4GB/30D", preco: "3.000,00", lucro: "142,50", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrinet 7GB/30D", preco: "5.000,00", lucro: "242,50", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrinet 15GB/30D", preco: "10.000,00", lucro: "485,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrinet 25GB/60D", preco: "15.000,00", lucro: "727,50", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Afrinet 50GB/60D", preco: "25.000,00", lucro: "1.212,50", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Konekta 4G 6GB/7D", preco: "4.000,00", lucro: "190,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Konekta 4G 12GB/7D", preco: "6.500,00", lucro: "315,25", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Konekta 4G 25GB/30D", preco: "13.000,00", lucro: "630,50", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Konekta 4G 40GB/30D", preco: "20.000,00", lucro: "970,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Konekta 4G 60GB/30D", preco: "25.000,00", lucro: "1.212,50", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Konekta 4G 100GB/30D", preco: "40.000,00", lucro: "1.940,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Konekta 5G 25MPS/30D", preco: "25.000,00", lucro: "1.212,50", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Konekta 5G 50MPS/30D", preco: "50.000,00", lucro: "2.425,00", comissao: "4.85%" },
    { provedor: "Africell", produto: "Africell: Konekta 5G 100MPS/30D", preco: "88.000,00", lucro: "4.268,00", comissao: "4.85%" },
    { provedor: "DStv", produto: "DStv: Fácil/7D", preco: "1.100,00", lucro: "36,58", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv: Fácil", preco: "3.700,00", lucro: "125,61", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv: Família/7D", preco: "1.400,00", lucro: "47,53", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv: Família+/7D", preco: "2.100,00", lucro: "71,30", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv: Família", preco: "5.000,00", lucro: "169,75", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv: Família Mais", preco: "7.400,00", lucro: "251,23", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv: Grande/7D", preco: "3.000,00", lucro: "101,85", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv: Grande", preco: "9.500,00", lucro: "322,52", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv: Grande Mais", preco: "15.000,00", lucro: "509,25", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv: Bué", preco: "19.800,00", lucro: "672,21", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv: Premium", preco: "22.800,00", lucro: "774,06", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv: Mega", preco: "27.500,00", lucro: "933,62", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv Adicional: China", preco: "2.000,00", lucro: "67,90", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv Adicional: French", preco: "4.500,00", lucro: "149,63", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv Adicional: French Tch", preco: "3.050,00", lucro: "103,55", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv Adicional: French Plus", preco: "9.000,00", lucro: "305,55", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv Adicional: India", preco: "10.000,00", lucro: "339,50", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv Combinado: Bué + India", preco: "23.000,00", lucro: "780,85", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv Combinado: Premium + India", preco: "26.700,00", lucro: "906,47", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv Combinado: French Cls + Bué", preco: "26.800,00", lucro: "909,86", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv Combinado: French Cls + Premium", preco: "29.600,00", lucro: "1.004,92", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv Combinado: Premium + Bué + India", preco: "35.000,00", lucro: "1.188,25", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv Combinado: French Cls + Premium + Bué", preco: "42.200,00", lucro: "1.432,69", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv Filmes: Box Office", preco: "De 1.300 Kz até 13.000 Kz", lucro: "Variável", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv Descodificadores: ExtraView", preco: "2.850,00", lucro: "96,76", comissao: "3.395%" },
    { provedor: "DStv", produto: "DStv Descodificadores: HD-PVR", preco: "2.850,00", lucro: "96,76", comissao: "3.395%" },
    { provedor: "Movicel", produto: "Movicel: Karga Leve/7D", preco: "1.000,00", lucro: "77,60", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Karga Nice", preco: "2.000,00", lucro: "152,00", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Karga Tudo", preco: "3.000,00", lucro: "232,80", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Karga Super", preco: "5.000,00", lucro: "388,00", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Karga Bwé", preco: "10.000,00", lucro: "776,00", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Karga VIP/60D", preco: "15.000,00", lucro: "1.164,00", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Kuia/1D", preco: "100,00", lucro: "7,76", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Kuia+/1D", preco: "200,00", lucro: "15,52", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Takuia 3D", preco: "500,00", lucro: "38,80", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Recarga Voz", preco: "De 100 Kz até 25.000 Kz", lucro: "Variável", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Recarga 100kz", preco: "100,00", lucro: "7,76", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Recarga 400kz", preco: "400,00", lucro: "31,04", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Recarga 500kz", preco: "500,00", lucro: "38,80", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Recarga 850kz", preco: "850,00", lucro: "65,96", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Recarga 1.000kz", preco: "1.000,00", lucro: "77,60", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Recarga 1.900kz", preco: "1.900,00", lucro: "144,40", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Recarga 2.200kz", preco: "2.200,00", lucro: "170,72", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Recarga 3.900kz", preco: "3.900,00", lucro: "302,64", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Recarga 4.800kz", preco: "4.800,00", lucro: "364,80", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Recarga 6.500kz", preco: "6.500,00", lucro: "504,40", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Recarga 7.900kz", preco: "7.900,00", lucro: "613,04", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Recarga 18.000kz", preco: "18.000,00", lucro: "1.396,80", comissao: "7.76%" },
    { provedor: "Movicel", produto: "Movicel: Recarga 25.000kz", preco: "25.000,00", lucro: "1.940,00", comissao: "7.76%" },
    { provedor: "Unitel", produto: "Unitel: Base", preco: "2.000,00", lucro: "20,00", comissao: "1.00%" },
    { provedor: "Unitel", produto: "Unitel: Recarga Voz", preco: "De 350 Kz até 25.000 Kz", lucro: "Variável", comissao: "1.00%" },
    { provedor: "Unitel", produto: "Unitel: 30min + 2GB / 2D", preco: "625,00", lucro: "6,25", comissao: "1.00%" },
    { provedor: "Unitel", produto: "Unitel: Mais 250min/sms/5GB/30D", preco: "5.000,00", lucro: "50,00", comissao: "1.00%" },
    { provedor: "Unitel", produto: "Unitel: Mais 600min/sms/10GB/30D", preco: "10.000,00", lucro: "100,00", comissao: "1.00%" },
    { provedor: "Unitel", produto: "Unitel: Casa 4G 100GB/30D", preco: "40.000,00", lucro: "400,00", comissao: "1.00%" },
    { provedor: "ZAP", produto: "ZAP: Satelite Mini (30D)", preco: "5.050,00", lucro: "195,94", comissao: "3.88%" },
    { provedor: "ZAP", produto: "ZAP: Satelite Max (30D)", preco: "10.100,00", lucro: "391,88", comissao: "3.88%" },
    { provedor: "ZAP", produto: "ZAP: Satelite Premium (30D)", preco: "20.250,00", lucro: "785,70", comissao: "3.88%" },
    { provedor: "ENDE", produto: "ENDE: Recarga Energia", preco: "De 300 Kz até 50.000 Kz", lucro: "Variável", comissao: "1.455%" },
    { provedor: "EPAL", produto: "EPAL: Pagamento de Facturas", preco: "Variável", lucro: "Variável", comissao: "1.455%" },
    { provedor: "EMATEA", produto: "Transferências EMATEA", preco: "De 50 Kz até 500.000 Kz", lucro: "Variável", comissao: "0.485%" },
    { provedor: "Seguros", produto: "Seguro: Veículos", preco: "Variável", lucro: "Variável", comissao: "7.76%" },
    { provedor: "Vouchers", produto: "Netflix 25EUR", preco: "38.647,88", lucro: "1.499,54", comissao: "3.88%" },
    { provedor: "Vouchers", produto: "Spotify 7EUR", preco: "5.465,40", lucro: "212,06", comissao: "3.88%" }
  ]

  const filteredData = dadosComissoes.filter(item => 
    item.provedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.produto.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  return (
    <div
      className="min-h-screen bg-[#0a2533] text-slate-100"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style>{`
        .lucro-page-scroll::-webkit-scrollbar {
          display: none;
        }
        .lucro-table-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <main className="lucro-page-scroll mx-auto w-full max-w-7xl px-4 py-5 pb-24 sm:px-8 sm:py-7">
        {/* CABEÇALHO DA TABELA + PESQUISA */}
        <section className="border-b border-cyan-900/70 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0e9fc2]">
                <FileText size={19} className="text-white" />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-base font-bold text-white sm:text-lg">
                  Tabela de comissão
                </h1>
                <p className="text-[11px] text-cyan-200/70">
                  Produtos, preços e comissões
                </p>
              </div>
            </div>

            <div className="relative w-full sm:w-72">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search size={16} />
              </span>

              <input
                type="text"
                placeholder="Pesquisar produto ou provedor..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full rounded-xl border border-cyan-800 bg-cyan-900/40 py-2.5 pl-9 pr-4 text-xs text-white placeholder-cyan-200/50 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>
        </section>

        {/* TABELA */}
        <section className="w-full">
          <div className="lucro-table-scroll overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-cyan-900 text-cyan-200">
                  <th className="p-3 font-bold uppercase tracking-wider text-[11px]">
                    Provedor
                  </th>
                  <th className="p-3 font-bold uppercase tracking-wider text-[11px]">
                    Produto
                  </th>
                  <th className="p-3 font-bold uppercase tracking-wider text-[11px]">
                    Preço (Kz)
                  </th>
                  <th className="p-3 font-bold uppercase tracking-wider text-[11px]">
                    Lucro (Kz)
                  </th>
                  <th className="p-3 font-bold uppercase tracking-wider text-[11px]">
                    Comissão (%)
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-cyan-900/40 text-slate-200">
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr
                      key={index}
                      className="transition-colors hover:bg-cyan-900/20"
                    >
                      <td className="p-3 font-semibold text-white">
                        <span className="rounded-md border border-cyan-700/50 bg-cyan-900/60 px-2 py-1 text-[11px] font-bold text-cyan-300">
                          {item.provedor}
                        </span>
                      </td>

                      <td className="p-3 text-slate-200">{item.produto}</td>
                      <td className="p-3 text-cyan-100">{item.preco}</td>
                      <td className="p-3 font-medium text-cyan-400">{item.lucro}</td>
                      <td className="p-3 font-semibold text-white">{item.comissao}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      Nenhum produto encontrado para "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINAÇÃO */}
          <div className="flex flex-col gap-3 border-t border-cyan-900/70 py-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs font-medium text-cyan-200/80">
              Página {currentPage} de {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-lg border border-cyan-800 bg-cyan-950 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition-colors hover:bg-cyan-900 disabled:opacity-40"
              >
                <ChevronLeft size={14} />
                Anterior
              </button>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-lg border border-cyan-800 bg-cyan-950 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition-colors hover:bg-cyan-900 disabled:opacity-40"
              >
                Seguinte
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )

}