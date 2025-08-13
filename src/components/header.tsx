
"use client";

import * as React from "react";
import Link from "next/link";
import { Bot, Home, Rocket, Info, Mail, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";

const navLinks = [
    { href: "/", label: "Home", icon: <Home /> },
    { href: "/generate", label: "Generate", icon: <Rocket /> },
    { href: "/about", label: "About", icon: <Info /> },
    { href: "/#contact", label: "Contact", icon: <Mail /> },
];

export function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    React.useEffect(() => {
        // This effect closes the menu when the route changes.
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const isLinkActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }
        if (href.startsWith("/#")) {
            return false;
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="sticky top-0 z-50">
            <header className="relative w-full border-b bg-background/90 backdrop-blur-sm">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 flex items-center">
                        <Link href="/" className="mr-6 flex items-center space-x-2">
                            <Bot className="h-6 w-6 text-primary" />
                            <span className="font-bold">GradeX</span>
                        </Link>
                    </div>
                    
                    <div className="flex flex-1 items-center justify-end space-x-2">
                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center space-x-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        buttonVariants({ variant: "ghost" }),
                                        "transition-colors",
                                        isLinkActive(link.href)
                                            ? "text-foreground"
                                            : "text-foreground/60 hover:text-foreground/80"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Nav */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
                    <div className="container py-4">
                         <nav className="flex flex-col space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={cn(
                                        buttonVariants({ variant: "ghost" }),
                                        "w-full justify-start transition-colors text-foreground/80"
                                    )}
                                    aria-label={link.label}
                                >
                                    {link.icon}
                                    <span className="ml-2">{link.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}
