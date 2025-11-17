import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/1ig4ihkUIeP7kaaR6yZeyOLF7j38Y_peytGKG6tgkqbw/gviz/tq?tqx=out:csv&sheet=TASAS%20COL%20-%20VEN";
    const sheetUrlTasasMayor = "https://docs.google.com/spreadsheets/d/1ig4ihkUIeP7kaaR6yZeyOLF7j38Y_peytGKG6tgkqbw/gviz/tq?tqx=out:csv&sheet=Tasas%20al%20mayor";

    // Función para parsear CSV
    const parseCSV = (text) => {
      const lines = text.split('\n');
      return lines.map(line => {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let char of line) {
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());
        return values;
      });
    };

    // Limpiar valores numéricos del CSV
    const limpiarValor = (valor) => {
      if (!valor) return null;
      const cleaned = String(valor).replace(/["$,]/g, '').trim();
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? null : parsed;
    };

    // ========== CARGAR PRIMERA HOJA (TASAS COL-VEN) ==========
    const response1 = await fetch(sheetUrl);
    const csv1 = await response1.text();
    const data1 = parseCSV(csv1);

    const tasa_bs = limpiarValor(data1[1]?.[12]); // M2
    const tasa_usd_cop_compra = limpiarValor(data1[3]?.[12]); // M4
    const tasa_cop_usd_venta = limpiarValor(data1[3]?.[13]); // N4

    // ========== CARGAR SEGUNDA HOJA (TASAS AL MAYOR) ==========
    const response2 = await fetch(sheetUrlTasasMayor);
    const csv2 = await response2.text();
    const data2 = parseCSV(csv2);

    // Inicializar todas las tasas
    let tasa_bs_cop = null;
    let tasa_cop_bs = null;
    let tasa_clp_bs = null;
    let tasa_clp_cop = null;
    // Tasas de Paypal
    let tasa_pypl_cop = null;
    let tasa_pypl_bs = null;
    let tasa_cop_pypl = null;

    // Buscar tasas por nombre en la columna A
    for (let i = 0; i < data2.length; i++) {
      const row = data2[i];
      const nombre = row[0]?.replace(/"/g, '').trim().toLowerCase();
      
      // Tasas existentes
      if (nombre === 've/cop') tasa_bs_cop = limpiarValor(row[1]);
      if (nombre === 'cop/ves') tasa_cop_bs = limpiarValor(row[1]);
      if (nombre === 'clp/ves') tasa_clp_bs = limpiarValor(row[1]);
      if (nombre === 'clp/cop') tasa_clp_cop = limpiarValor(row[1]);
      
      // Tasas de Paypal (filas 29-31 en la sheet)
      if (nombre === 'paypal/cop') tasa_pypl_cop = limpiarValor(row[1]);
      if (nombre === 'paypal/bs') tasa_pypl_bs = limpiarValor(row[1]);
      if (nombre === 'cop/paypal') tasa_cop_pypl = limpiarValor(row[1]);
    }

    // Objeto con todas las tasas
    const tasas = {
      tasa_bs,
      tasa_usd_cop_compra,
      tasa_cop_usd_venta,
      tasa_bs_cop,
      tasa_cop_bs,
      tasa_clp_bs,
      tasa_clp_cop,
      // Tasas de Paypal
      tasa_pypl_cop,
      tasa_pypl_bs,
      tasa_cop_pypl
    };

    console.log('Tasas cargadas:', tasas);

    return NextResponse.json(tasas);
    
  } catch (error) {
    console.error('Error cargando tasas:', error);
    
    // Valores de fallback si falla la carga desde Google Sheets
    return NextResponse.json(
      { 
        tasa_bs: 286.7,
        tasa_usd_cop_compra: 3610,
        tasa_cop_usd_venta: 4056,
        tasa_bs_cop: 11.68,
        tasa_cop_bs: 13.55,
        tasa_clp_bs: 0.294,
        tasa_clp_cop: 3.72,
        // Valores por defecto de Paypal
        tasa_pypl_cop: 4200,
        tasa_pypl_bs: 320,
        tasa_cop_pypl: 0.00024
      },
      { status: 500 }
    );
  }
}

export const revalidate = 300;