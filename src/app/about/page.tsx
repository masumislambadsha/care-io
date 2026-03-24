"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
  }, []);

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      bio: "Former pediatric nurse with 15 years of experience, passionate about connecting families with quality care.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      bio: "Tech veteran who built platforms serving millions. Believes technology should make care more accessible.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    },
    {
      name: "Amara Osei",
      role: "Head of Caregiver Success",
      bio: "Dedicated to ensuring every caregiver on our platform thrives professionally and personally.",
      image:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop",
    },
    {
      name: "David Park",
      role: "Head of Trust & Safety",
      bio: "Former law enforcement professional who built our rigorous background verification process.",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop",
    },
  ];

  const values = [
    {
      icon: "favorite",
      title: "Compassion First",
      desc: "Every decision we make starts with empathy — for families, caregivers, and the people they care for.",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: "verified_user",
      title: "Trust & Safety",
      desc: "Rigorous background checks and ongoing monitoring ensure every caregiver meets our high standards.",
      color: "bg-teal-100 text-teal-600",
    },
    {
      icon: "diversity_3",
      title: "Inclusive Community",
      desc: "We welcome caregivers and families from every background and walk of life.",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: "schedule",
      title: "Reliable Support",
      desc: "We are here around the clock to support families and caregivers when they need us most.",
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  const milestones = [
    {
      year: "2018",
      event:
        "Care.xyz was founded by two healthcare professionals.",
    },
    {
      year: "2020",
      event:
        "Launched background verification system and onboarded first 1,000 caregivers.",
    },
    {
      year: "2021",
      event:
        "Expanded to 25 cities and reached 100,000 families served.",
    },
    {
      year: "2022",
      event:
        "Introduced specialized care categories for seniors and special needs individuals.",
    },
    {
      year: "2023",
      event:
        "Surpassed 1 million bookings and launched mobile apps for iOS and Android.",
    },
    {
      year: "2024",
      event:
        "Reached 2 million families and 50,000 verified caregivers across North America.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-linear-to-br from-teal-600 to-teal-700 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-teal-200 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-4">
              Our Story
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Care built on trust, powered by people
            </h1>
            <p className="text-base sm:text-lg text-teal-100 max-w-2xl mx-auto">
              We started Care.xyz because finding reliable, compassionate care
              for loved ones shouldn&apos;t be hard. Today, we connect millions
              of families with verified caregivers they can truly trust.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-teal-600 font-semibold text-xs uppercase tracking-widest mb-3">
                Our Mission
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-5 leading-tight">
                Making quality care accessible to every family
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mb-4">
                We believe every family deserves access to safe, professional,
                and compassionate care — regardless of their circumstances. Our
                platform removes the barriers that make finding care stressful
                and uncertain.
              </p>
              <p className="text-slate-600 text-sm sm:text-base">
                From newborns to seniors, from routine childcare to specialized
                medical support, we match families with caregivers who are not
                just qualified, but genuinely caring.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=700&h=500&fit=crop"
                alt="Caregiver with family"
                className="rounded-2xl shadow-xl w-full object-cover h-64 sm:h-80"
              />
              <div className="absolute -bottom-4 -left-4 bg-teal-600 text-white rounded-2xl px-5 py-4 shadow-lg">
                <p className="text-2xl font-bold">2M+</p>
                <p className="text-teal-100 text-xs font-semibold">
                  Families Served
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3"
              data-aos="fade-up"
            >
              What we stand for
            </h2>
            <p
              className="text-slate-600 text-sm sm:text-base"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              The values that guide every decision we make
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center"
              >
                <div
                  className={`w-14 h-14 ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                >
                  <span className="material-icons text-2xl">
                    {value.icon}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-600 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-teal-600 to-teal-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: "50,000+", label: "Verified Caregivers" },
              { number: "2M+", label: "Happy Families" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "6+", label: "Years of Service" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-teal-100 text-xs sm:text-sm font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3"
              data-aos="fade-up"
            >
              Our journey
            </h2>
            <p
              className="text-slate-600 text-sm sm:text-base"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              From a small idea to a platform trusted by millions
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-teal-100" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-5 items-start"
                >
                  <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-md shadow-teal-200 z-10">
                    {m.year.slice(2)}
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 flex-1 border border-slate-100">
                    <p className="text-teal-600 font-bold text-xs mb-1">
                      {m.year}
                    </p>
                    <p className="text-slate-700 text-sm">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3"
              data-aos="fade-up"
            >
              Meet the team
            </h2>
            <p
              className="text-slate-600 text-sm sm:text-base"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              The people behind Care.xyz
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 text-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base mb-0.5">
                    {member.name}
                  </h3>
                  <p className="text-teal-600 font-semibold text-xs mb-3">
                    {member.role}
                  </p>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4"
            data-aos="fade-up"
          >
            Ready to find the right care?
          </h2>
          <p
            className="text-slate-600 text-sm sm:text-base mb-8"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Join millions of families who trust Care.xyz to connect them with
            verified, compassionate caregivers.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Link href="/caregivers">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-teal-600 text-white font-bold px-7 py-3.5 rounded-full hover:bg-teal-700 transition-all shadow-lg text-sm sm:text-base"
              >
                Find a Caregiver
              </motion.button>
            </Link>
            <Link href="/register?role=caregiver">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-transparent border-2 border-teal-600 text-teal-600 font-bold px-7 py-3.5 rounded-full hover:bg-teal-50 transition-all text-sm sm:text-base"
              >
                Become a Caregiver
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="material-icons text-white text-xl">
                  health_and_safety
                </span>
              </div>
              <span className="text-xl font-bold text-white">
                Care<span className="text-teal-400">.xyz</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm justify-center">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link
                href="/services"
                className="hover:text-white transition-colors"
              >
                Services
              </Link>
              <Link
                href="/caregivers"
                className="hover:text-white transition-colors"
              >
                Caregivers
              </Link>
              <Link
                href="/about"
                className="text-white font-semibold"
              >
                About
              </Link>
            </div>
            <p className="text-xs text-slate-500">
              © 2024 Care.xyz. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
