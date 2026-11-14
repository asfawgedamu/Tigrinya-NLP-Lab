import React from 'react';

interface SocialBadgesProps {
  className?: string;
}

export const SocialBadges: React.FC<SocialBadgesProps> = ({ className = '' }) => {
  const mailtoLink = `mailto:asfawg@gmail.com?subject=${encodeURIComponent(
    'Inquiry from Portfolio'
  )}&body=${encodeURIComponent(
    'Hi Asfaw,\n\nI visited your portfolio and would like to connect regarding...'
  )}`;

  return (
    <div 
      className={`flex flex-wrap items-center gap-2 ${className}`}
      role="group" 
      aria-label="Contact links"
    >
      {/* LinkedIn Badge */}
      <a 
        href="https://linkedin.com/in/asfawgedamu" 
        target="_blank" 
        rel="noopener noreferrer"
        className="transition-transform hover:-translate-y-0.5"
        title="Connect on LinkedIn"
      >
        <img 
          src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" 
          alt="LinkedIn" 
          className="h-7 rounded-[4px] shadow-2xs"
        />
      </a>

      {/* GitHub Badge */}
      <a 
        href="https://github.com/asfawgedamu" 
        target="_blank" 
        rel="noopener noreferrer"
        className="transition-transform hover:-translate-y-0.5"
        title="View GitHub Repositories"
      >
        <img 
          src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" 
          alt="GitHub" 
          className="h-7 rounded-[4px] shadow-2xs"
        />
      </a>

      {/* Email Badge (triggers mailto, takes user into email app without displaying raw email text) */}
      <a 
        href={mailtoLink}
        className="transition-transform hover:-translate-y-0.5 cursor-pointer"
        title="Launch email app to contact Asfaw"
      >
        <img 
          src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" 
          alt="Email" 
          className="h-7 rounded-[4px] shadow-2xs"
        />
      </a>
    </div>
  );
};
