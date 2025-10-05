<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ORRDS Business Plan Presentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
            color: white;
            overflow: hidden;
            height: 100vh;
        }

        .presentation-container {
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .slide-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            position: relative;
        }

        .slide {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 60px;
            max-width: 1200px;
            width: 100%;
            min-height: 600px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .slide h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #60a5fa 0%, #34d399 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .slide h2 {
            font-size: 2.5rem;
            margin-bottom: 30px;
            color: #60a5fa;
        }

        .slide h3 {
            font-size: 1.8rem;
            margin-bottom: 15px;
            color: #34d399;
        }

        .subtitle {
            font-size: 1.5rem;
            color: #94a3b8;
            margin-bottom: 40px;
        }

        .content {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #cbd5e1;
        }

        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 30px;
        }

        .grid-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            margin-top: 30px;
        }

        .card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 25px;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(96, 165, 250, 0.3);
        }

        .card h4 {
            color: #60a5fa;
            font-size: 1.3rem;
            margin-bottom: 10px;
        }

        .card .number {
            font-size: 2.5rem;
            font-weight: bold;
            color: #34d399;
            margin: 15px 0;
        }

        .card .label {
            font-size: 0.9rem;
            color: #94a3b8;
        }

        .bullet-list {
            list-style: none;
            margin-top: 20px;
        }

        .bullet-list li {
            padding: 15px 0;
            padding-left: 40px;
            position: relative;
            font-size: 1.2rem;
        }

        .bullet-list li:before {
            content: "→";
            position: absolute;
            left: 0;
            color: #34d399;
            font-size: 1.5rem;
            font-weight: bold;
        }

        .highlight-box {
            background: linear-gradient(135deg, rgba(96, 165, 250, 0.2) 0%, rgba(52, 211, 153, 0.2) 100%);
            border: 2px solid #34d399;
            border-radius: 15px;
            padding: 30px;
            margin-top: 30px;
        }

        .warning-box {
            background: rgba(251, 191, 36, 0.1);
            border: 2px solid #fbbf24;
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
        }

        .controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 60px;
            background: rgba(0, 0, 0, 0.3);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn {
            background: rgba(96, 165, 250, 0.2);
            border: 2px solid #60a5fa;
            color: white;
            padding: 12px 30px;
            border-radius: 10px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 600;
        }

        .btn:hover {
            background: #60a5fa;
            transform: scale(1.05);
        }

        .btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .slide-indicator {
            display: flex;
            gap: 10px;
        }

        .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            cursor: pointer;
            transition: all 0.3s;
        }

        .dot.active {
            background: #60a5fa;
            width: 40px;
            border-radius: 6px;
        }

        .icon {
            font-size: 4rem;
            margin-bottom: 20px;
            display: inline-block;
        }

        .revenue-stream {
            background: rgba(52, 211, 153, 0.1);
            border-left: 4px solid #34d399;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
        }

        .cost-item {
            background: rgba(239, 68, 68, 0.1);
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
        }

        .timeline {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            position: relative;
        }

        .timeline:before {
            content: "";
            position: absolute;
            top: 20px;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #ef4444 0%, #fbbf24 50%, #34d399 100%);
        }

        .timeline-item {
            flex: 1;
            text-align: center;
            position: relative;
        }

        .timeline-dot {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #60a5fa;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            position: relative;
            z-index: 1;
        }

        .stat-large {
            font-size: 4rem;
            font-weight: bold;
            background: linear-gradient(135deg, #60a5fa 0%, #34d399 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-align: center;
            margin: 20px 0;
        }

        .centered {
            text-align: center;
        }

        .logo {
            font-size: 5rem;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="presentation-container">
        <div class="slide-wrapper">
            <div class="slide" id="slide-content">
                <!-- Slide content will be inserted here -->
            </div>
        </div>
        
        <div class="controls">
            <button class="btn" id="prev-btn" onclick="previousSlide()">← Previous</button>
            <div class="slide-indicator" id="indicators"></div>
            <button class="btn" id="next-btn" onclick="nextSlide()">Next →</button>
        </div>
    </div>

    <script>
        let currentSlide = 0;
        const totalSlides = 7;

        const slides = [
            // Slide 1: Title
            `
                <div class="centered">
                    <div class="logo">🛰️</div>
                    <h1>ORRDS</h1>
                    <p class="subtitle">Orbital Resource Recovery & Debris Remediation System</p>
                    <div class="highlight-box">
                        <h3>Transforming Space Debris from Threat to Treasure</h3>
                        <p class="content" style="margin-top: 20px;">
                            The first profitable solution to the orbital debris crisis through autonomous capture, 
                            material recovery, and in-space manufacturing
                        </p>
                    </div>
                </div>
            `,

            // Slide 2: The Problem & Opportunity
            `
                <h2>The Orbital Debris Crisis</h2>
                <div class="grid-2">
                    <div>
                        <h3>The Problem</h3>
                        <ul class="bullet-list">
                            <li>34,000+ tracked debris objects in LEO</li>
                            <li>Millions of smaller untracked pieces</li>
                            <li>$12B annual satellite services at risk</li>
                            <li>Kessler Syndrome threat looming</li>
                            <li>Current removal: $100M+ per mission, no ROI</li>
                        </ul>
                    </div>
                    <div>
                        <h3>The Opportunity</h3>
                        <ul class="bullet-list">
                            <li>Growing mega-constellations (20K+ satellites)</li>
                            <li>Insurance premiums rising 15% annually</li>
                            <li>Debris remediation market: $200M → $3B by 2035</li>
                            <li>In-orbit manufacturing: $5B by 2035</li>
                            <li>No profitable solutions exist today</li>
                        </ul>
                    </div>
                </div>
                <div class="warning-box">
                    <strong>⚠️ Market Timing:</strong> Regulatory frameworks emerging, technology mature, customer base growing exponentially
                </div>
            `,

            // Slide 3: Our Solution
            `
                <h2>The ORRDS Solution</h2>
                <p class="subtitle">Autonomous orbital processors that turn debris into profit</p>
                
                <div class="grid-3">
                    <div class="card">
                        <div class="icon">🎯</div>
                        <h4>Capture</h4>
                        <p>Multi-method debris capture (nets, robotic arms, magnetic tethers) with 90%+ success rate</p>
                    </div>
                    <div class="card">
                        <div class="icon">⚙️</div>
                        <h4>Process</h4>
                        <p>In-orbit material extraction and purification of aluminum, titanium, rare earths</p>
                    </div>
                    <div class="card">
                        <div class="icon">🏭</div>
                        <h4>Manufacture</h4>
                        <p>Build standardized space components from recovered materials</p>
                    </div>
                </div>

                <div class="highlight-box" style="margin-top: 40px;">
                    <h3>Key Innovation: Circular Economy in Space</h3>
                    <p class="content">
                        First business model that makes debris removal profitable through multiple revenue streams:
                        removal contracts + material sales + component manufacturing + data services
                    </p>
                </div>
            `,

            // Slide 4: Business Model
            `
                <h2>Revenue Model</h2>
                <p class="subtitle">Four complementary revenue streams</p>

                <div class="grid-2">
                    <div>
                        <div class="revenue-stream">
                            <h4>💰 Debris Removal Contracts</h4>
                            <div class="number">$500K - $5M</div>
                            <p>Per object removed (size-dependent pricing)</p>
                        </div>
                        <div class="revenue-stream">
                            <h4>📋 Subscription Services</h4>
                            <div class="number">$5M - $15M</div>
                            <p>Annual orbital corridor maintenance</p>
                        </div>
                        <div class="revenue-stream">
                            <h4>🔩 Material Sales</h4>
                            <div class="number">$50K/kg</div>
                            <p>Recovered metals delivered in orbit</p>
                        </div>
                        <div class="revenue-stream">
                            <h4>📊 Data & Analytics</h4>
                            <div class="number">$100K - $500K</div>
                            <p>Debris tracking and risk assessment SaaS</p>
                        </div>
                    </div>

                    <div>
                        <div class="card">
                            <h4>Target Customers</h4>
                            <ul class="bullet-list" style="font-size: 1rem;">
                                <li>Constellation operators (Starlink, Kuiper, OneWeb)</li>
                                <li>Space agencies (NASA, ESA, JAXA)</li>
                                <li>Satellite insurance providers</li>
                                <li>In-orbit manufacturers</li>
                            </ul>
                        </div>
                        <div class="highlight-box">
                            <h4>Year 5 Targets</h4>
                            <div class="stat-large">$175M</div>
                            <p class="centered">Total Revenue</p>
                            <div class="stat-large">61%</div>
                            <p class="centered">Profit Margin</p>
                        </div>
                    </div>
                </div>
            `,

            // Slide 5: Financial Projections
            `
                <h2>Financial Roadmap</h2>
                <p class="subtitle">Path to profitability in 4 years</p>

                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-dot">Y1-2</div>
                        <h4 style="color: #ef4444;">Development</h4>
                        <p>$140M CAPEX</p>
                        <p>Build & launch OPU-1</p>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot">Y3</div>
                        <h4 style="color: #fbbf24;">Scale-up</h4>
                        <p>$45M Revenue</p>
                        <p>7 OPUs operational</p>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot">Y4</div>
                        <h4 style="color: #fbbf24;">Break Even</h4>
                        <p>$95M Revenue</p>
                        <p>Cash flow positive</p>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot">Y5</div>
                        <h4 style="color: #34d399;">Profitable</h4>
                        <p>$175M Revenue</p>
                        <p>$106M EBITDA</p>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot">Y10</div>
                        <h4 style="color: #34d399;">Market Leader</h4>
                        <p>$550M Revenue</p>
                        <p>$415M EBITDA</p>
                    </div>
                </div>

                <div class="grid-2" style="margin-top: 60px;">
                    <div class="cost-item">
                        <h4>Investment Required</h4>
                        <p><strong>Seed:</strong> $20M (completed)</p>
                        <p><strong>Series A:</strong> $120M (Year 1)</p>
                        <p><strong>Series B:</strong> $280M (Year 2-3)</p>
                        <p><strong>Total:</strong> $420M to profitability</p>
                    </div>
                    <div class="card">
                        <h4>Returns</h4>
                        <p><strong>Break Even:</strong> Year 4</p>
                        <p><strong>ROI:</strong> Full CAPEX recovered Year 6</p>
                        <p><strong>Target IRR:</strong> 35%+</p>
                        <p><strong>Exit Options:</strong> IPO Year 7-8 or strategic acquisition</p>
                    </div>
                </div>
            `,

            // Slide 6: Technology & Sustainability
            `
                <h2>Technology & Operations</h2>
                
                <div class="grid-2">
                    <div>
                        <h3>Orbital Processor Unit (OPU)</h3>
                        <ul class="bullet-list">
                            <li><strong>Mass:</strong> 1,200 kg (expandable to 3,000 kg)</li>
                            <li><strong>Power:</strong> 15 kW solar + battery</li>
                            <li><strong>Lifetime:</strong> 7-10 years (refuelable)</li>
                            <li><strong>Capture Range:</strong> 50m - 5km</li>
                            <li><strong>Autonomy:</strong> AI-driven targeting & navigation</li>
                        </ul>
                        
                        <div class="card" style="margin-top: 20px;">
                            <h4>🛡️ Resilience Features</h4>
                            <p>Radiation-hardened electronics, Whipple shields, triple-redundant systems, autonomous collision avoidance</p>
                        </div>
                    </div>
                    
                    <div>
                        <h3>Sustainability Commitment</h3>
                        <div class="highlight-box">
                            <h4>Zero-Debris Operations</h4>
                            <p>All captures designed to prevent fragmentation. Mission abort if risk >1%.</p>
                        </div>
                        <ul class="bullet-list">
                            <li>Soft-capture mechanisms prioritized</li>
                            <li>Real-time debris tracking integration</li>
                            <li>Controlled deorbit for all captured objects</li>
                            <li>25-year disposal rule compliance</li>
                            <li>ISO 24113 certified operations</li>
                        </ul>
                        
                        <div class="warning-box">
                            <strong>🌍 Environmental Impact:</strong> Annual sustainability reports, founding member of Orbital Sustainability Consortium
                        </div>
                    </div>
                </div>
            `,

            // Slide 7: Competitive Advantage & Call to Action
            `
                <h2>Why ORRDS Wins</h2>
                
                <div class="grid-3">
                    <div class="card">
                        <div class="icon">🎯</div>
                        <h4>First Mover</h4>
                        <p>Only profitable debris removal model in existence</p>
                    </div>
                    <div class="card">
                        <div class="icon">💡</div>
                        <h4>Multi-Revenue</h4>
                        <p>Not dependent on single income stream</p>
                    </div>
                    <div class="card">
                        <div class="icon">🤖</div>
                        <h4>Autonomous</h4>
                        <p>70% cost reduction vs traditional missions</p>
                    </div>
                    <div class="card">
                        <div class="icon">♻️</div>
                        <h4>Circular Economy</h4>
                        <p>Material recovery adds 25-30% revenue</p>
                    </div>
                    <div class="card">
                        <div class="icon">📈</div>
                        <h4>Scalable</h4>
                        <p>Fleet approach enables rapid growth</p>
                    </div>
                    <div class="card">
                        <div class="icon">🛡️</div>
                        <h4>IP Protected</h4>
                        <p>10+ patents on processing technology</p>
                    </div>
                </div>

                <div class="highlight-box" style="margin-top: 40px;">
                    <h2 class="centered">Join Us in Building Sustainable Space Infrastructure</h2>
                    <div class="grid-2" style="margin-top: 30px; gap: 60px;">
                        <div class="centered">
                            <div class="stat-large">$10B+</div>
                            <p>Total Addressable Market by 2035</p>
                        </div>
                        <div class="centered">
                            <div class="stat-large">35%+</div>
                            <p>Target IRR for Investors</p>
                        </div>
                    </div>
                    <p class="centered" style="margin-top: 30px; font-size: 1.3rem;">
                        <strong>We're not just solving a problem—we're creating a new industry.</strong>
                    </p>
                </div>
            `
        ];

        function renderSlide(index) {
            document.getElementById('slide-content').innerHTML = slides[index];
            updateIndicators();
            updateButtons();
        }

        function updateIndicators() {
            const indicatorsContainer = document.getElementById('indicators');
            indicatorsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'dot' + (i === currentSlide ? ' active' : '');
                dot.onclick = () => goToSlide(i);
                indicatorsContainer.appendChild(dot);
            }
        }

        function updateButtons() {
            document.getElementById('prev-btn').disabled = currentSlide === 0;
            document.getElementById('next-btn').disabled = currentSlide === totalSlides - 1;
        }

        function nextSlide() {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                renderSlide(currentSlide);
            }
        }

        function previousSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                renderSlide(currentSlide);
            }
        }

        function goToSlide(index) {
            currentSlide = index;
            renderSlide(currentSlide);
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') previousSlide();
        });

        // Initialize
        renderSlide(0);
    </script>
</body>
</html>
