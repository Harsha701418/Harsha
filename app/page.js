'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Navigation2,
  Zap,
  Menu,
  Loader,
  ShoppingBag,
  ChevronRight,
  Thermometer,
  Gauge,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Twitter,
  Instagram,
  Github,
  ArrowRight,
  X,
  PlayCircle,
  Check,
  MapPin
} from 'lucide-react';

export default function Home() {
  // --- Global / UI states ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Order Simulator Modal states ---
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [orderStep, setOrderStep] = useState('configure'); // 'configure' | 'tracking'
  const [selectedDosa, setSelectedDosa] = useState('Mysore Masala');
  const [selectedSpice, setSelectedSpice] = useState('Medium Saffron');
  
  // Telemetry stream state
  const [telemetry, setTelemetry] = useState({
    speed: '0 km/h',
    alt: '0m',
    temp: '85°C',
    status: 'Initializing drone components...',
    progress: 0
  });
  const [dronePosition, setDronePosition] = useState({ left: '10%', top: 'calc(50% - 18px)' });
  const [dashOffset, setDashOffset] = useState(1000);
  const [isFlightFinished, setIsFlightFinished] = useState(false);
  const flightIntervalRef = useRef(null);

  // --- Feature Modal states ---
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tabLidar'); // 'tabLidar' | 'tabThermal' | 'tabDrop'

  // LiDAR state
  const [obstacles, setObstacles] = useState([]);
  const [lidarLogs, setLidarLogs] = useState([]);
  const lidarLogRef = useRef(null);

  // Thermal state
  const [ventValue, setVentValue] = useState(50);
  const [thermalStats, setThermalStats] = useState({
    temp: 68,
    hum: 50,
    crisp: 79,
    zoneText: 'ZONE: CALIBRATING...',
    statusColor: 'var(--accent-gold)',
    steamOpacity: 0.4,
    steamScale: 1.5,
    steamTranslate: 20
  });

  // Balcony Drop state
  const [activeFloor, setActiveFloor] = useState(1);
  const [dropStatus, setDropStatus] = useState('Drone standing by. Select target floor above to launch drop.');
  const [winchDroneTop, setWinchDroneTop] = useState('115px'); // Default 1st floor height - 45px (160 - 45)
  const [winchCableHeight, setWinchCableHeight] = useState('0px');
  const [winchPackageActive, setWinchPackageActive] = useState(false);

  // --- Scroll Effect ---
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Intersection Observer for reveals ---
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    reveals.forEach(el => observer.observe(el));
    return () => reveals.forEach(el => observer.unobserve(el));
  }, []);

  // --- spotlight mouse move handler ---
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  };

  // --- Order Simulator Logic ---
  const openOrderSimulator = (plan = null) => {
    if (plan === 'Lite') {
      setSelectedDosa('Ghee Roast Plain');
      setSelectedSpice('Classic Lite');
    } else if (plan === 'Pro') {
      setSelectedDosa('Cheese Chilli Rava');
      setSelectedSpice('Guntur Fire');
    }
    setIsOrderOpen(true);
    resetOrderSimulator();
  };

  const resetOrderSimulator = () => {
    setOrderStep('configure');
    setTelemetry({
      speed: '0 km/h',
      alt: '0m',
      temp: '85°C',
      status: 'Initializing drone components...',
      progress: 0
    });
    setDronePosition({ left: '10%', top: 'calc(50% - 18px)' });
    setDashOffset(1000);
    setIsFlightFinished(false);
    if (flightIntervalRef.current) {
      clearInterval(flightIntervalRef.current);
    }
  };

  const launchOrder = () => {
    setOrderStep('tracking');
    
    const statuses = [
      { progress: 0, text: 'Piping hot dosa prepared and sealed in Aero-Pod.', speed: 0, alt: 0, temp: 85 },
      { progress: 15, text: 'Drone rotor pre-checks passed. Clearance granted.', speed: 10, alt: 5, temp: 85 },
      { progress: 30, text: 'Launching flight path. Speeding up over 80ft road...', speed: 45, alt: 18, temp: 84 },
      { progress: 50, text: 'AI autopilot detecting environment. Sidestepping residential power lines.', speed: 58, alt: 22, temp: 83 },
      { progress: 70, text: 'Dodging curious flock of pigeons. Cruising towards destination...', speed: 64, alt: 24, temp: 82 },
      { progress: 85, text: 'Approaching geo-fenced balcony boundaries. Initiating hover.', speed: 20, alt: 12, temp: 81 },
      { progress: 95, text: 'Balcony drop check: secure. Releasing Thermo-Pod.', speed: 2, alt: 3, temp: 80 },
      { progress: 100, text: 'Dosa safely landed! Breakfast is served. 🍽️🔥', speed: 0, alt: 0, temp: 80 }
    ];

    let currentStep = 0;
    setTimeout(() => {
      // Trigger SVG offset animation
      setDashOffset(0);

      flightIntervalRef.current = setInterval(() => {
        if (currentStep >= statuses.length) {
          clearInterval(flightIntervalRef.current);
          return;
        }

        const data = statuses[currentStep];
        setTelemetry({
          speed: `${data.speed} km/h`,
          alt: `${data.alt}m`,
          temp: `${data.temp}°C`,
          status: data.text,
          progress: data.progress
        });

        // Slide the drone element across
        const leftPercent = 10 + (data.progress * 0.76); // 10% to 86% range
        const verticalArc = Math.sin((data.progress / 100) * Math.PI) * 45;
        setDronePosition({
          left: `${leftPercent}%`,
          top: `calc(50% - 18px - ${verticalArc}px)`
        });

        if (data.progress === 100) {
          setIsFlightFinished(true);
        }

        currentStep++;
      }, 1000);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (flightIntervalRef.current) clearInterval(flightIntervalRef.current);
    };
  }, []);

  // --- Features Modals Tab Logic ---
  const openFeaturesModal = (tabIndex) => {
    const tabs = ['tabLidar', 'tabThermal', 'tabDrop'];
    setIsFeaturesOpen(true);
    switchTab(tabs[tabIndex]);
  };

  const switchTab = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'tabLidar') {
      resetLidar();
    } else if (tabId === 'tabThermal') {
      updateThermal(50);
    } else if (tabId === 'tabDrop') {
      resetDrop();
    }
  };

  // --- TAB 1: LiDAR Logic ---
  const addLidarLog = (message, type = 'info') => {
    const timeString = new Date().toLocaleTimeString();
    setLidarLogs(prev => [...prev, { time: timeString, text: message, type }]);
  };

  const resetLidar = () => {
    setObstacles([]);
    setLidarLogs([]);
    setTimeout(() => {
      addLidarLog('LiDAR sensor booted. Autopilot tracking active.', 'success');
      addLidarLog('Airspace analysis: 0 obstacles within 50m radius.', 'info');
    }, 100);
  };

  const spawnObstacle = (type) => {
    // Avoid stacking more than 4
    setObstacles(prev => {
      const next = [...prev];
      if (next.length >= 4) {
        next.shift();
      }

      const id = Date.now() + Math.random();
      const angle = Math.random() * Math.PI * 2;
      const distance = 60 + Math.random() * 40; // distance from center
      const x = 50 + Math.cos(angle) * (distance / 2.2);
      const y = 50 + Math.sin(angle) * (distance / 2.2);

      let emoji = '🦅';
      let name = 'Local Crow';
      if (type === 'wire') { emoji = '⚡'; name = 'Power Cable'; }
      if (type === 'kite') { emoji = '🪁'; name = 'Flying Kite'; }

      const newObs = { id, type, left: `${x}%`, top: `${y}%`, emoji, name, status: 'spawning' };

      // Trigger decision logs
      addLidarLog(`CRITICAL: ${name} detected at angle ${(angle * 180 / Math.PI).toFixed(0)}°!`, 'warning');

      // Dodge simulation
      setTimeout(() => {
        setObstacles(currentObs => 
          currentObs.map(o => o.id === id ? {
            ...o,
            status: 'dodging',
            left: `${x + 8}%`,
            top: `${y - 8}%`
          } : o)
        );
        addLidarLog(`REROUTING: AP-Autopilot recalculating vector. Vector adjusted +15° right.`, 'success');
      }, 800);

      // Autopilot Clear
      setTimeout(() => {
        addLidarLog(`CLEARED: Obstacle bypassed successfully. Resuming primary path.`, 'info');
        setObstacles(currentObs => currentObs.filter(o => o.id !== id));
      }, 3000);

      return [...next, newObs];
    });
  };

  useEffect(() => {
    if (lidarLogRef.current) {
      lidarLogRef.current.scrollTop = lidarLogRef.current.scrollHeight;
    }
  }, [lidarLogs]);

  // --- TAB 2: Thermal Logic ---
  const updateThermal = (valvePct) => {
    setVentValue(valvePct);
    const temp = Math.round(90 - (valvePct * 0.45)); // 90C down to 45C
    const humidity = Math.round(100 - (valvePct * 1.0)); // 100% down to 0%
    
    const idealValve = 35;
    const deviation = Math.abs(valvePct - idealValve);
    let crispiness = Math.round(100 - (deviation * 1.4));
    crispiness = Math.max(10, Math.min(100, crispiness)); // clip 10-100

    let zoneText = 'ZONE: TOO COLD (LOSING WARMTH) ❄️';
    let statusColor = 'var(--accent-gold)';
    
    if (crispiness >= 90) {
      statusColor = 'var(--accent-teal)';
      zoneText = 'ZONE: PERFECT GOLDEN CRISP! 🔥🏆';
    } else if (valvePct < 25) {
      statusColor = '#ef4444';
      zoneText = 'ZONE: CONDENSATION WARNING (SOGGY) 🌧️';
    }

    // Steam specs
    let steamOpacity = 0;
    let steamScale = 1;
    let steamTranslate = 10;
    if (valvePct > 10) {
      steamOpacity = (valvePct / 100) * 0.8;
      steamScale = 1 + valvePct * 0.01;
      steamTranslate = 10 + valvePct * 0.2;
    }

    setThermalStats({
      temp,
      hum: humidity,
      crisp: crispiness,
      zoneText,
      statusColor,
      steamOpacity,
      steamScale,
      steamTranslate
    });
  };

  // --- TAB 3: Balcony Drop Logic ---
  const resetDrop = () => {
    setWinchDroneTop('115px'); // Default 1st floor height (160px - 45px)
    setWinchCableHeight('0px');
    setWinchPackageActive(false);
    setDropStatus('Drone hovering at 25m. Select a target balcony floor.');
    setActiveFloor(1);
  };

  const handleFloorSelect = (floorNum, heightPx) => {
    setActiveFloor(floorNum);
    const floorName = floorNum === 3 ? 'Penthouse' : `Floor ${floorNum}`;
    setDropStatus(`Drone aligning coordinates to ${floorName}...`);
    setWinchCableHeight('0px');
    setWinchPackageActive(false);

    // Phase 1: Drone moves to correct vertical alignment
    setTimeout(() => {
      const hoverHeight = heightPx - 45;
      setWinchDroneTop(`${hoverHeight}px`);
      setDropStatus(`Autopilot hover lock engaged over ${floorName}. Lowering package...`);

      // Phase 2: Extend cable and show package
      setTimeout(() => {
        setWinchPackageActive(true);
        setWinchCableHeight('35px');

        // Phase 3: Deliver
        setTimeout(() => {
          setDropStatus(`Dosa package securely landed on ${floorName}! Bon Appétit! 🥙🚀`);
        }, 1500);
      }, 1500);
    }, 500);
  };

  return (
    <>
      {/* Ambient Backdrop */}
      <div className="bg-blobs">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="bg-grid"></div>
      </div>

      {/* Header Navigation */}
      <header id="header" className={isScrolled ? 'scrolled' : ''}>
        <div className="nav-container">
          <a href="#" className="logo">
            <div class="logo-icon-container">
              <Navigation2 style={{ transform: 'rotate(45deg)', strokeWidth: 3, width: 20, height: 20 }} />
            </div>
            <div className="logo-text">Air<span>Dosa</span></div>
          </a>
          <ul className={`nav-menu ${mobileMenuOpen ? 'mobile-active' : ''}`}>
            <li><a href="#" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
            <li><a href="#features" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Tech Features</a></li>
            <li><a href="#pricing" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Subscription Pricing</a></li>
          </ul>
          <div className="nav-actions">
            <button className="btn btn-secondary btn-order-trigger" style={{ padding: '10px 20px', fontSize: '0.9rem' }} onClick={() => openOrderSimulator()}>
              <Zap style={{ width: 16, height: 16 }} /> Order Simulator
            </button>
            <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-content reveal">
            <div className="hero-badge">
              <Loader style={{ width: 14, height: 14, animation: 'spin 8s linear infinite' }} /> AI-Powered Drone Logistics
            </div>
            <h1 className="hero-title">
              Crispy Dosas.<br />
              <span className="gradient-text-saffron">Delivered by Drones</span><br />
              in 5 Minutes.
            </h1>
            <p className="hero-description">
              Soggy deliveries are history. AirDosa combines automated cloud kitchens with autonomous flight mapping, dropping fresh, golden, piping-hot dosas directly onto your balcony.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-order-trigger" onClick={() => openOrderSimulator()}>
                <ShoppingBag /> Launch Order Simulator
              </button>
              <a href="#features" className="btn btn-secondary">
                Explore Tech Specs <ChevronRight />
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">300s<span>⏱️</span></div>
                <div className="stat-label">Batter to Balcony Time</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%<span>🔥</span></div>
                <div className="stat-label">Crispiness Retention</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.9<span>⭐</span></div>
                <div className="stat-label">98k Happy Indian Foodies</div>
              </div>
            </div>
          </div>
          
          {/* Visual Showcase */}
          <div className="hero-visual reveal reveal-delay-2">
            <div className="drone-image-card">
              <div className="drone-image-wrapper">
                <img src="/airdosa_drone_delivery.png" alt="Futuristic AirDosa Delivery Drone over Bengaluru skyline" />
              </div>
              
              {/* UI Telemetry Badges */}
              <div className="hud-badge hud-1">
                <div className="hud-icon saffron">
                  <Thermometer />
                </div>
                <div className="hud-data">
                  <h5>Pod Internal</h5>
                  <p>85.4°C (Optimal)</p>
                </div>
              </div>

              <div className="hud-badge hud-2">
                <div className="hud-icon">
                  <Gauge />
                </div>
                <div className="hud-data">
                  <h5>Telemetry</h5>
                  <p>Altitude: 15m | 52 km/h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header reveal">
          <div className="section-badge">How It Works</div>
          <h2 className="section-title">Freshness in Flight</h2>
          <p className="section-description">
            We solved the age-old problem of soggy delivery dosas. Here is the cutting-edge tech that makes it possible.
          </p>
        </div>

        <div className="features-grid">
          {/* Feature Card 1 */}
          <div className="glass-card feature-card reveal reveal-delay-1" style={{ cursor: 'pointer' }} onMouseMove={handleCardMouseMove} onClick={() => openFeaturesModal(0)}>
            <div className="feature-icon-wrapper">
              <Navigation style={{ width: 28, height: 28 }} />
            </div>
            <h3 className="feature-title">LiDAR Autopilot</h3>
            <p className="feature-text">
              Our drones navigate complex urban skies, dodging high-tension power lines, buildings, and local crows with military-grade collision avoidance sensors.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="glass-card feature-card reveal reveal-delay-2" style={{ cursor: 'pointer' }} onMouseMove={handleCardMouseMove} onClick={() => openFeaturesModal(1)}>
            <div className="feature-icon-wrapper">
              <ShieldCheck style={{ width: 28, height: 28 }} />
            </div>
            <h3 className="feature-title">Thermo-Crisp Pod</h3>
            <p className="feature-text">
              Carbon-fiber containers featuring dynamic ventilation valves. It releases steam while locking in tawa heat, keeping the dosa perfectly crispy.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="glass-card feature-card reveal reveal-delay-3" style={{ cursor: 'pointer' }} onMouseMove={handleCardMouseMove} onClick={() => openFeaturesModal(2)}>
            <div className="feature-icon-wrapper">
              <Zap style={{ width: 28, height: 28 }} />
            </div>
            <h3 className="feature-title">5-Min Balcony Drop</h3>
            <p className="feature-text">
              No stairs, no elevators, no gates. Drones drop directly to your balcony or window sill using real-time spatial tags. Instant gratification, served hot.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="section-header reveal">
          <div className="section-badge">Simple Pricing</div>
          <h2 className="section-title">Pick Your Fuel Plan</h2>
          <p className="section-description">
            Whether you want a casual weekend drop or unlimited daily breakfasts, we have a plan suited for your appetite.
          </p>
        </div>

        <div className="pricing-grid">
          {/* Plan 1: Dosa Lite */}
          <div className="glass-card pricing-card reveal reveal-delay-1">
            <h3 className="plan-name">Dosa Lite</h3>
            <p className="plan-description">Great for casual cravings and weekend experimental dosa drops.</p>
            <div className="plan-price">
              <span className="price-currency">₹</span>
              <span className="price-amount">99</span>
              <span className="price-period">/ delivery</span>
            </div>
            <ul className="plan-features">
              <li><CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0, color: 'var(--accent-teal)' }} /> Standard 10-Min Delivery</li>
              <li><CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0, color: 'var(--accent-teal)' }} /> Access to Classic Menu</li>
              <li><CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0, color: 'var(--accent-teal)' }} /> Balcony Dropping System</li>
              <li><CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0, color: 'var(--accent-teal)' }} /> Standard Customer Care</li>
            </ul>
            <button className="btn btn-secondary plan-button btn-order-trigger" onClick={() => openOrderSimulator('Lite')}>
              Order Lite Now
            </button>
          </div>

          {/* Plan 2: Dosa Pro */}
          <div className="glass-card pricing-card premium reveal reveal-delay-2">
            <div className="popular-tag">Most Popular</div>
            <h3 className="plan-name gradient-text-saffron">Dosa Pro</h3>
            <p className="plan-description">For the ultimate South Indian foodie. Free deliveries, speed drone paths, and premium batters.</p>
            <div className="plan-price">
              <span className="price-currency">₹</span>
              <span className="price-amount">499</span>
              <span className="price-period">/ month</span>
            </div>
            <ul className="plan-features">
              <li><CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0, color: 'var(--accent-saffron)' }} /> <strong>Unlimited Free Deliveries</strong></li>
              <li><CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0, color: 'var(--accent-saffron)' }} /> Priority 5-Min Hyper-Delivery</li>
              <li><CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0, color: 'var(--accent-saffron)' }} /> Premium Menu (Schezwan, Cheese Rava)</li>
              <li><CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0, color: 'var(--accent-saffron)' }} /> Custom Batter & Butter Ratio Selection</li>
              <li><CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0, color: 'var(--accent-saffron)' }} /> 24/7 VIP Priority Fleet Support</li>
            </ul>
            <button className="btn btn-primary plan-button btn-order-trigger" onClick={() => openOrderSimulator('Pro')}>
              Subscribe to Pro
            </button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="logo">
              <div class="logo-icon-container">
                <Navigation2 style={{ transform: 'rotate(45deg)', strokeWidth: 3, width: 20, height: 20 }} />
              </div>
              <div className="logo-text">Air<span>Dosa</span></div>
            </a>
            <p>Serving future-ready, piping hot breakfast. Re-imagining Indian food logistics through autonomous aerial robotics.</p>
            <div className="footer-socials">
              <a href="#" className="social-btn"><Twitter style={{ width: 18, height: 18 }} /></a>
              <a href="#" className="social-btn"><Instagram style={{ width: 18, height: 18 }} /></a>
              <a href="#" className="social-btn"><Github style={{ width: 18, height: 18 }} /></a>
            </div>
          </div>
          
          <div className="footer-links-col">
            <h4>Explore Tech</h4>
            <ul>
              <li><a href="#features">Drone Specifications</a></li>
              <li><a href="#pricing">Subscription Model</a></li>
              <li><a href="#">Launch Cities (Indiranagar)</a></li>
              <li><a href="#">Aero-Cooking Safety</a></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Get notified when AirDosa launching hubs open in HSR Layout or Koramangala.</p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed! We will notify you when we fly to your neighborhood.'); }}>
              <input type="email" placeholder="Enter your email" required className="newsletter-input" />
              <button type="submit" className="newsletter-btn">
                <ArrowRight style={{ width: 20, height: 20 }} />
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 AirDosa Aviation Pvt Ltd. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Aviation Compliance</a>
            <a href="#">FSSAI License</a>
          </div>
        </div>
      </footer>

      {/* Floating CTA Button */}
      <button className="floating-order-btn btn-order-trigger" onClick={() => openOrderSimulator()}>
        <Zap /> Order Now
      </button>

      {/* Order Simulator Modal */}
      <div className={`modal-overlay ${isOrderOpen ? 'active' : ''}`} onClick={(e) => { if (e.target.classList.contains('modal-overlay')) setIsOrderOpen(false); }}>
        <div className="modal-card">
          <button className="close-modal" onClick={() => setIsOrderOpen(false)}>
            <X style={{ width: 20, height: 20 }} />
          </button>
          
          <div className="modal-header">
            <h3 className="modal-title">
              {orderStep === 'configure' ? <PlayCircle style={{ color: 'var(--accent-saffron)' }} /> : <Navigation style={{ color: 'var(--accent-teal)' }} />}
              {orderStep === 'configure' ? 'AirDosa Flight Simulator' : 'Drone Telemetry Stream'}
            </h3>
            <p className="modal-subtitle">
              {orderStep === 'configure' 
                ? 'Custom-configure and deploy your autonomous drone order.' 
                : 'Live tracking flight AD-402 from Central Indiranagar Hub.'}
            </p>
          </div>

          <div className="simulator-content">
            {orderStep === 'configure' ? (
              <div className="customizer-box">
                <h4 className="customizer-title">Select Dosa Base</h4>
                <div className="options-grid">
                  {['Mysore Masala', 'Ghee Roast Plain', 'Cheese Chilli Rava'].map((dosa) => (
                    <button
                      key={dosa}
                      className={`opt-btn ${selectedDosa === dosa ? 'active' : ''}`}
                      onClick={() => setSelectedDosa(dosa)}
                    >
                      {dosa}
                    </button>
                  ))}
                </div>

                <h4 className="customizer-title">Select Spice/Butter Level</h4>
                <div className="options-grid">
                  {['Classic Lite', 'Medium Saffron', 'Guntur Fire'].map((spice) => (
                    <button
                      key={spice}
                      className={`opt-btn ${selectedSpice === spice ? 'active' : ''}`}
                      onClick={() => setSelectedSpice(spice)}
                    >
                      {spice}
                    </button>
                  ))}
                </div>

                <button className="btn btn-primary modal-btn" onClick={launchOrder}>
                  <Navigation /> Deploy Delivery Drone
                </button>
              </div>
            ) : (
              <>
                <div className="tracking-map" style={{ display: 'block' }}>
                  <svg className="tracking-path-svg">
                    <path d="M 60 70 Q 250 10, 440 70" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="4" strokeDasharray="8 6" />
                    <path
                      d="M 60 70 Q 250 10, 440 70"
                      fill="none"
                      stroke="var(--accent-teal)"
                      strokeWidth="4"
                      strokeDasharray="1000"
                      strokeDashoffset={dashOffset}
                      style={{ transition: 'stroke-dashoffset 8s linear' }}
                    />
                  </svg>
                  
                  <div className="kitchen-node">
                    <span className="node-dot saffron"></span>
                    <span className="node-label">Indiranagar Hub</span>
                  </div>

                  <div className="home-node">
                    <span className="node-dot"></span>
                    <span className="node-label">Your Balcony</span>
                  </div>

                  <div className="simulated-drone active" style={{ left: dronePosition.left, top: dronePosition.top }}>
                    <Navigation2 style={{ transform: 'rotate(45deg)', width: 18, height: 18, strokeWidth: 3 }} />
                  </div>
                </div>

                <div className="telemetry-grid" style={{ display: 'grid' }}>
                  <div className="telemetry-item">
                    <div className="telemetry-lbl">Speed</div>
                    <div className="telemetry-val">{telemetry.speed}</div>
                  </div>
                  <div className="telemetry-item">
                    <div className="telemetry-lbl">Altitude</div>
                    <div className="telemetry-val">{telemetry.alt}</div>
                  </div>
                  <div className="telemetry-item">
                    <div className="telemetry-lbl">Dosa Temp</div>
                    <div className="telemetry-val">{telemetry.temp}</div>
                  </div>
                </div>

                <div className="tracking-status-box" style={{ display: 'flex' }}>
                  <div 
                    className="status-pulse-dot" 
                    style={{ 
                      background: isFlightFinished ? 'var(--accent-teal)' : 'var(--accent-saffron)',
                      boxShadow: isFlightFinished ? '0 0 10px var(--accent-teal)' : '0 0 10px var(--accent-saffron)'
                    }}
                  ></div>
                  <div className="status-text">{telemetry.status}</div>
                </div>

                {isFlightFinished && (
                  <button className="btn btn-primary modal-btn" onClick={resetOrderSimulator}>
                    <Check /> Enjoy Your Dosa!
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Features Modal */}
      <div className={`modal-overlay ${isFeaturesOpen ? 'active' : ''}`} onClick={(e) => { if (e.target.classList.contains('modal-overlay')) setIsFeaturesOpen(false); }}>
        <div className="modal-card" style={{ maxWidth: '650px' }}>
          <button className="close-modal" onClick={() => setIsFeaturesOpen(false)}>
            <X style={{ width: 20, height: 20 }} />
          </button>
          
          {/* Tabs Nav */}
          <div className="features-tabs">
            <button className={`tab-btn ${activeTab === 'tabLidar' ? 'active' : ''}`} onClick={() => switchTab('tabLidar')}>
              <Navigation style={{ width: 16, height: 16 }} /> LiDAR Scanner
            </button>
            <button className={`tab-btn ${activeTab === 'tabThermal' ? 'active' : ''}`} onClick={() => switchTab('tabThermal')}>
              <Thermometer style={{ width: 16, height: 16 }} /> Thermo-Crisp
            </button>
            <button className={`tab-btn ${activeTab === 'tabDrop' ? 'active' : ''}`} onClick={() => switchTab('tabDrop')}>
              <MapPin style={{ width: 16, height: 16 }} /> Balcony Drop
            </button>
          </div>

          {/* Tab Content 1: LiDAR Autopilot */}
          <div className={`tab-content ${activeTab === 'tabLidar' ? 'active' : ''}`}>
            <div className="modal-header" style={{ marginBottom: '20px' }}>
              <h3 className="modal-title" style={{ fontSize: '1.6rem' }}><Navigation /> LiDAR Autopilot Scanner</h3>
              <p className="modal-subtitle">Autonomous collision avoidance in real-time. Spawn obstacles to test the AI routing.</p>
            </div>
            <div className="lidar-simulation">
              <div className="lidar-radar-screen">
                <div className="radar-sweep"></div>
                <div className="radar-drone">
                  <Navigation2 style={{ transform: 'rotate(45deg)', width: 24, height: 24, color: 'var(--accent-teal)', fill: 'rgba(6,182,212,0.2)' }} />
                </div>
                <div className="radar-obstacles">
                  {obstacles.map((obs) => (
                    <div
                      key={obs.id}
                      className="radar-item"
                      style={{
                        left: obs.left,
                        top: obs.top,
                        opacity: obs.status === 'dodging' ? 0.5 : 1,
                        transform: obs.status === 'dodging' ? 'scale(0.8) translate(15px, -15px)' : 'none',
                        borderColor: obs.status === 'dodging' ? 'rgba(6,182,212,0.4)' : 'rgb(239, 68, 68)',
                        background: obs.status === 'dodging' ? 'rgba(6,182,212,0.05)' : 'rgba(239, 68, 68, 0.2)',
                        color: obs.status === 'dodging' ? 'var(--accent-teal)' : '#ef4444',
                        transition: 'all 0.5s ease-out'
                      }}
                    >
                      {obs.emoji}
                    </div>
                  ))}
                </div>
                <div className="radar-ping"></div>
              </div>
              <div className="lidar-controls">
                <button className="btn btn-secondary spawn-btn" onClick={() => spawnObstacle('crow')}>
                  🦅 Spawn Crow
                </button>
                <button className="btn btn-secondary spawn-btn" onClick={() => spawnObstacle('wire')}>
                  ⚡ Powerline
                </button>
                <button className="btn btn-secondary spawn-btn" onClick={() => spawnObstacle('kite')}>
                  🪁 Spawn Kite
                </button>
              </div>
              <div className="lidar-console">
                <div className="console-header">AI Routing Decision Log</div>
                <div className="console-body" ref={lidarLogRef}>
                  {lidarLogs.length === 0 ? (
                    <div className="log-line text-muted">[System] LiDAR scanner active. Airspace clear.</div>
                  ) : (
                    lidarLogs.map((log, i) => (
                      <div
                        key={i}
                        className="log-line"
                        style={{
                          color: log.type === 'success' 
                            ? 'var(--accent-teal)' 
                            : log.type === 'warning' 
                            ? 'var(--accent-gold)' 
                            : log.type === 'alert' 
                            ? '#ef4444' 
                            : 'var(--text-muted)',
                          fontWeight: log.type !== 'info' ? 600 : 400
                        }}
                      >
                        [{log.time}] {log.text}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content 2: Thermo-Crisp Pod */}
          <div className={`tab-content ${activeTab === 'tabThermal' ? 'active' : ''}`}>
            <div className="modal-header" style={{ marginBottom: '20px' }}>
              <h3 className="modal-title" style={{ fontSize: '1.6rem' }}><Thermometer /> Thermo-Crisp Calibration</h3>
              <p className="modal-subtitle">Regulate air valves to prevent condensation while maintaining warmth.</p>
            </div>
            <div className="thermal-simulation">
              <div className="pod-cross-section">
                <div className="pod-exterior" style={{ borderColor: thermalStats.statusColor }}>
                  <div 
                    className="pod-steam" 
                    style={{ 
                      opacity: thermalStats.steamOpacity,
                      transform: `translateY(-${thermalStats.steamTranslate}px) scale(${thermalStats.steamScale})`,
                      transition: 'transform 0.5s ease, opacity 0.5s ease'
                    }}
                  ></div>
                  <div className="pod-dosa-graphic">🥙</div>
                  <div 
                    className="pod-status-light" 
                    style={{ 
                      background: thermalStats.statusColor === 'var(--accent-teal)' 
                        ? 'var(--accent-teal)' 
                        : thermalStats.statusColor === '#ef4444' 
                        ? '#ef4444' 
                        : 'var(--accent-gold)',
                      boxShadow: thermalStats.statusColor === 'var(--accent-teal)' 
                        ? '0 0 8px var(--accent-teal)' 
                        : thermalStats.statusColor === '#ef4444' 
                        ? '0 0 8px #ef4444' 
                        : '0 0 8px var(--accent-gold)'
                    }}
                  ></div>
                </div>
                <div className="pod-achievement" style={{ color: thermalStats.statusColor }}>{thermalStats.zoneText}</div>
              </div>
              <div className="valve-slider-box">
                <div className="slider-labels">
                  <span>Closed (0%)</span>
                  <span style={{ color: 'var(--accent-saffron)', fontWeight: 700 }}>Vents: {ventValue}%</span>
                  <span>Fully Open (100%)</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={ventValue} 
                  className="thermal-slider" 
                  onChange={(e) => updateThermal(parseInt(e.target.value))}
                />
              </div>
              <div className="thermal-meters">
                <div className="meter-item">
                  <div className="meter-label">
                    <span>Pod Temperature</span>
                    <span>{thermalStats.temp}°C</span>
                  </div>
                  <div className="meter-bar"><div className="meter-fill saffron" style={{ width: `${thermalStats.temp}%` }}></div></div>
                </div>
                <div className="meter-item">
                  <div className="meter-label">
                    <span>Humidity / Condensation</span>
                    <span>{thermalStats.hum}%</span>
                  </div>
                  <div className="meter-bar"><div className="meter-fill teal" style={{ width: `${thermalStats.hum}%` }}></div></div>
                </div>
                <div className="meter-item">
                  <div className="meter-label">
                    <span>Dosa Crispiness Rating</span>
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{thermalStats.crisp}%</span>
                  </div>
                  <div className="meter-bar"><div className="meter-fill gold" style={{ width: `${thermalStats.crisp}%` }}></div></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content 3: Balcony Drop */}
          <div className={`tab-content ${activeTab === 'tabDrop' ? 'active' : ''}`}>
            <div className="modal-header" style={{ marginBottom: '20px' }}>
              <h3 className="modal-title" style={{ fontSize: '1.6rem' }}><MapPin /> Balcony Drop Locator</h3>
              <p className="modal-subtitle">Calibrate delivery coordinates to your specific balcony floor.</p>
            </div>
            <div className="drop-simulation">
              <div className="building-visual">
                <div className="building-skyline"></div>
                <div className="building-tower">
                  <div className="building-floor">
                    <div className={`balcony-target ${activeFloor === 3 ? 'active' : ''}`} onClick={() => handleFloorSelect(3, 40)}>
                      Penthouse (3rd Flr)
                    </div>
                  </div>
                  <div className="building-floor">
                    <div className={`balcony-target ${activeFloor === 2 ? 'active' : ''}`} onClick={() => handleFloorSelect(2, 100)}>
                      Balcony (2nd Flr)
                    </div>
                  </div>
                  <div className="building-floor">
                    <div className={`balcony-target ${activeFloor === 1 ? 'active' : ''}`} onClick={() => handleFloorSelect(1, 160)}>
                      Balcony (1st Flr)
                    </div>
                  </div>
                </div>
                {/* Winch Drone */}
                <div className="winch-drone-wrapper" style={{ top: winchDroneTop }}>
                  <div className="winch-drone">
                    <Navigation2 style={{ transform: 'rotate(45deg)', width: 18, height: 18, color: 'white', fill: 'rgba(255,255,255,0.2)' }} />
                  </div>
                  <div className="winch-cable" style={{ height: winchCableHeight }}></div>
                  <div className={`winch-package ${winchPackageActive ? 'active' : ''}`}>🥙</div>
                </div>
              </div>
              <div className="drop-controls">
                <div className="drop-status-console">
                  {dropStatus}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
