import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const menuCategories = [
{
  title: "Breakfast",
  items: [
  { name: "Classic Bacon, Egg & Cheese", price: "$7.99", desc: "On your choice of bagel, roll, or toast" },
  { name: "Lox & Cream Cheese Bagel", price: "$12.99", desc: "Nova lox, cream cheese, capers, red onion" },
  { name: "Avocado Toast", price: "$9.99", desc: "Smashed avocado, everything seasoning, poached egg" },
  { name: "French Toast Platter", price: "$10.99", desc: "Thick-cut brioche, maple syrup, fresh berries" }]

},
{
  title: "Signature Sandwiches",
  items: [
  { name: "The Brickstreet Club", price: "$13.99", desc: "Turkey, bacon, ham, swiss, lettuce, tomato, mayo" },
  { name: "Italian Hero", price: "$14.99", desc: "Capicola, salami, prosciutto, provolone, oil & vinegar" },
  { name: "Reuben", price: "$14.99", desc: "House-cured corned beef, sauerkraut, swiss, Russian dressing" },
  { name: "Turkey Cranberry Melt", price: "$12.99", desc: "Roast turkey, brie, cranberry, arugula on ciabatta" }]

},
{
  title: "Fresh Salads",
  items: [
  { name: "Classic Caesar", price: "$10.99", desc: "Romaine, parmesan, croutons, house Caesar dressing" },
  { name: "Greek Salad", price: "$11.99", desc: "Mixed greens, feta, olives, cucumber, tomato, red onion" },
  { name: "Cobb Salad", price: "$13.99", desc: "Grilled chicken, bacon, egg, avocado, blue cheese" },
  { name: "Harvest Bowl", price: "$12.99", desc: "Quinoa, roasted vegetables, goat cheese, balsamic" }]

}];


export default function Menu({ images }) {
  return (
    <section id="menu" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16">
          
          <span className="text-slate-800 mb-4 text-sm font-body uppercase tracking-widest inline-block">WHAT WE SERVE</span>
          <h2 className="text-slate-800 mb-6 text-4xl font-bold md:text-5xl">Our Menu</h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Made fresh daily with quality ingredients you can taste
          </p>
        </motion.div>

        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {images.map((img, idx) =>
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="aspect-square rounded-2xl overflow-hidden shadow-lg">
            
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>
          )}
        </div>

        {/* Menu Categories */}
        <div className="grid md:grid-cols-3 gap-8">
          {menuCategories.map((category, catIdx) =>
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIdx * 0.1 }}>
            
              <Card className="bg-slate-200 text-card-foreground rounded-xl border shadow h-full border-border">
                <CardContent className="p-6">
                  <h3 className="text-blue-950 mb-6 pb-4 text-2xl font-normal border-b border-border">
                    {category.title}
                  </h3>
                  <div className="space-y-6">
                    {category.items.map((item, idx) =>
                  <div key={idx}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-body font-medium text-foreground">{item.name}</span>
                          <span className="font-body font-semibold text-primary ml-2">{item.price}</span>
                        </div>
                        <p className="font-body text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                  )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}