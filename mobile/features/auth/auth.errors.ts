const authErrorsMap = {
  INVALID_OTP: "Le code OTP fourni est invalide.",
  OTP_EXPIRED: "Le code OTP a expiré. Veuillez en demander un nouveau.",
};

export function getAuthErrorMessage(errorCode: string | undefined): string {
  if (!errorCode) {
    return "Une erreur inconnue est survenue. Veuillez réessayer.";
  }

  return (
    authErrorsMap[errorCode as keyof typeof authErrorsMap] ||
    "Une erreur inconnue est survenue. Veuillez réessayer."
  );
}
