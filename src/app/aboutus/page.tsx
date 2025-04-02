"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { FaGithub, FaLinkedin, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { StaticImageData } from "next/image";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import anmol from "../../assets/anmol.png";
import shashi from "../../assets/shashi.png";
import arpit from "../../assets/arpit.png";
import abhishek from "../../assets/abhishek.png";
import aditya from "../../assets/aditya.png";

// Reusable TeamCard component with consistent design and accessibility
interface TeamCardProps {
  name: string;
  image: StaticImageData;
  description: string;
  githubUrl: string;
  linkedinUrl: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  name,
  image,
  description,
  githubUrl,
  linkedinUrl,
}) => {
  return (
    <BackgroundGradient className="rounded-xl w-full h-full p-4 sm:p-6 bg-gray-400 dark:bg-zinc-900 shadow-lg transition-transform hover:scale-105">
      <div className="flex flex-col items-center h-full">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-3 border-2 border-gray-100 dark:border-zinc-700 shadow-md">
          <Image
            src={image}
            alt={`Profile picture of ${name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority
          />
        </div>
        <h3 className="text-lg sm:text-xl text-black dark:text-neutral-200 font-bold mt-2 mb-2 text-center">
          {name}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 text-center flex-grow">
          {description}
        </p>
        <div className="flex items-center gap-4 mt-auto">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub profile of ${name}`}
            className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            <FaGithub size={22} />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LinkedIn profile of ${name}`}
            className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            <FaLinkedin size={22} />
          </a>
        </div>
      </div>
    </BackgroundGradient>
  );
};

const teamMembers = [
  {
    name: "Anmol Bhardwaj",
    image: anmol,
    description:
      "Specializes in backend development and building AI/ML applications. Upcoming Uber summer intern.",
    githubUrl: "https://github.com/anmol-2003",
    linkedinUrl: "https://www.linkedin.com/in/anmol-bhardwaj-55374321a",
  },
  {
    name: "Arpit Karn",
    image: arpit,
    description:
      "Full Stack Developer and GenAI enthusiast, passionate about crafting creative apps with React and AI.",
    githubUrl: "https://github.com/arpit7257",
    linkedinUrl: "https://www.linkedin.com/in/arpit-karn-b047b3256/",
  },
  {
    name: "Shashi Sah",
    image: shashi,
    description:
      "Full-stack developer who loves coding, solving problems, and building amazing apps. AI ML enthusiast!",
    githubUrl: "https://github.com/shashi-sah2003",
    linkedinUrl: "https://www.linkedin.com/in/shashi-sah-56aa77175/",
  },
  {
    name: "Abhishek Shah",
    image: abhishek,
    description:
      "Software developer specialized in building web applications using React, Next.js, and Tailwind CSS.",
    githubUrl: "https://github.com/Abhishek-2610",
    linkedinUrl: "https://www.linkedin.com/in/abhishek-shah-3262ba275",
  },
  {
    name: "Aditya Kumar",
    image: aditya,
    description:
      "Specialises in development for embedded systems and cloud infrastructure. Upcoming intern at Microsoft.",
    githubUrl: "https://github.com/ryuukumar",
    linkedinUrl: "https://www.linkedin.com/in/kumar-aditya-ashokovich/",
  },
];

const AboutUs = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-4">
        {/* Mobile Carousel View */}
        <div className="md:hidden mb-10 relative">
          <div className="relative">
            <div 
              ref={sliderRef} 
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {teamMembers.map((member, index) => (
                <div key={index} className="flex-shrink-0 w-[85%] snap-center">
                  <TeamCard {...member} />
                </div>
              ))}
            </div>
            
            {/* Navigation buttons */}
            <button 
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-zinc-800 rounded-full p-2 shadow-lg z-10 opacity-80 hover:opacity-100 focus:outline-none"
              aria-label="Previous team member"
            >
              <FaChevronLeft className="text-gray-700 dark:text-gray-300" />
            </button>
            <button 
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-zinc-800 rounded-full p-2 shadow-lg z-10 opacity-80 hover:opacity-100 focus:outline-none"
              aria-label="Next team member"
            >
              <FaChevronRight className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-4 gap-2">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (sliderRef.current) {
                    const cardWidth = sliderRef.current.clientWidth * 0.85;
                    sliderRef.current.scrollTo({ 
                      left: cardWidth * index + (index * 16), // 16px is the gap
                      behavior: 'smooth' 
                    });
                  }
                }}
                className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700 focus:outline-none"
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Tablet (2 columns) to Desktop (3-5 columns) Grid View */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-10">
          {teamMembers.map((member, index) => (
            <div key={index} className="h-full flex">
              <TeamCard {...member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Add this CSS to hide scrollbar but maintain functionality
const CustomStyles = () => (
  <style jsx global>{`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
  `}</style>
);

export default function AboutUsPage() {
  return (
    <>
      <CustomStyles />
      <AboutUs />
    </>
  );
}