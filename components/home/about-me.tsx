"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function AboutMe() {
  return (
    <section className="py-12 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            About Me
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
            Get to know more about my journey and expertise
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 space-y-4">
              <p className="text-lg text-muted-foreground">
                I&apos;m a passionate developer with a strong foundation in frontend and backend technologies, currently pursuing a BSc (Hons) in Creative Computing at Bath Spa University.
              </p>
              <p className="text-lg text-muted-foreground">
                With over two years of experience in Python and more than a year in HTML and CSS, I&apos;ve built dynamic, user-friendly applications and websites. I&apos;m enthusiastic about crafting clean, responsive designs with a focus on great UI/UX.
              </p>
              <p className="text-lg text-muted-foreground">
                Recently, I&apos;ve started expanding my skills into JavaScript and Android app development using Kotlin, aiming to build robust cross-platform experiences. I&apos;m also deeply interested in Machine Learning and continually learning how to integrate intelligent systems into web and mobile solutions.
              </p>
              
              <div className="flex justify-center mt-6">
                <Button asChild size="lg">
                  <Link href="/about">
                    Learn More About Me
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}