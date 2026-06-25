import { jsPDF } from 'jspdf';
import { Product, Language } from '../types';

export const generateProductPDF = (product: Product, lang: Language) => {
  const isEn = lang === Language.EN;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Color Palette
  const colorPrimary = { r: 15, g: 23, b: 42 }; // #0f172a (Slate 900)
  const colorAccent = { r: 168, g: 85, b: 247 }; // #a855f7 (Purple/UV)
  const colorCyan = { r: 6, g: 182, b: 212 }; // #06b6d4 (Cyan)
  const colorLightGray = { r: 241, g: 245, b: 249 }; // #f1f5f9
  const colorBorder = { r: 226, g: 232, b: 240 }; // #e2e8f0
  const colorTextDim = { r: 100, g: 116, b: 139 }; // #64748b

  // Grid line decorations (Blueprint Feel)
  doc.setDrawColor(241, 245, 249);
  doc.setLineWidth(0.3);
  
  // Background aesthetic grids
  for (let x = 10; x < pageWidth; x += 30) {
    doc.line(x, 10, x, pageHeight - 10);
  }
  for (let y = 10; y < pageHeight; y += 30) {
    doc.line(10, y, pageWidth - 10, y);
  }

  // Draw high-precision frame borders
  doc.setDrawColor(colorAccent.r, colorAccent.g, colorAccent.b);
  doc.setLineWidth(0.8);
  // Outer elegant corner brackets
  const m = 12; // Margin
  doc.line(m, m, m + 15, m);
  doc.line(m, m, m, m + 15);

  doc.line(pageWidth - m, m, pageWidth - m - 15, m);
  doc.line(pageWidth - m, m, pageWidth - m, m + 15);

  doc.line(m, pageHeight - m, m + 15, pageHeight - m);
  doc.line(m, pageHeight - m, m, pageHeight - m - 15);

  doc.line(pageWidth - m, pageHeight - m, pageWidth - m - 15, pageHeight - m);
  doc.line(pageWidth - m, pageHeight - m, pageWidth - m, pageHeight - m - 15);

  // Subtle boundary box
  doc.setDrawColor(colorBorder.r, colorBorder.g, colorBorder.b);
  doc.setLineWidth(0.25);
  doc.rect(m + 4, m + 4, pageWidth - 2 * m - 8, pageHeight - 2 * m - 8);

  // 1. BRAND HEADER (Top Section)
  doc.setFillColor(colorPrimary.r, colorPrimary.g, colorPrimary.b);
  doc.rect(m + 6, m + 6, pageWidth - 2 * m - 12, 28, 'F');

  // Decorative cyan accent strip inside header
  doc.setFillColor(colorCyan.r, colorCyan.g, colorCyan.b);
  doc.rect(m + 6, m + 34, pageWidth - 2 * m - 12, 1.5, 'F');

  // Brand text on solid header
  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('QuDay', m + 15, m + 18);
  
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(colorCyan.r, colorCyan.g, colorCyan.b);
  doc.text('QUANTUM CYBER-SOVEREIGNTY SYSTEMS GMBH', m + 15, m + 24);

  // Header Status details
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('Courier', 'bold');
  const d = new Date();
  const dateStr = d.toISOString().split('T')[0];
  doc.text(`REF: QD-${product.id.toUpperCase()}-${d.getFullYear()}`, pageWidth - m - 60, m + 16);
  doc.text(`DOC-DATE: ${dateStr}`, pageWidth - m - 60, m + 21);
  doc.text(`CLASSIFICATION: COMMERCIAL_SECURE`, pageWidth - m - 60, m + 26);

  // 2. DOCUMENT TITLE
  let currentY = m + 48;
  doc.setTextColor(colorPrimary.r, colorPrimary.g, colorPrimary.b);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(26);
  doc.text(product.name.toUpperCase(), m + 12, currentY);

  currentY += 8;
  doc.setFillColor(colorAccent.r, colorAccent.g, colorAccent.b);
  doc.rect(m + 12, currentY, 32, 1, 'F');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(colorAccent.r, colorAccent.g, colorAccent.b);
  const sysCategory = isEn ? 'TECHNICAL DATA REPORT' : 'TECHNISCHER DATENBERICHT';
  doc.text(`${sysCategory}  //  ${product.category.toUpperCase()}`, m + 48, currentY + 1.5);

  currentY += 12;

  // 3. OVERVIEW / DESCRIPTION
  doc.setTextColor(colorPrimary.r, colorPrimary.g, colorPrimary.b);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  const overviewTitle = isEn ? '1. EXECUTIVE OVERVIEW' : '1. ENGINE-SPEZIFISCHE ÜBERSICHT';
  doc.text(overviewTitle, m + 12, currentY);

  currentY += 6;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(colorPrimary.r, colorPrimary.g, colorPrimary.b);
  
  const descText = product.description || '';
  const itemSummary = isEn
    ? `This document outlines the calibrated performance benchmarks, architectural characteristics, and structural specifications of the QuDay ${product.name} system.`
    : `Dieses Dokument beschreibt die kalibrierten Leistungsmerkmale, architektonischen Eigenschaften und strukturellen Spezifikationen des QuDay ${product.name}-Systems.`;

  const splitDesc = doc.splitTextToSize(`${descText} ${itemSummary}`, pageWidth - 2 * m - 24);
  doc.text(splitDesc, m + 12, currentY);
  
  currentY += splitDesc.length * 5 + 6;

  // 4. KEY CAPABILITIES & FEATURES
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(colorPrimary.r, colorPrimary.g, colorPrimary.b);
  const keyFeatTitle = isEn ? '2. SYSTEM FEATURES & ADVANTAGES' : '2. SYSTEMFUNKTIONEN & SYSTEMVORTEILE';
  doc.text(keyFeatTitle, m + 12, currentY);

  currentY += 6;
  const features = product.features || [];
  features.forEach((feat) => {
    // Elegant diamond badge for bullets
    doc.setFillColor(colorCyan.r, colorCyan.g, colorCyan.b);
    doc.rect(m + 14, currentY - 2.5, 2, 2, 'F');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colorPrimary.r, colorPrimary.g, colorPrimary.b);
    doc.text(feat, m + 20, currentY);
    currentY += 6.5;
  });

  currentY += 6;

  // 5. DETAILED TECHNICAL CHARTS & TABLES
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(colorPrimary.r, colorPrimary.g, colorPrimary.b);
  const sysSpecsTitle = isEn ? '3. PARAMETER SPECTRUM LAB TESTING' : '3. PARAMETERSPEKTRUM AUS DEM LABOR';
  doc.text(sysSpecsTitle, m + 12, currentY);

  currentY += 7;

  // Resolve specific parameters table according to product
  let tableHeaders = isEn ? ['TECHNICAL PARAMETER', 'LAB MEASUREMENT STATUS'] : ['STELLPARAMETER', 'LABORMESSWERTE'];
  let tableRows: string[][] = [];

  if (product.id === 'qkd') {
    tableRows = [
      [isEn ? 'Fidelity Level' : 'Fidelitäts-Niveau', '> 98.4 %'],
      [isEn ? 'Handshake Secure Range' : 'Sichere Reichweite', 'Up to 25 km fiber link'],
      [isEn ? 'Key Exchange Rate' : 'Schlüsselaustauschrate', '1.25 kBps @ 10km length'],
      [isEn ? 'Optimal Jitter Calibration' : 'Jitter-Kalibrierung', '< 150 ps duration'],
      [isEn ? 'Operation Wavelength' : 'Betriebswellenlänge', '810 nm standard (VIS)'],
      [isEn ? 'Form Design Factor' : 'Formfaktor-Gehäuse', '19-inch rack unit (3U)']
    ];
  } else if (product.id === 'sources') {
    tableRows = [
      [isEn ? 'Entanglement Source' : 'Verschränkte Photonenquelle', '405 nm active laser diode'],
      [isEn ? 'Output State Fidelity' : 'Ausgangs-Fidelität', '> 97.20 %'],
      [isEn ? 'Pair Generation Density' : 'Paarbildungs-Dichte', '2.5 x 10^7 pairs/second'],
      [isEn ? 'Power Supply Intake' : 'Eingangsspannung', '12 V DC, 2.5 A (calibrated)'],
      [isEn ? 'Symmetric Optical Out' : 'Ausgänge', 'Dual Single Mode Fiber (FC/APC)'],
      [isEn ? 'Operating Temperature' : 'Betriebstemperatur', '22.0 °C +/- 0.05 °C active stabilization']
    ];
  } else if (product.id === 'pam') {
    tableRows = [
      [isEn ? 'Passive Optical Modules' : 'Passive Optische Bauteile', 'Linear retarders & Wollaston prisms'],
      [isEn ? 'Analyzer Resolution' : 'Analysator-Auflösung', 'H/V, D/A, R/L selectable bases'],
      [isEn ? 'Coincidence Sorting Outputs' : 'Koinzidenz-Ausgänge', '4 separate TTL sub-ns triggers'],
      [isEn ? 'Wavelength Support' : 'Wellenlängen-Unterstützung', '750 nm to 860 nm range'],
      [isEn ? 'Insertion Impairment' : 'Einfügedämpfung', '< 0.45 dB minimum loss']
    ];
  } else {
    // PCM or Custom
    tableRows = [
      [isEn ? 'Active Fiber Drift Control' : 'Aktive Faserdrift-Kompensation', 'Piezoresistive state correction with feedback'],
      [isEn ? 'Polarization Tracking Speed' : 'Nachführgeschwindigkeit', 'Up to 45 rad/second'],
      [isEn ? 'Latency Limit' : 'Latenzlimit', '< 15 ms response step'],
      [isEn ? 'Insertion Degradation' : 'Einfügedämpfung', '< 0.18 dB (low loss)'],
      [isEn ? 'Auxiliary Output' : 'Hilfsanschluss', 'USB 3.1 & Ethernet Control Socket']
    ];
  }

  // Draw Technical Table
  const cellHeight = 7.5;
  const col1Width = 85;
  const col2Width = pageWidth - 2 * m - 24 - col1Width;

  // Table header background
  doc.setFillColor(colorPrimary.r, colorPrimary.g, colorPrimary.b);
  doc.rect(m + 12, currentY, col1Width + col2Width, cellHeight + 1, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(tableHeaders[0], m + 16, currentY + 5);
  doc.text(tableHeaders[1], m + 16 + col1Width, currentY + 5);

  currentY += cellHeight + 1;

  tableRows.forEach((row, rIdx) => {
    // Alternating row background for modern bento design feel
    if (rIdx % 2 === 0) {
      doc.setFillColor(colorLightGray.r, colorLightGray.g, colorLightGray.b);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(m + 12, currentY, col1Width + col2Width, cellHeight, 'F');

    // Subtle inline border lines
    doc.setDrawColor(colorBorder.r, colorBorder.g, colorBorder.b);
    doc.setLineWidth(0.15);
    doc.line(m + 12, currentY + cellHeight, m + 12 + col1Width + col2Width, currentY + cellHeight);

    doc.setTextColor(colorPrimary.r, colorPrimary.g, colorPrimary.b);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(row[0], m + 16, currentY + 5);

    doc.setFont('Courier', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(colorAccent.r, colorAccent.g, colorAccent.b);
    doc.text(row[1], m + 16 + col1Width, currentY + 5);

    currentY += cellHeight;
  });

  currentY += 12;

  // 6. SCIENTIFIC TEAM ENDORSEMENT
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(colorPrimary.r, colorPrimary.g, colorPrimary.b);
  const authSigText = isEn ? 'PHYSICAL-LAYER VERIFICATION ASSIGNMENT' : 'FREIGABE PHYSIKALISCHE SICHERHEITSSCHICHT';
  doc.text(authSigText, m + 12, currentY);

  currentY += 6;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(colorTextDim.r, colorTextDim.g, colorTextDim.b);
  
  const verificationParagraph = isEn
    ? 'This datasheet is digitally catalogued and certified under peer-vetted BBM92 protocols. Continuous photon entanglement guarantees physical unhackability.'
    : 'Dieses Datenblatt ist digital archiviert und gemäß den BBM92-Verschränkungskriterien zertifiziert. Kontinuierliche Absicherung schützt vor Abhören.';
  
  const splitVerif = doc.splitTextToSize(verificationParagraph, pageWidth - 2 * m - 24);
  doc.text(splitVerif, m + 12, currentY);

  currentY += splitVerif.length * 4.5 + 4;

  // Branded Signature Stamps
  doc.setFont('Courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(colorAccent.r, colorAccent.g, colorAccent.b);
  doc.text('APPROVED: Koushik D, CTO [Jena R&D Labs]', m + 12, currentY);
  doc.text('AUDIT_STATUS: BBM92_VERIFIED_100%', pageWidth - m - 75, currentY);


  // 7. BRAND FOOTER (Bottom border)
  doc.setFillColor(colorPrimary.r, colorPrimary.g, colorPrimary.b);
  doc.rect(m + 6, pageHeight - m - 14, pageWidth - 2 * m - 12, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(7);
  const footerLabel = isEn 
    ? 'CONFIDENTIAL // OFFICIAL QuDay QUANTUM TECH DATA SHEET. PEER-REVIEWED OPTICAL SYSTEMS JENA.'
    : 'VERTRAULICH // OFFIZIELLES QuDay SPEZIFIKATIONSBLATT. PEER-REVIEWED OPTIK-SYSTEME JENA.';
  doc.text(footerLabel, m + 12, pageHeight - m - 9);

  // Download Action
  doc.save(`QuDay_Technical_Specs_${product.name.replace(/\s+/g, '_')}_${lang}.pdf`);
};
