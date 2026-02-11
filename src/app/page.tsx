"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { useEffect } from "react";
import Lenis from "lenis";
import AOS from "aos";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "aos/dist/aos.css";
import Image from "next/image";

export default function HomePage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  const heroSlides = [
    {
      title: "Find the perfect care for your loved ones",
      subtitle: "Trusted babysitters, senior care, and special needs support",
      image:
        "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1200&h=600&fit=crop",
      color: "from-teal-600/90 to-teal-700/90",
    },
    {
      title: "Professional childcare you can trust",
      subtitle: "Background-checked caregivers for your peace of mind",
      image:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=600&fit=crop",
      color: "from-blue-600/90 to-blue-700/90",
    },
    {
      title: "Compassionate senior care services",
      subtitle: "Dedicated support for your aging loved ones",
      image:
        "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=1200&h=600&fit=crop",
      color: "from-purple-600/90 to-purple-700/90",
    },
    {
      title: "Specialized care for every need",
      subtitle: "Expert caregivers for individuals with special requirements",
      image:
        "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&h=600&fit=crop",
      color: "from-pink-600/90 to-pink-700/90",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="material-icons text-white text-xl">
                health_and_safety
              </span>
            </div>
            <span className="text-xl font-bold text-slate-900">Care.xyz</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/services"
              className="text-slate-600 hover:text-teal-600 transition-colors font-medium"
            >
              Find Care
            </Link>
            <Link
              href="/register?role=caregiver"
              className="text-slate-600 hover:text-teal-600 transition-colors font-medium"
            >
              Become a Caregiver
            </Link>
            <Link
              href="/about"
              className="text-slate-600 hover:text-teal-600 transition-colors font-medium"
            >
              Resources
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 hover:text-teal-600">
              <span className="material-icons">dark_mode</span>
            </button>
            <Link
              href="/login"
              className="text-slate-600 hover:text-teal-600 transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-full transition-all"
            >
              Join Now
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Image Slider */}
      <section className="relative h-[700px] overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${slide.color}`}
                  ></div>
                </div>

                {/* Content */}
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-white max-w-2xl"
                  >
                    <p className="text-white/90 font-semibold text-sm uppercase tracking-wider mb-4">
                      TRUSTED BY 2M+ FAMILIES
                    </p>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl text-white/90 mb-8">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href="/caregivers"
                          className="inline-block bg-white text-teal-600 font-bold px-8 py-4 rounded-full hover:bg-slate-100 transition-all shadow-lg"
                        >
                          Find a Caregiver
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href="/register?role=caregiver"
                          className="inline-block bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-all"
                        >
                          Become a Caregiver
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Search Bar Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-4xl mx-auto px-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                  <span className="material-icons text-slate-400">search</span>
                  <input
                    type="text"
                    placeholder="What care are you looking for?"
                    className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400"
                  />
                </div>
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                  <span className="material-icons text-slate-400">
                    location_on
                  </span>
                  <input
                    type="text"
                    placeholder="Zip code or City"
                    className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3 rounded-xl transition-all"
                >
                  Find Care
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Our Services
              </h2>
              <p className="text-slate-600">
                Professional care for every stage of life.
              </p>
            </div>
            <Link
              href="/services"
              className="text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1"
            >
              View All{" "}
              <span className="material-icons text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              {
                icon: "child_care",
                name: "Child Care",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: "elderly",
                name: "Senior Care",
                color: "bg-teal-100 text-teal-600",
              },
              {
                icon: "pets",
                name: "Pet Care",
                color: "bg-amber-100 text-amber-600",
              },
              {
                icon: "school",
                name: "Tutoring",
                color: "bg-purple-100 text-purple-600",
              },
              {
                icon: "cleaning_services",
                name: "Housekeeping",
                color: "bg-cyan-100 text-cyan-600",
              },
              {
                icon: "accessible",
                name: "Special Needs",
                color: "bg-pink-100 text-pink-600",
              },
            ].map((service, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                data-aos="fade-up"
                data-aos-delay={i * 50}
                className="bg-white border border-slate-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all cursor-pointer"
              >
                <div
                  className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                >
                  <span className="material-icons text-3xl">
                    {service.icon}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900">{service.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2
            className="text-4xl font-bold text-slate-900 mb-4"
            data-aos="fade-up"
          >
            How it Works
          </h2>
          <p
            className="text-xl text-slate-600 mb-16"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Finding the right care has never been easier
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "person_search",
                step: "1",
                title: "Search & Filter",
                desc: "Browse detailed profiles and filter by experience, rating, and availability.",
              },
              {
                icon: "chat",
                step: "2",
                title: "Connect & Interview",
                desc: "Message potential caregivers directly and schedule background-check verified interviews.",
              },
              {
                icon: "calendar_month",
                step: "3",
                title: "Book & Pay",
                desc: "Book with confidence using our secure payment system and managed scheduling.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.step}
                  </div>
                  <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="material-icons text-teal-600 text-4xl">
                      {step.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-linear-to-br from-amber-50 to-teal-50 rounded-3xl p-12 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-full rounded-2xl flex items-center justify-center">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOKf1ULoqcdo3xqKfjQywgtj2iKxOF-TJaUSAfqjJDqKafnWY1bDt7G7XDHiYSgJllU0wE1VnzgufihVStE9OReI_QzXfFugn9eW3SFgwcQK9CPQQ5yUQFiG1Oioedh4SQl7VarruPjMD50dv8FaJxlST3G377IQcGIDcc8zp95XkzZ3tzxfpLh341GlvccHpXOyq3V5iCDb8V-8ffJ9Y3VVLfEmgxa7L8M2HORBkZ9YPUb3xcISMau7eqkj88RlveAbA-N8zVmVk"
                      alt="family image"
                      width={400}
                      height={650}
                    />
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 bg-amber-400 text-white px-6 py-4 rounded-2xl shadow-xl z-40">
                  <p className="font-bold text-lg">
                    &quot;Peace of mind is priceless.&quot;
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="material-icons text-amber-400">
                    star
                  </span>
                ))}
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Trust is our foundation for every care connection.
              </h2>
              <p className="text-lg text-slate-600 mb-8 italic">
                &quot;Finding a sitter for my two energetic boys was stressful
                until I used Care.xyz. The vetting process gave me confidence,
                and Sarah has been a blessing to our family for over a year
                now.&quot;
              </p>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="material-icons text-teal-600">person</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Jessica Miller</p>
                  <p className="text-sm text-slate-500">
                    Parent, San Francisco
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-3xl font-bold text-teal-600 mb-1">98%</p>
                  <p className="text-sm text-slate-600">Satisfaction Rate</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-teal-600 mb-1">50k+</p>
                  <p className="text-sm text-slate-600">Verified Caregivers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-teal-600 mb-1">24/7</p>
                  <p className="text-sm text-slate-600">Support Team</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto bg-gradient-to-r from-teal-600 to-teal-700 rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: "40px 40px",
                height: "100%",
              }}
            ></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to find the perfect care?
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              Join thousands of families finding trusted help every day.
              <br />
              Sign up now and get your first match within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/register"
                  className="inline-block bg-white text-teal-600 font-bold px-8 py-4 rounded-full hover:bg-slate-100 transition-all"
                >
                  Get Started
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/register?role=caregiver"
                  className="inline-block bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-all"
                >
                  Become a Caregiver
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <span className="material-icons text-white text-xl">
                    health_and_safety
                  </span>
                </div>
                <span className="text-xl font-bold text-white">Care.xyz</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Transforming the way families find trusted, professional care
                for their loved ones across the globe.
              </p>
            </div>

            {/* Services Column */}
            <div>
              <h4 className="font-bold text-white mb-4">Services</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-teal-400 transition-colors"
                  >
                    Senior Care
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-teal-400 transition-colors"
                  >
                    Specialized Nursing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-teal-400 transition-colors"
                  >
                    Dementia Care
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-teal-400 transition-colors"
                  >
                    Child Care
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-teal-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-teal-400 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-teal-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-teal-400 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div>
              <h4 className="font-bold text-white mb-4">Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-all text-sm"
                >
                  Join
                </motion.button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-sm text-slate-500">
              © 2026 Care.xyz Inc. All rights reserved. Providing compassionate
              care nationwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
