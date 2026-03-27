import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className="bg-slate-900 fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2">
            <img src="/assets/164e888db_BBBBDELIIIII.png" alt="Brickstreet Deli" className="h-7 md:h-8 w-auto object-contain" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('about')} className="text-yellow-400 font-body hover:text-primary transition-colors">
              About
            </button>
            <button onClick={() => scrollTo('menu')} className="text-yellow-400 font-body hover:text-primary transition-colors">
              Menu
            </button>
            <button onClick={() => scrollTo('location')} className="text-amber-300 font-body hover:text-primary transition-colors">
              Location
            </button>
            <Button onClick={() => scrollTo('contact')} className="bg-slate-300 text-slate-800 px-4 py-2 text-sm font-medium rounded-md inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow hover:bg-primary/90 h-9 gap-2">
              <Phone className="w-4 h-4" />
              Contact Us
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}>
            
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen &&
        <div className="md:hidden pb-4 space-y-2">
            <button onClick={() => scrollTo('about')} className="block w-full text-left py-2 font-body text-foreground/80 hover:text-primary">
              About
            </button>
            <button onClick={() => scrollTo('menu')} className="block w-full text-left py-2 font-body text-foreground/80 hover:text-primary">
              Menu
            </button>
            <button onClick={() => scrollTo('location')} className="block w-full text-left py-2 font-body text-foreground/80 hover:text-primary">
              Location
            </button>
            <Button onClick={() => scrollTo('contact')} className="w-full gap-2 mt-2">
              <Phone className="w-4 h-4" />
              Contact Us
            </Button>
          </div>
        }
      </div>
    </nav>);

}