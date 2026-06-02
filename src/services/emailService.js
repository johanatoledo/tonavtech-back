import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { obtenerServicioPorId } from "../controllers/servicesController.js";

dotenv.config();

const TONAV_EMPRESA = {
  razonSocial: process.env.TONAV_RAZON_SOCIAL || "TONAVTECH",
  ruc: process.env.TONAV_RUC || "00000000000",
  direccion: process.env.TONAV_DIRECCION || "Lima, Perú",
  email: process.env.EMAIL_USER,
  telefono: process.env.TONAV_TELEFONO || "",
  logoUrl: process.env.TONAV_LOGO_URL || "",
};

const TONAV_THEME = {
  background: "#0a0a0a",
  darkBase: "#050505",
  primary: "#00ffff",
  secundary: "#ffffff",
  accent: "#ff003c",
  textMuted: "#b8b8b8",
  card: "#111111",
  borderPrimary: "rgba(0, 255, 255, 0.25)",
  diagonalGradient: `
    linear-gradient(
      135deg,
      rgba(0, 255, 255, 0.15) 20%,
      rgba(5, 5, 5, 1) 40%,
      rgba(255, 0, 60, 0.2) 100%
    )
  `,
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const construirPropuestaPorServicio = (servicio) => ({
  nombre: servicio?.nombre || "Solución tecnológica personalizada",
  descripcion:
    servicio?.descripcion ||
    "Solución digital personalizada según las necesidades de tu negocio.",
  beneficios: [
    "Diseño adaptado a la identidad del negocio.",
    "Optimización responsive para móviles, tablets y escritorio.",
    "Arquitectura preparada para crecimiento y futuras integraciones.",
    "Acompañamiento técnico durante la implementación inicial.",
  ],
});

export const enviarCotizacionEmail = async ({
  email,
  nombre,
  dni_ruc,
  empresa,
  servicio_id,
  monto,
  descripcion,
}) => {
  if (!email) {
    return { success: false, message: "No se proporcionó email del cliente." };
  }

  const servicioDB = servicio_id ? await obtenerServicioPorId(servicio_id) : null;
  const propuesta = construirPropuestaPorServicio(servicioDB);

  const fechaEmision = new Date().toLocaleDateString("es-PE");
  const fechaValidez = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString("es-PE");

  const subtotal = Number(monto || 0);
  const igv = subtotal > 0 ? subtotal * 0.18 : 0;
  const total = subtotal + igv;

  const formatMoney = (value) =>
    value > 0
      ? `S/ ${Number(value).toLocaleString("es-PE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "A definir";

  await transporter.sendMail({
    from: `"TonavTech" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Cotización TonavTech - ${propuesta.nombre}`,
    html: `
      <div style="background:${TONAV_THEME.darkBase}; font-family:Inter,Arial,sans-serif; color:${TONAV_THEME.secundary}; padding:32px;">
        <div style="max-width:760px; margin:auto; background:${TONAV_THEME.background}; border:1px solid ${TONAV_THEME.borderPrimary}; border-radius:22px; overflow:hidden;">

          <div style="padding:30px; background:${TONAV_THEME.diagonalGradient}; border-bottom:1px solid ${TONAV_THEME.borderPrimary};">
            <table width="100%">
              <tr>
                <td width="45%" valign="top">
                  ${
                    TONAV_EMPRESA.logoUrl
                      ? `<img src="${TONAV_EMPRESA.logoUrl}" alt="TonavTech Logo" style="max-width:150px; margin-bottom:12px;" />`
                      : `<div style="color:${TONAV_THEME.accent}; font-family:monospace; font-size:24px; font-weight:bold;">&lt; TonavTech /&gt;</div>`
                  }
                  <p style="margin:8px 0; color:${TONAV_THEME.secundary}; font-weight:bold;">
                    ${TONAV_EMPRESA.razonSocial}
                  </p>
                  <p style="margin:4px 0; color:${TONAV_THEME.textMuted}; font-size:13px;">RUC: ${TONAV_EMPRESA.ruc}</p>
                  <p style="margin:4px 0; color:${TONAV_THEME.textMuted}; font-size:13px;">Dirección: ${TONAV_EMPRESA.direccion}</p>
                  <p style="margin:4px 0; color:${TONAV_THEME.textMuted}; font-size:13px;">Email: ${TONAV_EMPRESA.email}</p>
                  ${
                    TONAV_EMPRESA.telefono
                      ? `<p style="margin:4px 0; color:${TONAV_THEME.textMuted}; font-size:13px;">Teléfono: ${TONAV_EMPRESA.telefono}</p>`
                      : ""
                  }
                </td>

                <td width="55%" valign="top" align="right">
                  <h1 style="margin:0; color:${TONAV_THEME.primary}; font-size:28px;">COTIZACIÓN</h1>
                  <p style="margin:8px 0; color:${TONAV_THEME.textMuted}; font-size:13px;">Fecha de emisión: ${fechaEmision}</p>
                  <p style="margin:4px 0; color:${TONAV_THEME.textMuted}; font-size:13px;">Válida hasta: ${fechaValidez}</p>
                  <p style="margin:18px 0 0; color:${TONAV_THEME.accent}; font-size:12px; letter-spacing:1px;">
                    Documento comercial informativo
                  </p>
                </td>
              </tr>
            </table>
          </div>

          <div style="padding:32px;">
            <div style="background:${TONAV_THEME.card}; border-radius:16px; padding:22px; margin-bottom:24px; border:1px solid rgba(255,255,255,0.08);">
              <p style="margin:0 0 10px; color:${TONAV_THEME.primary}; text-transform:uppercase; letter-spacing:2px; font-size:12px; font-weight:bold;">
                Datos del cliente
              </p>
              <p style="margin:4px 0; color:${TONAV_THEME.secundary};"><strong>Cliente:</strong> ${nombre || "No especificado"}</p>
              ${empresa ? `<p style="margin:4px 0; color:${TONAV_THEME.textMuted};"><strong>Empresa:</strong> ${empresa}</p>` : ""}
              ${dni_ruc ? `<p style="margin:4px 0; color:${TONAV_THEME.textMuted};"><strong>DNI/RUC:</strong> ${dni_ruc}</p>` : ""}
              <p style="margin:4px 0; color:${TONAV_THEME.textMuted};"><strong>Email:</strong> ${email}</p>
            </div>

            <div style="background:${TONAV_THEME.card}; border-left:4px solid ${TONAV_THEME.primary}; border-radius:16px; padding:24px; margin-bottom:24px;">
              <p style="margin:0 0 8px; color:${TONAV_THEME.primary}; text-transform:uppercase; letter-spacing:2px; font-size:12px; font-weight:bold;">
                Servicio cotizado
              </p>
              <h2 style="margin:0 0 12px; color:${TONAV_THEME.secundary}; font-size:22px;">
                ${propuesta.nombre}
              </h2>
              <p style="margin:0; color:${TONAV_THEME.textMuted}; line-height:1.8;">
                ${propuesta.descripcion}
              </p>
            </div>

            <div style="background:${TONAV_THEME.card}; border-left:4px solid ${TONAV_THEME.accent}; border-radius:16px; padding:24px; margin-bottom:24px;">
              <p style="margin:0 0 8px; color:${TONAV_THEME.accent}; text-transform:uppercase; letter-spacing:2px; font-size:12px; font-weight:bold;">
                Alcance inicial
              </p>
              <p style="margin:0; color:${TONAV_THEME.textMuted}; line-height:1.8;">
                ${descripcion || "El alcance final será definido luego de revisar los requerimientos específicos del proyecto."}
              </p>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0; border-collapse:collapse; overflow:hidden; border-radius:14px;">
              <thead>
                <tr style="background:rgba(0,255,255,0.12);">
                  <th align="left" style="padding:14px; color:${TONAV_THEME.primary}; border-bottom:1px solid ${TONAV_THEME.borderPrimary};">Concepto</th>
                  <th align="right" style="padding:14px; color:${TONAV_THEME.primary}; border-bottom:1px solid ${TONAV_THEME.borderPrimary};">Importe</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background:#0f0f0f;">
                  <td style="padding:14px; color:${TONAV_THEME.textMuted};">${propuesta.nombre}</td>
                  <td align="right" style="padding:14px; color:${TONAV_THEME.secundary};">${formatMoney(subtotal)}</td>
                </tr>
                <tr style="background:#090909;">
                  <td style="padding:14px; color:${TONAV_THEME.textMuted};">IGV 18%</td>
                  <td align="right" style="padding:14px; color:${TONAV_THEME.secundary};">${formatMoney(igv)}</td>
                </tr>
                <tr style="background:linear-gradient(135deg, rgba(0,255,255,0.08), rgba(255,0,60,0.08));">
                  <td style="padding:18px; color:${TONAV_THEME.primary}; font-weight:bold;">Total estimado</td>
                  <td align="right" style="padding:18px; color:${TONAV_THEME.primary}; font-size:22px; font-weight:bold;">${formatMoney(total)}</td>
                </tr>
              </tbody>
            </table>

            <div style="background:rgba(255,255,255,0.04); border-radius:16px; padding:22px; margin-bottom:24px;">
              <p style="color:${TONAV_THEME.secundary}; font-weight:bold; margin-top:0;">Beneficios incluidos:</p>
              <ul style="color:${TONAV_THEME.textMuted}; line-height:1.9; margin-bottom:0;">
                ${propuesta.beneficios.map((b) => `<li>${b}</li>`).join("")}
              </ul>
            </div>

            <div style="background:#080808; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:22px;">
              <p style="color:${TONAV_THEME.secundary}; font-weight:bold; margin-top:0;">Condiciones comerciales</p>
              <ul style="color:${TONAV_THEME.textMuted}; line-height:1.8; margin-bottom:0;">
                <li>La presente cotización tiene una vigencia de 15 días calendario.</li>
                <li>Los precios están expresados en soles peruanos.</li>
                <li>El monto final puede variar según alcance, integraciones, cantidad de módulos y requerimientos adicionales.</li>
                <li>La ejecución inicia previa aceptación formal de la propuesta y coordinación del adelanto correspondiente.</li>
                <li>Esta cotización no constituye comprobante de pago. Para efectos tributarios se emitirá el comprobante correspondiente según SUNAT.</li>
              </ul>
            </div>
          </div>

          <div style="padding:26px; text-align:center; background:#070707; border-top:1px solid rgba(255,255,255,0.08);">
            <p style="margin:0; color:${TONAV_THEME.primary}; font-weight:bold;">TonavTech</p>
            <p style="margin:8px 0 0; color:#777; font-size:13px;">Soluciones digitales con IA para negocios modernos</p>
          </div>

        </div>
      </div>
    `,
  });

  return {
    success: true,
    message: "Cotización enviada correctamente por email.",
    servicio: propuesta.nombre,
  };
};