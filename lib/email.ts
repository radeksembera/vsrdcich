import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation({
  email,
  fullName,
  deceasedName,
  variableSymbol,
  amount,
  pageUrl,
}: {
  email: string;
  fullName: string;
  deceasedName: string;
  variableSymbol: string;
  amount: number;
  pageUrl: string;
}) {
  await resend.emails.send({
    from: "VSrdcich <noreply@vsrdcich.semb.app>",
    to: email,
    subject: `Objednávka přijata – ${deceasedName}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #6b4c3b; border-bottom: 1px solid #d4a574; padding-bottom: 12px;">
          VSrdcich
        </h1>
        <p>Dobrý den, ${fullName},</p>
        <p>Vaše objednávka pamětní stránky pro <strong>${deceasedName}</strong> byla přijata.</p>

        <div style="background: #fdf6ef; border-left: 4px solid #d4a574; padding: 16px; margin: 24px 0;">
          <h2 style="margin-top: 0; color: #6b4c3b;">Platební údaje</h2>
          <p><strong>Částka:</strong> ${amount} Kč</p>
          <p><strong>Číslo účtu:</strong> ${process.env.BANK_ACCOUNT}</p>
          <p><strong>Variabilní symbol:</strong> ${variableSymbol}</p>
        </div>

        <p>Po přijetí platby bude stránka zveřejněna na adrese:</p>
        <p><a href="${pageUrl}" style="color: #d4a574;">${pageUrl}</a></p>

        <p>Zároveň vám poštou zašleme QR kód, který na stránku odkazuje.</p>

        <p style="color: #888; font-size: 14px; margin-top: 32px;">
          S úctou,<br/>Tým VSrdcich
        </p>
      </div>
    `,
  });
}
