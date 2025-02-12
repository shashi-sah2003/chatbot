"use client";
import React from "react";
import Image from "next/image";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import anmol from "../../assets/anmol.png";
import shashi from "../../assets/shashi.png";
import arpit from "../../assets/arpit.png";
import abhishek from "../../assets/abhishek.png";
import { FaArrowRight } from "react-icons/fa";

const page = () => {
  return (
    <div className="min-h-screen pt-[40px]">
      {/* Mobile Carousel (visible on mobile only) */}
      <div className="md:hidden">
        <div className="text-white flex items-center justify-center space-x-2">
          <div>swipe right to see more</div>
          <FaArrowRight />
        </div>

        <div className="flex gap-6 p-4 overflow-x-auto snap-x snap-mandatory">
          {/* Card 1 */}
          <div className="flex-shrink-0 w-full snap-center">
            <BackgroundGradient className="rounded-[22px] w-full p-4 sm:p-8 bg-gray-400 dark:bg-zinc-900">
              <Image
                src={anmol}
                alt="Profile Picture"
                height={400}
                width={400}
                className="object-contain"
              />
              <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 font-bold">
                Anmol Bhardwaj
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                I specialize in backend development and building AI/ML
                applications. Excited about my upcoming Uber summer internship!
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/anmol-2003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
                >
                  <FaGithub size={24} />
                </a>
                <a
                  href="https://www.linkedin.com/in/anmol-bhardwaj-55374321a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
                >
                  <FaLinkedin size={24} />
                </a>
              </div>
            </BackgroundGradient>
          </div>

          {/* Card 2 */}
          <div className="flex-shrink-0 w-full snap-center">
            <BackgroundGradient className="rounded-[22px] w-full p-4 sm:p-8 bg-gray-400 dark:bg-zinc-900">
              <Image
                src={arpit}
                alt="Profile Picture"
                height={400}
                width={400}
                className="object-contain"
              />
              <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 font-bold">
                Arpit Karn
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Front-end developer passionate about creating seamless user
                experiences with React and Next.js.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/arpit7257"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
                >
                  <FaGithub size={24} />
                </a>
                <a
                  href="https://www.linkedin.com/in/arpit-karn-b047b3256/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
                >
                  <FaLinkedin size={24} />
                </a>
              </div>
            </BackgroundGradient>
          </div>

          {/* Card 3 */}
          <div className="flex-shrink-0 w-full snap-center">
            <BackgroundGradient className="rounded-[22px] w-full p-4 sm:p-8 bg-gray-400 dark:bg-zinc-900">
              <Image
                src={shashi}
                alt="Profile Picture"
                height={400}
                width={400}
                className="object-contain"
              />
              <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 font-bold">
                Shashi Sah
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Full-stack developer who loves coding, solving problems, and
                building amazing apps. AI ML enthusiast!
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/shashi-sah2003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
                >
                  <FaGithub size={24} />
                </a>
                <a
                  href="https://www.linkedin.com/in/shashi-sah-56aa77175"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
                >
                  <FaLinkedin size={24} />
                </a>
              </div>
            </BackgroundGradient>
          </div>

          {/* Card 4 */}
          <div className="flex-shrink-0 w-full snap-center">
            <BackgroundGradient className="rounded-[22px] w-full p-4 sm:p-8 bg-gray-400 dark:bg-zinc-900">
              <Image
                src={abhishek}
                alt="Profile Picture"
                height={400}
                width={400}
                className="object-contain"
              />
              <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 font-bold">
                Abhishek Shah
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                I'm a software developer specialized in building web
                applications using React, Next.js, and Tailwind CSS.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/Abhishek-2610"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
                >
                  <FaGithub size={24} />
                </a>
                <a
                  href="https://www.linkedin.com/in/abhishek-shah-3262ba275"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
                >
                  <FaLinkedin size={24} />
                </a>
              </div>
            </BackgroundGradient>
          </div>
        </div>
      </div>

      {/* Desktop Grid (visible on md and larger screens) */}
      <div className="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-6 p-4">
        {/* Card 1 */}
        <BackgroundGradient className="rounded-[22px] max-w-sm mx-auto p-4 sm:p-8 bg-gray-400 dark:bg-zinc-900">
          <Image
            src={anmol}
            alt="Profile Picture"
            height={800}
            width={400}
            className="object-contain"
          />
          <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 font-bold">
            Anmol Bhardwaj
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            I specialize in backend development and building AI/ML applications.
            Excited about my upcoming Uber summer internship!
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/anmol-2003"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/anmol-bhardwaj-55374321a"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </BackgroundGradient>

        {/* Card 2 */}
        <BackgroundGradient className="rounded-[22px] max-w-sm mx-auto p-4 sm:p-8 bg-gray-400 dark:bg-zinc-900">
          <Image
            src={arpit}
            alt="Profile Picture"
            height={400}
            width={400}
            className="object-contain"
          />
          <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 font-bold">
            Arpit Karn
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Front-end developer passionate about creating seamless user
            experiences with React and Next.js.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/arpit7257"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/arpit-karn-b047b3256/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </BackgroundGradient>

        {/* Card 3 */}
        <BackgroundGradient className="rounded-[22px] max-w-sm mx-auto p-4 sm:p-8 bg-gray-400 dark:bg-zinc-900">
          <Image
            src={shashi}
            alt="Profile Picture"
            height={400}
            width={400}
            className="object-contain"
          />
          <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 font-bold">
            Shashi Sah
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Full-stack developer who loves coding, solving problems, and
            building amazing apps. AI ML enthusiast!
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/shashi-sah2003"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/shashi-sah-56aa77175/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </BackgroundGradient>

        {/* Card 4 */}
        <BackgroundGradient className="rounded-[22px] max-w-sm mx-auto p-4 sm:p-8 bg-gray-400 dark:bg-zinc-900">
          <Image
            src={abhishek}
            alt="Profile Picture"
            height={400}
            width={400}
            className="object-contain"
          />
          <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 font-bold">
            Abhishek Shah
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            I'm a software developer specialized in building web applications
            using React, Next.js, and Tailwind CSS.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Abhishek-2610"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/abhishek-shah-3262ba275"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </BackgroundGradient>
      </div>
    </div>
  );
};

export default page;
