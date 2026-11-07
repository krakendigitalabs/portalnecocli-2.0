export const WORKER_SUPER_ADMIN_EMAIL = "krakendigitalabs@gmail.com";

export function isWorkerSuperAdminEmail(email: string | null | undefined): boolean {
  return email?.trim().toLowerCase() === WORKER_SUPER_ADMIN_EMAIL;
}
