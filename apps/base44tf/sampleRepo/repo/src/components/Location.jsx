import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const carouselImages = [
{ src: "https://media.base44.com/images/public/69bde2b02104755d4ffa3e40/b1cb208e9_1.png", alt: "Brickstreet Deli interior with baked goods" },
{ src: "https://media.base44.com/images/public/69bde2b02104755d4ffa3e40/0451704f5_2.png", alt: "Brickstreet Deli exterior" },
{ src: "https://media.base44.com/images/public/69bde2b02104755d4ffa3e40/97f725998_3.png", alt: "Brickstreet Deli counter" }];


const hours = [
{ day: "Monday - Friday", time: "6:30 AM - 6:00 PM" },
{ day: "Saturday", time: "6:30 AM - 3:00 PM" },
{ day: "Sunday", time: "Closed" }];


function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % carouselImages.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl" style={{ height: '420px' }}>
      {carouselImages.map((img, idx) =>
      <img
        key={idx}
        src={img.src}
        alt={img.alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === current ? 'opacity-100' : 'opacity-0'}`} />

      )}
      <button onClick={() => setCurrent((c) => (c - 1 + carouselImages.length) % carouselImages.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => setCurrent((c) => (c + 1) % carouselImages.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors">
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {carouselImages.map((_, idx) =>
        <button key={idx} onClick={() => setCurrent(idx)} className={`w-2 h-2 rounded-full transition-colors ${idx === current ? 'bg-white' : 'bg-white/40'}`} />
        )}
      </div>
    </div>);

}

export default function Location() {
  return (
    <section id="location" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="my-20 px-3 text-center">
          
          
          <span className="text-slate-900 mb-2 text-sm font-body uppercase tracking-widest inline-block">VISIT US</span>
          <Carousel />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-lg h-[400px]">
            
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47574.89447729753!2d-74.05399044999999!3d41.50362825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2d2b12dbce5e1%3A0xb24d2e7cf23aab!2sNewburgh%2C%20NY!5e0!3m2!1sen!2sus!4v1679900000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Brickstreet Deli Location" />
            
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6">
            
            <Card className="bg-card border-border">
              <CardContent className="bg-slate-300 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-400 p-3 rounded-full">
                    <MapPin className="text-slate-200 lucide lucide-map-pin w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-slate-950 mb-2 text-xl font-bold">Address</h3>
                    <p className="text-slate-950 font-body">234 Liberty St
Newburgh, NY 12550
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="bg-slate-300 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-400 p-3 rounded-full">
                    <Clock className="text-slate-100 lucide lucide-clock w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-bold text-foreground mb-3">Hours</h3>
                    <div className="space-y-2">
                      {hours.map((h, idx) =>
                      <div key={idx} className="flex justify-between font-body">
                          <span className="text-slate-950 font-semibold">{h.day}</span>
                          <span className="text-foreground font-medium">{h.time}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card id="contact" className="bg-card border-border">
              <CardContent className="bg-slate-300 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-400 p-3 rounded-full">
                    <Phone className="text-slate-100 lucide lucide-phone w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2">Contact</h3>
                    <p className="font-body text-muted-foreground">
                      <a href="tel:+18455610178" className="hover:text-primary transition-colors">
                        (845) 561-0178
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>);

}