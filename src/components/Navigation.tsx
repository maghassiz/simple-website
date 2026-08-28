import { useEffect, useRef, useState } from 'react';
import { asset } from '../lib/cdn';

// TODO: hrefs are placeholders until the corresponding pages exist
// (Figma has Resources as a distinct page — route will follow once it's built).
const LINKS = [
  { label: 'Booking engine', href: '/booking-engine', badge: 'New' },
  { label: 'Custom website', href: '/custom-website' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About us', href: '/about-us' },
  { label: 'Resources', href: '#' },
  { label: 'Contact us', href: '/contact-us' },
];

// Local mirror of shared/Button.astro's prop shape (styles kept in sync by
// hand) -- kept separate since Astro components can't be imported into a
// React island.
const VARIANT_STYLES = {
  primary: 'bg-yellow text-navy hover:bg-brand hover:text-background',
  secondary: 'bg-background text-navy hover:bg-navy hover:text-background',
  dark: 'bg-navy text-background hover:bg-background hover:text-navy hover:border-navy',
};

function CtaPill({
  href,
  label,
  icon,
  variant,
  padding = 'pl-4 pr-5 py-3',
  gap = 'gap-3',
  iconSize = 'size-5',
  textSize = 'text-body-md',
  className = '',
}: {
  href: string;
  label: string;
  icon?: string;
  variant: 'primary' | 'secondary' | 'dark';
  padding?: string;
  gap?: string;
  iconSize?: string;
  textSize?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`${VARIANT_STYLES[variant]} flex ${gap} items-center justify-center rounded-lg border-2 border-transparent transition-colors duration-300 ${padding} ${className}`}
    >
      {icon && <img src={asset(icon)} alt="" className={iconSize} />}
      <span className={`font-body font-medium ${textSize} whitespace-nowrap`}>{label}</span>
    </a>
  );
}

// 'dark' (default) is for the gradient/dark hero backgrounds every existing
// page uses. 'light' is for pages like Blog Detail where the nav sits
// directly on the plain page background (bg-background) instead of a hero.
type NavigationProps = {
  variant?: 'dark' | 'light';
};

export default function Navigation({ variant = 'dark' }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  // Tracks whether the page has been scrolled past its hero section (marked with
  // data-hero on the hero's root element) -- only relevant for variant="dark", since
  // "light" pages have no hero to leave and are always in the light-on-white state.
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const isLight = variant === 'light' || scrolledPastHero;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Nav is fixed (out of flow), so measure its own height to reserve the
  // equivalent space where it sits in the document via the spacer below.
  useEffect(() => {
    const measure = () => setNavHeight(navRef.current?.offsetHeight ?? 0);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (variant !== 'dark') return;
    const heroEl = navRef.current?.closest('[data-hero]');
    if (!heroEl) return;
    // rootMargin pulls the observation line down by the nav's own height, so the
    // switch fires exactly when the hero has fully scrolled out from under the nav.
    const observer = new IntersectionObserver(
      ([entry]) => setScrolledPastHero(!entry.isIntersecting),
      { rootMargin: `-${navHeight}px 0px 0px 0px`, threshold: 0 }
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [variant, navHeight]);

  return (
    <>
      {/* Reserves the nav's space in normal flow now that the nav itself is fixed. */}
      <div style={navHeight ? { height: navHeight } : undefined} aria-hidden="true" />
      <nav
        ref={navRef}
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${isLight ? 'bg-background/70' : 'bg-transparent'} backdrop-blur-[18px] w-full ${isOpen ? 'max-lg:invisible' : ''}`}
      >
        <div className="flex items-center justify-between px-4 lg:px-[100px] py-4 max-w-[1440px] mx-auto">
          <a href="/" className="block h-6 w-[88px]">
            <img src={asset(isLight ? 'images/home/nav/mobile-menu-logo-dark.svg' : 'images/home/hero/hitels-logo.svg')} alt="Hitels" className="h-full w-full" />
          </a>

          <div className="flex gap-6 items-center">
            <div className="hidden lg:flex gap-6 items-center">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`group relative font-body font-medium ${isLight ? 'text-navy' : 'text-background'} text-body-sm whitespace-nowrap py-1`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 ${isLight ? 'bg-navy' : 'bg-background'}`}
                  />
                </a>
              ))}
            </div>
            {/* Book a demo stays visible on tablet (only true mobile, <768px, drops it) — confirmed against the Tablet Home frame, which keeps this button next to the hamburger */}
            <CtaPill
              href="/contact-us"
              label="Book a demo"
              icon={isLight ? 'images/home/hero/icon-calendar-nav-white.svg' : 'images/home/hero/icon-calendar-nav.svg'}
              variant={isLight ? 'dark' : 'secondary'}
              padding="pl-3 pr-4 py-2"
              gap="gap-2"
              iconSize="size-4"
              textSize="text-body-sm"
              className="hidden md:flex"
            />
            <button
              type="button"
              className="lg:hidden block relative shrink-0 size-8"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              onClick={() => setIsOpen(true)}
            >
              <img src={asset(isLight ? 'images/home/nav/mobile-nav-hamburger-navy.svg' : 'images/home/nav/mobile-nav-hamburger.svg')} alt="" className="size-full" />
            </button>
          </div>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`lg:hidden fixed inset-0 z-50 bg-background transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        <div className="backdrop-blur-[18px] flex items-center justify-between p-4 absolute top-0 left-0 w-full">
          <a href="/" className="block h-6 w-[88px]">
            <img src={asset('images/home/nav/mobile-menu-logo-dark.svg')} alt="Hitels" className="h-full w-full" />
          </a>
          <button
            type="button"
            className="relative shrink-0 size-8"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
          >
            <img src={asset('images/home/nav/mobile-menu-close.svg')} alt="" className="size-full" />
          </button>
        </div>

        <div className="flex flex-col justify-between h-full pt-[104px] px-4 pb-4">
          <div className="flex flex-col gap-5 items-start w-full">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-heading text-h3 text-navy w-full flex gap-3 items-center"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
                {link.badge && (
                  <span className="border border-brand text-navy font-body font-medium text-body-sm rounded-full px-2 py-0.5">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-10 items-start w-full">
            <div className="flex gap-6 items-center">
              <a href="#" aria-label="Instagram"><img src={asset('images/home/nav/icon-instagram.svg')} alt="" className="size-6" /></a>
              <a href="#" aria-label="Facebook"><img src={asset('images/home/nav/icon-facebook.svg')} alt="" className="size-[22px]" /></a>
              <a href="#" aria-label="LinkedIn"><img src={asset('images/home/nav/icon-linkedin.svg')} alt="" className="size-6" /></a>
            </div>
            <div className="font-heading text-h6 text-navy flex flex-col gap-5 w-full">
              <p>hi@hitels.is</p>
              <p>+354 5478001</p>
            </div>
            <CtaPill
              href="/contact-us"
              label="Book a demo"
              icon="images/home/hero/icon-calendar-cta.svg"
              variant="primary"
              padding="px-4 py-3"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}
