import React from 'react';
import { motion } from 'framer-motion';

export default function About({ interiorImage }) {
  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            
            <span className="text-slate-800 mb-4 text-sm font-medium uppercase tracking-widest inline-block">OUR STORY

            </span>
            <h2 className="text-slate-800 mb-6 text-2xl font-bold md:text-5xl">A Neighborhood Tradition

            </h2>
            <p className="font-body text-lg text-muted-foreground mb-6 leading-relaxed">
              Brickstreet Deli has been a cornerstone of the Newburgh community, serving 
              up classic deli favorites and fresh-baked goods that bring people together.
            </p>
            <p className="font-body text-lg text-muted-foreground mb-6 leading-relaxed">
              We believe in using only the freshest ingredients, sourced locally whenever 
              possible. From our hand-rolled bagels to our signature sandwiches piled 
              high with premium meats and cheeses, every bite tells our story of quality 
              and craftsmanship.
            </p>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Whether you're grabbing a quick breakfast on your way to work or sitting 
              down for lunch with friends, we're here to make your day a little brighter.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative">
            
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={interiorImage}
                alt="Inside Brickstreet Deli"
                className="w-full h-full object-cover" />
              
            </div>
            <div className="bg-slate-700 text-primary-foreground p-6 rounded-xl absolute -bottom-6 -left-6 shadow-lg">
              <p className="font-heading text-3xl font-bold">Est. 2010</p>
              <p className="font-body text-sm opacity-90">Serving Newburgh</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}