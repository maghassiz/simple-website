import { useEffect, useState } from 'react';
import { asset } from '../lib/cdn';

// TODO: hrefs are placeholders until the corresponding pages exist
// (Figma has About Us, Pricing, and Contact Us as distinct pages — routes
// will follow once those are built).
const LINKS = [
  { label: 'Booking engine', href: '/booking-engine', badge: 'New' },
  { label: 'Custom website', href: '/custom-website' },
  { label: 'Pricing', href: '#' },
  { label: 'About us', href: '#' },
  { label: 'Resources', href: '#' },
  { label: 'Contact us', href: '#' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      <nav
        className={`backdrop-blur-[18px] flex items-center justify-between px-4 lg:px-[100px] py-4 relative w-full ${isOpen ? 'max-lg:invisible' : ''}`}
      >
        <a href="/" className="block h-6 w-[88px]">
          <img src={asset('images/home/hero/hitels-logo.svg')} alt="Hitels" className="h-full w-full" />
        </a>

        <div className="flex gap-6 items-center">
          <div className="hidden lg:flex gap-6 items-center">
            {LINKS.map((link) => (
              <a key={link.label} href={link.href} className="font-body font-medium text-background text-body-sm whitespace-nowrap">
                {link.label}
              </a>
            ))}
          </div>
          {/* Book a demo stays visible on tablet (only true mobile, <768px, drops it) — confirmed against the Tablet Home frame, which keeps this button next to the hamburger */}
          <a href="#" className="hidden md:flex bg-background gap-2 items-center rounded-lg pl-3 pr-4 py-2">
            <img src={asset('images/home/hero/icon-calendar-nav.svg')} alt="" className="size-4" />
            <span className="font-body font-medium text-navy text-body-sm whitespace-nowrap">Book a demo</span>
          </a>
          <button
            type="button"
            className="lg:hidden block relative shrink-0 size-8"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            onClick={() => setIsOpen(true)}
          >
            <img src={asset('images/home/nav/mobile-nav-hamburger.svg')} alt="" className="size-full" />
          </button>
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
            <a href="#" className="bg-yellow flex gap-3 items-center justify-center rounded-lg px-4 py-3 w-full">
              <img src={asset('images/home/hero/icon-calendar-cta.svg')} alt="" className="size-5" />
              <span className="font-body font-medium text-navy text-body-md whitespace-nowrap">Book a demo</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
