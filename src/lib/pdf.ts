
"use client";

import { jsPDF } from "jspdf";
import type { GenerateQuestionsOutput } from "@/ai/flows/generate-questions";

// Helper function to fetch an image and convert it to a Base64 string.
const fetchImageAsBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};


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
  });

  const MARGIN = 15;
  const HEADER_HEIGHT = 20;
  const FOOTER_HEIGHT = 15;
  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
  const CONTENT_START_Y = HEADER_HEIGHT + 10;
  const CONTENT_END_Y = PAGE_HEIGHT - FOOTER_HEIGHT - 10;
  
  const HEADER_FOOTER_BG = "#29ABE2"; // primary color
  const HEADER_FOOTER_TEXT_COLOR = "#FFFFFF";
  const ANSWER_COLOR = "#334155";
  const EXPLANATION_COLOR = "#4b5563";

  // Fetch logo and watermark images.
  // IMPORTANT: Ensure 'pdf-logo.png' and 'pdf-watermark.png' exist in the /public/images/ directory.
  const logoImageBase64 = await fetchImageAsBase64('/images/assets/pdf-logo.png');
  const watermarkImageBase64 = await fetchImageAsBase64('/images/assets/pdf-watermark.png');


  // --- Reusable Header, Footer, and Watermark Functions ---

  const addWatermark = (docInstance: jsPDF) => {
    if (!watermarkImageBase64) return;
    try {
        const imgProps = docInstance.getImageProperties(watermarkImageBase64);
        const imgWidth = 200; // Increased watermark width
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        const x = (PAGE_WIDTH - imgWidth) / 2;
        const y = (PAGE_HEIGHT - imgHeight) / 2;

        docInstance.saveGraphicsState();
        docInstance.setGState(new (doc as any).GState({ opacity: 0.15 }));
        docInstance.addImage(watermarkImageBase64, 'PNG', x, y, imgWidth, imgHeight);
        docInstance.restoreGraphicsState();
    } catch (e) {
        console.error("Could not add watermark. Is the image path and format correct?", e);
    }
  };
  
  const addHeader = (docInstance: jsPDF) => {
    docInstance.setFillColor(HEADER_FOOTER_BG);
    docInstance.rect(0, 0, PAGE_WIDTH, HEADER_HEIGHT, 'F');
    docInstance.setTextColor(HEADER_FOOTER_TEXT_COLOR);
    
    // Add your logo image.
    if (logoImageBase64) {
        try {
            const imgProps = docInstance.getImageProperties(logoImageBase64);
            const logoHeight = 40; // Increased logo height for better visibility
            const logoWidth = (imgProps.width * logoHeight) / imgProps.height;
            docInstance.addImage(logoImageBase64, 'PNG', 2, (HEADER_HEIGHT - logoHeight) / 2, logoWidth, logoHeight);
        } catch(e) {
            console.error("Could not add logo. Is the image path and format correct?", e);
            // Fallback to text if image fails
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


  // --- Two-pass rendering to get total page count first ---

  let yPos = CONTENT_START_Y;
  let pageCount = 1;

  // Pass 1: Simulate rendering to calculate total pages
  Object.entries(questionsData.questions).forEach(([type, questions]) => {
      if (questions.length === 0) return;

      if (yPos + 15 > CONTENT_END_Y) { // Approx height for section header
          pageCount++;
          yPos = CONTENT_START_Y;
      }
      yPos += 10; // Space for section title

      questions.forEach(({ question, answer, explanation }) => {
          doc.setFontSize(12);
          const splitQuestion = doc.splitTextToSize(`1. ${question}`, CONTENT_WIDTH);
          let itemHeight = splitQuestion.length * 5 + 2;

          if (includeAnswers) {
              doc.setFontSize(11);
              const splitAnswer = doc.splitTextToSize(`Ans: ${answer}`, CONTENT_WIDTH - 5);
              itemHeight += splitAnswer.length * 4.5 + 2;
              if (explanation) {
                  const splitExplanation = doc.splitTextToSize(`Explanation: ${explanation}`, CONTENT_WIDTH - 5);
                  itemHeight += splitExplanation.length * 4.5 + 4;
              }
          }

          if (yPos + itemHeight > CONTENT_END_Y) {
              pageCount++;
              yPos = CONTENT_START_Y;
          }
          yPos += itemHeight + 5;
      });
      yPos += 5; // Space between sections
  });

  const totalPages = pageCount;
  pageCount = 1;
  yPos = CONTENT_START_Y;

  // Pass 2: Actual rendering with headers and footers
  const renderNewPage = (docInstance: jsPDF, currentPage: number, total: number) => {
      addWatermark(docInstance);
      addHeader(docInstance);
      addFooter(docInstance, currentPage, total);
  }
  
  renderNewPage(doc, pageCount, totalPages);

  Object.entries(questionsData.questions).forEach(([type, questions]) => {
    if (questions.length === 0) return;
    
    if (yPos + 15 > CONTENT_END_Y) {
      doc.addPage();
      pageCount++;
      yPos = CONTENT_START_Y;
      renderNewPage(doc, pageCount, totalPages);
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#000000");
    doc.text(type, MARGIN, yPos);
    yPos += 10;

    questions.forEach(({ question, answer, explanation }, index) => {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      
      const questionText = `${index + 1}. ${question}`;
      const splitQuestion = doc.splitTextToSize(questionText, CONTENT_WIDTH);
      let questionHeight = splitQuestion.length * 5 + 2;
      
      let answerHeight = 0;
      let explanationHeight = 0;
      
      if (includeAnswers) {
          doc.setFontSize(11);
          const splitAnswer = doc.splitTextToSize(`Ans: ${answer}`, CONTENT_WIDTH - 5);
          answerHeight = splitAnswer.length * 4.5 + 2;
          if (explanation) {
            const splitExplanation = doc.splitTextToSize(`Explanation: ${explanation}`, CONTENT_WIDTH - 5);
            explanationHeight = splitExplanation.length * 4.5 + 4;
          }
      }

      if (yPos + questionHeight + answerHeight + explanationHeight > CONTENT_END_Y) {
        doc.addPage();
        pageCount++;
        yPos = CONTENT_START_Y;
        renderNewPage(doc, pageCount, totalPages);
      }
      
      doc.setTextColor("#000000");
      doc.text(splitQuestion, MARGIN, yPos);
      yPos += questionHeight;

      if (includeAnswers) {
        doc.setFontSize(11);
        doc.setTextColor(ANSWER_COLOR);
        doc.setFont("helvetica", "italic");
        const answerText = `Ans: ${answer}`;
        const splitAnswer = doc.splitTextToSize(answerText, CONTENT_WIDTH - 5);
        doc.text(splitAnswer, MARGIN + 5, yPos);
        yPos += splitAnswer.length * 4.5 + 2;
        
        if (explanation) {
            doc.setTextColor(EXPLANATION_COLOR);
            const explanationText = `Explanation: ${explanation}`;
            const splitExplanation = doc.splitTextToSize(explanationText, CONTENT_WIDTH-5);
            doc.text(splitExplanation, MARGIN + 5, yPos);
            yPos += splitExplanation.length * 4.5 + 2;
        }
        yPos += 3;
      } else {
         yPos += 5;
      }
    });

    yPos += 5;
  });

  // Filename generation
  const parts = title.split(' - ');
  const subjectName = parts[0]?.replace(/\s+/g, '-') || "Subject";
  const className = parts[1]?.replace(/\s+/g, '-') || "Class";
  const nameSuffix = includeAnswers ? "With-Answers" : "Questions";
  const finalFilename = `${className}-${subjectName}-${nameSuffix}.pdf`;

  doc.save(finalFilename);
};
