import { type FirebaseWebConfig, getFirebasePublicConfigDiagnostics } from "@/lib/firebase/config";

type FirebaseErrorLike = {
  code?: string;
  message?: string;
};

type FirebaseAuthErrorDetails = {
  title: string;
  message: string;
  action?: string;
  code?: string;
};

function getFirebaseErrorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return undefined;
}

function getProjectLabel(config: FirebaseWebConfig) {
  return config.projectId || "proyecto Firebase configurado";
}

export function getFirebaseAuthErrorDetails(
  error: unknown,
  config: FirebaseWebConfig,
): FirebaseAuthErrorDetails {
  const code = getFirebaseErrorCode(error);
  const projectLabel = getProjectLabel(config);

  switch (code) {
    case "auth/configuration-not-found":
      return {
        code,
        title: "Configuración de autenticación no encontrada",
        message: `Google Sign-In no está configurado en Firebase Auth para el proyecto ${projectLabel}.`,
        action:
          "Habilita Google en Firebase Console > Authentication > Sign-in method y verifica que Vercel use el mismo proyecto.",
      };
    case "auth/operation-not-allowed":
      return {
        code,
        title: "Método de acceso deshabilitado",
        message: `El método de autenticación solicitado no está habilitado para el proyecto ${projectLabel}.`,
        action:
          "Activa Google o Email/Password en Firebase Console > Authentication > Sign-in method.",
      };
    case "auth/unauthorized-domain":
      return {
        code,
        title: "Dominio no autorizado",
        message: "El dominio actual no está autorizado para ejecutar autenticación con Firebase.",
        action:
          "Agrega tu dominio de producción y tus previews necesarios en Firebase Console > Authentication > Settings > Authorized domains.",
      };
    case "auth/invalid-api-key":
      return {
        code,
        title: "API key inválida",
        message:
          "La configuración pública de Firebase apunta a una API key inválida o a un proyecto distinto.",
        action:
          "Verifica las variables NEXT_PUBLIC_FIREBASE_* en Vercel y confirma que pertenezcan al mismo proyecto Firebase.",
      };
    case "auth/popup-blocked":
      return {
        code,
        title: "Popup bloqueado",
        message: "El navegador bloqueó la ventana de autenticación de Google.",
        action: "Permite popups para este sitio y vuelve a intentar.",
      };
    case "auth/popup-closed-by-user":
      return {
        code,
        title: "Popup cerrado",
        message: "Cerraste la ventana de autenticación antes de completar el acceso.",
      };
    case "auth/account-exists-with-different-credential":
      return {
        code,
        title: "Cuenta con otro proveedor",
        message: "Este correo ya existe en Firebase con un método de acceso diferente.",
        action:
          "Entra con el método original o vincula proveedores en Firebase si ese es el comportamiento esperado.",
      };
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return {
        code,
        title: "Credenciales inválidas",
        message: "El correo o la contraseña no coinciden con una cuenta válida.",
      };
    default: {
      const fallbackMessage =
        error instanceof Error && error.message.length > 0
          ? error.message
          : "No fue posible completar la autenticación con Firebase.";

      return {
        code,
        title: "Error de autenticación",
        message: fallbackMessage,
      };
    }
  }
}

export function getFirebaseConfigurationWarning() {
  const diagnostics = getFirebasePublicConfigDiagnostics();

  if (!diagnostics.hasConfig) {
    return `Faltan variables públicas de Firebase: ${diagnostics.missingEnv.join(", ")}.`;
  }

  if (!diagnostics.authDomainMatchesProject) {
    return `El authDomain (${diagnostics.authDomain}) no coincide con el projectId (${diagnostics.projectId}).`;
  }

  return null;
}
