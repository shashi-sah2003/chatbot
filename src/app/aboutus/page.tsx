"use client";
import React from "react";
import Image from "next/image";
import { FaGithub, FaLinkedin, FaArrowRight } from "react-icons/fa";
import type { StaticImageData } from "next/image";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import anmol from "../../assets/anmol.png";
import shashi from "../../assets/shashi.png";
import arpit from "../../assets/arpit.png";
import abhishek from "../../assets/abhishek.png";

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
    <BackgroundGradient className="rounded-xl w-full p-4 sm:p-10 bg-gray-400 dark:bg-zinc-900 shadow-lg">
  <div className="flex flex-col items-center">
    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-2">
      <Image
        src={image}
        alt={`Profile picture of ${name}`}
        fill
        className="object-cover"
      />
    </div>
        <h3 className="text-lg sm:text-xl text-black dark:text-neutral-200 font-bold mt-4 mb-2">
          {name}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 text-center">
          {description}
        </p>
        <div className="flex items-center gap-4">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub profile of ${name}`}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
          >
            <FaGithub size={24} />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LinkedIn profile of ${name}`}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
          >
            <FaLinkedin size={24} />
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
      "Front-end developer passionate about creating seamless user experiences with React and Next.js.",
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
];

const AboutUs = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Mobile Swiper View */}
        <div className="md:hidden">
          <div className="flex items-center justify-center space-x-2 mb-4 text-white dark:text-neutral-200">
            <span>Swipe right-left to see more</span>
            <FaArrowRight aria-hidden="true" />
          </div>
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex-shrink-0 w-full snap-center">
                <TeamCard {...member} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamCard key={index} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
