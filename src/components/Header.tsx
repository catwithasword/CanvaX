"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

interface HeaderProps {
  onSignInClick?: () => void;
  isAuthenticated?: boolean;
}

export const Header = ({ onSignInClick, isAuthenticated = false }: HeaderProps) => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const navLinks = [
    { path: "/create", label: "Create" },
    { path: "/marketplace", label: "Marketplace" },
    { path: "/collection", label: "My Collection" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size={32} />
            <span className="font-semibold text-lg">CanvaX</span>
          </Link>

          <nav className="flex items-center gap-8">
            {/* Navigation links - always visible (bypassing authentication) */}
            {!isHome && (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`text-sm font-medium transition-colors hover:text-foreground ${
                      pathname === link.path
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}
            
            {isHome && (
              <Button
                onClick={onSignInClick}
                className="rounded-full px-6 hover-invert"
              >
                Sign In to Start
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
