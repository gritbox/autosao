import React from 'react';
import { Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-heading text-2xl font-bold mb-2">Brickstreet Deli</h3>
            <p className="font-body text-background/70 text-sm">
              Fresh food, good vibes, in the heart of Newburgh.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/brickstreetdeli/"
              className="p-3 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
              aria-label="Instagram">
              
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/p/Brickstreet-Delicatessen-100054319248927/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
              aria-label="Facebook">
              
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          

          
        </div>
      </div>
    </footer>);

}