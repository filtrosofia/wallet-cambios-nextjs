import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/1ig4ihkUIeP7kaaR6yZeyOLF7j38Y_peytGKG6tgkqbw/gviz/tq?tqx=out:csv&sheet=TASAS%20COL%20-%20VEN";
    const sheetUrlTasasMayor = "https://docs.google.com/spreadsheets/d/1ig4ihkUIeP7kaaR6yZeyOLF7j38Y_peytGKG6tgkqbw/gviz/tq?tqx=out:csv&sheet=Tasas%20al%20mayor";

    console.log('[TASAS API] Iniciando fetch desde Google Sheets...');

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
    const response1 = await fetch(sheetUrl, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    if (!response1.ok) {
      throw new Error(`HTTP error! status: ${response1.status}`);
    }
    
    const csv1 = await response1.text();
    const data1 = parseCSV(csv1);
    console.log('[TASAS API] ✓ Primera hoja cargada correctamente');

    const tasa_bs = limpiarValor(data1[1]?.[12]); // M2
    const tasa_usd_cop_compra = limpiarValor(data1[3]?.[12]); // M4
    const tasa_cop_usd_venta = limpiarValor(data1[3]?.[13]); // N4

    // 🔍 DEBUG: Ver qué está leyendo de la primera hoja
    console.log('=== HOJA TASAS COL-VEN ===');
    console.log('Fila 1 (índice 0):', data1[0]?.slice(10, 15));
    console.log('Fila 2 (índice 1) VENEZUELA:', data1[1]?.slice(10, 15));
    console.log('Fila 4 (índice 3) COLOMBIA:', data1[3]?.slice(10, 15));
    console.log('---');
    console.log(`tasa_bs (data1[1][12]): "${data1[1]?.[12]}" → ${tasa_bs}`);
    console.log(`tasa_usd_cop_compra (data1[3][12]): "${data1[3]?.[12]}" → ${tasa_usd_cop_compra}`);
    console.log(`tasa_cop_usd_venta (data1[3][13]): "${data1[3]?.[13]}" → ${tasa_cop_usd_venta}`);

    // ========== CARGAR SEGUNDA HOJA (TASAS AL MAYOR) ==========
    const response2 = await fetch(sheetUrlTasasMayor, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    if (!response2.ok) {
      throw new Error(`HTTP error! status: ${response2.status}`);
    }
    
    const csv2 = await response2.text();
    const data2 = parseCSV(csv2);
    console.log('[TASAS API] ✓ Segunda hoja cargada correctamente');

    // Inicializar todas las tasas
    let tasa_bs_cop = null;
    let tasa_cop_bs = null;
    let tasa_clp_bs = null;
    let tasa_clp_cop = null;
    let tasa_pypl_cop = null;
    let tasa_pypl_bs = null;
    let tasa_cop_pypl = null;
    
    // Tasas USDT
    let tasa_clp_usd = null;
    let tasa_usdt_bs = null;
    let tasa_usdt_cop = null;
    let tasa_usdt_usd = null;
    let tasa_bs_usdt = null;
    let tasa_usd_usdt = null;
    let tasa_cop_usdt = null;
    let tasa_clp_usdt = null;

    // Buscar tasas por nombre en la columna A
    for (let i = 0; i < data2.length; i++) {
      const row = data2[i];
      const nombreRaw = row[0]?.replace(/"/g, '').trim();
      const nombre = nombreRaw.toLowerCase().replace(/\s+/g, '');
      
      // Log para debugging (temporal)
      if (nombre.includes('usdt') || nombre.includes('cop') || nombre.includes('bs')) {
        console.log(`[TASAS] Fila ${i}: "${nombreRaw}" → "${nombre}" = ${row[1]}`);
      }
      
      // Tasas existentes
      if (nombre === 've/cop' || nombre === 'ves/cop') tasa_bs_cop = limpiarValor(row[1]);
      if (nombre === 'cop/ves' || nombre === 'cop/ve') tasa_cop_bs = limpiarValor(row[1]);
      if (nombre === 'clp/ves' || nombre === 'clp/ve') tasa_clp_bs = limpiarValor(row[1]);
      if (nombre === 'clp/cop') tasa_clp_cop = limpiarValor(row[1]);
      if (nombre === 'paypal/cop') tasa_pypl_cop = limpiarValor(row[1]);
      if (nombre === 'paypal/bs' || nombre === 'paypal/ves') tasa_pypl_bs = limpiarValor(row[1]);
      if (nombre === 'cop/paypal') tasa_cop_pypl = limpiarValor(row[1]);
      
      // Tasas USDT - agregando más variantes
      if (nombre === 'clp/usa' || nombre === 'clp/usd') tasa_clp_usd = limpiarValor(row[1]);
      if (nombre === 'usdt/bs' || nombre === 'usdt/ves' || nombre === 'usdt/ve') tasa_usdt_bs = limpiarValor(row[1]);
      if (nombre === 'usdt/cop') tasa_usdt_cop = limpiarValor(row[1]);
      if (nombre === 'usdt/usd' || nombre === 'usdt/usa') tasa_usdt_usd = limpiarValor(row[1]);
      if (nombre === 'bs/usdt' || nombre === 'ves/usdt' || nombre === 've/usdt') tasa_bs_usdt = limpiarValor(row[1]);
      if (nombre === 'usd/usdt' || nombre === 'usa/usdt') tasa_usd_usdt = limpiarValor(row[1]);
      if (nombre === 'cop/usdt') tasa_cop_usdt = limpiarValor(row[1]);
      if (nombre === 'clp/usdt') tasa_clp_usdt = limpiarValor(row[1]);
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
      tasa_pypl_cop,
      tasa_pypl_bs,
      tasa_cop_pypl,
      tasa_clp_usd,
      tasa_usdt_bs,
      tasa_usdt_cop,
      tasa_usdt_usd,
      tasa_bs_usdt,
      tasa_usd_usdt,
      tasa_cop_usdt,
      tasa_clp_usdt
    };

    console.log('[TASAS API] ✓ Tasas cargadas exitosamente desde Google Sheets');
    
    return NextResponse.json(tasas, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error('[TASAS API] ❌ ERROR al cargar tasas:', error);
    console.error('[TASAS API] Usando valores de fallback actualizados');
    
    // Valores actualizados desde el Sheet (31 Dic 2024) - CORREGIDOS
    return NextResponse.json(
      { 
        tasa_bs: 521.7,
        tasa_usd_cop_compra: 3496,
        tasa_cop_usd_venta: 3948,
        tasa_bs_cop: 5.83,
        tasa_cop_bs: 7.18,
        tasa_clp_bs: 0.546,
        tasa_clp_cop: 3.68,
        tasa_pypl_cop: 3312.00,
        tasa_pypl_bs: 493.95,
        tasa_cop_pypl: 3948.00,
        tasa_clp_usd: 997.50,
        tasa_usdt_bs: 521.70,
        tasa_usdt_cop: 3496.00,
        tasa_usdt_usd: 0.95,
        tasa_bs_usdt: 606.00,     // CORREGIDO: era 555.50
        tasa_usd_usdt: 0.95,
        tasa_cop_usdt: 3948.00,   // CORREGIDO: era 3969.00
        tasa_clp_usdt: 997.50
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  }
}

// Revalidar cada request (sin cache)
export const revalidate = 0;
export const dynamic = 'force-dynamic';