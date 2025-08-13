
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, BookOpen, BrainCircuit, Cloud, Cpu, Rocket, ShieldCheck, Target, Zap, Bot, Edit, CheckCircle } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: "AI Integration",
      description: "Smart and relevant question generation powered by cutting-edge AI.",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Fast & Easy",
      description: "Generate comprehensive question papers in just a few seconds.",
    },
    {
      icon: <Cpu className="h-8 w-8 text-primary" />,
      title: "Custom Papers",
      description: "Tailor tests with specific topics, question types, and difficulty levels.",
    },
    {
      icon: <Cloud className="h-8 w-8 text-primary" />,
      title: "Cloud Powered",
      description: "Access your materials and generate questions from anywhere, anytime.",
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: "Student-Friendly UI",
      description: "An intuitive, clean, and distraction-free interface for focused learning.",
    },
     {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Data-Driven Insights",
      description: "Identify knowledge gaps and track your preparation progress effectively.",
    },
  ];

  const aboutPoints = [
    { icon: <Target className="h-6 w-6 text-primary shrink-0" />, text: "Focus your revision on specific chapters for targeted learning." },
    { icon: <Edit className="h-6 w-6 text-primary shrink-0" />, text: "Create diverse question papers with various formats like MCQs, Short Answers, and more." },
    { icon: <CheckCircle className="h-6 w-6 text-primary shrink-0" />, text: "Receive high-quality, relevant questions that align with your curriculum." },
    { icon: <BrainCircuit className="h-6 w-6 text-primary shrink-0" />, text: "Go beyond memorization by tackling questions that test true understanding." },
    { icon: <Rocket className="h-6 w-6 text-primary shrink-0" />, text: "Accelerate your study sessions and prepare more effectively in less time." },
  ];

  const steps = [
    {
      title: "Select Material",
      description: "Choose your class, subject, and the chapters you want to focus on.",
    },
    {
      title: "Customize Questions",
      description: "Pick question types (MCQ, Short Answer, etc.) and specify the quantity for each.",
    },
    {
      title: "Generate & Download",
      description: "Our AI generates your paper, ready for download as a PDF or for online practice.",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative flex items-center justify-center text-center text-white h-[70vh]">
            <Image 
                src="/images/hero-background.jpg"
                alt="Neural Network"
                fill={true}
                objectFit="cover"
                className="absolute inset-0"
                priority={true}
                data-ai-hint="futuristic education interface"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 z-10"></div>
            <div className="relative z-20 container mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Transform the Way You Prepare for Exams</h1>
                <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-white/90">AI-powered question generation tailored to your syllabus</p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link href="/generate" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto transition-all hover:-translate-y-0.5")}>
                        Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link href="/#about" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "bg-transparent text-white border-white/80 hover:bg-white hover:text-primary w-full sm:w-auto transition-all hover:-translate-y-0.5")}>
                        Learn More
                    </Link>
                </div>
            </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">What is GradeX?</h2>
                <p className="text-lg text-muted-foreground">
                  GradeX is an intelligent platform designed to revolutionize exam preparation. It moves beyond simple question generation by leveraging cutting-edge AI to create contextually aware, high-quality questions tailored to your specific curriculum. Our goal is to provide a powerful tool that not only saves educators time but also helps students learn more effectively by focusing on understanding, not just memorization.
                </p>
                <ul className="space-y-3 pt-4">
                  {aboutPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {point.icon}
                      <span className="flex-1">{point.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-first md:order-last">
                <Image
                  src="/images/about-us-image.jpg"
                  alt="Illustration of AI and education"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                  data-ai-hint="abstract education technology"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose Our Platform?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              We provide powerful tools to streamline your study and assessment process.
            </p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-left bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Get Your Questions in 3 Simple Steps</h2>
                <div className="relative mt-12 max-w-4xl mx-auto">
                    <div className="absolute left-1/2 top-4 hidden h-[calc(100%-2rem)] w-0.5 -translate-x-1/2 bg-border md:block" aria-hidden="true"></div>
                    <div className="grid grid-cols-1 gap-y-12 md:gap-y-16">
                        {steps.map((step, index) => (
                           <div key={index} className="relative flex flex-col items-center md:flex-row md:items-start md:justify-between">
                                <div className={`flex flex-col items-center md:flex-row md:w-1/2 ${index % 2 === 0 ? 'md:order-1' : 'md:order-3 md:justify-end'}`}>
                                    <div className="flex-shrink-0 order-1 md:order-none w-12 h-12 bg-primary rounded-full text-primary-foreground font-bold text-xl z-10 flex items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
                                        {index + 1}
                                    </div>
                                    <div className={`p-6 order-2 md:order-none bg-card rounded-lg shadow-md border w-full text-center md:w-[calc(100%-4rem)] transition-all hover:shadow-lg hover:border-primary hover:-translate-y-0.5 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                                        <h3 className="text-xl font-semibold">{step.title}</h3>
                                        <p className="mt-2 text-muted-foreground">{step.description}</p>
                                    </div>
                                </div>
                                <div className="hidden md:block md:w-1/2 md:order-2"></div>
                           </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to ace your next exam?</h2>
            <p className="mt-4 text-lg text-muted-foreground">Start generating intelligent questions now.</p>
            <div className="mt-8">
              <Link href="/generate" className={cn(buttonVariants({ size: "lg" }), "transition-all hover:-translate-y-0.5")}>
                Try GradeX Now <Rocket className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
