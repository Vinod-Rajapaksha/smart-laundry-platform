import { Shirt, Sparkles, Wind, Zap } from "lucide-react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Reviews from "../components/Reviews";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

const services = [
  {
    id: "washing",
    title: "Washing",
    description: "Deep-clean cycles with fabric-safe detergents for everyday freshness.",
    icon: Shirt,
  },
  {
    id: "dry-cleaning",
    title: "Dry Cleaning",
    description: "Professional treatment for delicate fabrics, suits, and premium wear.",
    icon: Sparkles,
  },
  {
    id: "ironing",
    title: "Ironing",
    description: "Sharp crease and wrinkle-free finishing to keep your clothes polished.",
    icon: Wind,
  },
  {
    id: "express",
    title: "Express Service",
    description: "Fast turnaround for urgent laundry with same-day options.",
    icon: Zap,
  },
];

const reviews = [
  {
    id: "r1",
    name: "Amelia Brown",
    rating: 5,
    comment: "Pickup was right on time and my office clothes came back perfectly pressed.",
  },
  {
    id: "r2",
    name: "Jason Lee",
    rating: 5,
    comment: "The express service saved me before a business trip. Super reliable team.",
  },
  {
    id: "r3",
    name: "Priya Patel",
    rating: 4,
    comment: "Great quality wash and very convenient scheduling through the website.",
  },
  {
    id: "r4",
    name: "Martin Gomez",
    rating: 5,
    comment: "Affordable plans for family laundry and the delivery staff is always courteous.",
  },
  {
    id: "r5",
    name: "Nina Watson",
    rating: 4,
    comment: "My dry-clean items were handled carefully and returned looking brand new.",
  },
];

export default function LaundryHomepage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ecfeff,_#f8fafc_45%,_#ffffff_100%)] text-slate-900">
      <Navbar links={navLinks} />
      <Hero />
      <About />
      <Services services={services} />
      <Reviews reviews={reviews} />
      <Contact />
      <Footer />
    </div>
  );
}
