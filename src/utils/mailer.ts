import nodemailer from 'nodemailer';

export const sendApprovalEmail = async (toEmail: string, assetName: string, applicantName: string) => {
  const { SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('SMTP_USER or SMTP_PASS not configured. Email not sent.');
    return { success: false, error: 'SMTP konfigurasi belum diatur di server (SMTP_USER/SMTP_PASS)' };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"HIMA TI UNIKU" <${SMTP_USER}>`,
      to: toEmail,
      subject: `[HIMA TI] Permintaan Akses Aset ${assetName} Disetujui`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #059669;">Halo, ${applicantName}!</h2>
          <p>Kabar gembira! Permintaan akses Anda untuk aset digital <strong>${assetName}</strong> telah <strong>DISETUJUI</strong> oleh pengurus HIMA TI.</p>
          <p>Tim kami akan segera menghubungi Anda via WhatsApp untuk memberikan panduan lebih lanjut terkait penggunaan aset ini.</p>
          <br/>
          <p>Terima kasih atas antusiasme Anda terhadap program KKN Desa Pintar!</p>
          <p>Salam hangat,</p>
          <p><strong>Pengurus HIMA TI UNIKU</strong></p>
        </div>
      `,
    });

    console.log(`Approval email sent successfully to ${toEmail}. Message ID: ${info.messageId}`);
    return { success: true, data: info };
  } catch (err: any) {
    console.error(`Failed to send email to ${toEmail}:`, err);
    return { success: false, error: err.message || 'Gagal mengirim email via Gmail' };
  }
};
