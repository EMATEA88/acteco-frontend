import { useEffect, useState } from 'react';
import { akiService } from '../services/akiService';
import RecargaModal from './RecargaModal';
import { CATEGORIES, type Category } from '../config/categories';

// Carregamento dinâmico otimizado de imagens da pasta src/assets/recharges/
const images = import.meta.glob<{ default: string }>('../assets/recharges/*.{png,PNG,jpg,JPG}', { eager: true });

function getLogoPath(fileName: string): string {
  if (!fileName) return '';
  const normalizedPath = `../assets/recharges/${fileName}`;
  for (const path in images) {
    if (path.toUpperCase() === normalizedPath.toUpperCase()) {
      return images[path].default;
    }
  }
  return '';
}

// Mapeamento rigoroso e separado para ZAP Satélite e ZAP Fibra
function getOperatorBranding(codeOrDescription: string = '') {
  const text = codeOrDescription.toUpperCase();

  if (text.includes('ZAP') && (text.includes('FIBRA') || text.includes('ZAP2'))) {
    return { label: 'Zap Fibra', logo: getLogoPath('ZAP2.PNG'), logoFileName: 'ZAP2.PNG' };
  }
  if (text.includes('ZAP')) {
    return { label: 'Zap Satélite', logo: getLogoPath('ZAP1.PNG'), logoFileName: 'ZAP1.PNG' };
  }

  if (text.includes('888')) return { label: '888Bets', logo: getLogoPath('888Bets.png'), logoFileName: '888Bets.png' };
  if (text.includes('BBET') || text.includes('BANTU')) return { label: 'BantuBet', logo: getLogoPath('BantuBet.png'), logoFileName: 'BantuBet.png' };
  if (text.includes('EBET') || text.includes('ELEPHANT')) return { label: 'Elephant Bet', logo: getLogoPath('Elephantbet.png'), logoFileName: 'Elephantbet.png' };
  if (text.includes('PBET') || text.includes('PREMIER')) return { label: 'Premier Bet', logo: getLogoPath('Premiebet.png'), logoFileName: 'Premiebet.png' };
  if (text.includes('ABET') || text.includes('AFRIBET')) return { label: 'AfriBet', logo: getLogoPath('AfriBet.png'), logoFileName: 'AfriBet.png' };
  if (text.includes('KWANZA') || text.includes('KWZ')) return { label: 'KwanzaBet', logo: getLogoPath('Kwanzabet.png'), logoFileName: 'Kwanzabet.png' };
  if (text.includes('MGMBET') || text.includes('MELBET') || text.includes('MGM')) return { label: 'MelBet', logo: getLogoPath('MelBet.png'), logoFileName: 'MelBet.png' };
  if (text.includes('MOBET') || text.includes('MOB')) return { label: 'MoBet', logo: getLogoPath('Mobet.png'), logoFileName: 'Mobet.png' };
  
  if (text.includes('UNITEL')) return { label: 'Unitel', logo: getLogoPath('UNITEL.PNG'), logoFileName: 'UNITEL.PNG' };
  if (text.includes('MOVICEL')) return { label: 'Movicel', logo: getLogoPath('MOVICEL.PNG'), logoFileName: 'MOVICEL.PNG' };
  if (text.includes('AFRICELL')) return { label: 'Africell', logo: getLogoPath('AFRICELL.PNG'), logoFileName: 'AFRICELL.PNG' };
  if (text.includes('NETONE')) return { label: 'NetOne', logo: getLogoPath('NETONE.PNG'), logoFileName: 'NETONE.PNG' };
  if (text.includes('DSTV')) return { label: 'DStv', logo: getLogoPath('DSTV.PNG'), logoFileName: 'DSTV.PNG' };
  if (text.includes('BAZZA')) return { label: 'Bazza', logo: getLogoPath('UNITEL.PNG'), logoFileName: 'UNITEL.PNG' };

  if (text.includes('ENDE')) return { label: 'ENDE E.P.', logo: getLogoPath('ENDE.PNG'), logoFileName: 'ENDE.PNG' };
  if (text.includes('EPAL')) return { label: 'EPAL', logo: getLogoPath('EPAL.PNG'), logoFileName: 'EPAL.PNG' };
  if (text.includes('STAS')) return { label: 'STAS', logo: getLogoPath('STAS.PNG'), logoFileName: 'STAS.PNG' };

  if (text.includes('AMAZON')) return { label: 'Amazon', logo: getLogoPath('AMAZON.PNG'), logoFileName: 'AMAZON.PNG' };
  if (text.includes('APPLE')) return { label: 'Apple', logo: getLogoPath('APPLE.PNG'), logoFileName: 'APPLE.PNG' };
  if (text.includes('GOOGLE')) return { label: 'Google Play', logo: getLogoPath('GOOGLEPLAY.PNG'), logoFileName: 'GOOGLEPLAY.PNG' };
  if (text.includes('NETFLIX')) return { label: 'Netflix', logo: getLogoPath('NETFLIX.PNG'), logoFileName: 'NETFLIX.PNG' };
  if (text.includes('SPOTIFY')) return { label: 'Spotify', logo: getLogoPath('SPOTIFY.PNG'), logoFileName: 'SPOTIFY.PNG' };
  if (text.includes('PLAYSTATION') || text.includes('TEAM')) return { label: 'PlayStation', logo: getLogoPath('TEAM.PNG'), logoFileName: 'TEAM.PNG' };
  if (text.includes('XBOX')) return { label: 'Xbox', logo: getLogoPath('XBOX.PNG'), logoFileName: 'XBOX.PNG' };
  if (text.includes('BOLT')) return { label: 'Bolt', logo: getLogoPath('BOLT.PNG'), logoFileName: 'BOLT.PNG' };
  if (text.includes('FLIXBUS')) return { label: 'FlixBus', logo: getLogoPath('FLIXBUS.PNG'), logoFileName: 'FLIXBUS.PNG' };

  return { label: codeOrDescription, logo: '', logoFileName: '' };
}

// Configuração visual de estilos por marca
const brandConfig: Record<string, { bg: string; label: string; logoFileName: string }> = {
  AFRICELL: { bg: 'bg-purple-900/40 border-purple-500/30', label: 'Africell', logoFileName: 'AFRICELL.PNG' },
  DSTV: { bg: 'bg-blue-900/40 border-blue-500/30', label: 'DStv', logoFileName: 'DSTV.PNG' },
  MOVICEL: { bg: 'bg-red-900/40 border-red-500/30', label: 'Movicel', logoFileName: 'MOVICEL.PNG' },
  UNITEL: { bg: 'bg-blue-950/50 border-blue-500/30', label: 'Unitel', logoFileName: 'UNITEL.PNG' },
  NETONE: { bg: 'bg-teal-950/50 border-teal-500/30', label: 'NetOne', logoFileName: 'NETONE.PNG' },
  ZAP1: { bg: 'bg-orange-950/50 border-orange-500/30', label: 'Zap Satélite', logoFileName: 'ZAP1.PNG' },
  ZAP2: { bg: 'bg-orange-950/50 border-orange-500/30', label: 'Zap Fibra', logoFileName: 'ZAP2.PNG' },
  
  '888': { bg: 'bg-orange-900/40 border-orange-500/30', label: '888Bets', logoFileName: '888Bets.png' },
  '888BET': { bg: 'bg-orange-900/40 border-orange-500/30', label: '888Bets', logoFileName: '888Bets.png' },
  BBET: { bg: 'bg-slate-800 border-slate-700', label: 'BantuBet', logoFileName: 'BantuBet.png' },
  BANTU: { bg: 'bg-slate-800 border-slate-700', label: 'BantuBet', logoFileName: 'BantuBet.png' },
  BANTUBET: { bg: 'bg-slate-800 border-slate-700', label: 'BantuBet', logoFileName: 'BantuBet.png' },
  EBET: { bg: 'bg-amber-950/50 border-amber-500/30', label: 'Elephant Bet', logoFileName: 'Elephantbet.png' },
  ELEPHANT: { bg: 'bg-amber-950/50 border-amber-500/30', label: 'Elephant Bet', logoFileName: 'Elephantbet.png' },
  ELEPHANTBET: { bg: 'bg-amber-950/50 border-amber-500/30', label: 'Elephant Bet', logoFileName: 'Elephantbet.png' },
  PBET: { bg: 'bg-yellow-950/50 border-yellow-500/30', label: 'Premier Bet', logoFileName: 'Premiebet.png' },
  PREMIER: { bg: 'bg-yellow-950/50 border-yellow-500/30', label: 'Premier Bet', logoFileName: 'Premiebet.png' },
  PREMIERBET: { bg: 'bg-yellow-950/50 border-yellow-500/30', label: 'Premier Bet', logoFileName: 'Premiebet.png' },
  ABET: { bg: 'bg-cyan-950/50 border-cyan-500/30', label: 'AfriBet', logoFileName: 'AfriBet.png' },
  AFRIBET: { bg: 'bg-cyan-950/50 border-cyan-500/30', label: 'AfriBet', logoFileName: 'AfriBet.png' },
  KWANZA: { bg: 'bg-zinc-900 border-zinc-700', label: 'KwanzaBet', logoFileName: 'Kwanzabet.png' },
  KWANZABET: { bg: 'bg-zinc-900 border-zinc-700', label: 'KwanzaBet', logoFileName: 'Kwanzabet.png' },
  KWZ: { bg: 'bg-zinc-900 border-zinc-700', label: 'KwanzaBet', logoFileName: 'Kwanzabet.png' },
  MGMBET: { bg: 'bg-neutral-900 border-neutral-700', label: 'MelBet', logoFileName: 'MelBet.png' },
  MELBET: { bg: 'bg-neutral-900 border-neutral-700', label: 'MelBet', logoFileName: 'MelBet.png' },
  MGM: { bg: 'bg-neutral-900 border-neutral-700', label: 'MelBet', logoFileName: 'MelBet.png' },
  MOBET: { bg: 'bg-neutral-900 border-neutral-700', label: 'MoBet', logoFileName: 'Mobet.png' },

  STAS: { bg: 'bg-teal-950/50 border-teal-500/30', label: 'STAS', logoFileName: 'STAS.PNG' },
  ENDE: { bg: 'bg-rose-950/50 border-rose-500/30', label: 'ENDE E.P.', logoFileName: 'ENDE.PNG' },
  EPAL: { bg: 'bg-sky-950/50 border-sky-500/30', label: 'EPAL', logoFileName: 'EPAL.PNG' },

  AMAZON: { bg: 'bg-amber-950/50 border-amber-500/30', label: 'Amazon', logoFileName: 'AMAZON.PNG' },
  APPLE: { bg: 'bg-zinc-800 border-zinc-600', label: 'Apple', logoFileName: 'APPLE.PNG' },
  GOOGLE: { bg: 'bg-blue-950/50 border-blue-500/30', label: 'Google Play', logoFileName: 'GOOGLEPLAY.PNG' },
  NETFLIX: { bg: 'bg-red-950/50 border-red-500/30', label: 'Netflix', logoFileName: 'NETFLIX.PNG' },
  SPOTIFY: { bg: 'bg-emerald-950/50 border-emerald-500/30', label: 'Spotify', logoFileName: 'SPOTIFY.PNG' },
  PLAYSTATION: { bg: 'bg-indigo-950/50 border-indigo-500/30', label: 'PlayStation', logoFileName: 'TEAM.PNG' },
  TEAM: { bg: 'bg-indigo-950/50 border-indigo-500/30', label: 'PlayStation', logoFileName: 'TEAM.PNG' },
  XBOX: { bg: 'bg-green-950/50 border-green-500/30', label: 'Xbox', logoFileName: 'XBOX.PNG' },
  BOLT: { bg: 'bg-yellow-950/50 border-yellow-500/30', label: 'Bolt', logoFileName: 'BOLT.PNG' },
  FLIXBUS: { bg: 'bg-orange-950/50 border-orange-500/30', label: 'FlixBus', logoFileName: 'FLIXBUS.PNG' },
};

export default function RecargasList() {
  const [providers, setProviders] = useState<{ name: string; items: any[] }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<{ name: string; items: any[] } | null>(null);
  const [selectedSubgroup, setSelectedSubgroup] = useState<{ name: string; items: any[] } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const currentUserId = 1;

  useEffect(() => {
    akiService.getProducts()
      .then((data) => {
        const rawProducts = data.Products || data || [];
        const groupedMap: { [key: string]: any[] } = {};
        
        if (Array.isArray(rawProducts)) {
          rawProducts.forEach((item: any) => {
            const providerCode = (item.Provider_Code || '').toUpperCase();
            let groupName = providerCode;

            if (providerCode.includes('ZAP')) {
              const desc = (item.Description_Public || item.Code || '').toUpperCase();
              if (desc.includes('FIBRA')) {
                groupName = 'ZAP2';
              } else {
                groupName = 'ZAP1';
              }
            } else if (providerCode === 'INT_VCH2' || providerCode === 'PAGAMENTOS INTERNACIONAIS') {
              const desc = (item.Description_Public || item.Code || '').toUpperCase();
              if (desc.includes('AMAZON')) groupName = 'AMAZON';
              else if (desc.includes('APPLE') || desc.includes('ITUNES')) groupName = 'APPLE';
              else if (desc.includes('GOOGLE') || desc.includes('PLAY')) groupName = 'GOOGLE';
              else if (desc.includes('NETFLIX')) groupName = 'NETFLIX';
              else if (desc.includes('SPOTIFY')) groupName = 'SPOTIFY';
              else if (desc.includes('PLAYSTATION') || desc.includes('PSN') || desc.includes('TEAM')) groupName = 'PLAYSTATION';
              else if (desc.includes('XBOX')) groupName = 'XBOX';
              else if (desc.includes('BOLT')) groupName = 'BOLT';
              else if (desc.includes('FLIXBUS')) groupName = 'FLIXBUS';
              else groupName = 'OUTROS_INTERNACIONAIS';
            } else if (!groupName) {
              groupName = (item.Type || 'OUTROS').toUpperCase();
            }

            if (!groupedMap[groupName]) {
              groupedMap[groupName] = [];
            }
            groupedMap[groupName].push(item);
          });
        }

        const formattedProviders = Object.keys(groupedMap).map((key) => ({
          name: key,
          items: groupedMap[key],
        }));

        setProviders(formattedProviders);
      })
      .catch((err) => {
        console.error('Erro ao carregar recargas:', err);
      });
  }, []);

  const getFilteredProviders = () => {
    if (!selectedCategory) return [];
    
    return providers.filter(prov => {
      const provNameUpper = prov.name.toUpperCase();

      if (selectedCategory.id === 'international' || selectedCategory.name.toLowerCase().includes('internacional')) {
        return [
          'AMAZON', 'APPLE', 'GOOGLE', 'NETFLIX', 'SPOTIFY', 
          'PLAYSTATION', 'TEAM', 'XBOX', 'BOLT', 'FLIXBUS', 'OUTROS_INTERNACIONAIS'
        ].includes(provNameUpper);
      }

      if (selectedCategory.id === 'tv' || selectedCategory.name.toLowerCase().includes('tv') || selectedCategory.name.toLowerCase().includes('satélite')) {
        return provNameUpper === 'DSTV' || provNameUpper === 'ZAP1' || provNameUpper === 'ZAP2' || provNameUpper.includes('ZAP');
      }

      return selectedCategory.prefixes.some(prefix => {
        const cleanPrefix = prefix.toUpperCase();
        return provNameUpper === cleanPrefix || provNameUpper.includes(cleanPrefix) || cleanPrefix.includes(provNameUpper);
      });
    });
  };

  const isTelecomCategory = () => {
    if (!selectedCategory) return false;
    const catName = selectedCategory.name.toLowerCase();
    return catName.includes('telecom') || catName.includes('recargas') || catName.includes('telemóvel');
  };

  const getTelecomSubgroups = (items: any[]) => {
    const subGroups: Record<string, any[]> = {
      'Planos Bazza': [],
      'Planos Mais 30 dias': [],
      'NetCasa 5G': [],
      'NetCasa 4G': [],
      'Redes Sociais': [],
      'VOZ / Saldo Normal': [],
      'Outros Planos': []
    };

    items.forEach(item => {
      const desc = (item.Description_Public || item.Code || '').toUpperCase();

      if (desc.includes('BAZZA')) {
        subGroups['Planos Bazza'].push(item);
      } else if (desc.includes('30 DIAS') || desc.includes('MAIS 30')) {
        subGroups['Planos Mais 30 dias'].push(item);
      } else if (desc.includes('NET') && desc.includes('5G')) {
        subGroups['NetCasa 5G'].push(item);
      } else if (desc.includes('NET') && desc.includes('4G')) {
        subGroups['NetCasa 4G'].push(item);
      } else if (desc.includes('SOCIAL') || desc.includes('FACEBOOK') || desc.includes('WHATSAPP') || desc.includes('INSTAGRAM')) {
        subGroups['Redes Sociais'].push(item);
      } else if (desc.includes('VOZ') || desc.includes('SALDO') || desc.includes('RECARGA')) {
        subGroups['VOZ / Saldo Normal'].push(item);
      } else {
        subGroups['Outros Planos'].push(item);
      }
    });

    return Object.keys(subGroups)
      .map(key => ({ name: key, items: subGroups[key] }))
      .filter(group => group.items.length > 0);
  };

  const currentBrandInfo = selectedProvider 
    ? (brandConfig[selectedProvider.name] || getOperatorBranding(selectedProvider.name))
    : null;

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      {/* Cabeçalho dinâmico com Logótipo Circular */}
      <div className="mb-6 text-center flex flex-col items-center">
        <h2 className="text-xl font-bold text-white tracking-wide flex items-center justify-center gap-2">
          {selectedProduct 
            ? 'Confirmar Compra' 
            : selectedSubgroup
            ? selectedSubgroup.name
            : selectedProvider && currentBrandInfo?.logoFileName
            ? <div className="w-16 h-16 rounded-full overflow-hidden bg-black/50 border border-white/20 flex items-center justify-center p-1 shadow-lg">
                <img src={getLogoPath(currentBrandInfo.logoFileName)} alt={currentBrandInfo.label} className="w-full h-full object-cover" />
              </div>
            : selectedProvider
            ? (currentBrandInfo?.label || selectedProvider.name)
            : selectedCategory 
            ? selectedCategory.name 
            : 'Servícios EMATEA'}
        </h2>
        <p className="text-gray-400 text-xs mt-1">
          {selectedProduct
            ? 'Detalhes da transação'
            : selectedSubgroup
            ? 'Selecione o pacote pretendido'
            : selectedProvider && isTelecomCategory()
            ? 'Selecione o tipo de plano'
            : selectedProvider 
            ? 'Selecione o pacote pretendido' 
            : selectedCategory 
            ? 'Selecione a marca' 
            : 'Escolha uma categoria para começar'}
        </p>
      </div>

      {/* NÍVEL 1: Categoria */}
      {!selectedCategory && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedProvider(null);
                setSelectedSubgroup(null);
              }}
              className="p-4 bg-[#12161C] border border-[#1E2329] hover:border-emerald-500/50 hover:bg-[#1A1F24] rounded-2xl text-left transition-all flex flex-col justify-between h-32 group shadow-sm"
            >
              <span className="text-2xl p-2 bg-black/40 rounded-xl w-fit border border-gray-800">
                {cat.icon}
              </span>
              <div>
                <h3 className="font-semibold text-gray-200 group-hover:text-white text-sm">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                  {cat.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* NÍVEL 2: Marca / Operadora com Círculos Grandes preenchidos */}
      {selectedCategory && !selectedProvider && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubgroup(null);
              }}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-[#161b22] px-3 py-2 rounded-xl border border-white/[0.08]"
            >
              ← Voltar às Categorias
            </button>
            <span className="text-xs text-gray-400">
              {getFilteredProviders().length} marcas disponíveis
            </span>
          </div>

          {getFilteredProviders().length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {getFilteredProviders().map((prov, idx) => {
                const brandingInfo = brandConfig[prov.name] || getOperatorBranding(prov.name);
                const logoSrc = brandingInfo.logoFileName ? getLogoPath(brandingInfo.logoFileName) : '';
                const count = prov.items.length;

                return (
                  <button
                    key={`prov-${prov.name}-${idx}`}
                    onClick={() => {
                      setSelectedProvider(prov);
                      setSelectedSubgroup(null);
                    }}
                    className="p-4 bg-[#12161C] border border-white/[0.08] hover:border-emerald-500/50 hover:bg-[#1A1F24] rounded-2xl transition-all flex flex-col items-center justify-between shadow-lg h-36 group text-center"
                  >
                    <span className="text-[10px] bg-black/50 px-2.5 py-0.5 rounded-full text-gray-300 font-medium self-end">
                      {count} {count === 1 ? 'cartão' : 'cartões'}
                    </span>
                    
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-black/60 border border-white/20 flex items-center justify-center p-1 shadow-inner group-hover:scale-105 transition-transform my-auto">
                      {logoSrc ? (
                        <img 
                          src={logoSrc} 
                          alt={brandingInfo.label} 
                          className="w-full h-full object-cover rounded-full" 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="font-bold text-[10px] uppercase text-white">
                          {brandingInfo.label}
                        </span>
                      )}
                    </div>

                    <span className="font-bold text-xs text-gray-200 group-hover:text-emerald-400 transition-colors uppercase tracking-wider line-clamp-1 w-full">
                      {brandingInfo.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 text-sm bg-[#12161C] rounded-2xl border border-[#1E2329]">
              Nenhum serviço disponível nesta categoria no momento.
              <div className="mt-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-emerald-400 text-xs underline"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* NÍVEL 3 (Opcional para Telecom): Subcategoria de Planos */}
      {selectedCategory && selectedProvider && isTelecomCategory() && !selectedSubgroup && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedProvider(null)}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-[#161b22] px-3 py-2 rounded-xl border border-white/[0.08]"
            >
              ← Voltar às Marcas
            </button>
            <span className="text-xs text-gray-400">
              {getTelecomSubgroups(selectedProvider.items).length} tipos de planos
            </span>
          </div>

          <div className="space-y-2.5">
            {getTelecomSubgroups(selectedProvider.items).map((subgroup, i) => (
              <button
                key={`sub-${subgroup.name}-${i}`}
                onClick={() => setSelectedSubgroup(subgroup)}
                className="w-full p-4 bg-[#161b22] border border-white/[0.08] rounded-xl text-left hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all flex items-center justify-between text-sm text-white shadow-sm group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    📁
                  </span>
                  <span className="font-semibold text-xs text-gray-200 group-hover:text-white">
                    {subgroup.name}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-black/30 px-2.5 py-1 rounded-lg">
                  {subgroup.items.length} opções
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* NÍVEL FINAL: Lista de Produtos */}
      {selectedCategory && selectedProvider && (!isTelecomCategory() || selectedSubgroup) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                if (isTelecomCategory()) {
                  setSelectedSubgroup(null);
                } else {
                  setSelectedProvider(null);
                }
              }}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-[#161b22] px-3 py-2 rounded-xl border border-white/[0.08]"
            >
              ← Voltar
            </button>
            <span className="text-xs text-gray-400">
              {isTelecomCategory() ? selectedSubgroup?.items.length : selectedProvider.items.length} opções disponíveis
            </span>
          </div>

          <div className="space-y-2.5">
            {(isTelecomCategory() ? selectedSubgroup!.items : selectedProvider.items).map((item: any, i: number) => {
              const itemBranding = getOperatorBranding(item.Description_Public || item.Code);
              return (
                <button
                  key={`item-${item.Code || i}-${i}`}
                  onClick={() => setSelectedProduct(item)}
                  className="w-full p-4 bg-[#161b22] border border-white/[0.08] rounded-xl text-left hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all flex items-center justify-between text-sm text-white shadow-sm"
                >
                  <span className="font-medium pr-2 text-xs text-gray-200">
                    {itemBranding.label}
                  </span>
                  {item.Value_Transaction > 0 && (
                    <span className="text-xs font-bold text-emerald-400 whitespace-nowrap bg-emerald-500/10 px-2 py-1 rounded-lg">
                      {item.Value_Transaction.toLocaleString()} Kz
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL DE COMPRA */}
      {selectedProduct && (
        <RecargaModal
          product={selectedProduct}
          userId={currentUserId}
          onClose={() => setSelectedProduct(null)}
          onSuccess={() => {
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}