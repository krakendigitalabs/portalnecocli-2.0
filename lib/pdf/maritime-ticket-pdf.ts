import "server-only";

import { PDFDocument, type PDFFont, type PDFPage, StandardFonts, rgb } from "pdf-lib";

export interface MaritimeTicketPassenger {
  name: string;
  docType: string;
  docNum: string;
  phone?: string;
  email?: string;
  petFriendly: boolean;
  allergies: boolean;
}

export interface MaritimeTicketPaymentRow {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface MaritimeTicketData {
  ticketId: string;
  operatorName: string;
  origin: string;
  destination: string;
  journeyLabel: string;
  tripType: string;
  travelDate: string;
  registeredAt: string;
  totalPrice: number;
  isSolidarityActive: boolean;
  passengers: MaritimeTicketPassenger[];
  paymentTitle: string;
  paymentRows: MaritimeTicketPaymentRow[];
}

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 40;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLORS = {
  primary: rgb(0.012, 0.412, 0.631), // #0369a1
  primaryLight: rgb(0.055, 0.647, 0.914), // #0ea5e9
  deep: rgb(0.047, 0.29, 0.431), // #0c4a6e
  sky: rgb(0.941, 0.976, 1), // #f0f9ff
  skyBorder: rgb(0.49, 0.827, 0.988), // #7dd3fc
  text: rgb(0.059, 0.09, 0.165), // #0f172a
  muted: rgb(0.278, 0.333, 0.412), // #475569
  subtle: rgb(0.58, 0.639, 0.722), // #94a3b8
  line: rgb(0.945, 0.961, 0.976), // #f1f5f9
  card: rgb(0.973, 0.98, 0.988), // #f8fafc
  cardBorder: rgb(0.886, 0.91, 0.941), // #e2e8f0
  green: rgb(0.02, 0.588, 0.412), // #059669
  greenBg: rgb(0.941, 0.992, 0.957), // #f0fdf4
  greenBorder: rgb(0.133, 0.773, 0.369), // #22c55e
  greenDark: rgb(0.086, 0.396, 0.204), // #166534
  amberBg: rgb(1, 0.984, 0.922), // #fffbeb
  amber: rgb(0.961, 0.62, 0.043), // #f59e0b
  amberText: rgb(0.573, 0.251, 0.055), // #92400e
  violetBg: rgb(0.929, 0.914, 0.996), // #ede9fe
  violet: rgb(0.427, 0.157, 0.851), // #6d28d9
  redBg: rgb(0.996, 0.886, 0.886), // #fee2e2
  red: rgb(0.725, 0.11, 0.11), // #b91c1c
  white: rgb(1, 1, 1),
};

// Characters outside Latin-1 that WinAnsi (standard PDF fonts) can still encode.
const WIN_ANSI_EXTRAS = new Set(["—", "–", "•", "“", "”", "‘", "’", "…", "€"]);

/** Standard PDF fonts cannot encode emojis or arbitrary Unicode; keep Spanish accents. */
function sanitize(value: string): string {
  return Array.from(value.replace(/→/g, "->"))
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      return (code >= 0x20 && code <= 0xff) || WIN_ANSI_EXTRAS.has(ch);
    })
    .join("")
    .trim();
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = sanitize(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

class TicketWriter {
  private page: PDFPage;
  private y: number;

  constructor(
    private readonly doc: PDFDocument,
    private readonly regular: PDFFont,
    private readonly bold: PDFFont,
  ) {
    this.page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT;
  }

  private ensureSpace(height: number) {
    if (this.y - height < MARGIN + 30) {
      this.page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      this.y = PAGE_HEIGHT - MARGIN;
    }
  }

  private text(
    value: string,
    x: number,
    y: number,
    opts: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb> } = {},
  ) {
    this.page.drawText(sanitize(value), {
      x,
      y,
      size: opts.size ?? 10,
      font: opts.font ?? this.regular,
      color: opts.color ?? COLORS.text,
    });
  }

  header() {
    const height = 92;
    this.page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - height,
      width: PAGE_WIDTH,
      height,
      color: COLORS.primary,
    });
    this.page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - height,
      width: PAGE_WIDTH,
      height: 6,
      color: COLORS.primaryLight,
    });
    const title = "Portal Necoclí";
    const subtitle = "Tiquete Oficial de Pre-Reserva Marítima";
    this.text(title, (PAGE_WIDTH - this.bold.widthOfTextAtSize(title, 24)) / 2, PAGE_HEIGHT - 45, {
      size: 24,
      font: this.bold,
      color: COLORS.white,
    });
    this.text(
      subtitle,
      (PAGE_WIDTH - this.regular.widthOfTextAtSize(subtitle, 11)) / 2,
      PAGE_HEIGHT - 66,
      { size: 11, color: COLORS.white },
    );
    this.y = PAGE_HEIGHT - height - 24;
  }

  ticketCode(ticketId: string) {
    const height = 70;
    this.ensureSpace(height + 20);
    this.page.drawRectangle({
      x: MARGIN,
      y: this.y - height,
      width: CONTENT_WIDTH,
      height,
      color: COLORS.sky,
      borderColor: COLORS.skyBorder,
      borderWidth: 1.5,
      borderDashArray: [6, 4],
    });
    const label = "CÓDIGO DE RESERVA";
    this.text(label, (PAGE_WIDTH - this.bold.widthOfTextAtSize(label, 9)) / 2, this.y - 22, {
      size: 9,
      font: this.bold,
      color: COLORS.primary,
    });
    this.text(ticketId, (PAGE_WIDTH - this.bold.widthOfTextAtSize(ticketId, 22)) / 2, this.y - 52, {
      size: 22,
      font: this.bold,
      color: COLORS.deep,
    });
    this.y -= height + 24;
  }

  sectionTitle(title: string) {
    this.ensureSpace(40);
    this.text(title.toUpperCase(), MARGIN, this.y, {
      size: 10,
      font: this.bold,
      color: COLORS.primary,
    });
    this.y -= 8;
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: MARGIN + CONTENT_WIDTH, y: this.y },
      thickness: 1.5,
      color: rgb(0.878, 0.949, 0.996),
    });
    this.y -= 16;
  }

  infoRow(label: string, value: string, opts: { highlight?: boolean } = {}) {
    const rowHeight = 22;
    this.ensureSpace(rowHeight);
    const size = opts.highlight ? 12 : 10.5;
    const font = opts.highlight ? this.bold : this.regular;
    const cleanValue = sanitize(value);
    this.text(label, MARGIN + 4, this.y, { size: 10.5, font: this.bold, color: COLORS.muted });
    this.text(
      cleanValue,
      MARGIN + CONTENT_WIDTH - 4 - font.widthOfTextAtSize(cleanValue, size),
      this.y,
      { size, font, color: opts.highlight ? COLORS.green : COLORS.text },
    );
    this.y -= 8;
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: MARGIN + CONTENT_WIDTH, y: this.y },
      thickness: 0.75,
      color: COLORS.line,
    });
    this.y -= 14;
  }

  passengerCard(index: number, p: MaritimeTicketPassenger) {
    const lines: string[] = [`Documento: ${p.docType} ${p.docNum}`];
    if (p.phone) lines.push(`Teléfono: ${p.phone}`);
    if (p.email) lines.push(`Correo: ${p.email}`);
    const badges: { label: string; bg: ReturnType<typeof rgb>; fg: ReturnType<typeof rgb> }[] = [];
    if (p.petFriendly)
      badges.push({ label: "Viaja con Mascota (Pet Friendly)", bg: COLORS.violetBg, fg: COLORS.violet });
    if (p.allergies)
      badges.push({ label: "Tiene Alergias declaradas", bg: COLORS.redBg, fg: COLORS.red });

    const height = 30 + lines.length * 14 + (badges.length ? 22 : 0);
    this.ensureSpace(height + 10);
    const top = this.y + 10;
    this.page.drawRectangle({
      x: MARGIN,
      y: top - height,
      width: CONTENT_WIDTH,
      height,
      color: COLORS.card,
      borderColor: COLORS.cardBorder,
      borderWidth: 1,
    });
    let cy = top - 20;
    this.text(`Pasajero ${index + 1}: ${p.name}`, MARGIN + 14, cy, {
      size: 11.5,
      font: this.bold,
      color: COLORS.primary,
    });
    cy -= 16;
    for (const line of lines) {
      this.text(line, MARGIN + 14, cy, { size: 10, color: COLORS.muted });
      cy -= 14;
    }
    if (badges.length) {
      let bx = MARGIN + 14;
      cy -= 4;
      for (const badge of badges) {
        const w = this.bold.widthOfTextAtSize(badge.label, 8.5) + 16;
        this.page.drawRectangle({ x: bx, y: cy - 4, width: w, height: 15, color: badge.bg });
        this.text(badge.label, bx + 8, cy, { size: 8.5, font: this.bold, color: badge.fg });
        bx += w + 6;
      }
    }
    this.y = top - height - 14;
  }

  paymentBox(title: string, rows: MaritimeTicketPaymentRow[]) {
    const note = "Para asegurar tu cupo, realiza un abono del 50% o más a la siguiente cuenta:";
    const footer = "Envía el comprobante de pago al WhatsApp de la naviera para confirmar tu reserva.";
    const titleLines = wrapText(title.toUpperCase(), this.bold, 10, CONTENT_WIDTH - 32);
    const height = 36 + titleLines.length * 14 + 18 + rows.length * 22 + 22;
    this.ensureSpace(height + 10);
    const top = this.y + 10;
    this.page.drawRectangle({
      x: MARGIN,
      y: top - height,
      width: CONTENT_WIDTH,
      height,
      color: COLORS.greenBg,
      borderColor: COLORS.greenBorder,
      borderWidth: 1.5,
    });
    let cy = top - 22;
    for (const line of titleLines) {
      this.text(line, MARGIN + 16, cy, { size: 10, font: this.bold, color: COLORS.greenDark });
      cy -= 14;
    }
    cy -= 4;
    this.text(note, MARGIN + 16, cy, { size: 9.5, color: COLORS.greenDark });
    cy -= 22;
    for (const row of rows) {
      const size = row.highlight ? 12 : 10;
      const font = row.highlight ? this.bold : this.regular;
      const value = sanitize(row.value);
      this.text(row.label, MARGIN + 16, cy, { size: 10, font: this.bold, color: COLORS.greenDark });
      this.text(value, MARGIN + CONTENT_WIDTH - 16 - font.widthOfTextAtSize(value, size), cy, {
        size,
        font,
        color: COLORS.greenDark,
      });
      cy -= 22;
    }
    this.text(footer, MARGIN + 16, cy + 4, { size: 8.5, color: COLORS.greenDark });
    this.y = top - height - 22;
  }

  notice(title: string, body: string) {
    const lines = wrapText(`${title} ${body}`, this.regular, 9.5, CONTENT_WIDTH - 30);
    const height = 18 + lines.length * 13;
    this.ensureSpace(height + 10);
    const top = this.y + 10;
    this.page.drawRectangle({
      x: MARGIN,
      y: top - height,
      width: CONTENT_WIDTH,
      height,
      color: COLORS.amberBg,
    });
    this.page.drawRectangle({ x: MARGIN, y: top - height, width: 4, height, color: COLORS.amber });
    let cy = top - 16;
    for (const line of lines) {
      this.text(line, MARGIN + 16, cy, { size: 9.5, color: COLORS.amberText });
      cy -= 13;
    }
    this.y = top - height - 20;
  }

  footer(operatorName: string) {
    const lines = [
      "Reserva gestionada por Portal Necoclí · Kraken Digital Labs",
      `Operado por ${operatorName}`,
      "portalnecocli.com · reservas@portalnecocli.com",
    ];
    this.ensureSpace(lines.length * 13 + 20);
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: MARGIN + CONTENT_WIDTH, y: this.y },
      thickness: 0.75,
      color: COLORS.cardBorder,
    });
    this.y -= 18;
    for (const line of lines) {
      const clean = sanitize(line);
      this.text(clean, (PAGE_WIDTH - this.regular.widthOfTextAtSize(clean, 9)) / 2, this.y, {
        size: 9,
        color: COLORS.subtle,
      });
      this.y -= 13;
    }
  }
}

/** Builds the maritime pre-booking ticket as a PDF and returns its bytes. */
export async function generateMaritimeTicketPdf(data: MaritimeTicketData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Tiquete Pre-Reserva ${data.ticketId}`);
  doc.setAuthor("Portal Necoclí · Kraken Digital Labs");
  doc.setSubject("Tiquete Oficial de Pre-Reserva Marítima");
  doc.setCreator("Portal Necoclí");

  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const w = new TicketWriter(doc, regular, bold);

  w.header();
  w.ticketCode(data.ticketId);

  w.sectionTitle("Detalles del Viaje");
  w.infoRow("Origen", data.origin);
  w.infoRow("Naviera", data.operatorName);
  w.infoRow("Destino", data.destination);
  w.infoRow("Trayecto", data.journeyLabel);
  w.infoRow("Tipo de Plan", data.tripType.toUpperCase());
  w.infoRow("Fecha de Viaje", data.travelDate);
  w.infoRow("Total Pasajeros", String(data.passengers.length));
  w.infoRow("Fecha de Reserva", data.registeredAt);
  w.infoRow("Valor a pagar en taquilla", `$${data.totalPrice.toLocaleString("es-CO")} COP`, {
    highlight: true,
  });
  if (data.isSolidarityActive) {
    w.infoRow("Aporte Solidario Motonecos", "$5.000 COP (Incluido)");
  }

  w.sectionTitle("Pasajeros");
  data.passengers.forEach((p, i) => w.passengerCard(i, p));

  w.paymentBox(data.paymentTitle, data.paymentRows);

  w.notice(
    "Política de Equipaje:",
    "Tienes 10 kg incluidos por pasajero. El peso excedente tiene un valor de $2.000 COP por cada kilo adicional, pagaderos exclusivamente en la taquilla de la naviera.",
  );

  w.footer(data.operatorName);

  return doc.save();
}
