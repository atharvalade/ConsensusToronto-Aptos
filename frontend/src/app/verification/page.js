'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Advanced animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Verification Process Component
const VerificationProcess = ({ step, title, description, icon, delay }) => {
  return (
    <motion.div 
      className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-700 relative z-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay: delay }}
    >
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">{step}</div>
      
      <div className="text-5xl mb-6 mx-auto bg-gradient-to-br from-green-400/20 to-green-600/20 w-20 h-20 rounded-full flex items-center justify-center">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// IoT Data Component
const IoTDataComponent = ({ title, data, icon }) => {
  return (
    <motion.div
      className="bg-gray-800/90 rounded-lg p-4 border border-gray-700"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-green-400 text-xl">{icon}</span>
        <h4 className="text-white font-medium">{title}</h4>
      </div>
      <div className="space-y-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm py-1 border-b border-gray-700">
            <span className="text-gray-400">{item.label}</span>
            <span className="text-white font-mono">{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// NFT Certificate Component
const NFTCertificate = () => {
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden border-4 border-green-500/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 z-0"></div>
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white">Carbon Credit Certificate</h3>
            <p className="text-green-400">Verified on Aptos Blockchain</p>
          </div>
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
            <Image 
              src="/images/EcoChainLogo.svg" 
              alt="EcoChain Logo"
              width={60}
              height={60}
              className="filter brightness-0 invert"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Project ID</p>
            <p className="text-white font-medium">RF-2023-089</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Verification Date</p>
            <p className="text-white font-medium">May 12, 2023</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Location</p>
            <p className="text-white font-medium">3.4653° S, 73.8078° W</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">CO₂ Offset</p>
            <p className="text-white font-medium">500 Tons</p>
          </div>
        </div>

        <div className="mt-6 border-t border-white/20 pt-4">
          <p className="text-gray-400 text-sm">Verification Hash</p>
          <p className="text-white/70 font-mono text-xs truncate">0x7f2c38e5d3b95a4a0c8f19167d8c5b7d9d2e898432c6f37a12cf42bc198f2d8e</p>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">Verified</span>
          </div>
          <Link href="#" className="text-blue-400 text-sm hover:underline">View on Explorer</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default function VerificationPage() {
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
          <source src="/videos/Verification.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        {/* Logo - Top Left */}
        <div className="absolute top-4 left-4 z-20">
          <Image
            src="/images/EcoChainLogo.svg" 
            alt="EcoChain Logo" 
            width={120}  
            height={40} 
            priority
            className="filter brightness-0 invert"
          />
        </div>

        {/* Creative Headline with Visual Effects */}
        <div className="relative z-20 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: heroVisible ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Main Title */}
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-thin mb-4 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 20 }}
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
              <span className="font-medium" style={{ color: '#E0F2F1' }}>VERIFICATION</span> SYSTEM
            </motion.h1>
            
            {/* Elegant line separator */}
            <motion.div 
              className="w-16 h-px mx-auto mb-6"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: heroVisible ? 64 : 0, opacity: heroVisible ? 0.8 : 0 }}
              transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
              style={{ 
                background: 'linear-gradient(to right, transparent, rgba(200, 255, 218, 0.7), transparent)',
              }}
            />
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 10 }}
              transition={{ duration: 2, delay: 1.4 }}
              className="text-base sm:text-lg md:text-xl mt-2 font-light max-w-2xl mx-auto"
              style={{ 
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                color: 'rgba(240, 248, 255, 0.9)',
                letterSpacing: '0.05em',
                lineHeight: 1.6,
              }}
            >
              Transparent, immutable, and secure verification of carbon credits on the Aptos blockchain
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll down indicator - Bottom Center */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 z-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: heroVisible ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          onClick={() => {
            const verificationProcess = document.getElementById('verification-process');
            if (verificationProcess) {
              verificationProcess.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <p 
            className="text-xs font-medium mb-1"
            style={{ 
              textShadow: '0px 1px 5px rgba(0,0,0,0.9)',
              color: 'white',
              letterSpacing: '0.15em',
              textTransform: 'uppercase'
            }}
          >
            EXPLORE
          </p>
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

      {/* Verification Process Section */}
      <section 
        id="verification-process" 
        className="w-full bg-gradient-to-b from-gray-900 to-gray-800 py-20 relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-green-500/5 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-green-500/10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              Verification Process
            </h2>
            <p className="text-gray-300 mt-4 max-w-3xl mx-auto">
              Our blockchain-powered verification system ensures that every carbon credit is authentic, 
              transparent, and accurately represents real environmental impact.
            </p>
          </motion.div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-3 gap-12 lg:gap-8 mb-16 md:mb-20 relative">
            {/* Line connecting elements (visible on medium screens and up) */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-green-500/30 via-emerald-500/60 to-green-500/30"></div>
            
            {/* Step 1: Data Collection */}
            <VerificationProcess
              step="1"
              title="Data Collection"
              description="IoT sensors deployed at project sites collect real-time environmental data including CO2 levels, biomass growth, and other key metrics. Data is cryptographically signed at the source."
              icon="📡"
              delay={0.2}
            />

            {/* Step 2: Blockchain Verification */}
            <VerificationProcess
              step="2"
              title="Blockchain Verification"
              description="Collected data is verified through a Move smart contract on Aptos blockchain, ensuring data integrity, preventing tampering, and establishing a transparent verification record."
              icon="🔗"
              delay={0.4}
            />

            {/* Step 3: NFT Minting */}
            <VerificationProcess
              step="3"
              title="NFT Certificate"
              description="Once verified, a unique NFT certificate is minted, containing all project details, verification data, and impact metrics. This creates an immutable record of the carbon credit on the blockchain."
              icon="🏆"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* IoT Verification Details */}
      <section className="w-full bg-gray-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,#4ade80,transparent)]"></div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              IoT-Powered Verification
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Our network of IoT sensors continuously monitors carbon offset projects in real-time,
              ensuring data accuracy and authenticity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side: IoT data visualization */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-white">
                Real-time Data Collection
              </h3>
              <p className="text-lg text-gray-300">
                Our network of sensors continuously monitors carbon offset projects, capturing critical environmental data:
              </p>
              
              {/* Real-time data display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <IoTDataComponent
                  title="Environmental Metrics"
                  icon="🌱"
                  data={[
                    { label: "CO₂ Absorption Rate", value: "4.28 kg/day" },
                    { label: "Tree Growth Rate", value: "0.87 cm/month" },
                    { label: "Soil Carbon Content", value: "5.23%" },
                    { label: "Biomass Accumulation", value: "2.14 tons/hectare" }
                  ]}
                />
                
                <IoTDataComponent
                  title="Geographical Data"
                  icon="🌍"
                  data={[
                    { label: "Latitude", value: "3.4653° S" },
                    { label: "Longitude", value: "73.8078° W" },
                    { label: "Elevation", value: "824 m" },
                    { label: "Area Monitored", value: "1,250 hectares" }
                  ]}
                />
                
                <IoTDataComponent
                  title="Verification Status"
                  icon="✅"
                  data={[
                    { label: "Last Updated", value: "2 minutes ago" },
                    { label: "Consensus Rate", value: "99.7%" },
                    { label: "Verification Status", value: "Confirmed" },
                    { label: "Next Audit", value: "25 days" }
                  ]}
                />
                
                <IoTDataComponent
                  title="Blockchain Records"
                  icon="🔗"
                  data={[
                    { label: "Transaction Hash", value: "0x7f2c38..." },
                    { label: "Block Number", value: "12,457,891" },
                    { label: "Total Verifications", value: "24" },
                    { label: "Contract Address", value: "0x3f91a2..." }
                  ]}
                />
              </div>
            </motion.div>
            
            {/* Right side: NFT Certificate */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">
                NFT Carbon Credit Certificate
              </h3>
              <NFTCertificate />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 bg-gray-900/50 rounded-lg p-4 border border-gray-700"
              >
                <h4 className="text-white font-medium mb-2">Certificate Benefits</h4>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Immutable record on Aptos blockchain</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>IPFS storage for images and additional data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Full verification history and audit trail</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Easy transfer and retirement tracking</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Contract Section */}
      <section className="w-full bg-gray-900 py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Move Smart Contract Verification
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Our verification process leverages Move smart contracts on Aptos blockchain for 
              secure, transparent, and efficient carbon credit verification.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side: Code sample */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-gray-950 rounded-xl p-6 border border-gray-800 font-mono text-sm overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full py-2 px-4 bg-gray-800 text-gray-300 text-xs flex items-center">
                  <span className="mr-2">•</span>
                  <span>ecochain_verification.move</span>
                </div>
                <pre className="text-gray-300 mt-6 overflow-x-auto">
                  <code>
{`module ecochain::verification {
    // Verification struct to track carbon credit verification
    struct VerificationRecord has key, store {
        id: UID,
        project_id: ID,
        verifier: address,
        timestamp: u64,
        latitude: String,
        longitude: String,
        co2_captured: u64,  // in kg
        methodology: String,
        data_hash: vector<u8>,
        ipfs_cid: String,
        status: u8, // 0: pending, 1: verified, 2: rejected
    }
    
    // Create a new verification request
    public fun create_verification(
        project_id: ID,
        latitude: String,
        longitude: String,
        co2_captured: u64,
        methodology: String,
        data_hash: vector<u8>,
        ipfs_cid: String,
        ctx: &mut TxContext
    ): VerificationRecord {
        // Implementation details...
    }
    
    // Verify carbon credit data by authorized verifier
    public fun verify(
        verification: &mut VerificationRecord,
        verifier: &Verifier,
        ctx: &mut TxContext
    ) {
        // Validation logic...
        // Check verifier authorization
        // Cross reference IoT data
        // Update verification status
    }
    
    // Mint NFT certificate after successful verification
    public fun mint_certificate(
        verification: &VerificationRecord,
        ctx: &mut TxContext
    ): Certificate {
        // Create immutable carbon credit certificate
    }
}`}
                  </code>
                </pre>
              </div>
            </motion.div>
            
            {/* Right side: Verification explanation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold text-white">
                How Smart Contract Verification Works
              </h3>
              
              <div className="space-y-6">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-green-400 text-lg mb-2">Data Integrity</h4>
                  <p className="text-gray-300">
                    IoT sensor data is cryptographically hashed and signed at the source, ensuring that
                    the data cannot be tampered with during transmission or storage.
                  </p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-green-400 text-lg mb-2">Multi-Verifier Consensus</h4>
                  <p className="text-gray-300">
                    Multiple authorized verifiers independently validate the data using predefined
                    methodologies, creating a trustless verification system that prevents fraud.
                  </p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-green-400 text-lg mb-2">Permanent Record</h4>
                  <p className="text-gray-300">
                    Once verified, the carbon credit data is permanently recorded on the Aptos blockchain,
                    creating an immutable record that can be audited by anyone.
                  </p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-green-400 text-lg mb-2">Certificate Minting</h4>
                  <p className="text-gray-300">
                    After successful verification, an NFT certificate is minted, containing all project
                    details and verification data, ready to be traded or retired on the marketplace.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-br from-green-900 to-gray-900 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Start Verifying?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our network of verified carbon projects and contribute to a more sustainable future
              with transparent, blockchain-verified carbon credits.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace" className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-300">
                Explore Marketplace
              </Link>
              <Link href="#" className="inline-block px-8 py-4 bg-gray-800 text-white font-medium rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300">
                Become a Verifier
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Background Effect */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-gray-900 to-transparent z-0"></div>
      </section>
    </>
  );
} 