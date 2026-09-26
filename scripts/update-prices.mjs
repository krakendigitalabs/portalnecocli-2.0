import fs from 'fs';
import path from 'path';

function updatePricesInString(text) {
  // Regex to find things like $6.000, $15.000
  return text.replace(/\$(\d{1,3}(?:\.\d{3})*)/g, (match, p1) => {
    const numericValue = parseInt(p1.replace(/\./g, ''), 10);
    const newValue = Math.round(numericValue * 1.1); // add 10%
    return '$' + newValue.toLocaleString('es-CO').replace(/,/g, '.');
  });
}

function updateFile(filePath, addNote = false) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Extra step: if it's the AI prompt, we might want to update ONLY the MOTOCARRO section.
  // Or if it's the TARIFARIO_MOTOCARRO_2026.md, update everything.
  
  if (filePath.includes('ai.ts')) {
    const parts = content.split('--- 4. TARIFARIO MOTOCARRO 2026 ---');
    if (parts.length > 1) {
      const parts2 = parts[1].split('--- 5. TARIFARIO TAXI AMARILLO 2026 ---');
      let motocarroSection = parts2[0];
      
      // Update prices
      motocarroSection = updatePricesInString(motocarroSection);
      
      // Add the night note
      if (!motocarroSection.includes('Tarifa Nocturna')) {
         motocarroSection = motocarroSection.replace('CASCO URBANO:', 'NOTA: Tarifa Nocturna (después de 8pm) es el DOBLE del precio normal.\nCASCO URBANO:');
      }
      
      parts[1] = motocarroSection + '--- 5. TARIFARIO TAXI AMARILLO 2026 ---' + parts2[1];
      content = parts.join('--- 4. TARIFARIO MOTOCARRO 2026 ---');
    }
  } else if (filePath.includes('TARIFARIO_MOTOCARRO_2026.md')) {
    content = updatePricesInString(content);
    if (!content.includes('Tarifa Nocturna')) {
      content = content.replace('La carga pesada no hace parte del valor del pasajero y es negociable con el conductor.', 'La carga pesada no hace parte del valor del pasajero y es negociable con el conductor. **La Tarifa Nocturna (después de las 8:00 PM) corresponde al DOBLE del precio normal diurno aquí listado.**');
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${filePath}`);
}

const aiTsPath = path.resolve('lib/actions/ai.ts');
const docPath = path.resolve('docs/TARIFARIO_MOTOCARRO_2026.md');

updateFile(aiTsPath);
updateFile(docPath);
