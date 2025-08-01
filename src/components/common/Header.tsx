"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import NavLink from "./header/NavLink";
import MobileMenu from "./header/MobileMenu";
import { HoverHighlight } from "./HoverHighlight";
import { LogoLink } from "./header/LogoLink";
import { LandingImage } from "./header/LandingImage";
import { Button } from "../ui/Button";
import Link from "next/link";

const navItems = [
  {
    href: "https://app.triggerx.network/devhub",
    label: "Dev Hub",
    target: "_blank",
  },
  {
    href: "https://app.triggerx.network/dashboard",
    label: "Dashboard",
    target: "_blank",
  },
  {
    href: "https://app.triggerx.network/leaderboard",
    label: "Leaderboard",
    target: "_blank",
  },
];

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Initial check
    checkScreenSize();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <header className="fixed top-0 left-0 right-0 w-full headerbg bg-[#0a0a0a]/80 backdrop-blur-md z-50">
        <div className="w-[90%] mx-auto my-6 md:my-8 h-16"></div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 w-full headerbg bg-[#0a0a0a]/80 backdrop-blur-md z-50">
      {isDesktop ? (
        /* Desktop Header */
        <div className="w-[90%] mx-auto my-6 md:my-8 header flex items-center justify-between">
          <div className="w-[170px]">
            <LogoLink
              width={180}
              height={40}
              className="w-[140px] xl:w-[170px] h-auto"
              priority={true}
            />
          </div>

          <div className="relative">
            <div
              className="absolute z-0 w-[500px] h-max transition-all duration-700 ease-out"
              style={{
                top: isScrolled ? -300 : -50,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <LandingImage
                alt="Navigation Background Design"
                width={658}
                height={386}
                priority={!isScrolled} // Only prioritize when visible
              />
            </div>

            <nav className="relative bg-[#181818F0] rounded-xl z-10">
              <HoverHighlight>
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    isActive={pathname === item.href}
                    className="text-center xl:w-[150px] lg:w-[110px] lg:text-[12px] xl:text-base text-gray-200 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                    target={item.target}
                  />
                ))}
              </HoverHighlight>
            </nav>
          </div>

          <div className=" items-center gap-3  ">
            <Link href="https://app.triggerx.network/" target="_blank">
              <Button color="yellow" className="w-[150px]">
                Get App
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Mobile Header */
        <div className="w-[90%] mx-auto flex justify-between items-center my-6 header">
          <div className="flex-shrink-0 relative z-10 w-[120px] sm:w-[140px] md:w-[170px] h-max">
            <LogoLink
              width={130}
              height={30}
              className="w-[170px] h-auto"
              priority={true}
            />
          </div>

          <div className="absolute left-[calc(50%-90px)] sm:left-[calc(50%-120px)] -top-3 sm:-top-7 w-[180px] sm:w-[240px]">
            <LandingImage
              alt="Mobile Navigation Background"
              width={256}
              height={100}
              priority={true}
            />
          </div>

          <div className="relative flex items-center gap-2 md:gap-4 z-10">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white text-xl sm:text-2xl focus:outline-none mt-1 md:mt-2"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? "✖" : "☰"}
            </button>
            <MobileMenu
              isOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
              navItems={navItems}
              currentPath={pathname}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
