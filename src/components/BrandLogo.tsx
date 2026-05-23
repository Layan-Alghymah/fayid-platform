import { Link } from "wouter";

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className = "h-10 w-auto" }: BrandLogoProps) {
  const base = import.meta.env.BASE_URL;

  return (
    <Link href="/" className="flex-shrink-0 flex items-center" aria-label="الرئيسية — فائض">
      {/* Dark mode — light logo on dark navbar */}
      <img
        src={`${base}logo-dark-landscape.png`}
        alt="فائض"
        className={`${className} hidden dark:block`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = `${base}logo-dark.png`;
        }}
      />
      {/* Light mode — use logo-light.png */}
      <img
        src={`${base}logo-light.png`}
        alt="فائض"
        className={`${className} block dark:hidden`}
      />
    </Link>
  );
}
