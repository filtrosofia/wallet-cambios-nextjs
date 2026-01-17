const fs = require('fs');
const path = require('path');
const https = require('https');

async function fetchTasas() {
  return new Promise((resolve, reject) => {
    https.get('https://walletcambios.com/api/tasas', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const tasas = JSON.parse(data);
          resolve(tasas);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function updateRatesSnapshot() {
  try {
    console.log('📡 Fetching tasas from API...');
    const tasas = await fetchTasas();
    
    console.log('✅ Tasas recibidas:', tasas.tasa_bs);
    
    // Agregar timestamp
    const snapshot = {
      ...tasas,
      lastUpdated: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    // Guardar en public/rates.json
    const publicDir = path.join(__dirname, '..', 'public');
    const filePath = path.join(publicDir, 'rates.json');
    
    // Crear directorio si no existe
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2));
    
    console.log('💾 Snapshot guardado en public/rates.json');
    console.log('🕐 Timestamp:', snapshot.lastUpdated);
    
  } catch (error) {
    console.error('❌ Error actualizando snapshot:', error.message);
    process.exit(1);
  }
}

updateRatesSnapshot();