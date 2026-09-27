import { expect, test } from "@playwright/test";

test.describe("Página de Login y Rutas de Perfil", () => {
  test("Debe renderizar las tres opciones de acceso (Turista, Conductor, Comercio)", async ({
    page,
  }) => {
    // 1. Navegamos a la página de login
    await page.goto("/ingresar");

    // 2. Verificamos que el título esté visible
    await expect(page.locator("text=Selecciona tu perfil")).toBeVisible();

    // 3. Verificamos la ruta de Turista
    const touristButton = page.locator("button:has-text('Turista')");
    await expect(touristButton).toBeVisible();
    await expect(page.locator("text=Explora, reserva y viaja")).toBeVisible();

    // 4. Verificamos la ruta de Conductor Aliado
    const driverButton = page.locator("button:has-text('Conductor Aliado')");
    await expect(driverButton).toBeVisible();
    await expect(page.locator("text=Recibe carreras y gana")).toBeVisible();

    // 5. Verificamos la ruta de Comercio
    const merchantButton = page.locator("button:has-text('Comercio')");
    await expect(merchantButton).toBeVisible();
    await expect(page.locator("text=Hoteles, restaurantes y tours")).toBeVisible();

    // Nota: No podemos probar el flujo de OAuth 2.0 (Google) directamente en E2E
    // sin mockear Firebase Auth, pero validamos que los botones de enrutamiento 
    // están renderizados correctamente.
  });
});
