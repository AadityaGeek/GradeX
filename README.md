
# GradeX - AI-Powered Question Paper Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

GradeX is an intelligent web application designed to revolutionize how students and educators prepare for and create exams. By harnessing the power of generative AI, it automates the creation of high-quality, customized question papers based on specific curriculum requirements. This tool saves valuable time for educators and provides students with a powerful resource for targeted revision.

## ✨ Key Features

- **🧠 Intelligent Content Generation**: Leverages advanced AI to generate questions and answers that are contextually relevant and accurate.
- **📚 Curriculum-Specific**: Tailor question papers by selecting the class, subject, and specific chapters.
- **📝 Customizable Question Types**: Choose from a variety of question formats (MCQ, Short Answer, True/False, etc.) and set the desired quantity for each.
- **💻 Modern & Interactive UI**: A clean, responsive, and user-friendly interface built with the latest web technologies for a seamless experience.
- **📄 PDF Export**: Instantly download the generated question papers as a PDF, with the option to include or exclude the answer key.
- **✅ Review & Confirm**: A final confirmation step allows users to review their selections before the AI begins the generation process.
- **🌙 Dark Mode**: A sleek and comfortable dark mode for reduced eye strain during late-night study sessions.

## 📸 Screenshots

| Landing Page | Generation Form |
| :---: | :---: |
| <img src="public/images/readme/landing-page.png" alt="Landing Page" data-ai-hint="app screenshot"> | <img src="/public/images/readme/generation-form.png" alt="Question Generation Form" data-ai-hint="app form screenshot"> |

| Review Dialog | Generated Questions |
| :---: | :---: |
| <img src="/public/images/readme/review-dialog.png" alt="Review Dialog" data-ai-hint="app dialog screenshot"> | <img src="/public/images/readme/generated-questions.png" alt="Generated Questions" data-ai-hint="app questions screenshot"> |


## 🚀 How It Works

Using GradeX is as simple as 1-2-3:

1.  **Select Your Material**: Navigate to the "Generate" page and choose the desired class and subject from the dropdown menus.
2.  **Choose Your Chapters & Questions**: Select one or more chapters you want to focus on. Then, specify the types of questions (e.g., MCQs, Short Answer) and the number you need for each.
3.  **Generate & Download**: Review your selections in the confirmation dialog. Once confirmed, the AI will generate your unique question paper, which you can immediately view and download as a PDF.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Integration**: [Genkit (Google's Generative AI Toolkit)](https://firebase.google.com/docs/genkit)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Schema Validation**: [Zod](https://zod.dev/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)

## ⚙️ Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later is recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AadityaGeek/GradeX.git
    cd GradeX
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add your Google AI API key.
    ```env
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    GENERATE_QUESTIONS_PROMPT="YOUR_CUSTOM_PROMPT"
    ```

### Running the Application

This project requires two services to be running concurrently: the Next.js frontend and the Genkit AI service.

1.  **Start the Next.js development server:**
    ```bash
    npm run dev
    ```
    This will start the application on `http://localhost:9002`.

2.  **Start the Genkit development service (in a separate terminal):**
    ```bash
    npm run genkit:dev
    ```
    This runs the Genkit flows in development mode and allows the frontend to communicate with the AI backend.

Now you can open your browser and navigate to `http://localhost:9002` to use the application.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements, please feel free to create an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## Contact

[![Email](https://img.shields.io/badge/Email-work.aadityakumar@gmail.com-blue?style=for-the-badge&logo=gmail&logoColor=white)](mailto:work.aadityakumar@gmail.com)<br>
[![GitHub](https://img.shields.io/badge/GitHub-Aaditya%20Geek-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AadityaGeek/)<br>
[![LinkedIn](https://img.shields.io/badge/LinkedIn-aaditya%20kumar-0A66C2?style=for-the-badge&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/aadityakr/)<br>
[![Website](https://img.shields.io/badge/Website-Personal%20Portfolio%20Website-5570A1?style=for-the-badge&logo=globe&logoColor=white)](https://aadityageek.github.io/)

## 📄 License

This project is distributed under the MIT License. See `LICENSE` for more information.
