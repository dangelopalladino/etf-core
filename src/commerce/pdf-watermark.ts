/**
 * Per-buyer PDF watermark engine (Phase 4).
 *
 * Stamps a low-opacity footer on every page of a source PDF with the buyer's
 * email, purchase date, and a short session hash. Pure-JS via `pdf-lib`.
 */
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface WatermarkStamp {
  email: string;
  purchasedAt: string;
  sessionHash: string;
}

const FOOTER_FONT_SIZE = 8;
const FOOTER_Y_OFFSET = 18;
const FOOTER_OPACITY = 0.3;
// Warm charcoal #3A3632 — matches BRAND.foreground.
const FOOTER_COLOR = rgb(58 / 255, 54 / 255, 50 / 255);

function formatStamp(stamp: WatermarkStamp): string {
  const date = (stamp.purchasedAt || '').slice(0, 10);
  const hash = (stamp.sessionHash || '').slice(-6);
  return `${stamp.email} · purchased ${date} · #${hash}`;
}

export async function watermarkPdf(
  buffer: Uint8Array,
  stamp: WatermarkStamp
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer, { updateMetadata: false });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const text = formatStamp(stamp);
  const textWidth = font.widthOfTextAtSize(text, FOOTER_FONT_SIZE);

  for (const page of doc.getPages()) {
    const { width } = page.getSize();
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: FOOTER_Y_OFFSET,
      size: FOOTER_FONT_SIZE,
      font,
      color: FOOTER_COLOR,
      opacity: FOOTER_OPACITY,
    });
  }

  return doc.save({ useObjectStreams: true });
}
