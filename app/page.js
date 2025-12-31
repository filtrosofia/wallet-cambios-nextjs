import CalculadoraUniversal from '@/components/CalculadoraUniversal';
import FooterAccordion from '@/components/FooterAccordion';
import Image from 'next/image';

async function getTasas() {
  try {
    const res = await fetch('http://localhost:3000/api/tasas', { cache: 'no-store' });
    if (!res.ok) throw new Error('Error');
    return res.json();
  } catch (error) {
    return {
      tasa_bs: 286.7,
      tasa_usd_cop_compra: 3610,
      tasa_cop_usd_venta: 4056,
      tasa_bs_cop: 11.68,
      tasa_cop_bs: 13.55,
      tasa_clp_bs: 0.294,
      tasa_clp_cop: 3.72,
      tasa_pypl_cop: 4200,
      tasa_pypl_bs: 320,
      tasa_cop_pypl: 0.00024,
      // Valores de fallback USDT
      tasa_clp_usd: 997.50,
      tasa_usdt_bs: 498.20,
      tasa_usdt_cop: 3496.00,
      tasa_usdt_usd: 0.95,
      tasa_bs_usdt: 555.50,
      tasa_usd_usdt: 0.95,
      tasa_cop_usdt: 3969.00,
      tasa_clp_usdt: 997.50
    };
  }
}

export default async function Home() {
  const tasas = await getTasas();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a2332] to-[#0f1419]">
      <div className="mx-auto w-full max-w-[980px] px-3 sm:px-6 py-6 sm:py-12">

        {/* Logo + Título en la misma línea */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-8">
          <Image
            src="https://raw.githubusercontent.com/filtrosofia/calculadora/main/output-onlinepngtools.png"
            alt="Wallet Cambios Logo"
            width={50}
            height={50}
            style={{ marginRight: '24px' }}
            className="drop-shadow-2xl flex-shrink-0"
            priority
          />
          <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4BA9C3] via-[#3D9FC2] to-[#2881AB] drop-shadow-2xl text-[clamp(24px,6vw,48px)] leading-tight">
            Calculadora Wallet Cambios
          </h1>
        </div>

        {/* Horario */}
        <div className="bg-gradient-to-r from-[#FFC542]/25 to-[#F36B2D]/25 border-l-4 border-[#FFC542] rounded-xl p-6 mb-10 shadow-xl">
          <p className="text-white text-center font-bold text-[16px] sm:text-lg leading-snug">
            🕒 | Lunes a Sábados 8:00 a.m. - 6:00 p.m. |
            Domingos 12:00 m - 5:00 p.m.
          </p>
        </div>

        {/* Descripción */}
        <div className="text-center mb-10 sm:mb-12 px-4">
          <p className="text-white/90 text-lg sm:text-xl font-semibold max-w-2xl mx-auto leading-relaxed">
            Calcula cuánto enviar o recibir entre diferentes monedas. Simple, rápido y al instante.
          </p>
        </div>

        {/* Calculadora Universal */}
        <div className="w-full max-w-[720px] mx-auto mb-10 sm:mb-16">
          <CalculadoraUniversal tasas={tasas} />
        </div>

        {/* Footer con acordeones */}
        <FooterAccordion />

      </div>
    </main>
  );
}