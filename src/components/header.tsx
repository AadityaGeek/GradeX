
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Bot, Home, Rocket, Info, Mail, Menu, X, LogOut, Loader2, Star, User as UserIcon, Diamond } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { useUser } from "@/firebase/auth/use-user";
import { useFirebase } from "@/firebase/client-provider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const navLinks = [
    { href: "/", label: "Home", icon: <Home /> },
    { href: "/generate", label: "Generate", icon: <Rocket /> },
    { href: "/pricing", label: "Pricing", icon: <Diamond /> },
    { href: "/about", label: "About", icon: <Info /> },
    { href: "/#contact", label: "Contact", icon: <Mail /> },
];

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { auth } = useFirebase();
    const { user, loading } = useUser();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isLogoutAlertOpen, setIsLogoutAlertOpen] = React.useState(false);

    React.useEffect(() => {
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

    const handleLogout = async () => {
        await auth.signOut();
        router.push('/');
        setIsLogoutAlertOpen(false);
    };


    const UserProfile = () => {
      if (loading) {
        return <Loader2 className="h-6 w-6 animate-spin" />;
      }

      if (user) {
        return (
         <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer h-8 w-8">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'}/>
                <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-transparent cursor-default">
                  <div className="flex items-center justify-between w-full">
                    <span className="flex items-center">
                        <Star className="mr-2 h-4 w-4 text-yellow-500" />
                        Credits
                    </span>
                    <span>{user.planId === 'premium' ? 'Unlimited' : user.generationsRemaining ?? 0}</span>
                  </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsLogoutAlertOpen(true)} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog open={isLogoutAlertOpen} onOpenChange={setIsLogoutAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You will be returned to the homepage. You can always log back in later.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>Log Out</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </>
        );
      }

      return (
          <Link href="/login" className={cn(buttonVariants({ variant: "outline" }))}>
              Login
          </Link>
      );
    };

    return (
        <div className="sticky top-0 z-50">
            <header className="relative w-full border-b bg-background/90 backdrop-blur-sm">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 flex items-center">
                        <Link href="/" className="mr-6 flex items-center space-x-2">
                            <Image 
                                src="/images/assets/logo.png" 
                                alt="GradeX" 
                                width={30} 
                                height={30} 
                            />
                            <span className="font-bold">GradeX</span>
                        </Link>
                    </div>
                    
                    <div className="flex flex-1 items-center justify-end space-x-4">
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

                        <UserProfile />
                        
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
              <div className="absolute top-full left-0 w-full bg-background/90 backdrop-blur-sm md:hidden animate-in fade-in-20 slide-in-from-top-4">
                <nav className="grid gap-2 p-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "transition-colors",
                        isLinkActive(link.href)
                          ? "text-foreground"
                          : "text-foreground/60 hover:text-foreground/80",
                        "justify-start"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            )}
        </div>
    );
}
