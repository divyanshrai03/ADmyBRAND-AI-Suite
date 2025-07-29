'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';
import Image from 'next/image';
// --- DUMMY DATA --- //
const features = [
  {
    icon: 'BrainCircuit',
    title: 'Predictive Analytics',
    description: 'Forecast market trends and customer behavior with over 95% accuracy to make smarter decisions.',
  },
  {
    icon: 'Target',
    title: 'Automated Ad Campaigns',
    description: 'Launch, manage, and optimize ads across all platforms from a single, intuitive dashboard.',
  },
  {
    icon: 'Wand',
    title: 'AI Content Generation',
    description: 'Create high-converting copy for ads, emails, and social media in seconds, not hours.',
  },
  {
    icon: 'Smile',
    title: 'Sentiment Analysis',
    description: 'Monitor brand perception and customer feedback in real-time to protect your reputation.',
  },
  {
    icon: 'Binoculars',
    title: 'Competitor Intelligence',
    description: "Uncover your competitors' strategies and discover untapped market advantages.",
  },
  {
    icon: 'GitBranch',
    title: 'Personalized Journeys',
    description: 'Deliver unique customer experiences that dramatically boost conversion and long-term loyalty.',
  },
]

const pricingTiers = [
  {
    name: 'Starter',
    priceMonthly: 29,
    priceYearly: 290,
    userBase: 1,
    userRate: 10,
    description: 'For individuals and small teams getting started with AI marketing.',
    features: ['1 User', 'Predictive Analytics', 'AI Content Generation', 'Basic Support'],
    isPopular: false,
  },
  {
    name: 'Professional',
    priceMonthly: 79,
    priceYearly: 790,
    userBase: 5,
    userRate: 8,
    description: 'For growing businesses that need more power and automation.',
    features: [
      '5 Users',
      'All Starter Features',
      'Automated Ad Campaigns',
      'Sentiment Analysis',
      'Priority Support',
    ],
    isPopular: true,
  },
  {
    name: 'Enterprise',
    priceMonthly: 'Contact Us',
    priceYearly: 'Custom',
    description: 'For large organizations with custom needs and dedicated support.',
    features: ['Unlimited Users', 'All Pro Features', 'Competitor Intelligence', 'Dedicated Account Manager'],
    isPopular: false,
  },
]

const testimonials = [
  {
    quote:
      "ADmyBRAND has revolutionized our marketing. The predictive analytics are scarily accurate and have given us a significant edge over our competitors.",
    name: 'Sarah Johnson',
    title: 'CMO, Innovate Inc.',
    imgSrc: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=SJ',
  },
  {
    quote:
      "The AI content generator is a game-changer. We've cut our content production time by 80% while increasing engagement. I can't imagine working without it.",
    name: 'Michael Chen',
    title: 'Founder, Digital Growth Co.',
    imgSrc: 'https://placehold.co/100x100/2DD4BF/FFFFFF?text=MC',
  },
  {
    quote:
      "The ROI from the automated ad campaigns paid for the subscription in the first month. It's an essential tool for any serious marketing team.",
    name: 'Emily Rodriguez',
    title: 'Marketing Director, ScaleUp',
    imgSrc: 'https://placehold.co/100x100/8A2BE2/FFFFFF?text=ER',
  },
    {
    quote:
      "The user interface is incredibly intuitive. Our team was up and running in a single afternoon, which is unheard of for a platform this powerful.",
    name: 'David Lee',
    title: 'Head of Marketing, FastTrack',
    imgSrc: 'https://placehold.co/100x100/f59e0b/FFFFFF?text=DL',
  },
]

const faqs = [
    {
        question: "What is ADmyBRAND AI Suite?",
        answer: "ADmyBRAND AI Suite is a comprehensive marketing platform that leverages artificial intelligence to automate and optimize your marketing efforts. From predictive analytics to content generation, our suite provides the tools you need to grow your business faster."
    },
    {
        question: "Who is this platform for?",
        answer: "Our platform is designed for marketing teams of all sizes, from solo entrepreneurs to large enterprises. We have different pricing tiers and feature sets to match your specific needs and scale with you as you grow."
    },
    {
        question: "Is there a free trial?",
        answer: "Yes, we offer a 14-day free trial on our Professional plan. This allows you to experience the full power of our platform with no commitment. You can sign up without a credit card."
    },
    {
        question: "How does the AI work?",
        answer: "We use a combination of proprietary machine learning models and leading large language models (LLMs). Our system analyzes vast amounts of data to identify trends, predict outcomes, and generate human-quality content, giving you a significant competitive advantage."
    },
    {
        question: "Can I integrate it with my existing tools?",
        answer: "Absolutely. ADmyBRAND AI Suite is built to be flexible. We offer a robust API and native integrations with popular platforms like Salesforce, HubSpot, Google Analytics, and major social media channels."
    }
]

const blogPosts = [
    {
        title: "The Future of Marketing is Predictive: Are You Ready?",
        excerpt: "Discover how predictive analytics is reshaping the marketing landscape and how your business can stay ahead of the curve.",
        date: "July 29, 2025",
        author: "Jane Doe"
    },
    {
        title: "5 Ways AI Can Boost Your Ad Campaign ROI Overnight",
        excerpt: "Stop wasting money on ineffective ads. Learn five practical AI-driven strategies to maximize your return on investment.",
        date: "July 25, 2025",
        author: "John Smith"
    },
    {
        title: "Content Creation on Steroids: A Guide to AI Generators",
        excerpt: "From blog posts to social media updates, see how AI content generators can save you time and elevate your brand's voice.",
        date: "July 22, 2025",
        author: "Alex Ray"
    }
]

const sentimentPings = [
    { message: "Just tried the new product from #BrandX, it's amazing!", sentiment: 'positive' },
    { message: "The customer service at #BrandX is top-notch!", sentiment: 'positive' },
    { message: "I'm a bit confused about the new update from #BrandX.", sentiment: 'neutral' },
    { message: "My order from #BrandX was delayed again... so frustrating.", sentiment: 'negative' },
    { message: "Can't wait for the #BrandX summer sale!", sentiment: 'positive' },
    { message: "The new #BrandX ad is everywhere, and I love it!", sentiment: 'positive' },
    { message: "Thinking about switching to #BrandX for my business.", sentiment: 'neutral' },
    { message: "Had a terrible experience with #BrandX support today.", sentiment: 'negative' },
];

// --- SVG ICONS (Lucide-React inspired) --- //
const Icon = ({ name, className }) => {
  const icons = {
    BrainCircuit: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.72c0 .27.16.59.67.5A10 10 0 0 0 22 12a10 10 0 0 0-10-10z"/></svg>
    ),
    Target: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
    ),
    Wand: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 4V2m0 14v-2m-7.5-13.5L6 4m9 12-1.5-1.5M22 12h-2m-2-6.5L16.5 7M4 12H2m2-6.5L5.5 7M12 22v-2m0-14v-2m-7.5-2.5L6 8m9 6-1.5 1.5"/><circle cx="12" cy="12" r="3"/></svg>
    ),
    Smile: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
    ),
    Binoculars: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 6L8 10H6a2 2 0 00-2 2v3a2 2 0 002 2h2l4 4V6zM18 10l-4 4h2a2 2 0 012 2v3a2 2 0 01-2 2h-2l-4-4V10z"/></svg>
    ),
    GitBranch: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 01-9 9"/></svg>
    ),
    Check: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><motion.polyline initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.2 }} points="20 6 9 17 4 12"></motion.polyline></svg>
    ),
    Plus: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    ),
    Minus: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    ),
    Twitter: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
    ),
    Linkedin: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
    ),
    X: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    ),
    SentimentPositive: () => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
    ),
    SentimentNegative: () => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
    ),
    SentimentNeutral: () => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM7 11h10v2H7v-2z"></path></svg>
    )
  }
  const IconComponent = icons[name]
  return IconComponent ? <IconComponent /> : null
}

// --- Reusable Components --- //

const GlassmorphicCard = ({ children, className = '' }) => (
  <div className={`bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 ${className}`}>
    {children}
  </div>
)

const EarthModel = () => {
  const { scene } = useGLTF('/earth.glb');
   scene.position.set(-5, -105, 0); 
  return <primitive object={scene} scale={110} />; // increased from 2.5 → 4.5
};


const GradientButton = ({ children, className = '', ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(138, 43, 226, 0.5)" }}
    whileTap={{ scale: 0.95 }}
    className={`px-6 py-3 font-sora font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg shadow-lg ${className}`}
    {...props}
  >
    {children}
  </motion.button>
)

const GhostButton = ({ children, className = '', ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
    whileTap={{ scale: 0.95 }}
    className={`px-6 py-3 font-sora font-semibold text-white bg-transparent border-2 border-slate-500 rounded-lg ${className}`}
    {...props}
  >
    {children}
  </motion.button>
)

const Modal = ({ isOpen, onClose, children }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl shadow-purple-500/20"
                    onClick={e => e.stopPropagation()}
                >
                    {children}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

// --- Animated Demo Component --- //
const DemoAnimation = () => {
    const [step, setStep] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setStep(prev => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const lineVariants = {
        hidden: { pathLength: 0 },
        visible: { pathLength: 1, transition: { duration: 1, ease: "easeInOut" } }
    };

    const dotVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { duration: 0.5, delay: 0.8 } }
    };

    return (
        <div className="p-6 bg-slate-800/50 rounded-lg">
            <div className="w-full aspect-video relative flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {step === 0 && <motion.p key="0" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center text-slate-300">Analyzing Market Data...</motion.p>}
                    {step === 1 && <motion.p key="1" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center text-teal-400">Trend Identified: "AI in Marketing" +35%</motion.p>}
                    {step === 2 && <motion.p key="2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center text-blue-400">Launching Automated Campaign...</motion.p>}
                    {step === 3 && <motion.p key="3" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center text-purple-400">Optimizing Ad Spend...</motion.p>}
                </AnimatePresence>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
                    <motion.path
                        key={`line-${step}`}
                        d="M 10 80 Q 50 20, 90 60 T 190 30"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        variants={lineVariants}
                        initial="hidden"
                        animate="visible"
                    />
                    <motion.circle
                        key={`dot-${step}`}
                        cx="190"
                        cy="30"
                        r="3"
                        fill="white"
                        variants={dotVariants}
                        initial="hidden"
                        animate="visible"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8A2BE2" />
                            <stop offset="100%" stopColor="#4F46E5" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
};


// --- Page Sections --- //

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-slate-900/60 backdrop-blur-xl border-b border-slate-800' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-white font-space-grotesk">
          ADmyBRAND<span className="text-purple-400">.ai</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
          <a href="#pulse" className="text-slate-300 hover:text-white transition-colors">Live Demo</a>
          <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
          <a href="#testimonials" className="text-slate-300 hover:text-white transition-colors">Testimonials</a>
          <a href="#blog" className="text-slate-300 hover:text-white transition-colors">Blog</a>
          <a href="#faq" className="text-slate-300 hover:text-white transition-colors">FAQ</a>
        </nav>
        <GradientButton className="hidden md:block">Get Started</GradientButton>
      </div>
    </header>
  );
};

const HeroSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const headline = "Marketing on Autopilot. Results on Demand.";
    const words = headline.split(" ");

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const wordVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100
            }
        }
    };

    return (
        <>
            <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-24 pb-12">
                <div className="absolute inset-0 bg-slate-900 -z-20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] -z-10"></div>
                
                <div className="container mx-auto px-6 z-10">
                    <motion.h1
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-white font-space-grotesk leading-tight tracking-tighter"
                    >
                        {words.map((word, index) => (
                            <motion.span
                                key={index}
                                variants={wordVariants}
                                className={`inline-block mr-4 ${word.includes("Results") ? 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500' : ''}`}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="mt-6 max-w-2xl mx-auto text-lg text-slate-300"
                    >
                        ADmyBRAND AI Suite analyzes market trends, automates campaigns, and delivers unparalleled ROI. Stop guessing, start growing.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4"
                    >
                        <GradientButton>Start Your Free Trial</GradientButton>
                        <GhostButton onClick={() => setIsModalOpen(true)}>Watch Demo</GhostButton>
                    </motion.div>
                    
                    <motion.div 
                        className="mt-16 w-full max-w-4xl mx-auto"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 1.2, ease: "backOut" }}
                    >
                        <div className="relative aspect-video rounded-2xl bg-slate-800/50 border border-slate-700/50 p-2 shadow-2xl shadow-purple-500/10">
                            <div className="absolute top-4 left-4 flex space-x-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
                                <motion.div
                                    className="w-3/4 h-3/4 flex items-center justify-center"
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        rotate: [0, 1, -1, 0],
                                    }}
                                    transition={{
                                        duration: 10,
                                        repeat: Infinity,
                                        repeatType: "mirror",
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="w-full h-full relative">
                                        <motion.div className="absolute w-16 h-16 bg-blue-500 rounded-full" style={{ top: '10%', left: '20%' }} animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}></motion.div>
                                        <motion.div className="absolute w-12 h-12 bg-purple-500 rounded-full" style={{ top: '60%', left: '10%' }} animate={{ x: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}></motion.div>
                                        <motion.div className="absolute w-20 h-20 bg-teal-400 rounded-full" style={{ top: '30%', left: '70%' }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}></motion.div>
                                        <motion.div className="absolute w-8 h-8 bg-white rounded-full" style={{ top: '75%', left: '80%' }} animate={{ y: [0, 15, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}></motion.div>
                                        <motion.div className="absolute w-24 h-1 bg-slate-600" style={{ top: '50%', left: '30%' }}></motion.div>
                                        <motion.div className="absolute w-32 h-1 bg-slate-600" style={{ top: '35%', left: '45%' }}></motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white font-space-grotesk">ADmyBRAND.ai Demo</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                            <Icon name="X" className="w-6 h-6" />
                        </button>
                    </div>
                    <DemoAnimation />
                </div>
            </Modal>
        </>
    )
}

const FeaturesSection = () => (
  <section id="features" className="py-20 sm:py-32 bg-slate-900">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white font-space-grotesk">Everything You Need to Succeed</h2>
        <p className="mt-4 text-lg text-slate-300">
          Our AI-powered suite is packed with features to supercharge your marketing, from strategy to execution.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlassmorphicCard className="h-full hover:border-purple-400/50 transition-colors duration-300">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600">
                <Icon name={feature.icon} className="w-6 h-6 text-white" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white font-space-grotesk">{feature.title}</h3>
              <p className="mt-2 text-slate-300">{feature.description}</p>
            </GlassmorphicCard>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

const GlobalPulseSection = () => {
    const [pulses, setPulses] = useState([]);
    const [feed, setFeed] = useState([]);

    const locations = [
        { x: 200, y: 150 }, // North America
        { x: 350, y: 350 }, // South America
        { x: 520, y: 120 }, // Europe
        { x: 700, y: 180 }, // Asia
        { x: 850, y: 380 }, // Oceania
        { x: 500, y: 280 }, // Africa
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            const newPing = sentimentPings[Math.floor(Math.random() * sentimentPings.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            const id = Date.now() + Math.random();
            
            setPulses(prev => [...prev, { ...newPing, ...location, id }]);
            setFeed(prev => [ { ...newPing, id }, ...prev].slice(0, 5));

            setTimeout(() => {
                setPulses(prev => prev.filter(p => p.id !== id));
            }, 4000);

        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const sentimentConfig = {
        positive: { icon: 'SentimentPositive', color: 'text-green-400', stroke: '#4ade80' },
        negative: { icon: 'SentimentNegative', color: 'text-red-400', stroke: '#f87171' },
        neutral: { icon: 'SentimentNeutral', color: 'text-slate-400', stroke: '#94a3b8' },
    };

    return (
        <section id="pulse" className="py-20 sm:py-32 bg-slate-900 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-space-grotesk">Global Brand Pulse</h2>
                    <p className="mt-4 text-lg text-slate-300">
                        Witness our AI detect and analyze brand mentions from across the globe in real-time.
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2 flex relative aspect-[2/1] rounded-2xl bg-slate-800/30 border border-slate-700/50">
           {/* 3D Globe Canvas */}
          <Canvas className="absolute " camera={{ position: [-200,100,-50] }}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[2, 5, 5]} />
            <Suspense fallback={null}>
              <EarthModel />
            </Suspense>
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 2}
              maxPolarAngle={Math.PI / 2}
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Canvas>

  {/* Pulse + Arrow Layer */}
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 500">
    <AnimatePresence>
      {pulses.map(pulse => (
        <g key={pulse.id}>
          {/* Pulse circle */}
          <motion.circle
            cx={pulse.x}
            cy={pulse.y}
            r="4"
            fill={sentimentConfig[pulse.sentiment].stroke}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.8, 1] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
          />
          {/* Animated arrow path */}
          <motion.path
            d={`M ${pulse.x} ${pulse.y} Q ${(pulse.x + 500) / 2} ${pulse.y - 100}, 500 50`}
            fill="none"
            stroke={sentimentConfig[pulse.sentiment].stroke}
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0.7, 1, 0] }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </g>
      ))}
    </AnimatePresence>
  </svg>
</div>

                    <div className="h-full">
                        <GlassmorphicCard className="h-full flex flex-col">
                            <h3 className="text-xl font-bold text-white font-space-grotesk mb-4">Live Feed</h3>
                            <div className="flex-grow overflow-hidden relative">
                                <AnimatePresence>
                                    {feed.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -50 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                            className="flex items-start gap-3 py-2 border-b border-slate-700/50"
                                        >
                                            <Icon name={sentimentConfig[item.sentiment].icon} className={`w-5 h-5 mt-0.5 shrink-0 ${sentimentConfig[item.sentiment].color}`} />
                                            <p className="text-sm text-slate-300">{item.message}</p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </GlassmorphicCard>
                    </div>
                </div>
            </div>
        </section>
    );
};


const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [users, setUsers] = useState(5);

  const calculatePrice = (tier) => {
      if (typeof tier.priceMonthly !== 'number') return tier.priceMonthly;
      
      const basePrice = isYearly ? tier.priceYearly : tier.priceMonthly;
      const extraUsers = Math.max(0, users - tier.userBase);
      const extraCost = extraUsers * tier.userRate * (isYearly ? 10 : 1); // Cheaper yearly rate
      
      return basePrice + extraCost;
  }

  return (
    <section id="pricing" className="py-20 sm:py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 to-transparent -z-10"></div>
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-space-grotesk">Flexible Pricing for Teams of All Sizes</h2>
          <p className="mt-4 text-lg text-slate-300">
            Choose the plan that's right for you. No hidden fees. Change plans anytime.
          </p>
        </div>

        <div className="mt-8 flex justify-center items-center gap-4">
          <span className={`font-medium ${!isYearly ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
          <div
            onClick={() => setIsYearly(!isYearly)}
            className={`w-14 h-8 flex items-center bg-slate-700 rounded-full p-1 cursor-pointer transition-colors duration-300 ${isYearly ? 'bg-purple-600' : 'bg-slate-700'}`}
          >
            <motion.div
              className="w-6 h-6 bg-white rounded-full shadow-md"
              layout
              transition={{ type: 'spring', stiffness: 700, damping: 30 }}
            />
          </div>
          <span className={`font-medium ${isYearly ? 'text-white' : 'text-slate-400'}`}>Yearly</span>
          <span className="text-sm font-semibold text-teal-400 bg-teal-400/10 px-2 py-1 rounded-full font-sora">Save ~20%</span>
        </div>

        <div className="max-w-md mx-auto mt-8">
            <label htmlFor="users-slider" className="block text-center text-slate-300 mb-2">Number of Users: <span className="font-bold text-white">{users}</span></label>
            <input 
                id="users-slider"
                type="range"
                min="1"
                max="50"
                value={users}
                onChange={(e) => setUsers(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              whileHover={tier.isPopular ? { y: -10, scale: 1.08 } : { y: -5, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`relative h-full`}
            >
              <GlassmorphicCard className={`h-full flex flex-col ${tier.isPopular ? 'border-purple-500' : ''}`}>
                {tier.isPopular && (
                  <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-sm font-bold rounded-full font-sora">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white font-space-grotesk">{tier.name}</h3>
                <p className="mt-2 text-slate-300 flex-grow">{tier.description}</p>
                
                <div className="my-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isYearly ? `y-${users}` : `m-${users}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="text-5xl font-bold text-white font-space-grotesk"
                    >
                      {typeof tier.priceMonthly !== 'number' ? (
                        <span className="text-3xl">{tier.priceMonthly}</span>
                      ) : (
                        <>
                          <span className="text-3xl align-top">$</span>
                          {calculatePrice(tier)}
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <p className="text-slate-400 mt-1 h-5">{typeof tier.priceMonthly === 'number' ? (isYearly ? '/ year' : '/ month') : ' '}</p>
                </div>

                <ul className="space-y-4 text-slate-300 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Icon name="Check" className="w-5 h-5 text-teal-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {tier.isPopular ? (
                    <GradientButton className="w-full">Choose Plan</GradientButton>
                  ) : (
                    <GhostButton className="w-full">Choose Plan</GhostButton>
                  )}
                </div>
              </GlassmorphicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TestimonialsSection = () => {
    const [index, setIndex] = useState(0);
    const carouselRef = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (carouselRef.current) {
            setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
        }
    }, []);

    const handleDragEnd = (event, info) => {
        if (!carouselRef.current) return;
        const cardWidth = carouselRef.current.children[0].offsetWidth + 32; // card width + gap
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset < -cardWidth / 2 || velocity < -500) {
            setIndex(prev => Math.min(prev + 1, testimonials.length - 1));
        } else if (offset > cardWidth / 2 || velocity > 500) {
            setIndex(prev => Math.max(prev - 1, 0));
        }
    };

    return (
        <section id="testimonials" className="py-20 sm:py-32 bg-slate-900 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-space-grotesk">Loved by Marketing Teams Worldwide</h2>
                    <p className="mt-4 text-lg text-slate-300">
                        Don't just take our word for it. Here's what our customers have to say.
                    </p>
                </div>
                <motion.div ref={carouselRef} className="cursor-grab mt-16">
                    <motion.div
                        className="flex gap-8"
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        onDragEnd={handleDragEnd}
                        animate={{ x: -index * (carouselRef.current ? (carouselRef.current.children[0].offsetWidth + 32) : 0) }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {testimonials.map((testimonial) => (
                            <motion.div key={testimonial.name} className="min-w-[80vw] md:min-w-[40vw] lg:min-w-[30vw]">
                                <GlassmorphicCard className="h-full flex flex-col justify-between">
                                    <p className="text-slate-200 text-lg italic">"{testimonial.quote}"</p>
                                    <div className="mt-6 flex items-center">
                                        <Image src={testimonial.imgSrc} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-purple-400" />
                                        <div className="ml-4">
                                            <p className="font-bold text-white font-space-grotesk">{testimonial.name}</p>
                                            <p className="text-slate-400">{testimonial.title}</p>
                                        </div>
                                    </div>
                                </GlassmorphicCard>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
                <div className="flex justify-center gap-2 mt-8">
                    {testimonials.map((_, i) => (
                        <button key={i} onClick={() => setIndex(i)} className={`w-3 h-3 rounded-full transition-colors ${i === index ? 'bg-purple-500' : 'bg-slate-600 hover:bg-slate-500'}`}></button>
                    ))}
                </div>
            </div>
        </section>
    );
};

const BlogSection = () => (
    <section id="blog" className="py-20 sm:py-32 bg-slate-900">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white font-space-grotesk">From the Blog</h2>
                <p className="mt-4 text-lg text-slate-300">
                    Insights, tips, and news on the future of AI-powered marketing.
                </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <GlassmorphicCard className="h-full flex flex-col group">
                            <h3 className="text-xl font-bold text-white font-space-grotesk flex-grow">{post.title}</h3>
                            <p className="mt-2 text-slate-300 flex-grow">{post.excerpt}</p>
                            <div className="mt-4 pt-4 border-t border-slate-700/50">
                                <div className="flex justify-between items-center text-sm text-slate-400">
                                    <span>{post.author}</span>
                                    <span>{post.date}</span>
                                </div>
                                <a href="#" className="mt-4 inline-block text-purple-400 font-semibold group-hover:text-purple-300 transition-colors font-sora">
                                    Read More &rarr;
                                </a>
                            </div>
                        </GlassmorphicCard>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);


const FaqSection = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = index => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <section id="faq" className="py-20 sm:py-32 bg-slate-900">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-space-grotesk">Frequently Asked Questions</h2>
                    <p className="mt-4 text-lg text-slate-300">
                        Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
                    </p>
                </div>
                <div className="mt-16 max-w-3xl mx-auto">
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.8 }}
                                transition={{ duration: 0.5 }}
                                className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden"
                            >
                                <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center text-left p-6">
                                    <span className="text-lg font-semibold text-white font-space-grotesk">{faq.question}</span>
                                    <motion.div animate={{ rotate: openFaq === index ? 45 : 0 }}>
                                        <Icon name="Plus" className="w-6 h-6 text-slate-400" />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 text-slate-300">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-1">
                    <h3 className="text-2xl font-bold text-white font-space-grotesk">ADmyBRAND<span className="text-purple-400">.ai</span></h3>
                    <p className="mt-4 text-slate-400">Marketing on Autopilot.</p>
                    <div className="mt-6 flex space-x-4">
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Icon name="Twitter" className="w-6 h-6" /></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Icon name="Linkedin" className="w-6 h-6" /></a>
                    </div>
                </div>
                <div className="col-span-1">
                    <h4 className="font-space-grotesk font-semibold text-white">Product</h4>
                    <ul className="mt-4 space-y-2">
                        <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                        <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Demo</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Integrations</a></li>
                    </ul>
                </div>
                <div className="col-span-1">
                    <h4 className="font-space-grotesk font-semibold text-white">Company</h4>
                    <ul className="mt-4 space-y-2">
                        <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
                        <li><a href="#blog" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
                    </ul>
                </div>
                <div className="col-span-1">
                    <h4 className="font-space-grotesk font-semibold text-white">Legal</h4>
                    <ul className="mt-4 space-y-2">
                        <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 border-t border-slate-800 pt-8 text-center text-slate-500">
                <p>&copy; {new Date().getFullYear()} ADmyBRAND AI Suite. All rights reserved.</p>
            </div>
        </div>
    </footer>
);


// --- Main App Component --- //
export default function App() {
  return (
    <div className="bg-slate-900 text-slate-100 font-inter">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <GlobalPulseSection />
        <PricingSection />
        <TestimonialsSection />
        <BlogSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  )
}
