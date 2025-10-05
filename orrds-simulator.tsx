import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, DollarSign, Target, Trash2, TrendingUp, AlertTriangle, Satellite, Zap } from 'lucide-react';

const ORRDSSimulator = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [simulation, setSimulation] = useState({
    time: 0,
    debrisRemoved: 0,
    revenue: 0,
    costs: 0,
    materialRecovered: 0,
    collisionsAvoided: 0,
    initialCostsDeducted: false
  });
  
  const [config, setConfig] = useState({
    opuCount: 1,
    captureEfficiency: 90,
    processingEnabled: false,
    manufacturingEnabled: false
  });
  
  const [debris, setDebris] = useState([]);
  const [opus, setOpus] = useState([]);
  const [activeTab, setActiveTab] = useState('simulation');
  const animationRef = useRef(null);

  useEffect(() => {
    const newDebris = [];
    for (let i = 0; i < 150; i++) {
      const randSize = Math.random();
      let size = 'small';
      if (randSize > 0.7 && randSize < 0.9) size = 'medium';
      else if (randSize >= 0.9) size = 'large';
      
      newDebris.push({
        id: i,
        angle: Math.random() * Math.PI * 2,
        distance: 100 + Math.random() * 180,
        speed: 0.001 + Math.random() * 0.003,
        size: size,
        value: size === 'small' ? 500000 : size === 'medium' ? 2000000 : 5000000,
        captured: false
      });
    }
    setDebris(newDebris);
  }, []);

  useEffect(() => {
    const newOpus = [];
    for (let i = 0; i < config.opuCount; i++) {
      newOpus.push({
        id: i,
        angle: (Math.PI * 2 * i) / config.opuCount,
        distance: 150,
        speed: 0.004,
        target: null,
        capturing: false,
        captureProgress: 0
      });
    }
    setOpus(newOpus);
  }, [config.opuCount]);

  useEffect(() => {
    if (!isRunning) return;

    const animate = () => {
      setDebris(prev => prev.map(d => ({
        ...d,
        angle: d.angle + d.speed
      })));

      setOpus(prev => prev.map(opu => {
        let newOpu = { ...opu };
        
        if (!newOpu.target) {
          const availableDebris = debris.filter(d => !d.captured);
          if (availableDebris.length > 0) {
            const closest = availableDebris.reduce((min, d) => {
              const dx = Math.cos(d.angle) * d.distance - Math.cos(opu.angle) * opu.distance;
              const dy = Math.sin(d.angle) * d.distance - Math.sin(opu.angle) * opu.distance;
              const dist = Math.sqrt(dx * dx + dy * dy);
              return dist < min.dist ? { debris: d, dist } : min;
            }, { debris: null, dist: Infinity });
            
            if (closest.debris) {
              newOpu.target = closest.debris.id;
            }
          }
        } else {
          const targetDebris = debris.find(d => d.id === newOpu.target);
          if (targetDebris && !targetDebris.captured) {
            const dx = Math.cos(targetDebris.angle) * targetDebris.distance - Math.cos(opu.angle) * opu.distance;
            const dy = Math.sin(targetDebris.angle) * targetDebris.distance - Math.sin(opu.angle) * opu.distance;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 20) {
              newOpu.capturing = true;
              newOpu.captureProgress += 2;
              
              if (newOpu.captureProgress >= 100) {
                setDebris(prev => prev.map(d => 
                  d.id === newOpu.target ? { ...d, captured: true } : d
                ));
                
                const materialMass = targetDebris.size === 'large' ? 15 : targetDebris.size === 'medium' ? 5 : 2;
                const materialValue = config.processingEnabled ? materialMass * 50000 * 1.3 : materialMass * 50000;
                
                // Only get contract revenue if capture is successful (efficiency check)
                const captureSuccess = Math.random() * 100 < config.captureEfficiency;
                const contractRevenue = captureSuccess ? targetDebris.value : 0;
                
                setSimulation(prev => ({
                  ...prev,
                  debrisRemoved: prev.debrisRemoved + 1,
                  revenue: prev.revenue + contractRevenue + materialValue,
                  materialRecovered: prev.materialRecovered + materialMass,
                  collisionsAvoided: prev.collisionsAvoided + (Math.random() < 0.3 ? 1 : 0)
                }));
                
                newOpu.target = null;
                newOpu.capturing = false;
                newOpu.captureProgress = 0;
              }
            } else {
              const targetAngle = Math.atan2(dy, dx);
              const currentAngle = opu.angle;
              let angleDiff = targetAngle - currentAngle;
              
              if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
              if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
              
              newOpu.angle = currentAngle + Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), 0.05);
              
              const targetDist = targetDebris.distance;
              newOpu.distance += (targetDist - opu.distance) * 0.02;
            }
          } else {
            newOpu.target = null;
            newOpu.capturing = false;
            newOpu.captureProgress = 0;
          }
        }
        
        if (!newOpu.target) {
          newOpu.angle += newOpu.speed;
        }
        
        return newOpu;
      }));

      setSimulation(prev => {
        const newTime = prev.time + 1;
        // More realistic cost model
        // Fixed costs per OPU: $10M annually = ~$27,400/day = ~$19/minute in simulation
        const fixedCostPerMinute = config.opuCount * 19;
        
        // Variable costs: propellant, power, operations
        const variableCosts = config.opuCount * 5;
        
        // Initial CAPEX amortization (spread over 7 years)
        const capexPerOPU = 60000000; // $40M + $20M launch
        const amortizationPerMinute = (config.opuCount * capexPerOPU / (7 * 365 * 24 * 60)) * 10; // accelerated for demo
        
        const totalCosts = fixedCostPerMinute + variableCosts + amortizationPerMinute;
        
        return {
          ...prev,
          time: newTime,
          costs: prev.costs + totalCosts
        };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, debris, config.opuCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const draw = () => {
      ctx.fillStyle = '#0a0e27';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < 100; i++) {
        const x = (i * 73) % canvas.width;
        const y = (i * 97) % canvas.height;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x, y, 1, 1);
      }
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 60);
      gradient.addColorStop(0, '#4a90e2');
      gradient.addColorStop(0.7, '#2c5aa0');
      gradient.addColorStop(1, '#1a3a6e');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#2d5f2d';
      ctx.beginPath();
      ctx.arc(centerX - 20, centerY - 10, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + 15, centerY + 20, 20, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      [150, 200, 250].forEach(r => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      });
      
      debris.forEach(d => {
        if (d.captured) return;
        
        const x = centerX + Math.cos(d.angle) * d.distance;
        const y = centerY + Math.sin(d.angle) * d.distance;
        
        let color, size;
        if (d.size === 'small') {
          color = '#ff6b6b';
          size = 3;
        } else if (d.size === 'medium') {
          color = '#ffa726';
          size = 5;
        } else {
          color = '#f44336';
          size = 7;
        }
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        if (d.size === 'large') {
          ctx.strokeStyle = 'rgba(244, 67, 54, 0.3)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, size + 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      
      opus.forEach(opu => {
        const x = centerX + Math.cos(opu.angle) * opu.distance;
        const y = centerY + Math.sin(opu.angle) * opu.distance;
        
        ctx.fillStyle = opu.capturing ? '#4caf50' : '#2196f3';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#64b5f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 15, y);
        ctx.lineTo(x + 15, y);
        ctx.stroke();
        
        if (opu.capturing && opu.target) {
          const targetDebris = debris.find(d => d.id === opu.target);
          if (targetDebris) {
            const tx = centerX + Math.cos(targetDebris.angle) * targetDebris.distance;
            const ty = centerY + Math.sin(targetDebris.angle) * targetDebris.distance;
            
            ctx.strokeStyle = 'rgba(76, 175, 80, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(tx, ty);
            ctx.stroke();
            
            ctx.strokeStyle = '#4caf50';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(tx, ty, 15, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        
        if (opu.target && !opu.capturing) {
          const targetDebris = debris.find(d => d.id === opu.target);
          if (targetDebris) {
            const tx = centerX + Math.cos(targetDebris.angle) * targetDebris.distance;
            const ty = centerY + Math.sin(targetDebris.angle) * targetDebris.distance;
            
            ctx.strokeStyle = 'rgba(33, 150, 243, 0.3)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(tx, ty);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      });
      
      requestAnimationFrame(draw);
    };
    
    draw();
  }, [debris, opus]);

  const handleReset = () => {
    setIsRunning(false);
    setSimulation({
      time: 0,
      debrisRemoved: 0,
      revenue: 0,
      costs: 0,
      materialRecovered: 0,
      collisionsAvoided: 0,
      initialCostsDeducted: false
    });
    
    const newDebris = [];
    for (let i = 0; i < 150; i++) {
      const randSize = Math.random();
      let size = 'small';
      if (randSize > 0.7 && randSize < 0.9) size = 'medium';
      else if (randSize >= 0.9) size = 'large';
      
      newDebris.push({
        id: i,
        angle: Math.random() * Math.PI * 2,
        distance: 100 + Math.random() * 180,
        speed: 0.001 + Math.random() * 0.003,
        size: size,
        value: size === 'small' ? 500000 : size === 'medium' ? 2000000 : 5000000,
        captured: false
      });
    }
    
    setDebris(newDebris);
  };

  const formatMoney = (value) => {
    if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'K';
    return '$' + value.toFixed(0);
  };

  const profitMargin = simulation.revenue > 0 ? ((simulation.revenue - simulation.costs) / simulation.revenue * 100).toFixed(1) : 0;
  const activeDebris = debris.filter(d => !d.captured).length;
  const profit = simulation.revenue - simulation.costs;
  const cleanedPercent = simulation.debrisRemoved + activeDebris > 0 ? ((simulation.debrisRemoved / (simulation.debrisRemoved + activeDebris)) * 100).toFixed(1) : 0;
  
  // Time calculations (1 second = 1 day)
  const days = simulation.time;
  const years = Math.floor(days / 365);
  const remainingDaysAfterYears = days % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  const remainingDays = remainingDaysAfterYears % 30;
  const decimalYears = (days / 365).toFixed(2);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Satellite className="text-blue-400" size={36} />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ORRDS Simulator
            </h1>
          </div>
          <p className="text-lg text-slate-300">Orbital Resource Recovery and Debris Remediation System</p>
          <p className="text-sm text-slate-400 mt-2">Watch autonomous spacecraft clean up space debris and generate revenue</p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${activeTab === 'simulation' ? 'bg-blue-600 shadow-lg' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            <Zap size={18} />
            Live Simulation
          </button>
          <button
            onClick={() => setActiveTab('economics')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${activeTab === 'economics' ? 'bg-blue-600 shadow-lg' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            <TrendingUp size={18} />
            Business Model
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${activeTab === 'config' ? 'bg-blue-600 shadow-lg' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            <Target size={18} />
            Settings
          </button>
        </div>

        {activeTab === 'simulation' && (
          <div className="space-y-6">
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">Mission Time</h3>
                <div className="text-right">
                  <div className="text-3xl font-bold text-cyan-400">
                    {years} Year{years !== 1 ? 's' : ''} {months} Month{months !== 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-slate-400">{remainingDays} days ({days} total days = {decimalYears} years)</div>
                  <div className="text-xs text-slate-500 mt-1">1 second = 1 day in simulation</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 bg-opacity-50 backdrop-blur rounded-xl p-4 border border-slate-700">
              <h3 className="font-semibold mb-3 text-lg">Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>OPU Patrolling</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>OPU Capturing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Large Debris</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Medium/Small</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-slate-800 bg-opacity-50 backdrop-blur rounded-xl p-4 border border-slate-700">
                  <canvas
                    ref={canvasRef}
                    width={700}
                    height={700}
                    className="w-full rounded-lg"
                  />
                  <div className="flex gap-3 mt-4 justify-center flex-wrap">
                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg font-semibold shadow-lg transition-all"
                    >
                      {isRunning ? <Pause size={20} /> : <Play size={20} />}
                      {isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-all"
                    >
                      <RotateCcw size={20} />
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 bg-opacity-40 backdrop-blur rounded-xl p-5 border border-blue-700 border-opacity-50">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Target className="text-blue-400" size={24} />
                    Operations
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3">
                      <div className="text-sm text-slate-400 mb-1">Active OPUs</div>
                      <div className="text-3xl font-bold text-blue-400">{config.opuCount}</div>
                    </div>
                    <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3">
                      <div className="text-sm text-slate-400 mb-1">Captured</div>
                      <div className="text-3xl font-bold text-green-400">{simulation.debrisRemoved}</div>
                    </div>
                    <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3">
                      <div className="text-sm text-slate-400 mb-1">Remaining</div>
                      <div className="text-3xl font-bold text-red-400">{activeDebris}</div>
                      <div className="text-xs text-slate-500 mt-1">{cleanedPercent}% cleaned</div>
                    </div>
                    <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3">
                      <div className="text-sm text-slate-400 mb-1">Collisions Prevented</div>
                      <div className="text-3xl font-bold text-yellow-400">{simulation.collisionsAvoided}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-900 to-green-800 bg-opacity-40 backdrop-blur rounded-xl p-5 border border-green-700 border-opacity-50">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <DollarSign className="text-green-400" size={24} />
                    Financials
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3">
                      <div className="text-sm text-slate-400 mb-1">Revenue</div>
                      <div className="text-3xl font-bold text-green-400">{formatMoney(simulation.revenue)}</div>
                    </div>
                    <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3">
                      <div className="text-sm text-slate-400 mb-1">Costs</div>
                      <div className="text-3xl font-bold text-red-400">{formatMoney(simulation.costs)}</div>
                    </div>
                    <div className={`rounded-lg p-3 ${profit >= 0 ? 'bg-green-900 bg-opacity-30' : 'bg-red-900 bg-opacity-30'}`}>
                      <div className="text-sm text-slate-400 mb-1">Net Profit/Loss</div>
                      <div className={`text-3xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatMoney(profit)}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {profit >= 0 ? `Margin: ${profitMargin}%` : 'Operating at loss'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900 to-purple-800 bg-opacity-40 backdrop-blur rounded-xl p-5 border border-purple-700 border-opacity-50">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Trash2 className="text-purple-400" size={24} />
                    Materials
                  </h3>
                  <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3">
                    <div className="text-sm text-slate-400 mb-1">Recovered</div>
                    <div className="text-3xl font-bold text-purple-400">{simulation.materialRecovered} kg</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Value: {formatMoney(simulation.materialRecovered * 50000 * (config.processingEnabled ? 1.3 : 1))}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-900 to-orange-900 bg-opacity-40 backdrop-blur rounded-xl p-4 border border-yellow-700 border-opacity-50">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
                    <div className="text-xs text-slate-300">
                      <div className="font-semibold text-yellow-300 mb-1">Financial Reality</div>
                      <p className="mb-2">All CAPEX ($60M per OPU) deducted at start. Daily OPEX: ${((config.opuCount * 10000000) / 365).toFixed(0)}/day.</p>
                      <p>Early operations run at a loss. Most ventures break even around Year 4-5 after capturing significant high-value debris.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'economics' && (
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <TrendingUp className="text-green-400" size={28} />
              Business Model
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="font-bold text-xl mb-4 text-green-400">Revenue Streams</h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg border border-green-700 border-opacity-30">
                    <div className="font-semibold text-green-300 mb-1">Debris Removal</div>
                    <div className="text-2xl font-bold text-green-400">$500K - $5M</div>
                    <div className="text-slate-400 mt-1">Per object</div>
                  </div>
                  <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg border border-green-700 border-opacity-30">
                    <div className="font-semibold text-green-300 mb-1">Subscriptions</div>
                    <div className="text-2xl font-bold text-green-400">$5M - $15M</div>
                    <div className="text-slate-400 mt-1">Annual maintenance</div>
                  </div>
                  <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg border border-green-700 border-opacity-30">
                    <div className="font-semibold text-green-300 mb-1">Materials</div>
                    <div className="text-2xl font-bold text-green-400">$50K per kg</div>
                    <div className="text-slate-400 mt-1">Recovered metals</div>
                  </div>
                  <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg border border-green-700 border-opacity-30">
                    <div className="font-semibold text-green-300 mb-1">Data Services</div>
                    <div className="text-2xl font-bold text-green-400">$100K - $500K</div>
                    <div className="text-slate-400 mt-1">Per client annually</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xl mb-4 text-red-400">Cost Structure</h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-red-900 bg-opacity-20 p-4 rounded-lg border border-red-700 border-opacity-30">
                    <div className="font-semibold text-red-300 mb-1">OPU Development</div>
                    <div className="text-2xl font-bold text-red-400">$40M</div>
                    <div className="text-slate-400 mt-1">Per spacecraft</div>
                  </div>
                  <div className="bg-red-900 bg-opacity-20 p-4 rounded-lg border border-red-700 border-opacity-30">
                    <div className="font-semibold text-red-300 mb-1">Launch</div>
                    <div className="text-2xl font-bold text-red-400">$20M</div>
                    <div className="text-slate-400 mt-1">Per launch</div>
                  </div>
                  <div className="bg-red-900 bg-opacity-20 p-4 rounded-lg border border-red-700 border-opacity-30">
                    <div className="font-semibold text-red-300 mb-1">Operations</div>
                    <div className="text-2xl font-bold text-red-400">$10M</div>
                    <div className="text-slate-400 mt-1">Per OPU annually</div>
                  </div>
                  <div className="bg-red-900 bg-opacity-20 p-4 rounded-lg border border-red-700 border-opacity-30">
                    <div className="font-semibold text-red-300 mb-1">Insurance</div>
                    <div className="text-2xl font-bold text-red-400">$15M</div>
                    <div className="text-slate-400 mt-1">Company-wide</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900 bg-opacity-30 rounded-xl p-6 border border-blue-700 border-opacity-50 mb-6">
              <h4 className="font-bold text-xl mb-4 text-blue-300">10-Year Projections</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-800 bg-opacity-50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-2">Year 1-3</div>
                  <div className="text-3xl font-bold text-red-400">Loss</div>
                  <div className="text-xs text-slate-500 mt-1">Building infrastructure</div>
                </div>
                <div className="bg-slate-800 bg-opacity-50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-2">Year 4</div>
                  <div className="text-3xl font-bold text-yellow-400">Break Even</div>
                  <div className="text-xs text-slate-500 mt-1">First profit</div>
                </div>
                <div className="bg-slate-800 bg-opacity-50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-2">Year 5</div>
                  <div className="text-3xl font-bold text-green-400">$106M</div>
                  <div className="text-xs text-slate-500 mt-1">61% margin</div>
                </div>
                <div className="bg-slate-800 bg-opacity-50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-2">Year 10</div>
                  <div className="text-3xl font-bold text-green-400">$415M</div>
                  <div className="text-xs text-slate-500 mt-1">75% margin</div>
                </div>
              </div>
            </div>

            <div className="bg-green-900 bg-opacity-20 rounded-xl p-6 border border-green-700 border-opacity-50">
              <h4 className="font-bold text-xl mb-4 text-green-300">Why This Works</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <div className="font-semibold text-green-300">Multiple Revenue Streams</div>
                    <div className="text-slate-300">Not dependent on single source</div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <div className="font-semibold text-green-300">Autonomous Operations</div>
                    <div className="text-slate-300">70% cost reduction</div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <div className="font-semibold text-green-300">Material Recovery</div>
                    <div className="text-slate-300">25-30% additional revenue</div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <div className="font-semibold text-green-300">First Mover</div>
                    <div className="text-slate-300">Pioneer in $3B market</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Target className="text-blue-400" size={28} />
              Configuration
            </h3>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-lg font-semibold">Number of OPUs</label>
                  <span className="text-3xl font-bold text-blue-400">{config.opuCount}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={config.opuCount}
                  onChange={(e) => setConfig({ ...config, opuCount: parseInt(e.target.value) })}
                  className="w-full h-3 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="mt-2 p-3 bg-blue-900 bg-opacity-20 rounded-lg border border-blue-700 border-opacity-30">
                  <div className="text-sm text-slate-300">
                    <span className="font-semibold">Total Investment:</span> {formatMoney(config.opuCount * 60000000)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    $40M per OPU + $20M launch | Annual OPEX: {formatMoney(config.opuCount * 10000000)}
                  </div>
                  <div className="text-xs text-yellow-400 mt-2">
                    ⚠️ More OPUs = Higher costs initially, but faster path to profitability
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-lg font-semibold">Capture Success Rate</label>
                  <span className="text-3xl font-bold text-green-400">{config.captureEfficiency}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={config.captureEfficiency}
                  onChange={(e) => setConfig({ ...config, captureEfficiency: parseInt(e.target.value) })}
                  className="w-full h-3 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="text-sm text-slate-400 mt-2">
                  Higher efficiency means more successful captures
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Advanced Capabilities</h4>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 bg-slate-700 bg-opacity-50 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={config.processingEnabled}
                      onChange={(e) => setConfig({ ...config, processingEnabled: e.target.checked })}
                      className="w-5 h-5 mt-1"
                    />
                    <div>
                      <div className="font-semibold text-purple-300">Material Processing</div>
                      <div className="text-sm text-slate-400 mt-1">
                        Extract and purify metals (+30% material revenue)
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-slate-700 bg-opacity-50 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={config.manufacturingEnabled}
                      onChange={(e) => setConfig({ ...config, manufacturingEnabled: e.target.checked })}
                      className="w-5 h-5 mt-1"
                    />
                    <div>
                      <div className="font-semibold text-cyan-300">Component Manufacturing</div>
                      <div className="text-sm text-slate-400 mt-1">
                        Build space components from recovered materials (+$40M by Year 7)
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-yellow-900 bg-opacity-30 rounded-xl p-5 border border-yellow-700 border-opacity-50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-semibold text-yellow-300 text-lg mb-3">Key Success Factors</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex gap-2">
                        <span className="text-yellow-400">•</span>
                        <span>Autonomous operation reduces costs by 70% vs traditional missions</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-400">•</span>
                        <span>Multi-target sequencing increases efficiency by 40%</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-400">•</span>
                        <span>Material recovery provides 25-30% additional revenue</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-400">•</span>
                        <span>Subscription model creates predictable recurring revenue</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-400">•</span>
                        <span>First-mover advantage in emerging debris remediation market</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-slate-500 border-t border-slate-700 pt-6">
          <p className="mb-2">
            This simulator demonstrates core ORRDS operational and economic concepts.
          </p>
          <p>
            Real-world performance subject to regulatory approval, technology validation, and market conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ORRDSSimulator;