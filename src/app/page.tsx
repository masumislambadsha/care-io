"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import AOS from "aos";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "aos/dist/aos.css";
import Navbar from "@/components/Navbar";

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  image: string;
  base_hourly_rate: number;
  base_daily_rate: number;
  features: string[];
  is_active: boolean;
};

type Caregiver = {
  id: string;
  name: string;
  image: string;
  bio: string;
  experience: number;
  hourly_rate: number;
  certifications: string[];
  languages: string[];
  services_offered: string[];
  verification_status: string;
  avg_rating: number;
  total_reviews: number;
  total_bookings: number;
};

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      if (response.ok) setServices(data.services || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchCaregivers = async () => {
    try {
      const response = await fetch("/api/caregivers");
      const data = await response.json();
      if (response.ok) setCaregivers(data.caregivers || []);
    } catch (error) {
      console.error("Error fetching caregivers:", error);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
    fetchServices();
    fetchCaregivers();
  }, []);

  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes("baby") || name.includes("child")) return "child_care";
    if (name.includes("senior") || name.includes("elderly")) return "elderly";
    if (name.includes("pet")) return "pets";
    if (name.includes("tutor") || name.includes("education")) return "school";
    if (name.includes("housekeeping") || name.includes("cleaning"))
      return "cleaning_services";
    if (name.includes("special")) return "accessible";
    return "favorite";
  };

  const getServiceColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-teal-100 text-teal-600",
      "bg-amber-100 text-amber-600",
      "bg-purple-100 text-purple-600",
      "bg-cyan-100 text-cyan-600",
      "bg-pink-100 text-pink-600",
    ];
    return colors[index % colors.length];
  };

  const heroSlides = [
    {
      title: "Find the perfect care for your loved ones",
      subtitle: "Trusted babysitters, senior care, and special needs support",
      image:
        "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1200&h=600&fit=crop",
    },
    {
      title: "Professional childcare you can trust",
      subtitle: "Background-checked caregivers for your peace of mind",
      image:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=600&fit=crop",
    },
    {
      title: "Compassionate senior care services",
      subtitle: "Dedicated support for your aging loved ones",
      image:
        "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=1200&h=600&fit=crop",
    },
    {
      title: "Specialized care for every need",
      subtitle: "Expert caregivers for individuals with special requirements",
      image:
        "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&h=600&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar />
      {/* Hero */}
      <section className="relative h-[480px] sm:h-[560px] md:h-[680px] overflow-hidden">
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
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                <div className="absolute inset-0 bg-slate-900/50" />
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-white max-w-xl w-full"
                  >
                    <p className="text-white/80 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-3">
                      TRUSTED BY 2M+ FAMILIES
                    </p>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-5 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-white/85 mb-5 sm:mb-7">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col xs:flex-row gap-3">
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <Link
                          href="/caregivers"
                          className="inline-block bg-white text-teal-600 font-bold px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full hover:bg-slate-100 transition-all shadow-lg text-center text-sm sm:text-base"
                        >
                          Find a Caregiver
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <Link
                          href="/register?role=caregiver"
                          className="inline-block bg-transparent border-2 border-white text-white font-bold px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full hover:bg-white/10 transition-all text-center text-sm sm:text-base"
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

        {/* Search bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-4 sm:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-3xl mx-auto px-3 sm:px-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-2.5 sm:p-4 md:p-5">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex items-center gap-2 px-3 py-2 sm:py-2.5 bg-slate-50 rounded-xl flex-1">
                  <span className="material-icons text-slate-400 text-lg shrink-0">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="What care are you looking for?"
                    className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-xs sm:text-sm min-w-0"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 py-2 sm:py-2.5 bg-slate-50 rounded-xl sm:flex-shrink-0">
                  <span className="material-icons text-slate-400 text-lg shrink-0">
                    location_on
                  </span>
                  <input
                    type="text"
                    placeholder="City or Zip"
                    className="flex-1 sm:w-32 md:w-44 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-xs sm:text-sm min-w-0"
                  />
                </div>
                <button className="bg-teal-600 text-white font-semibold text-xs sm:text-sm rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 hover:bg-teal-700 transition-colors shrink-0">
                  Find Care
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Our Services
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Professional care for every stage of life.
              </p>
            </div>
            <Link
              href="/services"
              className="text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1 text-sm sm:text-base whitespace-nowrap"
            >
              View All{" "}
              <span className="material-icons text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {services.slice(0, 6).map((service, i) => (
              <Link key={service.id} href={`/services/${service.slug}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  data-aos="fade-up"
                  data-aos-delay={i * 50}
                  className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 md:p-6 text-center hover:shadow-lg transition-all cursor-pointer h-full flex flex-col items-center justify-center"
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${getServiceColor(i)} rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3`}
                  >
                    <span className="material-icons text-xl sm:text-2xl md:text-3xl">
                      {getServiceIcon(service.name)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-xs sm:text-sm leading-tight">
                    {service.name}
                  </h3>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Caregivers */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3"
              data-aos="fade-up"
            >
              Meet Our Top-Rated Caregivers
            </h2>
            <p
              className="text-sm sm:text-base lg:text-lg text-slate-600"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Verified professionals ready to provide exceptional care
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {caregivers.slice(0, 4).map((caregiver, i) => (
              <motion.div
                key={caregiver.id}
                whileHover={{ y: -8 }}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100"
              >
                <div className="relative h-48 sm:h-52 md:h-60 bg-linear-to-br from-teal-100 to-blue-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      caregiver.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(caregiver.name)}&size=400&background=0d9488&color=fff`
                    }
                    alt={caregiver.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1 shadow-md">
                    <span className="material-icons text-amber-400 text-xs sm:text-sm">
                      star
                    </span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {caregiver.avg_rating.toFixed(1)}
                    </span>
                  </div>
                  {caregiver.verification_status === "APPROVED" && (
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-teal-600 text-white px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-bold">
                      ✓ Verified
                    </div>
                  )}
                </div>
                <div className="p-3 sm:p-4 md:p-5">
                  <h3 className="font-bold text-sm sm:text-base md:text-lg text-slate-900 mb-0.5 truncate">
                    {caregiver.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-teal-600 font-semibold mb-2 line-clamp-1">
                    {caregiver.services_offered[0] || "Caregiver"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-3 gap-1">
                    <span className="flex items-center gap-0.5 sm:gap-1 min-w-0">
                      <span className="material-icons text-xs">work</span>
                      <span className="truncate">
                        {caregiver.experience} yrs
                      </span>
                    </span>
                    <span className="flex items-center gap-0.5 sm:gap-1 min-w-0">
                      <span className="material-icons text-xs">reviews</span>
                      <span className="truncate">
                        {caregiver.total_reviews}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                    <span className="text-base sm:text-lg md:text-xl font-bold text-slate-900 shrink-0">
                      ${caregiver.hourly_rate}/hr
                    </span>
                    <Link href={`/caregivers/${caregiver.id}`}>
                      <button className="bg-teal-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 font-semibold text-xs rounded-xl hover:bg-teal-700 transition-colors">
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/caregivers">
              <button className="bg-teal-600 text-white rounded-2xl px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold hover:bg-teal-700 transition-colors inline-flex items-center gap-2">
                Browse All Caregivers
                <span className="material-icons text-base leading-none">
                  arrow_forward
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3"
            data-aos="fade-up"
          >
            How it Works
          </h2>
          <p
            className="text-sm sm:text-base lg:text-lg text-slate-600 mb-10 sm:mb-14"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Finding the right care has never been easier
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-8 lg:gap-10 w-full">
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
                whileHover={{ y: -8 }}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="relative w-full min-w-0"
              >
                <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-md hover:shadow-xl transition-all border border-slate-100 overflow-hidden">
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:-right-2 md:-top-2 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm md:text-base shadow-lg shrink-0">
                    {step.step}
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 flex-shrink-0">
                    <span className="material-icons text-teal-600 text-2xl sm:text-3xl md:text-4xl">
                      {step.icon}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 mb-2 break-words">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-slate-600 break-words">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3"
              data-aos="fade-up"
            >
              Why Families Choose Care.xyz
            </h2>
            <p
              className="text-sm sm:text-base lg:text-lg text-slate-600"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              The most trusted platform for finding quality care
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {[
              {
                icon: "verified_user",
                title: "Background Verified",
                desc: "Every caregiver undergoes thorough background checks and identity verification",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: "shield",
                title: "Secure Payments",
                desc: "Safe and encrypted payment processing with full transaction protection",
                color: "bg-teal-100 text-teal-600",
              },
              {
                icon: "support_agent",
                title: "24/7 Support",
                desc: "Round-the-clock customer support team ready to assist you anytime",
                color: "bg-purple-100 text-purple-600",
              },
              {
                icon: "workspace_premium",
                title: "Quality Guarantee",
                desc: "Satisfaction guaranteed or your money back - we stand behind our caregivers",
                color: "bg-amber-100 text-amber-600",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="text-center"
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 shadow-md`}
                >
                  <span className="material-icons text-2xl sm:text-3xl md:text-4xl">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-slate-600">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-teal-600 to-teal-700 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3"
              data-aos="fade-up"
            >
              Trusted by Thousands
            </h2>
            <p
              className="text-sm sm:text-base lg:text-lg text-teal-100"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Join the growing community of satisfied families
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { number: "50,000+", label: "Verified Caregivers" },
              { number: "2M+", label: "Happy Families" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "24/7", label: "Support Available" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-teal-100 font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3"
              data-aos="fade-up"
            >
              What Families Are Saying
            </h2>
            <p
              className="text-sm sm:text-base lg:text-lg text-slate-600"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Real stories from real families
            </p>
          </div>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            autoplay={{ delay: 4000 }}
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {[
              {
                name: "Jennifer Martinez",
                role: "Mother of 2",
                rating: 5,
                text: "Care.xyz connected us with Maria, who has been incredible with our kids. The platform made it so easy to find someone trustworthy.",
                image:
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
              },
              {
                name: "Robert Williams",
                role: "Son of Senior",
                rating: 5,
                text: "Finding care for my elderly father was stressful until I found Care.xyz. The caregiver we hired is professional and compassionate.",
                image:
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
              },
              {
                name: "Lisa Anderson",
                role: "Working Parent",
                rating: 5,
                text: "The background verification process gave me peace of mind. Our caregiver has become part of our family!",
                image:
                  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
              },
              {
                name: "David Chen",
                role: "Father of 3",
                rating: 5,
                text: "Best decision we made! The platform is user-friendly and the caregivers are top-notch. Highly recommend!",
                image:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
              },
              {
                name: "Amanda Taylor",
                role: "Daughter",
                rating: 5,
                text: "My mom needs special care and we found the perfect match through Care.xyz. The support team was amazing throughout.",
                image:
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
              },
            ].map((testimonial, i) => (
              <SwiperSlide key={i}>
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 md:p-7 shadow-sm h-full">
                  <div className="flex items-center gap-0.5 mb-3">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <span
                        key={j}
                        className="material-icons text-amber-400 text-base sm:text-lg"
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-600 mb-4 sm:mb-5 italic text-xs sm:text-sm md:text-base">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Caregiver CTA */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
                Are you a professional caregiver?
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 mb-6 sm:mb-8">
                Join thousands of caregivers who have found meaningful work
                through our platform. Set your own rates, choose your schedule,
                and connect with families who need your expertise.
              </p>
              <ul className="space-y-2.5 sm:space-y-3 mb-7 sm:mb-8">
                {[
                  "Flexible scheduling that works for you",
                  "Competitive pay rates you control",
                  "Secure and timely payments",
                  "Access to thousands of families",
                  "Professional development resources",
                  "24/7 support team",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="material-icons text-teal-600 text-xs">
                        check
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm md:text-base text-slate-700">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/register?role=caregiver">
                <button className="bg-teal-600 text-white font-bold rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-base hover:bg-teal-700 transition-colors inline-flex items-center gap-2">
                  Start Your Caregiver Journey{" "}
                  <span className="material-icons text-base">
                    arrow_forward
                  </span>
                </button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop"
                  alt="Professional caregiver"
                  className="w-full h-56 sm:h-72 md:h-80 lg:h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 md:bottom-8 md:left-8 md:right-8">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-teal-600 rounded-full flex items-center justify-center shrink-0">
                        <span className="material-icons text-white text-base sm:text-lg md:text-xl">
                          trending_up
                        </span>
                      </div>
                      <div>
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                          $2,500+
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600">
                          Average monthly earnings
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3"
              data-aos="fade-up"
            >
              Frequently Asked Questions
            </h2>
            <p
              className="text-sm sm:text-base lg:text-lg text-slate-600"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Everything you need to know about Care.xyz
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {[
              {
                question: "How are caregivers verified?",
                answer:
                  "All caregivers undergo comprehensive background checks including criminal records, identity verification, and reference checks. We also verify their certifications and work history.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, debit cards, and digital payment methods through our secure Stripe integration. All transactions are encrypted and protected.",
              },
              {
                question: "Can I cancel or reschedule a booking?",
                answer:
                  "Yes! You can cancel or reschedule bookings up to 24 hours before the scheduled time without any penalty. Cancellations within 24 hours may incur a small fee.",
              },
              {
                question: "What if I'm not satisfied with a caregiver?",
                answer:
                  "We offer a satisfaction guarantee. If you're not happy with your caregiver, contact our support team and we'll help you find a better match or provide a refund.",
              },
              {
                question: "How much does it cost to use Care.xyz?",
                answer:
                  "Creating an account and browsing caregivers is completely free. We charge a small platform fee (5%) on bookings to maintain our secure platform and support services.",
              },
              {
                question: "Are caregivers insured?",
                answer:
                  "Yes, all caregivers on our platform are covered by liability insurance during their bookings. This provides additional protection for both families and caregivers.",
              },
            ].map((faq, i) => (
              <motion.details
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 50}
                className="bg-slate-50 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all group"
              >
                <summary className="font-bold text-slate-900 cursor-pointer flex items-center justify-between text-sm sm:text-base">
                  {faq.question}
                  <span className="material-icons text-teal-600 group-open:rotate-180 transition-transform shrink-0 ml-3">
                    expand_more
                  </span>
                </summary>
                <p className="mt-3 text-slate-600 leading-relaxed text-xs sm:text-sm md:text-base">
                  {faq.answer}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-linear-to-br from-amber-50 to-teal-50 rounded-3xl p-5 sm:p-8 md:p-10 relative overflow-hidden">
                <div className="w-full rounded-2xl flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOKf1ULoqcdo3xqKfjQywgtj2iKxOF-TJaUSAfqjJDqKafnWY1bDt7G7XDHiYSgJllU0wE1VnzgufihVStE9OReI_QzXfFugn9eW3SFgwcQK9CPQQ5yUQFiG1Oioedh4SQl7VarruPjMD50dv8FaJxlST3G377IQcGIDcc8zp95XkzZ3tzxfpLh341GlvccHpXOyq3V5iCDb8V-8ffJ9Y3VVLfEmgxa7L8M2HORBkZ9YPUb3xcISMau7eqkj88RlveAbA-N8zVmVk"
                    alt="family"
                    className="w-full rounded-2xl object-cover"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 md:bottom-8 md:left-8 md:right-8 bg-amber-400 text-white px-4 py-3 sm:px-5 sm:py-3.5 md:px-6 md:py-4 rounded-2xl shadow-xl z-40">
                  <p className="font-bold text-xs sm:text-base md:text-lg">
                    &quot;Peace of mind is priceless.&quot;
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-1 mb-4 sm:mb-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="material-icons text-amber-400 text-base sm:text-lg md:text-xl"
                  >
                    star
                  </span>
                ))}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
                Trust is our foundation for every care connection.
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-6 sm:mb-8 italic">
                &quot;Finding a sitter for my two energetic boys was stressful
                until I used Care.xyz. The vetting process gave me confidence,
                and Sarah has been a blessing to our family for over a year
                now.&quot;
              </p>
              <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 mb-8 sm:mb-12">
                <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-icons text-teal-600 text-base sm:text-lg">
                    person
                  </span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                    Jessica Miller
                  </p>
                  <p className="text-xs text-slate-500">
                    Parent, San Francisco
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8">
                <div>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-teal-600 mb-1">
                    98%
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Satisfaction Rate
                  </p>
                </div>
                <div>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-teal-600 mb-1">
                    50k+
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Verified Caregivers
                  </p>
                </div>
                <div>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-teal-600 mb-1">
                    24/7
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Support Team
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-linear-to-r from-teal-600 to-teal-700 rounded-3xl p-6 sm:p-10 md:p-12 text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
              Ready to find the perfect care?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-teal-100 mb-6 sm:mb-8">
              Join thousands of families finding trusted help every day.
              <br className="hidden sm:block" />
              Sign up now and get your first match within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  href="/register"
                  className="inline-block bg-white text-teal-600 font-bold px-6 sm:px-7 py-2.5 sm:py-3.5 rounded-full hover:bg-slate-100 transition-all text-sm sm:text-base"
                >
                  Get Started
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  href="/register?role=caregiver"
                  className="inline-block bg-transparent border-2 border-white text-white font-bold px-6 sm:px-7 py-2.5 sm:py-3.5 rounded-full hover:bg-white/10 transition-all text-sm sm:text-base"
                >
                  Become a Caregiver
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mb-10 sm:mb-12">
            <div className="col-span-2 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <span className="material-icons text-white text-lg">
                    health_and_safety
                  </span>
                </div>
                <span className="text-base sm:text-lg md:text-xl font-bold text-white">
                  Care.xyz
                </span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Transforming the way families find trusted, professional care
                for their loved ones across the globe.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                Services
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-400">
                {[
                  "Senior Care",
                  "Specialized Nursing",
                  "Dementia Care",
                  "Child Care",
                ].map((s) => (
                  <li key={s}>
                    <Link
                      href="#"
                      className="hover:text-teal-400 transition-colors"
                    >
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                Company
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-400">
                {["About Us", "Careers", "Privacy Policy", "Contact"].map(
                  (s) => (
                    <li key={s}>
                      <Link
                        href="#"
                        className="hover:text-teal-400 transition-colors"
                      >
                        {s}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-bold text-white mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                Newsletter
              </h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm min-w-0"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-all text-xs sm:text-sm shrink-0"
                >
                  Join
                </motion.button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-sm text-slate-500">
              © 2026 Care.xyz Inc. All rights reserved. Providing compassionate
              care nationwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
