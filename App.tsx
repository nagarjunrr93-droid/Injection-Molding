import React, { useState, useMemo } from 'react';
import { 
  Settings, Boxes, Ruler, Weight, Timer, Leaf, Zap, Globe, 
  User, Mail, MapPin, MessageSquare, Send, Hexagon, Activity,
  ChevronDown, Info, ArrowUpRight
} from 'lucide-react';
import { MATERIALS } from './data';
import { Shape } from './types';
import { computeAll } from './calculator';

const BrandLogo: React.FC<{ className?: string, layout?: 'horizontal' | 'vertical', color?: string, knockoutColor?: string }> = ({ 
  className, 
  layout = 'vertical',
  color = "#0E4C7A", 
  knockoutColor = "#ffffff" 
}) => {
  const isVertical = layout === 'vertical';
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox={isVertical ? "0 0 240 420" : "0 0 920 240"} 
      className={className}
      aria-label="Hexuno Technologies Logo"
    >
      <g>
        <polygon fill={color} points="120,10 214,65 214,175 120,230 26,175 26,65"/>
        <rect x="78" y="68" width="26" height="104" rx="6" fill={knockoutColor}/>
        <rect x="136" y="68" width="26" height="104" rx="6" fill={knockoutColor}/>
        <rect x="78" y="112" width="84" height="28" rx="6" fill={knockoutColor}/>
      </g>
      <g fill={color} transform={isVertical ? "translate(120,335)" : "translate(280,118)"}>
        <text x="0" y="0" fontFamily="'Inter', system-ui, sans-serif" fontSize="115" fontWeight="900" textAnchor={isVertical ? "middle" : "start"} letterSpacing="-2">HEXUNO</text>
        <text x={isVertical ? "0" : "4"} y="72" fontFamily="'Inter', system-ui, sans-serif" fontSize="48" fontWeight="700" textAnchor={isVertical ? "middle" : "start"} letterSpacing="11">TECHNOLOGIES</text>
      </g>
    </svg>
  );
};

const MetricHeaderCard = ({ label, value, unit, icon: Icon, subtext, color = "blue" }: any) => {
  const colors: Record<string, string> = {
    blue: "text-blue-600",
    indigo: "text-indigo-600",
    orange: "text-orange-500",
    green: "text-emerald-500"
  };
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className={colors[color]} />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-slate-900 tracking-tight">{value}</span>
          <span className="text-sm font-bold text-slate-400">{unit}</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 font-medium">{subtext}</p>
      </div>
    </div>
  );
};

const ProgressBar = ({ label, time, total, color, description, subValue }: any) => {
  const percentage = Math.min(100, (time / total) * 100) || 5;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{label}</span>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{description}</p>
        </div>
        <span className="text-sm font-black text-slate-900">{time.toFixed(3)}s</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
      </div>
      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
        <span>{subValue}</span>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [selectedMaterialName, setSelectedMaterialName] = useState(MATERIALS[0].name);
  const [shape, setShape] = useState<Shape>('RECTANGLE');
  const [dimensions, setDimensions] = useState<Record<string, number>>({
    length: 100,
    width: 50,
    od: 50,
    id: 30,
    side: 40,
    af: 40
  });
  const [wallThickness, setWallThickness] = useState(2.0);
  const [partWeight, setPartWeight] = useState(25);
  const [runnerPct, setRunnerPct] = useState(15);
  const [cavities, setCavities] = useState(4);
  const [inserts, setInserts] = useState(0);
  const [gridEmissionFactor, setGridEmissionFactor] = useState(0.475);

  const selectedMaterial = useMemo(() => 
    MATERIALS.find(m => m.name === selectedMaterialName) || MATERIALS[0],
    [selectedMaterialName]
  );

  const results = useMemo(() => 
    computeAll(selectedMaterial, shape, dimensions, wallThickness, partWeight, runnerPct, cavities, inserts, gridEmissionFactor),
    [selectedMaterial, shape, dimensions, wallThickness, partWeight, runnerPct, cavities, inserts, gridEmissionFactor]
  );

  const handleDimChange = (key: string, value: string) => {
    const num = parseFloat(value) || 0;
    setDimensions(prev => ({ ...prev, [key]: num }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans">
      <header className="bg-white border-b border-slate-200 py-4 px-8 sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <BrandLogo className="w-48 h-auto" layout="horizontal" />
          <div className="flex flex-col items-center">
             <h1 className="text-xl font-black text-[#0E4C7A] uppercase tracking-tighter">Injection Molding Cycle Time Calculator</h1>
          </div>
          <div className="hidden lg:flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Machine</p>
                <p className="text-sm font-black text-[#0E4C7A]">{results.selectedMachineTons || 0} Tonnes Clamp Force</p>
             </div>
             <div className="p-2 bg-blue-50 text-[#0E4C7A] rounded-lg">
                <Activity size={20} />
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-4 lg:p-6 space-y-6">
        {/* Top Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricHeaderCard label="Required Tonnage" value={results.requiredTonnage.toFixed(1)} unit="Tons" icon={Weight} subtext={`Assigned: ${results.selectedMachineTons || 0} Ton Machine`} color="blue" />
          <MetricHeaderCard label="Total Area" value={Math.round(results.totalProjectedAreaCm2)} unit="cm²" icon={Boxes} subtext={`${results.areaPerCavityCm2.toFixed(2)} cm² per cavity`} color="indigo" />
          <MetricHeaderCard label="Energy Use" value={results.energyConsumptionKwh.toFixed(3)} unit="kWh" icon={Zap} subtext="Per complete shot" color="orange" />
          <MetricHeaderCard label="Material Carbon" value={results.materialCo2Kg.toFixed(3)} unit="kg" icon={Leaf} subtext="Raw mat production impact" color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Material Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-[#0E4C7A]">
                <Settings size={18} />
                <h2 className="text-sm font-black uppercase tracking-widest">Material</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Grade / Name</label>
                  <div className="relative">
                    <select 
                      value={selectedMaterialName}
                      onChange={(e) => setSelectedMaterialName(e.target.value)}
                      className="w-full appearance-none bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                    >
                      {MATERIALS.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                      <p className="text-[9px] font-black text-blue-600 uppercase mb-1">Density</p>
                      <p className="text-xs font-black">{selectedMaterial.densityGcm3} g/cm³</p>
                   </div>
                   <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">
                      <p className="text-[9px] font-black text-orange-600 uppercase mb-1">Melt Temp</p>
                      <p className="text-xs font-black">{selectedMaterial.meltingTempC}°C</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Part Configuration */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-[#0E4C7A]">
                <Ruler size={18} />
                <h2 className="text-sm font-black uppercase tracking-widest">Part Configuration</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Primary Geometry</label>
                  <div className="relative">
                    <select value={shape} onChange={(e) => setShape(e.target.value as Shape)} className="w-full appearance-none bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none">
                      <option value="RECTANGLE">Rectangle</option>
                      <option value="ROUND">Round</option>
                      <option value="SQUARE">Square</option>
                      <option value="TUBE">Tube</option>
                      <option value="HEXAGONAL">Hexagonal</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Length (mm)</label>
                    <input type="number" value={dimensions.length} onChange={(e) => handleDimChange('length', e.target.value)} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Width (mm)</label>
                    <input type="number" value={dimensions.width} onChange={(e) => handleDimChange('width', e.target.value)} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Wall Thickness (mm)</label>
                  <input type="number" step="0.1" value={wallThickness} onChange={(e) => setWallThickness(parseFloat(e.target.value) || 0)} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold" />
                </div>
              </div>
            </div>

            {/* Production Details */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-[#0E4C7A]">
                <Activity size={18} />
                <h2 className="text-sm font-black uppercase tracking-widest">Production Details</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Part Weight (g)</label>
                  <input type="number" value={partWeight} onChange={(e) => setPartWeight(parseFloat(e.target.value) || 0)} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Runner %</label>
                  <input type="number" value={runnerPct} onChange={(e) => setRunnerPct(parseFloat(e.target.value) || 0)} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">No. Cavities</label>
                  <input type="number" value={cavities} onChange={(e) => setCavities(parseInt(e.target.value) || 1)} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">No. Inserts</label>
                  <input type="number" value={inserts} onChange={(e) => setInserts(parseInt(e.target.value) || 0)} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold" />
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Production Cycle Profile */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm min-h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <Timer className="text-orange-500" size={24} />
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Production Cycle Profile</h2>
                </div>
                <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {(partWeight * cavities * (1 + runnerPct/100)).toFixed(1)}g Shot
                </div>
              </div>

              <div className="space-y-10 flex-grow">
                <ProgressBar 
                  label="1. Injection Stage" 
                  description={`Rate: ${results.injRateCm3s?.toFixed(1) || 0} cm³/s`}
                  subValue={`Shot Vol: ${results.shotVolumeCm3.toFixed(2)} cm³`}
                  time={results.injTimeSec} 
                  total={results.totalCycleTimeSec} 
                  color="bg-blue-500" 
                />
                <ProgressBar 
                  label="2. Cooling Stage" 
                  description={`Thk: ${wallThickness}mm`}
                  subValue={`Diff: ${selectedMaterial.thermalDiffusivityMm2s} mm²/s`}
                  time={results.coolTimeSec} 
                  total={results.totalCycleTimeSec} 
                  color="bg-emerald-500" 
                />
                <ProgressBar 
                  label="3. Ejection & Machine Open/Close" 
                  description={`Dry Cycle: ${results.dryCycleSec || 0}s`}
                  subValue={`Handling: ${results.ejectionBlockSec}s`}
                  time={(results.dryCycleSec || 0) + results.ejectionBlockSec} 
                  total={results.totalCycleTimeSec} 
                  color="bg-indigo-500" 
                />
                <ProgressBar 
                  label="4. Insert Handling (Manual)" 
                  description={`Inserts: ${inserts} units`}
                  subValue="Calculated loading duration"
                  time={results.insertLoadingSec} 
                  total={results.totalCycleTimeSec} 
                  color="bg-orange-400" 
                />
              </div>

              <div className="mt-12 p-6 bg-[#F8FAFC] rounded-2xl flex justify-between items-center border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Hexagon size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Machine Rank</p>
                    <p className="text-lg font-black text-slate-900">{results.selectedMachineTons || 0} Tonnes Clamp Force</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency Benchmark</p>
                  <p className="text-lg font-black text-blue-600 uppercase tracking-tighter">Optimal Match</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: ESG Impact */}
          <div className="lg:col-span-3">
             <div className="bg-[#14532D] rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-900/20 flex flex-col min-h-[600px]">
                <div className="flex justify-between items-start mb-10">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Globe size={20} className="text-emerald-400" />
                        <h2 className="text-lg font-black uppercase tracking-tight">ESG Impact</h2>
                      </div>
                      <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest">Sustainability analysis per shot</p>
                   </div>
                   <div className="bg-emerald-800/50 p-3 rounded-2xl text-emerald-400">
                      <Leaf size={24} />
                   </div>
                </div>

                <div className="space-y-1">
                   <p className="text-5xl font-black tracking-tighter mb-2">{results.totalCo2Kg.toFixed(4)} <span className="text-2xl opacity-60">kg</span></p>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Total CO2E Emissions</p>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <p className="text-lg font-black">{results.materialCo2Kg.toFixed(4)} kg</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400/80">Scope 3 (Material)</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-lg font-black">{results.processingCo2Kg.toFixed(4)} kg</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400/80">Scope 2 (Energy)</p>
                   </div>
                </div>

                <div className="mt-12 p-6 bg-emerald-900/40 rounded-3xl border border-white/5 space-y-4">
                   <div className="flex items-center gap-2">
                      <Zap size={16} className="text-yellow-400" />
                      <h3 className="text-[10px] font-black uppercase tracking-widest">Grid Mix Breakdown</h3>
                   </div>
                   <p className="text-xs text-emerald-200/80 leading-relaxed font-medium">
                      Based on a grid factor of {gridEmissionFactor} kg CO2/kWh, processing one shot consumes {results.energyConsumptionKwh.toFixed(4)} kWh of energy.
                   </p>
                </div>

                <div className="mt-auto pt-10">
                   <div className="bg-white rounded-[2rem] p-6 text-[#14532D]">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Annual Impact Projection</p>
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-2xl font-black tracking-tighter">{Math.round(results.totalCo2Kg * 100000)} kg</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Per 100k cycles</p>
                         </div>
                         <div className="flex items-center gap-1 text-emerald-600">
                            <Leaf size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Eco Rating: A</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Support Hub (Compact) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
               <div className="hidden md:block">
                  <BrandLogo className="w-40 h-auto" layout="horizontal" />
               </div>
               <div className="h-10 w-[1px] bg-slate-200 hidden md:block"></div>
               <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase">Engineering Support Hub</h3>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">solutions@hexuno.tech • Globally Distributed Team</p>
               </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-[#0E4C7A] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0E4C7A]/90 transition-all active:scale-95 flex items-center gap-2">
                Request Optimization Audit <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 px-8 text-center border-t border-slate-200 bg-white">
          <div className="max-w-[1800px] mx-auto space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {["Cost Modeling & Estimation", "Cost Optimization", "Benchmarking", "Sourcing", "Supplier Quality", "Digital & AI", "Prototyping"].map((item, i) => (
                <div key={i} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-[#0E4C7A] cursor-pointer transition-colors">
                  {i+1}. {item}
                </div>
              ))}
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
              © {new Date().getFullYear()} HEXUNO TECHNOLOGIES • PRECISION THROUGH DATA
            </p>
          </div>
      </footer>
    </div>
  );
};

export default App;
