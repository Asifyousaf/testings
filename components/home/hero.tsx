// components/home/hero.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { socialLinks } from "@/data/social";

export function Hero() {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const displayedSkills = [
    "Front End Developer",
    "Web Developer",
    "App Developer",
    "UI/UX Designer"
  ];

  // Parallax effect setup
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, 250]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkillIndex((prevIndex) => (prevIndex + 1) % displayedSkills.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Get icon component for social links
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "github":
        return <Github className="h-5 w-5" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5" />;
      case "twitter":
        return <Twitter className="h-5 w-5" />;
      case "mail":
        return <Mail className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <section className="relative py-12 md:py-24 overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div 
            className="flex flex-col justify-center space-y-4"
            style={{ y: y1 }}
          >
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Hi, I&apos;m Asif Yousaf
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-12"
              >
                <div className="relative overflow-hidden h-full flex items-center">
                  {displayedSkills.map((skill, index) => (
                    <div
                      key={skill}
                      className={`absolute transition-all duration-500 transform ${
                        index === currentSkillIndex
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-0"
                      }`}
                    >
                      <h2 className="text-2xl font-semibold text-primary sm:text-3xl">
                        {skill}
                      </h2>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-[600px] text-muted-foreground md:text-xl"
              >
                A passionate developer with expertise in web development, mobile app development,
                and UI/UX design. Currently focused on creating modern and responsive web applications.
              </motion.p>
            </div>
            
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Button asChild size="lg" className="group">
                <a href="#projects">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a 
                  href="https://github.com/Asifyousaf/MyPortfolio.github.io/raw/main/Asif%20CV.pdf" 
                  download="Asif_CV.pdf" 
                  target="_blank"                      
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Resume
                </a>
              </Button>
            </motion.div>
            
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-3 pt-2"
            >
              {socialLinks.map((social) => (
                <motion.div
                  key={social.id}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="rounded-full bg-muted/50 hover:bg-primary/10"
                  >
                    <a 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={social.name}
                    >
                      {getIconComponent(social.icon)}
                    </a>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}