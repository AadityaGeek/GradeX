
"use client";

import { jsPDF } from "jspdf";
import type { GenerateQuestionsOutput } from "@/ai/flows/generate-questions";

// Helper: fetch image URL → base64 data URL
const fetchImageAsBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

// Helper: resize a base64 image using canvas to reduce embedded pixel data.
// maxW/maxH are the caps in pixels — the image is scaled down proportionally if larger.
const resizeImageBase64 = (base64: string, maxW: number, maxH: number): Promise<string> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(1, maxW / img.width, maxH / img.height);
            const w = Math.round(img.width * scale);
            const h = Math.round(img.height * scale);
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = base64;
    });


// Helper: Clean and format markdown text, tables, mathematical equations, and geometry symbols for PDF rendering
// Standard jsPDF Helvetica uses WinAnsi/Latin-1 encoding. Non-Latin1 symbols (like angles ∠, perpendicular ⊥, Greek letters, or LaTeX delimiters)
// break font metrics in jsPDF, causing wide-spaced text. We convert all mathematical/geometry notations to clear, readable standard terms.
function formatTextForPdf(text: string): string {
  if (!text) return "";

  let processed = text;

  // 1. Remove LaTeX math wrappers ($...$, $$...$$, \(...\), \[...\])
  processed = processed
    .replace(/\$\$([\s\S]*?)\$\$/g, " $1 ")
    .replace(/\$([^$]+)\$/g, " $1 ")
    .replace(/\\\[([\s\S]*?)\\\]/g, " $1 ")
    .replace(/\\\(([\s\S]*?)\\\)/g, " $1 ");

  // 2. LaTeX formatting tags & fractions
  processed = processed
    .replace(/\\(?:text|mathbf|mathrm|textit|textbf|underline)\{([^}]+)\}/g, "$1")
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)");

  // 3. LaTeX and Unicode Geometry & Angle Symbols
  processed = processed
    .replace(/\\angle\s*([A-Za-z0-9_]+)/g, "angle $1")
    .replace(/[∠∡]/g, "angle ")
    .replace(/\\perp|\\bot|[⊥]/g, " perpendicular to ")
    .replace(/\\parallel|\\par|[∥]/g, " || ")
    .replace(/\\cong|[≅]/g, " congruent to ")
    .replace(/\\sim|[∼]/g, " similar to ")
    .replace(/\\triangle|\\Delta|[Δ]/g, "Triangle ")
    .replace(/\\therefore|[∴]/g, "Therefore, ")
    .replace(/\\because|[∵]/g, "Because, ");

  // 4. Mathematical Operators, Units, and Greek Letters
  processed = processed
    .replace(/\\pi|[π]/g, "pi")
    .replace(/\\theta|[θ]/g, "theta")
    .replace(/\\alpha|[α]/g, "alpha")
    .replace(/\\beta|[β]/g, "beta")
    .replace(/\\gamma|[γ]/g, "gamma")
    .replace(/\\lambda|[λ]/g, "lambda")
    .replace(/\\phi|[φ]/g, "phi")
    .replace(/\\sqrt\{([^}]+)\}/g, "sqrt($1)")
    .replace(/\\sqrt\s*([A-Za-z0-9_]+)/g, "sqrt($1)")
    .replace(/[√]/g, "sqrt")
    .replace(/\\pm|[±]/g, "+/-")
    .replace(/\\leq|[≤]/g, "<=")
    .replace(/\\geq|[≥]/g, ">=")
    .replace(/\\neq|[≠]/g, "!=")
    .replace(/\\times|[×]/g, " * ")
    .replace(/\\cdot|[·•]/g, " * ")
    .replace(/\\div|[÷]/g, " / ")
    .replace(/\\infty|[∞]/g, "infinity")
    .replace(/\\implies|\\Rightarrow|[⇒]/g, " => ")
    .replace(/\\iff|\\Leftrightarrow|[⇔]/g, " <=> ")
    .replace(/\\rightarrow|\\to|-->|->|[→]/g, " -> ")
    .replace(/\\leftarrow|<--|<-|[←]/g, " <- ")
    .replace(/\\approx|[≈]/g, " ~= ")
    .replace(/\\equiv|[≡]/g, " = ")
    .replace(/\\degree|\\circ|[°]/g, " deg")
    .replace(/\\Omega|[Ω]/g, " ohms")
    .replace(/\bOhms\b/g, " ohms")
    .replace(/\\mu|[µ]/g, "u")
    .replace(/\^\{([^}]+)\}/g, "^$1")
    .replace(/\^2|²/g, "^2")
    .replace(/\^3|³/g, "^3")
    .replace(/_\{([^}]+)\}/g, "_$1");

  // 5. Clean Quotes, Dashes, and Typography
  processed = processed
    .replace(/[“”]/g, '"')
    .replace(/[‘’`]/g, "'")
    .replace(/[—–]/g, " - ")
    .replace(/\t/g, "    ");

  // 6. Handle Markdown tables and lines
  const lines = processed.split("\n");
  const outputLines: string[] = [];
  let inTable = false;
  let headers: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();

    // Check if line is a table divider like |---|---|
    if (/^\|[-:\s|]+\|$/.test(rawLine)) {
      continue;
    }

    // Check if line is a markdown table row (| col1 | col2 | ...)
    if (rawLine.startsWith("|") && rawLine.endsWith("|")) {
      const cells = rawLine
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim().replace(/\*\*/g, "").replace(/\*/g, ""))
        .filter((c) => c.length > 0);

      if (cells.length > 0) {
        if (!inTable) {
          inTable = true;
          headers = cells;
          outputLines.push(""); // Spacing before table
        } else {
          // Format comparison row cleanly
          const rowTitle = cells[0];
          outputLines.push(`- ${rowTitle}:`);
          for (let colIdx = 1; colIdx < cells.length; colIdx++) {
            const headerName = headers[colIdx] || `Category ${colIdx}`;
            outputLines.push(`    * ${headerName}: ${cells[colIdx]}`);
          }
        }
      }
      continue;
    } else {
      if (inTable) {
        inTable = false;
        headers = [];
        outputLines.push(""); // Spacing after table
      }
    }

    // Clean standard markdown formatting
    let cleaned = rawLine
      .replace(/\*\*(.*?)\*\*/g, "$1") // Bold **text** -> text
      .replace(/\*(.*?)\*/g, "$1")     // Italic *text* -> text
      .replace(/^#{1,6}\s+/, "");       // Headings ### -> text

    // 7. Strict ASCII normalizer: replace any leftover unhandled Unicode glyphs with space to guarantee font consistency
    cleaned = cleaned.replace(/[^\x20-\x7E\n]/g, " ");

    // Normalize multiple spaces into single space
    cleaned = cleaned.replace(/ {2,}/g, " ");

    outputLines.push(cleaned);
  }

  return outputLines.join("\n");
}

export const generatePdf = async (
    questionsData: GenerateQuestionsOutput, 
    title: string,
    subtitle: string,
    includeAnswers: boolean
) => {
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
    putOnlyUsedFonts: true,
    compress: true,
  });

  const MARGIN = 15;
  const HEADER_HEIGHT = 20;
  const FOOTER_HEIGHT = 15;
  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
  const CONTENT_START_Y = HEADER_HEIGHT + 10;
  const CONTENT_END_Y = PAGE_HEIGHT - FOOTER_HEIGHT - 6;
  
  const HEADER_FOOTER_BG = "#29ABE2"; // primary color
  const HEADER_FOOTER_TEXT_COLOR = "#FFFFFF";
  const ANSWER_COLOR = "#334155";
  const EXPLANATION_COLOR = "#4b5563";

  // Fetch logo and watermark images with canvas downsampling
  const rawLogo = await fetchImageAsBase64('/images/assets/pdf-logo.png');
  const rawWatermark = await fetchImageAsBase64('/images/assets/pdf-watermark.png');
  const logoImageBase64 = await resizeImageBase64(rawLogo, 400, 200);
  const watermarkImageBase64 = await resizeImageBase64(rawWatermark, 800, 800);

  // --- Header, Footer, and Watermark ---

  const addWatermark = (docInstance: jsPDF) => {
    if (!watermarkImageBase64) return;
    try {
        const imgProps = docInstance.getImageProperties(watermarkImageBase64);
        const imgWidth = 200;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        const x = (PAGE_WIDTH - imgWidth) / 2;
        const y = (PAGE_HEIGHT - imgHeight) / 2;

        docInstance.saveGraphicsState();
        docInstance.setGState(new (doc as any).GState({ opacity: 0.15 }));
        docInstance.addImage(watermarkImageBase64, 'PNG', x, y, imgWidth, imgHeight, 'watermark', 'SLOW');
        docInstance.restoreGraphicsState();
    } catch (e) {
        console.error("Could not add watermark:", e);
    }
  };
  
  const addHeader = (docInstance: jsPDF) => {
    docInstance.setFillColor(HEADER_FOOTER_BG);
    docInstance.rect(0, 0, PAGE_WIDTH, HEADER_HEIGHT, 'F');
    docInstance.setTextColor(HEADER_FOOTER_TEXT_COLOR);
    
    if (logoImageBase64) {
        try {
            const imgProps = docInstance.getImageProperties(logoImageBase64);
            const logoHeight = 40;
            const logoWidth = (imgProps.width * logoHeight) / imgProps.height;
            docInstance.addImage(logoImageBase64, 'PNG', 2, (HEADER_HEIGHT - logoHeight) / 2, logoWidth, logoHeight, 'logo', 'SLOW');
        } catch(e) {
            console.error("Could not add logo:", e);
            docInstance.setFontSize(16);
            docInstance.setFont("helvetica", "bold");
            docInstance.text("GradeX", MARGIN, HEADER_HEIGHT / 2 + 4);
        }
    } else {
        docInstance.setFontSize(16);
        docInstance.setFont("helvetica", "bold");
        docInstance.text("GradeX", MARGIN, HEADER_HEIGHT / 2 + 4);
    }

    // Centered Title/Subtitle
    docInstance.setFontSize(16);
    docInstance.setFont("helvetica", "bold");
    docInstance.text(title, PAGE_WIDTH / 2, HEADER_HEIGHT / 2 - 1, { align: "center" });
    docInstance.setFontSize(11);
    docInstance.setFont("helvetica", "normal");
    const splitSubtitle = doc.splitTextToSize(subtitle, CONTENT_WIDTH - 40);
    docInstance.text(splitSubtitle, PAGE_WIDTH / 2, HEADER_HEIGHT / 2 + 6, { align: "center" });
  };
  
  const addFooter = (docInstance: jsPDF, pageNum: number, totalPages: number) => {
    docInstance.setFillColor(HEADER_FOOTER_BG);
    docInstance.rect(0, PAGE_HEIGHT - FOOTER_HEIGHT, PAGE_WIDTH, FOOTER_HEIGHT, 'F');
    docInstance.setTextColor(HEADER_FOOTER_TEXT_COLOR);
    docInstance.setFontSize(12);
    docInstance.text(`Page ${pageNum} of ${totalPages}`, PAGE_WIDTH / 2, PAGE_HEIGHT - FOOTER_HEIGHT / 2 + 2, { align: "center" });
  };

  const renderNewPage = (docInstance: jsPDF, currentPage: number, total: number) => {
      addWatermark(docInstance);
      addHeader(docInstance);
      addFooter(docInstance, currentPage, total);
  };

  // --- Strict Line-by-Line Flow Renderer ---
  // Renders lines with automatic page breaking so content NEVER overflows past CONTENT_END_Y

  const executePass = (isSimulation: boolean, totalPagesCount: number): number => {
    let yPos = CONTENT_START_Y;
    let pageCount = 1;

    if (!isSimulation) {
      renderNewPage(doc, pageCount, totalPagesCount);
    }

    const printLines = (
      lines: string[], 
      x: number, 
      lineHeight: number,
      fontName = "helvetica",
      fontStyle = "normal",
      fontSize = 11,
      textColor = "#000000"
    ) => {
      if (!isSimulation) {
        doc.setFont(fontName, fontStyle);
        doc.setFontSize(fontSize);
        doc.setTextColor(textColor);
      }

      for (const line of lines) {
        if (yPos + lineHeight > CONTENT_END_Y) {
          pageCount++;
          yPos = CONTENT_START_Y;
          if (!isSimulation) {
            doc.addPage();
            renderNewPage(doc, pageCount, totalPagesCount);
            doc.setFont(fontName, fontStyle);
            doc.setFontSize(fontSize);
            doc.setTextColor(textColor);
          }
        }
        if (!isSimulation) {
          doc.text(line, x, yPos);
        }
        yPos += lineHeight;
      }
    };

    // Render question types in the exact standard order: MCQ -> Fill in the Blanks -> True/False -> Very Short Answer -> Short Answer -> Long Answer
    const ORDERED_TYPES = [
      'MCQ',
      'Fill in the Blanks',
      'True/False',
      'Very Short Answer',
      'Short Answer',
      'Long Answer',
    ];

    const sortedEntries = Object.entries(questionsData.questions).sort(([typeA], [typeB]) => {
      const indexA = ORDERED_TYPES.indexOf(typeA);
      const indexB = ORDERED_TYPES.indexOf(typeB);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });

    sortedEntries.forEach(([type, questions]) => {
      if (!questions || questions.length === 0) return;

      const isLongAnswer = type.toLowerCase().includes("long");

      // For Long Answer section, start the section header on a fresh page (if not already at top)
      // For other sections, ensure enough room for header + at least one question
      if (isLongAnswer && yPos > CONTENT_START_Y + 5) {
        pageCount++;
        yPos = CONTENT_START_Y;
        if (!isSimulation) {
          doc.addPage();
          renderNewPage(doc, pageCount, totalPagesCount);
        }
      } else if (yPos + 18 > CONTENT_END_Y) {
        pageCount++;
        yPos = CONTENT_START_Y;
        if (!isSimulation) {
          doc.addPage();
          renderNewPage(doc, pageCount, totalPagesCount);
        }
      }

      if (!isSimulation) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.setTextColor("#000000");
        doc.text(type, MARGIN, yPos);
      }
      yPos += 8;

      questions.forEach(({ question, answer, explanation }, index) => {
        // Each SUBSEQUENT Long Answer question (index > 0) starts on a fresh page
        if (isLongAnswer && index > 0) {
          pageCount++;
          yPos = CONTENT_START_Y;
          if (!isSimulation) {
            doc.addPage();
            renderNewPage(doc, pageCount, totalPagesCount);
          }
        }

        // 1. Question Text
        const formattedQuestion = formatTextForPdf(question);
        const questionPrefix = `${index + 1}. `;
        const questionLines = doc.splitTextToSize(`${questionPrefix}${formattedQuestion}`, CONTENT_WIDTH);
        printLines(questionLines, MARGIN, 5.2, "helvetica", "normal", 11, "#000000");
        yPos += 1.5;

        // 2. Answer Text (if included)
        if (includeAnswers && answer) {
          const formattedAnswer = formatTextForPdf(answer);
          const answerLines = doc.splitTextToSize(`Ans: ${formattedAnswer}`, CONTENT_WIDTH - 4);
          printLines(answerLines, MARGIN + 4, 4.8, "helvetica", "italic", 10.5, ANSWER_COLOR);

          // 3. Explanation Text (if included)
          if (explanation && explanation.trim()) {
            const formattedExplanation = formatTextForPdf(explanation);
            const explanationLines = doc.splitTextToSize(`Explanation: ${formattedExplanation}`, CONTENT_WIDTH - 4);
            printLines(explanationLines, MARGIN + 4, 4.8, "helvetica", "normal", 10, EXPLANATION_COLOR);
          }
          yPos += 3;
        } else {
          yPos += 3;
        }
      });

      yPos += 4; // Space between sections
    });

    return pageCount;
  };

  // Pass 1: Simulate exact layout to calculate accurate total page count
  const calculatedTotalPages = executePass(true, 1);

  // Pass 2: Actually draw the PDF with 100% accurate page numbers and no overflow
  executePass(false, calculatedTotalPages);

  // Filename generation
  const parts = title.split(' - ');
  const subjectName = parts[0]?.replace(/\s+/g, '-') || "Subject";
  const className = parts[1]?.replace(/\s+/g, '-') || "Class";
  const nameSuffix = includeAnswers ? "With-Answers" : "Questions";
  const finalFilename = `${className}-${subjectName}-${nameSuffix}.pdf`;

  doc.save(finalFilename);
};
