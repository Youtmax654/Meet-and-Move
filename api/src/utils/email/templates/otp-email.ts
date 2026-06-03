import { emailTheme } from "./theme";

type OtpEmailContent = {
  subject: string;
  preheader: string;
  heading: string;
  body: string;
};

type RenderOtpEmailParams = {
  otp: string;
  content: OtpEmailContent;
  brandName?: string;
};

export function renderOtpEmail({
  otp,
  content,
  brandName = "Meet & Move",
}: RenderOtpEmailParams) {
  const { colors, fontFamily, cardRadius, containerWidth, buttonRadius } =
    emailTheme;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${content.subject}</title>
  </head>
  <body style="margin:0;padding:0;background:${colors.background};font-family:${fontFamily};color:${colors.text};">
    <span style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">${content.preheader}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${colors.background};padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="${containerWidth}" cellspacing="0" cellpadding="0" style="background:${colors.card};border-radius:${cardRadius};padding:32px;border:1px solid ${colors.border};">
            <tr>
              <td style="padding-bottom:16px;font-size:14px;color:${colors.muted};letter-spacing:0.3px;">${brandName}</td>
            </tr>
            <tr>
              <td style="font-size:22px;font-weight:700;color:${colors.text};">${content.heading}</td>
            </tr>
            <tr>
              <td style="padding:12px 0 24px 0;font-size:14px;line-height:1.6;color:${colors.muted};">${content.body}</td>
            </tr>
            <tr>
              <td align="center" style="padding:12px 0 24px 0;">
                <div style="display:inline-block;padding:12px 24px;border-radius:${buttonRadius};background:${colors.brand};color:#fff;font-size:20px;letter-spacing:6px;font-weight:700;">
                  ${otp}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding-top:8px;font-size:12px;color:${colors.muted};">
                Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.
              </td>
            </tr>
          </table>
          <table role="presentation" width="${containerWidth}" cellspacing="0" cellpadding="0" style="margin-top:12px;">
            <tr>
              <td align="center" style="font-size:12px;color:${colors.muted};">
                Besoin d'aide ? Répondez à cet email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
