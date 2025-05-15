'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Advanced multi-stage typewriter effect
const AdvancedTypewriter = ({ lines, onComplete }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isCursorVisible, setIsCursorVisible] = useState(true);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setIsCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typing effect
  useEffect(() => {
    if (currentLine >= lines.length) {
      onComplete && onComplete();
      return;
    }

    const currentFullText = lines[currentLine];
    
    if (isTyping) {
      if (text.length < currentFullText.length) {
        const timeout = setTimeout(() => {
          setText(currentFullText.substring(0, text.length + 1));
        }, Math.random() * 50 + 30); // Variable speed for more natural effect
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
        const timeout = setTimeout(() => {
          setIsTyping(true);
          if (currentLine < lines.length - 1) {
            setText('');
            setCurrentLine(currentLine + 1);
          }
        }, 1500); // Pause at the end of line
        return () => clearTimeout(timeout);
      }
    }
  }, [text, isTyping, currentLine, lines, onComplete]);

  return (
    <span className="relative">
      <span dangerouslySetInnerHTML={{ __html: text }} />
      <span 
        className={`absolute ${isCursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}
        style={{ color: '#4ade80' }}
      >|</span>
    </span>
  );
};

export default function HomePage() {
  const [typingComplete, setTypingComplete] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // Slight delay before starting the animation sequence
    const timer = setTimeout(() => {
      setHeroVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col items-center justify-center text-white overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute z-0 w-full h-full object-cover"
        >
          <source src="/videos/LandingPage.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Logo - Top Left */}
        <div 
          className="fixed top-4 left-4 z-50"
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 9999
          }}
        >
          {/* Adding filter to make logo white */}
        <Image
            src="/images/EcoChainLogo.svg" 
            alt="EcoChain Logo" 
            width={120}  
            height={40} 
            priority
            className="filter brightness-0 invert"
            style={{
              filter: 'brightness(0) invert(1)'
            }}
          />
        </div>

        {/* Creative Headline with Visual Effects */}
        <div className="relative z-10 flex flex-col items-center justify-center p-8 bg-transparent max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative"
          >
            {/* First Line - Main Title */}
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-thin mb-4 tracking-tight whitespace-nowrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.8, 
                ease: [0.19, 1.0, 0.22, 1.0],
                delay: 0.2 
              }}
              style={{ 
                textShadow: '0 0 35px rgba(0, 0, 0, 0.5)',
                color: '#F0F4F8',
                letterSpacing: '0.01em',
                fontWeight: 200,
                fontFamily: 'var(--font-montserrat)',
                lineHeight: 1.2
              }}
            >
              TRANSFORM <span className="font-medium" style={{ color: '#E0F2F1' }}>NATURE'S</span> VALUE
            </motion.h1>
            
            {/* Elegant line separator */}
            <motion.div 
              className="w-16 h-px mx-auto mb-4"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 64, opacity: 0.8 }}
              transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
              style={{ 
                background: 'linear-gradient(to right, transparent, rgba(200, 255, 218, 0.7), transparent)',
              }}
            />
            
            {/* Second Line with Typewriter Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="mb-10"
            >
              <h2 className="text-base sm:text-lg md:text-2xl font-light tracking-wider"
                style={{ 
                  textShadow: '0 0 12px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.5)',
                  color: '#AAFFAA',
                  letterSpacing: '0.15em',
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}
              >
                <AdvancedTypewriter 
                  lines={["VERIFIED <span style='color: #FFFFFF; margin: 0 0.5rem;'>•</span> TOKENIZED <span style='color: #FFFFFF; margin: 0 0.5rem;'>•</span> DECENTRALIZED"]} 
                  onComplete={() => setTypingComplete(true)}
                />
              </h2>
            </motion.div>
          </motion.div>
          
          {/* Subtle tagline explainer */}
          {typingComplete && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, delay: 0.3 }}
              className="text-xs sm:text-sm md:text-base mt-6 max-w-xl font-light"
              style={{ 
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                color: 'rgba(240, 248, 255, 0.9)',
                letterSpacing: '0.08em',
                lineHeight: 1.8,
                fontFamily: 'var(--font-montserrat)',
                maxWidth: '28rem',
                margin: '1.5rem auto 0'
              }}
            >
              The revolution in carbon offsetting on the Aptos blockchain
            </motion.p>
          )}
        </div>

        {/* Scroll down indicator - Bottom Center */}
        {typingComplete && (
          <div
            className="fixed bottom-8 left-0 right-0 z-50 text-center"
            style={{
              position: 'absolute', 
              bottom: '32px',
              left: '0',
              right: '0',
              zIndex: 9999,
              textAlign: 'center'
            }}
            onClick={() => {
              const secondSection = document.getElementById('how-it-works');
              if (secondSection) {
                secondSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-xs font-medium mb-1"
              style={{ 
                textShadow: '0px 1px 5px rgba(0,0,0,0.9)',
                color: 'white',
                letterSpacing: '0.15em',
                textTransform: 'uppercase'
              }}
            >
              EXPLORE
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
              }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.8, 
                  ease: "easeInOut",
                  repeatType: "reverse" 
                }}
                className="text-4xl"
                style={{ 
                  color: '#4ade80',
                  textShadow: '0px 2px 8px rgba(74, 222, 128, 0.6)',
                }}
              >
                ↓
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
      {/* End of Hero Section */} 

      {/* Carbon Credit Overview Section */}
      <motion.section 
        id="how-it-works"
        className="w-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center py-20 sm:py-28 px-4 md:px-10 text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-green-500/5 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-green-500/10 blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              How EcoChain Works
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl mb-10 md:mb-16 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover the transparent and secure process of how carbon credits are created, meticulously verified, and seamlessly traded on the EcoChain platform, leveraging the power of Aptos blockchain and cutting-edge IoT technology.
            </p>
          </motion.div>
          
          {/* Process flow with enhanced visuals */}
          <div className="grid md:grid-cols-3 gap-12 lg:gap-8 mb-16 md:mb-20 relative">
            {/* Line connecting elements (visible on medium screens and up) */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-green-500/30 via-emerald-500/60 to-green-500/30"></div>
            
            {/* 1. Creation */}
            <motion.div 
              className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-green-500/20 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">1</div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-5xl mb-6 mx-auto bg-gradient-to-br from-green-400/20 to-green-600/20 w-20 h-20 rounded-full flex items-center justify-center"
              >
                🌳
              </motion.div>
              
              <h3 className="text-xl font-bold mb-4 text-white">Creation</h3>
              
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Sustainable projects that reduce or sequester greenhouse gases generate carbon credits. Each credit represents one verified metric ton of CO₂ equivalent removed from the atmosphere.
                </p>
                
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  whileInView={{ opacity: 1, height: 'auto' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-gray-900/50 rounded-lg p-4 border border-green-500/10 mt-4"
                >
                  <h4 className="text-green-400 text-sm font-medium mb-2">Credit Generation Sources:</h4>
                  <ul className="text-gray-400 text-sm space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>Reforestation &amp; Conservation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>Renewable Energy Projects</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>Methane Capture Systems</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>

            {/* 2. Verification */}
            <motion.div 
              className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-blue-500/20 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">2</div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-5xl mb-6 mx-auto bg-gradient-to-br from-blue-400/20 to-blue-600/20 w-20 h-20 rounded-full flex items-center justify-center"
              >
                🛡️
              </motion.div>
              
              <h3 className="text-xl font-bold mb-4 text-white">Verification</h3>
              
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Our network of IoT sensors and satellite data continuously monitor carbon offset projects, while Aptos blockchain immutably records every measurement, ensuring complete transparency and data integrity.
                </p>
                
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  whileInView={{ opacity: 1, height: 'auto' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="relative"
                >
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-blue-500/10 mt-4 overflow-hidden">
                    <h4 className="text-blue-400 text-sm font-medium mb-2">Verification Process:</h4>
                    {/* Animated verification process */}
                    <motion.div 
                      className="flex items-center space-x-2 text-xs text-gray-400"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 1.0 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">1</div>
                      <div className="flex-1">Data Collection</div>
                    </motion.div>
                    
                    <motion.div className="h-5 border-l border-dashed border-blue-500/30 ml-3" 
                      initial={{ height: 0 }}
                      whileInView={{ height: 20 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.2, delay: 1.1 }}
                    />
                    
                    <motion.div 
                      className="flex items-center space-x-2 text-xs text-gray-400"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 1.2 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">2</div>
                      <div className="flex-1">Multi-source Validation</div>
                    </motion.div>
                    
                    <motion.div className="h-5 border-l border-dashed border-blue-500/30 ml-3" 
                      initial={{ height: 0 }}
                      whileInView={{ height: 20 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.2, delay: 1.3 }}
                    />
                    
                    <motion.div 
                      className="flex items-center space-x-2 text-xs text-gray-400"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 1.4 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">3</div>
                      <div className="flex-1">Blockchain Recording</div>
                    </motion.div>
                  </div>
                  
                  {/* Animated pulse element */}
                  <motion.div 
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-400/30"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.1, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* 3. Trading */}
            <motion.div 
              className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-purple-500/20 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">3</div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-5xl mb-6 mx-auto bg-gradient-to-br from-purple-400/20 to-purple-600/20 w-20 h-20 rounded-full flex items-center justify-center"
              >
                💹
              </motion.div>
              
              <h3 className="text-xl font-bold mb-4 text-white">Trading</h3>
              
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Buy, sell, or retire verified carbon credits on our intuitive marketplace with instant settlement. Companies and individuals can transparently offset their carbon footprint with complete confidence.
                </p>
                
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  whileInView={{ opacity: 1, height: 'auto' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/10 mt-4"
                >
                  <h4 className="text-purple-400 text-sm font-medium mb-2">Marketplace Benefits:</h4>
                  <div className="space-y-2 text-gray-400 text-sm">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span>Real-time Pricing &amp; Settlements</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span>NFT-backed Certificates</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span>Detailed Impact Tracking</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Platform details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-10"
          >
            <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed">
              Our platform provides real-time data and unparalleled transparency, empowering you to make a tangible impact while tracking your offsetting journey with precision and confidence.
            </p>
          </motion.div>

          {/* Global Impact Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-20 max-w-4xl mx-auto bg-gray-900/60 p-8 rounded-xl border border-gray-700 backdrop-blur-sm"
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-green-400 mb-6">Global Impact Dashboard</h3>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700 text-center">
                <div className="text-4xl text-green-500 mb-2">1.2M+</div>
                <div className="text-sm text-gray-400">Tons CO₂ Offset</div>
              </div>
              <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700 text-center">
                <div className="text-4xl text-blue-500 mb-2">186</div>
                <div className="text-sm text-gray-400">Verified Projects</div>
              </div>
              <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700 text-center">
                <div className="text-4xl text-purple-500 mb-2">32K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
            </div>
            
            <h4 className="text-lg font-medium text-white mb-3">2023 CO₂ Offset Target</h4>
            <div className="w-full bg-gray-800 rounded-full h-6 mb-2 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-end pr-2 text-xs font-bold"
                initial={{ width: "0%" }}
                whileInView={{ width: "75%" }} 
                viewport={{ once: true }}
                transition={{ 
                  duration: 1.5, 
                  ease: "easeOut",
                  delay: 0.8
                }}
              >
                75%
              </motion.div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 tons</span>
              <span>Target: 2M tons</span>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="text-sm text-gray-400 mb-4">Regional Distribution of Carbon Credits</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <motion.div 
                  className="bg-gray-800/80 rounded-lg p-2 border border-gray-700"
                  initial={{ height: 40, opacity: 0.5 }}
                  whileInView={{ height: 80, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <div className="h-full flex flex-col justify-between">
                    <div className="text-xs text-gray-400">Americas</div>
                    <div className="text-lg text-green-400">38%</div>
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-gray-800/80 rounded-lg p-2 border border-gray-700"
                  initial={{ height: 40, opacity: 0.5 }}
                  whileInView={{ height: 60, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  <div className="h-full flex flex-col justify-between">
                    <div className="text-xs text-gray-400">Europe</div>
                    <div className="text-lg text-green-400">25%</div>
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-gray-800/80 rounded-lg p-2 border border-gray-700"
                  initial={{ height: 40, opacity: 0.5 }}
                  whileInView={{ height: 70, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                >
                  <div className="h-full flex flex-col justify-between">
                    <div className="text-xs text-gray-400">Asia</div>
                    <div className="text-lg text-green-400">28%</div>
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-gray-800/80 rounded-lg p-2 border border-gray-700"
                  initial={{ height: 40, opacity: 0.5 }}
                  whileInView={{ height: 50, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                >
                  <div className="h-full flex flex-col justify-between">
                    <div className="text-xs text-gray-400">Africa</div>
                    <div className="text-lg text-green-400">9%</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Testimonials - Enhanced */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-10 text-white">What Our Users Say</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div 
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-gray-700 backdrop-blur-sm relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="absolute -top-4 -left-4 text-3xl">💬</div>
                <p className="text-gray-300 italic mb-4 leading-relaxed">
                  "EcoChain has revolutionized how we approach carbon offsetting. The transparency and ease of use are game-changers for our corporate sustainability goals!"
                </p>
                <div className="flex items-center mt-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">A</div>
                  <div className="ml-3">
                    <p className="text-white font-medium">Alex P.</p>
                    <p className="text-gray-400 text-sm">CEO of GreenTech Solutions</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-gray-700 backdrop-blur-sm relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="absolute -top-4 -left-4 text-3xl">💬</div>
                <p className="text-gray-300 italic mb-4 leading-relaxed">
                  "The real-time verification dashboard gives us complete confidence in our carbon credit investments. We've increased our offset commitment by 200% this year alone."
                </p>
                <div className="flex items-center mt-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">S</div>
                  <div className="ml-3">
                    <p className="text-white font-medium">Sarah M.</p>
                    <p className="text-gray-400 text-sm">Sustainability Director, FutureCorp</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <a href="#marketplace" className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg shadow-lg shadow-green-500/20 transform transition-all duration-300 hover:scale-105 hover:shadow-green-500/30">
              Explore the Marketplace
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Marketplace Section */}
      <section className="w-full bg-white py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Carbon Credit <span className="text-green-600">Marketplace</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse, purchase, and retire carbon credits from verified projects around the world.
            </p>
          </motion.div>

          {/* Featured projects */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-800">Featured Projects</h3>
              <button className="text-green-600 hover:text-green-700 font-medium flex items-center">
                View all projects
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  id: "RF-2023-089",
                  title: "Amazon Rainforest Conservation",
                  location: "Brazil",
                  image: "🌴",
                  type: "Reforestation",
                  price: "$18.45",
                  creditsAvailable: "12,450",
                  rating: 4.9,
                  verified: true,
                  co2: "1 Ton"
                },
                {
                  id: "SE-2023-142",
                  title: "Solar Energy Farm",
                  location: "India",
                  image: "☀️",
                  type: "Renewable Energy",
                  price: "$14.20",
                  creditsAvailable: "45,230",
                  rating: 4.7,
                  verified: true,
                  co2: "1 Ton"
                },
                {
                  id: "MG-2023-076",
                  title: "Methane Gas Capture",
                  location: "United States",
                  image: "♨️",
                  type: "Gas Capture",
                  price: "$12.80",
                  creditsAvailable: "9,120",
                  rating: 4.8,
                  verified: true,
                  co2: "1 Ton"
                }
              ].map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200"
                >
                  <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white text-6xl">
                    {project.image}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h4>
                        <p className="text-gray-500 text-sm flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {project.location}
                        </p>
                      </div>
                      
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {project.type}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className="text-yellow-400 flex">
                          {"★".repeat(Math.floor(project.rating))}
                          {"☆".repeat(5 - Math.floor(project.rating))}
                        </div>
                        <span className="text-gray-500 text-xs ml-2">{project.rating}/5</span>
                      </div>
                      
                      {project.verified && (
                        <span className="flex items-center text-green-600 text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600 text-sm">Available: {project.creditsAvailable}</span>
                      <span className="text-gray-600 text-sm">{project.co2} CO₂</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">{project.price}</span>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Purchase
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Market activity */}
          <div className="bg-gray-50 rounded-xl p-8 mb-16">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Latest Market Activity</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Transaction</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Project</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Credits</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Price</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Buyer</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { 
                      type: "Purchase", 
                      project: "Amazon Rainforest Conservation", 
                      credits: "500", 
                      price: "$9,225.00",
                      pricePerCredit: "$18.45",
                      buyer: "GreenTech Inc.",
                      location: "Brazil",
                      date: "2 hours ago",
                      txHash: "0x7f2c38e5d3b95a4a0c8f19167d8c5b7d9d2e898432c6f37a"
                    },
                    { 
                      type: "Retirement", 
                      project: "Wind Farm Kenya", 
                      credits: "1,200", 
                      price: "$16,440.00",
                      pricePerCredit: "$13.70",
                      buyer: "EcoAir Corp",
                      location: "Kenya",
                      date: "5 hours ago",
                      txHash: "0x9e8b1a4d5f2c38e5c7f19167d8c5b7d9d2e898432c6f37a"
                    },
                    { 
                      type: "Purchase", 
                      project: "Mangrove Restoration Initiative", 
                      credits: "800", 
                      price: "$11,600.00",
                      pricePerCredit: "$14.50",
                      buyer: "OceanGuard",
                      location: "Indonesia",
                      date: "1 day ago",
                      txHash: "0x5e2a38e5d3b95a4c7f19167d8c5b7d9d2e898432c6f37a"
                    },
                    { 
                      type: "Purchase", 
                      project: "Solar Energy Farm Rajasthan", 
                      credits: "350", 
                      price: "$4,970.00",
                      pricePerCredit: "$14.20",
                      buyer: "SustainCorp",
                      location: "India",
                      date: "1 day ago",
                      txHash: "0x3f2c38e5d3b95a4c7f19167d8c5b7d9d2e898432c6f37a"
                    },
                    { 
                      type: "Retirement", 
                      project: "Methane Capture Colorado", 
                      credits: "700", 
                      price: "$8,960.00",
                      pricePerCredit: "$12.80",
                      buyer: "CleanFutures LLC",
                      location: "United States",
                      date: "2 days ago",
                      txHash: "0x1a2c38e5d3b95a4c7f19167d8c5b7d9d2e898432c6f37a"
                    },
                    { 
                      type: "Purchase", 
                      project: "Marine Conservation Blue Carbon", 
                      credits: "250", 
                      price: "$4,875.00",
                      pricePerCredit: "$19.50",
                      buyer: "OceanicSolutions",
                      location: "Philippines",
                      date: "3 days ago",
                      txHash: "0x8b2c38e5d3b95a4c7f19167d8c5b7d9d2e898432c6f37a"
                    },
                    { 
                      type: "Retirement", 
                      project: "Reforestation Highland Project", 
                      credits: "1,500", 
                      price: "$24,750.00",
                      pricePerCredit: "$16.50",
                      buyer: "GreenPath International",
                      location: "Scotland",
                      date: "4 days ago",
                      txHash: "0x2d2c38e5d3b95a4c7f19167d8c5b7d9d2e898432c6f37a"
                    }
                  ].map((tx, index) => (
                    <motion.tr 
                      key={index}
                      initial={{ opacity: 0, backgroundColor: "rgba(236, 253, 245, 1)" }}
                      animate={{ opacity: 1, backgroundColor: "rgba(255, 255, 255, 1)" }}
                      transition={{ duration: 2, delay: index * 0.2 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${tx.type === "Purchase" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{tx.project}</div>
                          <div className="text-xs text-gray-500">{tx.location}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="text-sm font-medium">{tx.credits}</div>
                          <div className="text-xs text-gray-500">CO₂ Tons</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="text-sm font-medium">{tx.price}</div>
                          <div className="text-xs text-gray-500">{tx.pricePerCredit}/credit</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">{tx.buyer}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="text-sm text-gray-500">{tx.date}</div>
                          <div className="text-xs text-gray-400 truncate max-w-[120px]">{tx.txHash}</div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Key marketplace features */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Transparent Pricing",
                desc: "Clear, market-driven prices with no hidden fees or markups",
                icon: "💰",
                color: "from-blue-400 to-blue-600"
              },
              {
                title: "Instant Settlement",
                desc: "Blockchain-powered transactions complete in seconds, not days",
                icon: "⚡",
                color: "from-purple-400 to-purple-600"
              },
              {
                title: "Verifiable Impact",
                desc: "Track your carbon offset's real-world environmental benefits",
                icon: "🌿",
                color: "from-green-400 to-green-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className={`w-14 h-14 mb-4 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br ${feature.color} text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
