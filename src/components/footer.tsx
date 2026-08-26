
"use client";

import * as React from "react";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
    const [year, setYear] = React.useState<number | null>(null);

    React.useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    const socialLinks = [
        { icon: <Mail className="h-5 w-5" />, href: "mailto:work.aadityakumar@gmail.com", label: "Email", target: "_self" },
        { icon: <Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/in/aadityakr/", label: "LinkedIn", target: "_blank" },
        { icon: <Github className="h-5 w-5" />, href: "https://github.com/AadityaGeek/", label: "GitHub", target: "_blank" },
        { icon: <Instagram className="h-5 w-5" />, href: "https://Instagram.com/aadityakr_/", label: "Instagram", target: "_blank" },
    ];

    const quickLinks = [
        { href: "/", label: "Home" },
        { href: "/generate", label: "Generate" },
        { href: "/pricing", label: "Pricing" },
        { href: "/about", label: "About" },
    ];

    const resourceLinks = [
        { href: "/generate", label: "Question Generator" },
        { href: "/pricing", label: "Plans & Pricing" },
        { href: "/profile", label: "My Profile" },
        { href: "/login", label: "Sign In" },
    ];

    return (
        <footer id="contact" className="bg-card border-t">
            {/* Main footer content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Brand Column */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2 w-fit">
                            <Image
                                src="/images/assets/logo.png"
                                alt="GradeX Logo"
                                width={28}
                                height={28}
                            />
                            <span className="font-bold text-lg">GradeX</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            AI-powered question paper generation tailored to your syllabus. Study smarter, not harder.
                        </p>
                        {/* Social Icons */}
                        <div className="flex items-center gap-2 mt-1">
                            {socialLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-label={link.label}
                                    target={link.target}
                                    rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                                    className="flex items-center justify-center w-9 h-9 rounded-lg border bg-background text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-all hover:-translate-y-0.5"
                                >
                                    {link.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Section: Side by side on mobile (grid-cols-2) and 2 columns on desktop */}
                    <div className="grid grid-cols-2 gap-6 md:col-span-2 md:gap-8">
                        {/* Quick Links Column */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-semibold text-sm tracking-wider uppercase text-muted-foreground">Quick Links</h3>
                            <ul className="flex flex-col gap-2">
                                {quickLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-0.5 inline-block"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources Column */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-semibold text-sm tracking-wider uppercase text-muted-foreground">Resources</h3>
                            <ul className="flex flex-col gap-2">
                                {resourceLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-0.5 inline-block"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t">
                <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>&copy; {year || new Date().getFullYear()} GradeX. All rights reserved.</span>
                    <span>Designed &amp; built by <span className="text-primary font-medium">Aaditya Kumar</span></span>
                </div>
            </div>
        </footer>
    );
}
