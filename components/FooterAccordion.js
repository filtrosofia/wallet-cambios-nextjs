'use client';
import { useState } from 'react';

export default function FooterAccordion() {
  const [acercaAbierto, setAcercaAbierto] = useState(false);
  const [terminosAbierto, setTerminosAbierto] = useState(false);

  return (
    <footer className="text-center px-4" style={{ marginTop: '48px' }}>
      <div className="max-w-[700px] mx-auto space-y-6">
        
        {/* Acordeón: Acerca de nosotros */}
        <div>
          <button
            onClick={() => setAcercaAbierto(!acercaAbierto)}
            style={{
              all: 'unset',
              color: '#4BA9C3',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'block',
              width: '100%',
              marginTop: '48px',
              marginBottom: '24px',
              textAlign: 'center'
            }}
          >
            Acerca de nosotros
          </button>
          
          {acercaAbierto && (
            <div 
              className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed text-justify"
              style={{ 
                animation: 'fadeIn 0.3s ease-in',
                paddingLeft: '8px',
                paddingRight: '8px'
              }}
            >
              En Wallet Cambios hacemos que cambiar tu dinero sea simple y seguro. Ya sea que necesites enviar dólares a Venezuela, pesos colombianos a tu familia, o manejar pagos de PayPal, te ofrecemos tasas justas actualizadas al instante y un servicio rápido y confiable. Calcula, confirma y realiza tu cambio en minutos.
            </div>
          )}
        </div>

        {/* Acordeón: Términos y Condiciones */}
        <div>
          <button
            onClick={() => setTerminosAbierto(!terminosAbierto)}
            style={{
              all: 'unset',
              color: '#4BA9C3',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'block',
              width: '100%',
              textAlign: 'center'
            }}
          >
            Términos y Condiciones
          </button>
          
          {terminosAbierto && (
            <div 
              className="mt-4 text-gray-400 text-xs sm:text-sm leading-relaxed text-justify"
              style={{ 
                animation: 'fadeIn 0.3s ease-in',
                paddingLeft: '8px',
                paddingRight: '8px'
              }}
            >
              <p className="mb-3">Al utilizar los servicios de Wallet Cambios, usted acepta los siguientes términos:</p>
              
              <p className="mb-2"><strong>1. INFORMACIÓN DE TASAS:</strong> Las tasas de cambio mostradas en esta calculadora son referenciales y pueden variar en el momento de la transacción final debido a fluctuaciones del mercado. La tasa definitiva será confirmada al momento de procesar su operación.</p>
              
              <p className="mb-2"><strong>2. PROCESO DE LIQUIDACIÓN:</strong> Todas las transacciones están sujetas a verificación y confirmación. Para pagos mediante PayPal, la liquidación se realizará únicamente cuando los fondos se encuentren reflejados y disponibles en nuestras cuentas. Los tiempos de procesamiento pueden variar según el método de pago utilizado.</p>
              
              <p className="mb-2"><strong>3. LIMITACIÓN DE RESPONSABILIDAD:</strong> Wallet Cambios no se hace responsable por demoras, errores o pérdidas ocasionadas por información incorrecta proporcionada por el cliente, fallas en servicios de terceros (bancos, procesadores de pago, plataformas digitales), o eventos fuera de nuestro control. El usuario es responsable de verificar la exactitud de toda la información proporcionada antes de confirmar cualquier transacción.</p>
              
              <p className="mb-2"><strong>4. CUMPLIMIENTO NORMATIVO:</strong> Nos reservamos el derecho de solicitar documentación de identificación y verificación de origen de fondos según lo requieran las regulaciones vigentes. Todas las operaciones están sujetas a políticas contra el lavado de activos y financiamiento del terrorismo.</p>
              
              <p className="mb-2"><strong>5. HORARIO DE SERVICIO:</strong> Las operaciones se procesarán únicamente durante nuestro horario de atención publicado. Solicitudes recibidas fuera de este horario serán atendidas el siguiente día hábil.</p>
              
              <p className="mb-2"><strong>6. MODIFICACIONES:</strong> Wallet Cambios se reserva el derecho de modificar estos términos, las tasas de cambio, comisiones y condiciones de servicio sin previo aviso.</p>
              
              <p className="mb-2"><strong>7. USO DE LA CALCULADORA:</strong> Esta herramienta es únicamente informativa. Su uso no constituye una oferta vinculante ni garantiza la disponibilidad del servicio para cualquier transacción específica.</p>
              
              <p className="mb-3">Al continuar con cualquier operación, usted declara haber leído, entendido y aceptado estos términos en su totalidad.</p>
              
              <p className="text-xs text-gray-500 italic">Última actualización: Noviembre 2025</p>
            </div>
          )}
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </footer>
  );
}