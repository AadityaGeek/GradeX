
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin, Mail, Rocket, Target, Users, Lightbulb, Heart, History, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative flex items-center justify-center text-center text-white h-[60vh]">
          <Image
            src="/images/res/hero-about.jpg"
            alt="Students studying together"
            fill={true}
            objectFit="cover"
            className="absolute inset-0"
            priority={true}
            data-ai-hint="happy diverse students"
          />
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div className="relative z-20 container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">More Than Just a Tool</h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-white/90">Discover the story, the people, and the passion behind GradeX.</p>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl sm:text-3xl md:text-4xl font-bold"><Users className="h-8 w-8 text-primary" /> Who Are We?</h2>
                    <p className="text-lg text-muted-foreground">
                        At our core, we're a team of one with a big idea: that preparing for exams shouldn't be a stressful, time-consuming chore. GradeX is the result of that idea — a smart, friendly, and powerful AI companion designed to make learning and testing more efficient and accessible for every student and educator.
                    </p>
                    <p className="text-lg text-muted-foreground">
                        We're not a big corporation; we're a passion project dedicated to leveraging technology for education in a meaningful way.
                    </p>
                </div>
                <div>
                     <Image
                        src="/images/res/who-are-we.jpg"
                        alt="A student using a laptop with icons for books and ideas"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-xl"
                        data-ai-hint="education technology interface"
                    />
                </div>
            </div>
        </section>

        {/* Why We Built This Section */}
        <section className="py-16 md:py-24 bg-secondary/20">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                 <div className="order-last md:order-first">
                    <Image
                        src="/images/res/why-we-built.jpg"
                        alt="A lightbulb symbolizing an idea"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-xl"
                        data-ai-hint="bright idea lightbulb"
                    />
                </div>
                <div className="space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl sm:text-3xl md:text-4xl font-bold"><History className="h-8 w-8 text-primary" /> Why We Built GradeX</h2>
                    <p className="text-lg text-muted-foreground">
                       GradeX started from a simple, personal frustration: <span className="italic">"Why is it so hard to find good, relevant practice questions for a specific chapter?"</span> I spent countless hours searching for materials during my own studies and saw a clear gap.
                    </p>
                     <p className="text-lg text-muted-foreground">
                       I realized AI could solve this. It could understand the curriculum, adapt to different question types, and generate a unique paper in seconds. This project was born out of the desire to build the tool I wish I had — a tool to help students focus on learning, not just searching.
                    </p>
                </div>
            </div>
        </section>
        
        {/* Mission and Vision Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 space-y-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-3 text-2xl sm:text-3xl font-bold"><Target className="h-8 w-8 text-primary" /> Our Mission</h3>
                        <p className="text-lg text-muted-foreground">
                            Our mission is to empower students and educators by using AI to create high-quality, accessible learning tools. We want to eliminate the tedious parts of exam preparation, freeing up more time for genuine understanding and teaching.
                        </p>
                    </div>
                     <div>
                        <Image
                            src="/images/res/our-mission.jpg"
                            alt="A person reaching for a star"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-xl"
                            data-ai-hint="achieving goal"
                        />
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-last md:order-first">
                        <Image
                            src="/images/res/vision.jpg"
                            alt="A telescope pointing at the stars"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-xl"
                            data-ai-hint="future vision"
                        />
                    </div>
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-3 text-2xl sm:text-3xl font-bold"><Eye className="h-8 w-8 text-primary" /> Our Vision</h3>
                        <p className="text-lg text-muted-foreground">
                            We envision a future where personalized education is just a click away. A future where AI acts as a personal tutor for every student, helping them identify weaknesses, build confidence, and achieve their academic goals without barriers.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Who's Behind GradeX Section */}
        <section className="py-16 md:py-24 bg-secondary/20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Who's Behind GradeX?</h2>
                <div className="mt-12 flex flex-col items-center">
                    <Avatar className="w-32 h-32 mb-4">
                        <AvatarImage src="https://github.com/aadityageek.png" alt="Aaditya Kumar" />
                        <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                    <h3 className="text-2xl font-semibold">Aaditya Kumar</h3>
                    <p className="text-primary">Creator & Developer</p>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl italic">
                        Hi, I'm Aaditya! I'm a developer with a passion for building things that make a real difference. GradeX is my contribution to the world of education technology, built with the hope of making the learning journey a little bit smoother for everyone.
                    </p>
                </div>
            </div>
        </section>

        {/* Want to Connect? Section */}
        <section className="py-16 md:py-24 text-center">
            <div className="container mx-auto px-4">
                 <h2 className="text-3xl md:text-4xl font-bold">Want to Connect?</h2>
                <p className="mt-4 text-lg text-muted-foreground">Have a question, a suggestion, or just want to say hi? I'd love to hear from you!</p>
                <div className="mt-8">
                    <Button asChild size="lg" variant="outline">
                        <Link href="mailto:work.aadityakumar@gmail.com">
                            <Mail className="mr-2 h-5 w-5" />
                            Get in Touch
                        </Link>
                    </Button>
                </div>
                <div className="mt-12 flex justify-center items-center space-x-4">
                    <Link href="https://github.com/AadityaGeek/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Github/></Link>
                    <Link href="https://www.linkedin.com/in/aadityakr/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Linkedin/></Link>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
