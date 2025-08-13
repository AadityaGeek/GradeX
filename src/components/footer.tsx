
"use client";

import * as React from "react";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function Footer() {
    const [year, setYear] = React.useState<number | null>(null);

    React.useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    const socialLinks = [
        { icon: <Mail className="h-6 w-6"/>, href: "mailto:work.aadityakumar@gmail.com", "aria-label": "Email", target: "_self" },
        { icon: <Linkedin className="h-6 w-6"/>, href: "https://www.linkedin.com/in/aadityakr/", "aria-label": "LinkedIn", target: "_blank" },
        { icon: <Github className="h-6 w-6"/>, href: "https://github.com/AadityaGeek/", "aria-label": "GitHub", target: "_blank" },
        { icon: <Instagram className="h-6 w-6"/>, href: "https://Instagram.com/aadityakr_/", "aria-label": "Instagram", target: "_blank" },
    ];

    return (
        <footer id="contact" className="bg-card border-t py-8">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
                <div className="text-sm text-muted-foreground flex flex-col sm:flex-row items-center gap-1 sm:gap-2 order-2 md:order-1">
                    <span>&copy; {year || new Date().getFullYear()} GradeX. All rights reserved.</span>
                    <span className="hidden sm:inline">|</span>
                    <span>Designed by Aaditya</span>
                </div>
                <div className="flex items-center space-x-1 order-1 md:order-2">
                    {socialLinks.map((link) => (
                        <Button key={link.href} variant="ghost" asChild className="p-2">
                           <Link 
                             href={link.href} 
                             aria-label={link['aria-label']}
                             target={link.target}
                             rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                           >
                             {link.icon}
                           </Link>
                        </Button>
                    ))}
                </div>
            </div>
        </footer>
    );
}
