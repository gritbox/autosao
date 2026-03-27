import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 md:pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/eab4ed89f_IMG_35622.jpg"
          alt="Fresh artisan bagels"
          className="w-full h-full object-cover" />
        
        <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/50 to-background/10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl">
          
          <span className="text-slate-800 mb-4 text-sm font-body uppercase tracking-widest inline-block">NEWBURGH, NEW YORK

          </span>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6">
            Fresh. Local.
            <br />
            <span className="text-blue-900">Delicious.</span>
          </h1>
          <p className="text-slate-950 mb-8 text-lg font-body leading-relaxed md:text-xl">Handcrafted sandwiches, fresh-baked bagels, and authentic deli favorites made with love in the heart of Newburgh.


          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" onClick={() => scrollTo('menu')} className="bg-slate-900 text-primary-foreground px-8 text-lg font-medium rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow hover:bg-primary/90 h-10">
              View Our Menu
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollTo('location')} className="text-lg px-8">
              Find Us
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 text-sm font-body">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="text-slate-900 lucide lucide-map-pin w-5 h-5" />
              <span className="text-zinc-950">234 Liberty StNewburgh, NY 12550</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="text-slate-900 lucide lucide-clock w-5 h-5" />
              <span className="text-slate-900">Open Daily 6AM - 4PM</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}