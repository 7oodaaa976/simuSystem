import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { addArabicFont, ar } from "./pdfArabic";

/* ================= Helpers ================= */

const safe = (v) => (v === null || v === undefined ? "" : String(v));

const loadImageAsDataURL = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });

const addHeaderWithLogo = (doc, { title, logoDataURL }) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Logo (يمين عشان RTL)
  const logoW = 90;
  const logoH = 34;
  const xLogo = pageWidth - 40 - logoW;
  const yLogo = 20;

  if (logoDataURL) {
    doc.addImage(logoDataURL, "PNG", xLogo, yLogo, logoW, logoH);
  }

  // Title
  doc.setFontSize(14);
  doc.text(ar(title), pageWidth / 2, 40, { align: "center" });

  // Subtitle
  doc.setFontSize(10);
  doc.text(ar("Simulator Egypt"), pageWidth / 2, 56, { align: "center" });

  // Divider
  doc.setDrawColor(220);
  doc.line(40, 70, pageWidth - 40, 70);

  return 80; // startY for table
};

/* ================= Transactions PDF ================= */

export const exportTransactionsPDF = async (
  rows,
  filename = "transactions.pdf",
  logoUrl = "/simulator-logo.png"
) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  // ✅ Arabic font + Unicode encoding
  const fontName = addArabicFont(doc);

  // Load logo
  let logoDataURL = "";
  try {
    logoDataURL = await loadImageAsDataURL(logoUrl);
  } catch {
    logoDataURL = "";
  }

  const startY = addHeaderWithLogo(doc, {
    title: "تقرير الحركات (دخول / خروج)",
    logoDataURL,
  });

  const body = rows.map((r) => [
    safe(r["التاريخ"]),
    safe(r["النوع"]),
    safe(r["المنتج"]),
    safe(r["الكمية"]),
    safe(r["السبب"]),
    safe(r["المستلم"]),
    safe(r["بواسطة"]),
    safe(r["الدور"]),
  ]);

  autoTable(doc, {
    startY,
    head: [[
      ar("التاريخ"),
      ar("النوع"),
      ar("المنتج"),
      ar("الكمية"),
      ar("السبب"),
      ar("المستلم"),
      ar("بواسطة"),
      ar("الدور"),
    ]],
    body: body.map((row) => row.map((cell) => ar(cell))),
    styles: {
      font: fontName,
      fontSize: 10,
      cellPadding: 6,
      overflow: "linebreak",
      halign: "right",
    },
    headStyles: {
      font: fontName,
      halign: "right",
    },
    margin: { left: 40, right: 40 },
  });

  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
};

/* ================= Products PDF ================= */

export const exportProductsPDF = async (
  rows,
  filename = "products.pdf",
  logoUrl = "/simulator-logo.png"
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  // ✅ Arabic font + Unicode encoding
  const fontName = addArabicFont(doc);

  // Load logo
  let logoDataURL = "";
  try {
    logoDataURL = await loadImageAsDataURL(logoUrl);
  } catch {
    logoDataURL = "";
  }

  const startY = addHeaderWithLogo(doc, {
    title: "تقرير المنتجات",
    logoDataURL,
  });

  const body = rows.map((r) => [
    safe(r["الاسم"]),
    safe(r["التصنيف"]),
    safe(r["الكود"]),
    safe(r["الكمية"]),
    safe(r["المكان"]),
    safe(r["الحالة"]),
  ]);

  autoTable(doc, {
    startY,
    head: [[
      ar("الاسم"),
      ar("التصنيف"),
      ar("الكود"),
      ar("الكمية"),
      ar("المكان"),
      ar("الحالة"),
    ]],
    body: body.map((row) => row.map((cell) => ar(cell))),
    styles: {
      font: fontName,
      fontSize: 10,
      cellPadding: 6,
      overflow: "linebreak",
      halign: "right",
    },
    headStyles: {
      font: fontName,
      halign: "right",
    },
    margin: { left: 40, right: 40 },
  });

  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
};
