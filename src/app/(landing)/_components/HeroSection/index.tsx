"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import EPath from "@/constants/path";

function HeroSection() {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (imageRef.current) {
        if (scrollPosition > scrollThreshold) {
          imageRef.current.classList.add("scrolled");
        } else {
          imageRef.current.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="w-full pt-24 md:pt-32 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="text-4xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title">
            Your AI Career Coach for
            <br />
            Professtional Success
          </h1>
          <p className="max-w-[600px] mx-auto px-2 text-muted-foreground md:text-xl">
            Advance your career with personalized guidance, interview prep and
            AI-Powered tools for job success.
          </p>
        </div>
        <div>
          <Link href={EPath.DASHBOARD}>
            <Button size="lg" className="px-8">
              Get started
            </Button>
          </Link>
          <Link href={EPath.DASHBOARD} className="ml-3">
            <Button size="lg" variant="outline" className="px-8">
              Watch demo
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner-resume.jpeg"
              alt="banner career AI"
              width={1280}
              height={720}
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
