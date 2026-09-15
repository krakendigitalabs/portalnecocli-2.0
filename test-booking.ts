import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { processMaritimeBooking } from './app/actions/maritime-booking';

async function testBooking() {
  console.log("Iniciando prueba de reserva marítima...");
  const payload = {
    tripType: "sol" as const,
    destination: "Capurganá",
    date: "2026-09-20",
    accommodation: "food_standard" as const,
    isSolidarityActive: true,
    totalPrice: 425000,
    passengers: [
      {
        name: "Yessy Test",
        docType: "CC" as const,
        docNum: "123456789",
        phone: "3001234567",
        email: "portalnecocli@gmail.com",
        petFriendly: false,
        allergies: false,
      }
    ]
  };

  const result = await processMaritimeBooking(payload);
  console.log("Resultado de la acción:", JSON.stringify(result, null, 2));
}

testBooking().catch(console.error);
