'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import wallet components with SSR disabled
const WalletComponents = dynamic(
  () => import('./WalletComponents.js').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <button 
        disabled
        className="bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
      >
        Loading...
      </button>
    )
  }
);

// Components for marketplace
const ProjectCard = ({ project }) => {
  const [purchasing, setPurchasing] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // We'll pass these functions to the WalletComponents
  const startPurchase = () => {
    setError(null); // Clear any previous errors
    setPurchasing(true);
  };
  
  const completePurchase = (hash) => {
    setTransactionHash(hash);
    setShowModal(true);
    setPurchasing(false);
  };
  
  const handlePurchaseError = (err) => {
    console.error("Transaction error:", err);
    // Handle both error objects and strings
    if (typeof err === 'object' && err !== null) {
      setError(err.message || "Transaction failed. Please try again.");
    } else {
      setError(err || "Transaction failed. Please try again.");
    }
    setPurchasing(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setTransactionHash(null);
  };

  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 h-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        <Image 
          src={project.image} 
          alt={project.title}
          fill={true}
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h4>
            <p className="text-gray-600 text-sm flex items-center">
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
            <span className="text-gray-600 text-xs ml-2">{project.rating}/5</span>
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
          <span className="text-gray-700 text-sm">Available: {project.creditsAvailable}</span>
          <span className="text-gray-700 text-sm">{project.co2} CO₂</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">{project.price}</span>
            <span className="text-gray-500 text-xs">≈ 0.025 APT</span>
          </div>
          <WalletComponents 
            project={project} 
            purchasing={purchasing}
            onStartPurchase={startPurchase}
            onCompletePurchase={completePurchase}
            onError={handlePurchaseError}
          />
        </div>
        
        {/* Error message display */}
        {error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Purchase Successful!</h3>
            <p className="text-gray-600 text-center mb-6">
              Your carbon credit NFT has been transferred to your wallet.
            </p>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-gray-700 text-sm font-medium mb-1">Transaction Hash:</p>
              <p className="text-gray-600 text-xs font-mono truncate">{transactionHash}</p>
            </div>
            
            <div className="flex gap-3">
              <a 
                href={`https://explorer.aptoslabs.com/txn/${transactionHash}?network=testnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View on Explorer
              </a>
              <button 
                onClick={closeModal}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const ProjectFilter = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Filter Projects</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <button 
            key={category.id}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeCategory === category.id ? 'bg-green-100 text-green-800' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <div className="flex items-center">
              <span className="text-lg mr-2">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Wallet Connect Button Component - Will be moved to WalletComponents.js
const WalletButton = dynamic(
  () => import('./WalletComponents.js').then(mod => mod.WalletButton),
  {
    ssr: false,
    loading: () => (
      <button
        disabled
        className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        Loading Wallet...
      </button>
    ) 
  }
);

// Sample data for marketplace
const projectCategories = [
  { id: 'all', name: 'All Projects', icon: '🌎' },
  { id: 'reforestation', name: 'Reforestation', icon: '🌳' },
  { id: 'renewable', name: 'Renewable Energy', icon: '☀️' },
  { id: 'methane', name: 'Methane Capture', icon: '♨️' },
  { id: 'conservation', name: 'Conservation', icon: '🌿' },
  { id: 'marine', name: 'Marine', icon: '🌊' }
];

const projectsData = [
  {
    id: "RF-2023-089",
    title: "Amazon Rainforest Conservation",
    location: "Brazil",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    type: "Reforestation",
    price: "$18.45",
    creditsAvailable: "12,450",
    rating: 4.9,
    verified: true,
    co2: "1 Ton",
    category: "reforestation",
    description: "This project focuses on conserving and restoring the Amazon rainforest, one of Earth's most vital carbon sinks and biodiversity hotspots."
  },
  {
    id: "SE-2023-142",
    title: "Solar Energy Farm",
    location: "India",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    type: "Renewable Energy",
    price: "$14.20",
    creditsAvailable: "45,230",
    rating: 4.7,
    verified: true,
    co2: "1 Ton",
    category: "renewable",
    description: "A large-scale solar farm in Rajasthan that replaces coal-fired power plants, significantly reducing carbon emissions in India's energy sector."
  },
  {
    id: "MG-2023-076",
    title: "Methane Gas Capture",
    location: "United States",
    image: "/images/methane-capture.jpg",
    type: "Gas Capture",
    price: "$12.80",
    creditsAvailable: "9,120",
    rating: 4.8,
    verified: true,
    co2: "1 Ton",
    category: "methane",
    description: "This project captures harmful methane emissions from landfills in Colorado, converting this potent greenhouse gas into clean energy."
  },
  {
    id: "MC-2023-105",
    title: "Marine Conservation Blue Carbon",
    location: "Philippines",
    image: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    type: "Conservation",
    price: "$19.50",
    creditsAvailable: "7,850",
    rating: 4.6,
    verified: true,
    co2: "1 Ton",
    category: "marine",
    description: "Protection of coastal mangrove forests in the Philippines, preserving vital blue carbon ecosystems and supporting local communities."
  },
  {
    id: "RF-2023-118",
    title: "Highland Reforestation Project",
    location: "Scotland",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    type: "Reforestation",
    price: "$16.50",
    creditsAvailable: "15,200",
    rating: 4.5,
    verified: true,
    co2: "1 Ton",
    category: "reforestation",
    description: "Restoration of native Caledonian forests in the Scottish Highlands, enhancing biodiversity while creating significant carbon sinks."
  },
  {
    id: "WE-2023-092",
    title: "Wind Farm Kenya",
    location: "Kenya",
    image: "https://images.unsplash.com/photo-1527847263472-aa5338d178b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    type: "Renewable Energy",
    price: "$13.70",
    creditsAvailable: "32,600",
    rating: 4.8,
    verified: true,
    co2: "1 Ton",
    category: "renewable",
    description: "Africa's largest wind power project, providing clean electricity to over 300,000 homes while avoiding 380,000 tons of CO₂ emissions annually."
  }
];

const transactions = [
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
];

export default function MarketplacePage() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);  // Initialize as empty

  useEffect(() => {
    // Initialize projects state on client side
    setFilteredProjects(projectsData);
    
    // Slight delay before starting the animation sequence
    const timer = setTimeout(() => {
      setHeroVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter projects when category changes
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProjects(projectsData);
    } else {
      setFilteredProjects(projectsData.filter(project => project.category === activeCategory));
    }
  }, [activeCategory]);

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
          <source src="/videos/Marketplace.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>

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
        <div className="relative z-20 flex flex-col items-center justify-center p-8 bg-transparent max-w-4xl mx-auto text-center">
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
              CARBON CREDIT <span className="font-medium" style={{ color: '#E0F2F1' }}>MARKETPLACE</span>
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
              Buy, sell, and retire verified carbon credits with confidence on the Aptos blockchain
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
            const marketplaceSection = document.getElementById('marketplace');
            if (marketplaceSection) {
              marketplaceSection.scrollIntoView({ behavior: 'smooth' });
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

      {/* Marketplace Section */}
      <section id="marketplace" className="w-full bg-gray-50 py-16 md:py-20">
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

          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Carbon Credit Marketplace</h1>
              <p className="text-gray-600 max-w-2xl">
                Browse and purchase verified carbon credits directly from environmental projects around the world.
              </p>
            </div>
            
            {/* Add Wallet Button */}
            <WalletButton />
          </div>
          
          {/* Market Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Total Credits Available</h3>
                <span className="text-green-600 text-2xl font-bold">122,450</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Credits Sold</h3>
                <span className="text-green-600 text-2xl font-bold">42,000</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Credits Retired</h3>
                <span className="text-green-600 text-2xl font-bold">18,000</span>
              </div>
            </motion.div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <ProjectFilter 
                categories={projectCategories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
              
              {/* Recent Transactions */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Transactions</h3>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((tx, index) => (
                    <div key={index} className="border-b border-gray-100 pb-2 last:border-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${tx.type === 'Purchase' ? 'text-blue-600' : 'text-purple-600'}`}>
                          {tx.type}
                        </span>
                        <span className="text-sm text-gray-500">{tx.date}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-600">{tx.project}</span>
                        <span className="text-sm font-medium">{tx.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="#" className="text-blue-600 text-sm mt-3 block text-center hover:underline">
                  View All Transactions
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Activity Section */}
      <section className="w-full bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Market Activity</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real-time transactions from the EcoChain carbon marketplace
            </p>
          </motion.div>
          
          <div className="bg-white rounded-xl shadow-md overflow-x-auto">
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
                {transactions.map((tx, index) => (
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
                        <div className="text-xs text-gray-700">{tx.location}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-sm font-medium">{tx.credits}</div>
                        <div className="text-xs text-gray-700">CO₂ Tons</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-sm font-medium">{tx.price}</div>
                        <div className="text-xs text-gray-700">{tx.pricePerCredit}/credit</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">{tx.buyer}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-sm text-gray-700">{tx.date}</div>
                        <div className="text-xs text-gray-600 truncate max-w-[120px]">{tx.txHash}</div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Marketplace Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides a seamless and transparent way to trade carbon credits
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="w-14 h-14 mb-4 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                💰
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">Clear, market-driven prices with no hidden fees or markups, ensuring fair value for buyers and sellers.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="w-14 h-14 mb-4 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                ⚡
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Settlement</h3>
              <p className="text-gray-600">Blockchain-powered transactions complete in seconds, not days, with immediate delivery of carbon credit NFTs.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="w-14 h-14 mb-4 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                🌿
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verifiable Impact</h3>
              <p className="text-gray-600">Track your carbon offset's real-world environmental benefits with detailed impact metrics and project data.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-r from-green-600 to-emerald-600 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Offset Your Carbon Footprint?</h2>
            <p className="text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses and individuals making a tangible impact on climate change through verified carbon credits.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#marketplace" className="inline-block px-8 py-4 bg-white text-green-600 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-colors">
                Start Trading
              </Link>
              <Link href="/verification" className="inline-block px-8 py-4 bg-green-700 text-white font-medium rounded-lg shadow-lg hover:bg-green-800 transition-colors">
                Learn About Verification
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
} 