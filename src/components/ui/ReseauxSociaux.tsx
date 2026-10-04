import React from "react";
type SocialItem = {
  name: string;
  link: string;
  bg: string;
  icon: React.ReactNode;
};

import { FaInstagram, FaWhatsapp, FaRedditAlien } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


const socials: SocialItem[] = [
  {
    name: "Instagram",
    link: "https://www.instagram.com/toursmarrakechdesert/",
    bg: "bg-gradient-to-tr from-[#833AB4] via-[#E1306C] to-[#FCAF45]",
    icon: <FaInstagram aria-hidden="true" />,
  },
  {
    name: "WhatsApp",
    link: "https://wa.me/212704572370",
    bg: "bg-[#25D366]",
    icon: <FaWhatsapp aria-hidden="true" />,
  },
  {
    name: "Reddit",
    link: "https://www.reddit.com/user/toursmarrakechdesert/",
    bg: "bg-[#FF4500]",
    icon: <FaRedditAlien aria-hidden="true" />,
  },
  {
    name: "X",
    link: "https://x.com/MohsineSeg92559",
    bg: "bg-black",
    icon: <FaXTwitter aria-hidden="true" />,
  },
];



function ReseauxSociaux(): React.JSX.Element {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-4 sm:gap-5">
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.link}
          title={social.name}
          aria-label={social.name}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            group flex h-11 w-11 items-center justify-center rounded-full
            text-white shadow-sm
            transition-all duration-300
            hover:-translate-y-1 hover:scale-105 hover:shadow-md
            focus:outline-non focus:ring-offset-2
            ${social.bg}
          `}
        >
          <span className="text-lg transition-transform duration-300 group-hover:scale-110">
            {social.icon}
          </span>
        </a>
      ))}
    </div>
  );
}



export default ReseauxSociaux;
