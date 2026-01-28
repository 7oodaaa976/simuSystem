import bidiFactory from "bidi-js";
import arialBase64 from "../assets/fonts/Arial.base64.js";
import * as R from "arabic-persian-reshaper";

const bidi = bidiFactory();

// ✅ المكتبة عندك بتطلع object فيه convertArabic
const shaper =
  R.default ||
  R.ArabicShaper ||
  (R.default && R.default.ArabicShaper) ||
  R;

// ✅ إضافة الخط مع Unicode encoding
export const addArabicFont = (doc) => {
  const fontName = "ArialUnicode";
  doc.addFileToVFS("Arial.ttf", arialBase64);
  doc.addFont("Arial.ttf", fontName, "normal", "Identity-H");
  doc.setFont(fontName);
  return fontName;
};

// ✅ Arabic shaping + bidi
export const ar = (text) => {
  const s = String(text ?? "");

  // ✅ استخدم الدالة اللي عندك
  const shaped = typeof shaper.convertArabic === "function" ? shaper.convertArabic(s) : s;

  // ✅ RTL ordering
  return bidi.getDisplayText(shaped);
};
