import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

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

export const enviarCotizacionEmail = async ({
  email,
  nombre,
  servicio,
  monto,
  descripcion,
}) => {
  if (!email) {
    return {
      success: false,
      message: "No se proporcionó email del cliente.",
    };
  }

  const montoFormateado = monto
    ? `S/ ${Number(monto).toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "A definir según alcance final";

  await transporter.sendMail({
    from: `"TonavTech" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Cotización TonavTech - ${servicio || "Solución tecnológica"}`,
    html: `
      <div style="
        margin:0;
        padding:0;
        background:${TONAV_THEME.darkBase};
        font-family:Inter, Arial, sans-serif;
        color:${TONAV_THEME.secundary};
      ">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:${TONAV_THEME.darkBase}; padding:32px 12px;">
          <tr>
            <td align="center">

              <table width="100%" cellpadding="0" cellspacing="0" style="
                max-width:680px;
                background:${TONAV_THEME.background};
                border:1px solid ${TONAV_THEME.borderPrimary};
                border-radius:22px;
                overflow:hidden;
                box-shadow:0 0 32px rgba(0,255,255,0.12);
              ">

                <tr>
                  <td style="
                    padding:42px 32px;
                    text-align:center;
                    background:${TONAV_THEME.diagonalGradient};
                  ">
                    <div style="
                      color:${TONAV_THEME.accent};
                      font-family:monospace;
                      font-size:24px;
                      font-weight:bold;
                    ">
                      &lt; TonavTech /&gt;
                    </div>

                    <h1 style="
                      margin:18px 0 8px;
                      color:${TONAV_THEME.primary};
                      font-size:30px;
                      line-height:1.2;
                    ">
                      Propuesta Comercial
                    </h1>

                    <p style="
                      margin:0;
                      color:${TONAV_THEME.textMuted};
                      font-size:14px;
                      letter-spacing:1px;
                    ">
                      Desarrollo Web • Agentes IA • Automatización Digital
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:36px 32px;">

                    <h2 style="
                      margin:0 0 18px;
                      color:${TONAV_THEME.secundary};
                      font-size:24px;
                    ">
                      Hola ${nombre || "cliente"},
                    </h2>

                    <p style="
                      color:${TONAV_THEME.textMuted};
                      font-size:16px;
                      line-height:1.8;
                      margin:0 0 24px;
                    ">
                      Gracias por contactar con 
                      <strong style="color:${TONAV_THEME.primary};">TonavTech</strong>.
                      Hemos recibido tu solicitud y preparamos una cotización inicial basada en el servicio seleccionado.
                    </p>

                    <div style="
                      background:${TONAV_THEME.card};
                      border-left:4px solid ${TONAV_THEME.primary};
                      border-radius:16px;
                      padding:24px;
                      margin:26px 0;
                    ">
                      <p style="
                        margin:0 0 8px;
                        color:${TONAV_THEME.primary};
                        font-size:13px;
                        text-transform:uppercase;
                        letter-spacing:2px;
                        font-weight:bold;
                      ">
                        Servicio solicitado
                      </p>

                      <h3 style="
                        margin:0;
                        color:${TONAV_THEME.secundary};
                        font-size:22px;
                      ">
                        ${servicio || "Solución tecnológica personalizada"}
                      </h3>
                    </div>

                    <div style="
                      background:${TONAV_THEME.card};
                      border-left:4px solid ${TONAV_THEME.accent};
                      border-radius:16px;
                      padding:24px;
                      margin:26px 0;
                    ">
                      <p style="
                        margin:0 0 8px;
                        color:${TONAV_THEME.accent};
                        font-size:13px;
                        text-transform:uppercase;
                        letter-spacing:2px;
                        font-weight:bold;
                      ">
                        Alcance inicial
                      </p>

                      <p style="
                        margin:0;
                        color:${TONAV_THEME.textMuted};
                        font-size:15px;
                        line-height:1.8;
                      ">
                        ${descripcion || "Cotización personalizada según los requerimientos enviados."}
                      </p>
                    </div>

                    <div style="
                      text-align:center;
                      padding:28px;
                      margin:34px 0;
                      border-radius:18px;
                      background:linear-gradient(135deg, rgba(0,255,255,0.08), rgba(255,0,60,0.08));
                      border:1px solid rgba(255,255,255,0.08);
                    ">
                      <p style="
                        margin:0 0 8px;
                        color:${TONAV_THEME.textMuted};
                        font-size:14px;
                      ">
                        Inversión estimada
                      </p>

                      <div style="
                        color:${TONAV_THEME.primary};
                        font-size:36px;
                        font-weight:bold;
                      ">
                        ${montoFormateado}
                      </div>
                    </div>

                    <p style="
                      color:${TONAV_THEME.textMuted};
                      font-size:15px;
                      line-height:1.8;
                    ">
                      Esta propuesta es una estimación inicial. El alcance final será confirmado después de revisar los detalles específicos de tu proyecto.
                    </p>

                    <div style="
                      margin-top:32px;
                      padding:22px;
                      border-radius:16px;
                      background:rgba(255,255,255,0.04);
                      border:1px solid rgba(255,255,255,0.08);
                    ">
                      <p style="
                        margin:0;
                        color:${TONAV_THEME.secundary};
                        font-size:15px;
                        line-height:1.7;
                      ">
                        Próximo paso: nuestro equipo se pondrá en contacto contigo para validar requerimientos, funcionalidades y tiempos de desarrollo.
                      </p>
                    </div>

                  </td>
                </tr>

                <tr>
                  <td style="
                    padding:28px;
                    text-align:center;
                    background:#070707;
                    border-top:1px solid rgba(255,255,255,0.08);
                  ">
                    <p style="
                      margin:0;
                      color:${TONAV_THEME.primary};
                      font-weight:bold;
                    ">
                      TonavTech
                    </p>

                    <p style="
                      margin:8px 0 0;
                      color:#777;
                      font-size:13px;
                    ">
                      Soluciones digitales con IA para negocios modernos
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </div>
    `,
  });

  return {
    success: true,
    message: "Cotización enviada correctamente por email.",
  };
};