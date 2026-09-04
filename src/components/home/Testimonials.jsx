// src/components/home/Testimonials.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    id: 1,
    name: 'Ahmed Khan',
    role: 'Food Lover 🇵🇰',
    image: 'https://i.pravatar.cc/100?img=1',
    rating: 5,
    text: 'Absolutely amazing desi food delivery service! The biryani arrived hot and fresh. Highly recommend!',
  },
  {
    id: 2,
    name: 'Fatima Ali',
    role: 'Regular Customer',
    image: 'https://i.pravatar.cc/100?img=2',
    rating: 5,
    text: 'Best food delivery platform for Pakistani cuisine. Great selection of restaurants and fast delivery.',
  },
  {
    id: 3,
    name: 'Usman Malik',
    role: 'Food Enthusiast',
    image: 'https://i.pravatar.cc/100?img=3',
    rating: 4,
    text: 'Love the variety of desi cuisines available. The app is easy to use and the food is always delicious.',
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-200">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            🇵🇰 What Our Customers Say
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Real reviews from real people who love our desi service
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                  />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;