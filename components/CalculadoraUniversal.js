'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/* ===== helper: sanitizar decimales ===== */
const cleanDecimal = (v) => {
  if (!v) return '';
  let s = v.replace(/,/g, '.').replace(/[^0-9.]/g, '');
  const parts = s.split('.');
  if (parts.length > 2) s = parts[0] + '.' + parts.slice(1).join('');
  return s;
};

/* ===== combinaciones válidas ===== */
const COMBINACIONES_VALIDAS = {
  USD: ['Bs', 'COP'],
  COP: ['USD', 'Bs', 'PYPL'],
  Bs: ['COP'],
  CLP: ['Bs', 'COP'],
  PYPL: ['COP', 'Bs'],
};

/* ===== etiquetas y banderas ===== */
const NOMBRES = {
  USD: 'Dólar estadounidense',
  COP: 'Peso colombiano',
  Bs: 'Bolívar venezolano',
  CLP: 'Peso chileno',
  PYPL: 'PayPal',
};

const BANDERAS = {
  USD: '/banderas/usa.png',
  COP: '/banderas/colombia.png',
  Bs: '/banderas/venezuela.png',
  CLP: '/banderas/chile.png',
  PYPL: '/banderas/paypal.png',
};

/* ===== Dropdown de moneda (custom, sin <select>) ===== */
function CurrencyPill({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 430);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} className="relative" style={{ width: 'auto' }}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        style={{
          all: 'unset',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? '8px' : '10px',
          minHeight: isMobile ? '48px' : '72px',
          padding: isMobile ? '0 12px' : '0 16px',
          borderRadius: '12px',
          border: '2px solid #4BA9C3',
          backgroundColor: '#253142',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#F36B2D'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#4BA9C3'}
      >
        <Image
          src={BANDERAS[value]}
          alt={value}
          width={isMobile ? 24 : 28}
          height={isMobile ? 18 : 21}
          className="rounded"
          style={{ objectFit: 'cover' }}
          priority
        />
        <span style={{ 
          color: '#fff', 
          fontSize: isMobile ? '16px' : '20px',
          fontWeight: '800', 
          letterSpacing: '-0.3px',
          lineHeight: '1'
        }}>
          {value}
        </span>
        <span style={{ 
          color: '#4BA9C3', 
          fontSize: isMobile ? '14px' : '16px',
          lineHeight: '1'
        }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            zIndex: 9999,
            marginTop: '8px',
            width: isMobile ? '260px' : '300px',
            maxHeight: '350px',
            overflowY: 'auto',
            backgroundColor: '#1a2332',
            border: '2px solid #4BA9C3',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            padding: isMobile ? '8px' : '12px'
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              style={{
                all: 'unset',
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                gap: '10px',
                padding: isMobile ? '12px 8px' : '14px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#253142';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Image
                src={BANDERAS[opt]}
                alt={opt}
                width={isMobile ? 24 : 28}
                height={isMobile ? 18 : 21}
                className="rounded"
                style={{ objectFit: 'cover', flexShrink: 0 }}
              />
              <span style={{ 
                color: '#fff', 
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '700',
                minWidth: isMobile ? '50px' : '60px'
              }}>
                {opt}
              </span>
              <span style={{ 
                color: '#9ca3af', 
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '400',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {NOMBRES[opt]}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CalculadoraUniversal({ tasas }) {
  const [monedaOrigen, setMonedaOrigen] = useState('USD');
  const [monedaDestino, setMonedaDestino] = useState('COP');
  const [montoEnviar, setMontoEnviar] = useState('');
  const [montoRecibir, setMontoRecibir] = useState('');
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  // === FUNCIÓN getTasa() - AQUÍ ESTABA EL PROBLEMA ===
  const getTasa = () => {
    const par = `${monedaOrigen}-${monedaDestino}`;
    const map = {
      'USD-Bs': tasas.tasa_bs,
      'Bs-USD': 1 / tasas.tasa_bs,
      'USD-COP': tasas.tasa_usd_cop_compra,
      'COP-USD': 1 / tasas.tasa_cop_usd_venta,
      'COP-Bs': 1 / tasas.tasa_cop_bs,
      'Bs-COP': tasas.tasa_bs_cop,
      'CLP-Bs': tasas.tasa_clp_bs,
      'Bs-CLP': 1 / tasas.tasa_clp_bs,
      'CLP-COP': tasas.tasa_clp_cop,
      'COP-CLP': 1 / tasas.tasa_clp_cop,
      'PYPL-COP': tasas.tasa_pypl_cop,
      'PYPL-Bs': tasas.tasa_pypl_bs,
      'COP-PYPL': 1/ tasas.tasa_cop_pypl,
    };
    return map[par] || 1;
  };

  const tasa = getTasa();

  useEffect(() => {
    const valid = COMBINACIONES_VALIDAS[monedaOrigen] || [];
    if (!valid.includes(monedaDestino)) {
      setMonedaDestino(valid[0] || 'COP');
      setMontoEnviar('');
      setMontoRecibir('');
    }
  }, [monedaOrigen, monedaDestino]);

  const handleEnviarChange = (raw) => {
    const v = cleanDecimal(raw);
    setMontoEnviar(v);
    const n = parseFloat(v);
    if (!isNaN(n) && n > 0) setMontoRecibir((n * tasa).toFixed(2));
    else setMontoRecibir('');
  };

  const handleRecibirChange = (raw) => {
    const v = cleanDecimal(raw);
    setMontoRecibir(v);
    const n = parseFloat(v);
    if (!isNaN(n) && n > 0) setMontoEnviar((n / tasa).toFixed(2));
    else setMontoEnviar('');
  };

  const crearEnlaceWhatsApp = () => {
    const msg =
      `Hola, necesito enviar ${montoEnviar || '0'} ${monedaOrigen} ` +
      `para recibir ${montoRecibir || '0'} ${monedaDestino}`;
    return `https://wa.me/584146108166?text=${encodeURIComponent(msg)}`;
  };

  const handleWhatsAppClick = (e) => {
    if (monedaOrigen === 'PYPL') {
      e.preventDefault();
      setMostrarAlerta(true);
    }
  };

  const confirmarYEnviar = () => {
    setMostrarAlerta(false);
    window.open(crearEnlaceWhatsApp(), '_blank');
  };

  const opcionesOrigen = ['USD', 'COP', 'Bs', 'CLP', 'PYPL'];
  const opcionesDestino = COMBINACIONES_VALIDAS[monedaOrigen] || [];

  return (
    <div className="space-y-8">
      {/* ===== ENVIAR ===== */}
      <div className="space-y-3">
        <label className="text-white font-bold text-xl flex items-center gap-3">
          <span></span> ¿Cuánto deseas enviar?
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CurrencyPill
            value={monedaOrigen}
            options={opcionesOrigen}
            onChange={(m) => {
              setMonedaOrigen(m);
              setMontoEnviar('');
              setMontoRecibir('');
            }}
          />

          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            enterKeyHint="done"
            value={montoEnviar}
            onChange={(e) => handleEnviarChange(e.target.value)}
            placeholder="0.00"
            style={{ flex: 1 }}
          />
        </div>
      </div>

      {/* ===== Tasa - CORREGIDA ===== */}
      <p className="text-center text-gray-400 text-lg">
        Tasa actual:{' '}
        <span className="text-[#F36B2D] font-bold text-2xl">
          {tasa < 1 
            ? `${(1/tasa).toFixed(2)} ${monedaDestino}/${monedaOrigen}`
            : `${tasa.toFixed(2)} ${monedaOrigen}/${monedaDestino}`
          }
        </span>
      </p>

      {/* ===== RECIBIR ===== */}
      <div className="space-y-3">
        <label className="text-white font-bold text-xl flex items-center gap-2">
          <span></span> El destinatario recibirá:
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CurrencyPill
            value={monedaDestino}
            options={opcionesDestino}
            onChange={(m) => {
              setMonedaDestino(m);
              setMontoEnviar('');
              setMontoRecibir('');
            }}
          />

          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            enterKeyHint="done"
            value={montoRecibir}
            onChange={(e) => handleRecibirChange(e.target.value)}
            placeholder="0.00"
            style={{ flex: 1 }}
          />
        </div>
      </div>

      {/* Botón WhatsApp */}
      {(montoEnviar || montoRecibir) && (
        <div className="flex justify-center" style={{ marginTop: '48px' }}>
          <a 
            href={crearEnlaceWhatsApp()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-whatsapp"
            onClick={handleWhatsAppClick}
          >
            <Image 
              src="/banderas/whatsapp.png" 
              alt="WhatsApp" 
              width={30} 
              height={30}
              style={{ flexShrink: 0 }}
            />
            <span className="font-semibold">Realiza el cambio ahora</span>
          </a>
        </div>
      )}

      {/* Modal de advertencia PayPal */}
      {mostrarAlerta && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px'
          }}
          onClick={() => setMostrarAlerta(false)}
        >
          <div 
            style={{
              backgroundColor: '#1a2332',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
              border: '2px solid #F36B2D',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '56px' }}>⚠️</span>
            </div>

            <h3 style={{ 
              color: '#F36B2D', 
              fontSize: '24px', 
              fontWeight: 'bold', 
              textAlign: 'center',
              marginBottom: '20px',
              lineHeight: '1.3'
            }}>
              Advertencia: Pago con PayPal
            </h3>

            <p style={{ 
              color: '#fff', 
              fontSize: '17px', 
              lineHeight: '1.7',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              PayPal cobra comisiones. Liquidaremos según el monto que llegue a nuestra cuenta después de restar las respectivas comisiones.
            </p>

            <p style={{ 
              color: '#4BA9C3', 
              fontSize: '18px', 
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '28px'
            }}>
              ¿Desea continuar?
            </p>

            <div style={{ 
              display: 'flex', 
              gap: '12px',
              flexDirection: 'column'
            }}>
              <button
                onClick={confirmarYEnviar}
                style={{
                  all: 'unset',
                  backgroundColor: '#25D366',
                  color: '#fff',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '17px',
                  boxShadow: '0 4px 12px rgba(37,211,102,0.4)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ✓ Sí, continuar a WhatsApp
              </button>

              <button
                onClick={() => setMostrarAlerta(false)}
                style={{
                  all: 'unset',
                  backgroundColor: '#253142',
                  color: '#fff',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '17px',
                  border: '2px solid #4BA9C3',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a3847'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#253142'}
              >
                ← Volver a la calculadora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
