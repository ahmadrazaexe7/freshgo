"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, MessageCircle, ShieldCheck, Truck, Instagram, Twitter, Facebook, Sparkles, Leaf, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const MotionLink = motion(Link) as any;

// Animation variants for staggered children
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: "Products", href: "/shop" },
      { label: "Vegetables", href: "/shop?category=vegetables" },
      { label: "Fruits", href: "/shop?category=fruits" },
    ],
    account: [
      { label: "Wishlist", href: "/wishlist" },
      { label: "Orders", href: "/orders" },
      { label: "Login", href: "/login" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ];

  return (
    <footer className="relative mt-12 overflow-hidden bg-[#081D18] text-white/80">
      {/* Animated gradient line at top */}
      <motion.div 
        className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D1B06B]/40 to-transparent"
        animate={{
          background: [
            'linear-gradient(to right, transparent, #D1B06B40, transparent)',
            'linear-gradient(to right, transparent, #D1B06B80, transparent)',
            'linear-gradient(to right, transparent, #D1B06B40, transparent)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle background glow effects */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(209,176,107,0.05) 0%, transparent 70%)' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Main Footer Grid - Integrated WhatsApp */}
        <motion.div 
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 items-start"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Brand - Span 2 */}
          <motion.div className="lg:col-span-2 space-y-5" variants={fadeInUp}>
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
               <div className="w-8 h-8 bg-gradient-to-br from-[#D1B06B] to-[#D1B06B]/70 rounded-lg flex items-center justify-center text-xl shadow-lg">🥬</div>
               <span className="text-xl font-bold tracking-tight text-white font-serif">FreshGo</span>
            </motion.div>
            <p className="text-sm leading-relaxed text-white/40 max-w-xs">
              Premium groceries delivered same-day in Rawalpindi & Islamabad. 
              Nature's best, simplified for your doorstep.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, idx) => (
                <MotionLink
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  whileHover={{ y: -3, scale: 1.1, borderColor: 'rgba(209,176,107,0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:text-[#D1B06B] hover:shadow-lg hover:shadow-[#D1B06B]/20"
                >
                  <social.icon className="h-4 w-4" />
                </MotionLink>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          {Object.entries(footerLinks).map(([title, links], idx) => (
            <motion.div key={title} variants={fadeInUp}>
              <motion.h3 
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D1B06B] mb-5 flex items-center gap-2"
                whileHover={{ x: 4 }}
              >
                <span className="w-4 h-[1px] bg-[#D1B06B]/50" />
                {title}
              </motion.h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <motion.li key={link.label} whileHover={{ x: 4 }}>
                    <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-[#D1B06B]/0 group-hover:bg-[#D1B06B] transition-all" />
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* WhatsApp Support - Brought UP and Compacted */}
          <motion.div 
            className="rounded-3xl border border-[#D1B06B]/20 bg-[#D1B06B]/5 p-5 relative overflow-hidden"
            variants={fadeInUp}
            whileHover={{ 
              y: -4, 
              boxShadow: "0 20px 40px -10px rgba(209,176,107,0.15)",
              borderColor: 'rgba(209,176,107,0.3)'
            }}
          >
            {/* Subtle shimmer effect */}
            <motion.div
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(209,176,107,0.05) 50%, transparent 70%)',
                backgroundSize: '200% 200%'
              }}
              animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            />
            <div className="flex items-center gap-2 mb-3">
              <motion.div 
                className="h-2 w-2 rounded-full bg-emerald-500"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D1B06B]">Live Support</span>
            </div>
            <p className="text-sm font-medium text-white mb-4">Quick WhatsApp Help</p>
            <motion.a
              href="https://wa.me/923363629981"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D1B06B] to-[#D1B06B]/90 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#081D18] shadow-lg shadow-[#D1B06B]/20"
              whileHover={{ scale: 1.02, boxShadow: "0 8px 20px -5px rgba(209,176,107,0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle className="h-4 w-4" />
              Chat Now
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Enhanced Features Bar */}
        <motion.div 
          className="mt-12 flex flex-wrap gap-4 border-t border-white/5 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {[
            { icon: Truck, text: "Free Same-Day Delivery", color: "text-emerald-400" },
            { icon: ShieldCheck, text: "Secure COD Payments", color: "text-blue-400" },
            { icon: MapPin, text: "Twin Cities Coverage", color: "text-purple-400" },
            { icon: Clock, text: "24/7 Support", color: "text-orange-400" },
          ].map((feature, idx) => (
            <motion.div 
              key={idx} 
              className="flex items-center gap-3 rounded-full bg-white/[0.03] px-4 py-2 border border-white/5 backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -2, 
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderColor: 'rgba(209,176,107,0.2)'
              }}
            >
              <div className={`flex items-center justify-center rounded-full bg-white/5 p-1.5 ${feature.color}`}>
                <feature.icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-[11px] font-medium text-white/60">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Bottom Bar */}
        <motion.div 
          className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 md:flex-row"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.p 
            className="text-[11px] text-white/20 flex items-center gap-2"
            whileHover={{ color: 'rgba(209,176,107,0.5)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D1B06B]/30" />
            © {currentYear} FreshGo. Nature Delivered.
          </motion.p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Privacy', href: '/contact' },
              { label: 'Terms', href: '/contact' },
              { label: 'Contact', href: '/contact' },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
              >
                <Link 
                  href={item.href} 
                  className="text-[11px] text-white/20 hover:text-[#D1B06B] transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D1B06B] group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}