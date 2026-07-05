import nodemailer from 'nodemailer';

export const sendApprovalEmail = async (toEmail: string, assetName: string, applicantName: string, links: { demo_url?: string; repo_url?: string; guide_url?: string } = {}) => {
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

  const linksArray = [];
  if (links.demo_url) linksArray.push(`🌐 <strong>Demo:</strong> <a href="${links.demo_url}" style="color: #059669; text-decoration: none;">${links.demo_url}</a>`);
  if (links.repo_url) linksArray.push(`💻 <strong>Repository:</strong> <a href="${links.repo_url}" style="color: #059669; text-decoration: none;">${links.repo_url}</a>`);
  if (links.guide_url) linksArray.push(`📖 <strong>Panduan:</strong> <a href="${links.guide_url}" style="color: #059669; text-decoration: none;">${links.guide_url}</a>`);
  const linksText = linksArray.length > 0 ? linksArray.join('<br/>') : 'Silakan hubungi admin untuk info lebih lanjut.';

  try {
    const info = await transporter.sendMail({
      from: `"HIMA TI UNIKU" <${SMTP_USER}>`,
      to: toEmail,
      subject: `[HIMA TI] Permintaan Akses Aset ${assetName} Disetujui`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #059669; padding: 24px; text-align: center; color: white;">
            <h2 style="margin: 0; font-size: 24px; letter-spacing: 0.5px;">HIMA TI UNIKU</h2>
          </div>
          <div style="padding: 32px 24px;">
            <h3 style="color: #111827; margin-top: 0; font-size: 18px;">Halo ${applicantName},</h3>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Kabar gembira! Pengajuan akses Anda untuk aset digital <strong>${assetName}</strong> telah <strong style="color: #059669;">DISETUJUI</strong> oleh pengurus HIMA TI UNIKU.
            </p>
            
            <div style="background-color: #ecfdf5; border-left: 4px solid #059669; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
              <p style="margin-top: 0; margin-bottom: 12px; font-weight: 600; color: #065f46; font-size: 15px;">Berikut adalah akses yang dapat Anda gunakan:</p>
              <div style="margin-bottom: 0; line-height: 1.8; color: #1f2937; font-size: 15px;">
                ${linksText}
              </div>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-top: 24px;">Tim kami juga mungkin akan menghubungi Anda via WhatsApp untuk memberikan panduan lebih lanjut jika diperlukan.</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0 24px 0;" />
            <p style="font-size: 14px; color: #4b5563; margin: 0 0 8px 0; line-height: 1.5;">Terima kasih atas antusiasme Anda terhadap program KKN Desa Pintar!</p>
            <p style="font-size: 14px; color: #4b5563; margin: 0;">Salam hangat,<br/><strong style="color: #111827;">Pengurus HIMA TI 🚀</strong></p>
          </div>
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
