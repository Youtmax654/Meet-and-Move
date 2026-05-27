import { Resend } from "resend";
import { renderOtpEmail } from "./templates/otp-email";

type OtpEmailType =
  | "sign-in"
  | "email-verification"
  | "forget-password"
  | "change-email";

type OtpEmailPayload = {
  email: string;
  otp: string;
  type: OtpEmailType;
};

type EmailConfig = {
  resend?: Resend;
  from?: string;
};

function getEmailConfig(): EmailConfig {
  return {
    resend: new Resend(process.env.RESEND_API_KEY),
    from: process.env.RESEND_FROM,
  };
}

function getEmailCopy(type: OtpEmailType) {
  if (type === "sign-in") {
    return {
      subject: "Votre code de connexion",
      preheader: "Utilisez ce code pour vous connecter.",
      heading: "Connexion",
      body: "Utilisez le code ci-dessous pour vous connecter. Ce code expire bientôt.",
    };
  }

  if (type === "email-verification") {
    return {
      subject: "Vérifiez votre email",
      preheader: "Confirmez votre adresse email.",
      heading: "Vérification de votre email",
      body: "Utilisez le code ci-dessous pour vérifier votre adresse email.",
    };
  }

  return {
    subject: "Réinitialisation du mot de passe",
    preheader: "Utilisez ce code pour réinitialiser votre mot de passe.",
    heading: "Réinitialiser votre mot de passe",
    body: "Utilisez le code ci-dessous pour réinitialiser votre mot de passe.",
  };
}

export async function sendOtpEmail({ email, otp, type }: OtpEmailPayload) {
  const { resend, from } = getEmailConfig();

  if (!resend || !from) {
    console.warn(
      "Resend is not configured. Missing RESEND_API_KEY or RESEND_FROM.",
    );
    return;
  }

  const copy = getEmailCopy(type);

  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject: copy.subject,
    html: renderOtpEmail({ otp, content: copy }),
    text: `${copy.body}\n\n${otp}`,
  });

  // const response = await fetch("https://api.resend.com/emails", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${apiKey}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     from,
  //     to: email,
  //     subject: copy.subject,
  //     html: buildHtml({ otp, type }),
  //     text: `${copy.body}\n\n${otp}`,
  //   }),
  // });

  if (error) {
    console.error("Resend email failed:", error);
  }
}
