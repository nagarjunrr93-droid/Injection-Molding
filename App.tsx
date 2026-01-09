
import React, { useState, useMemo } from 'react';
import { 
  Settings, Boxes, Ruler, Weight, Factory, Timer, Info, Leaf, Zap, Globe, 
  User, Mail, Phone, Building, Hammer, Send, MapPin, MessageSquare 
} from 'lucide-react';
import { MATERIALS } from './data';
import { Shape, Material, CalculationResults } from './types';
import { computeAll } from './calculator';

const App: React.FC = () => {
  // Calculator State
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
  const [gridEmissionFactor, setGridEmissionFactor] = useState(0.475); // kg CO2 / kWh

  // Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    service: 'Engineering Services',
    message: ''
  });

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const MetricCard = ({ label, value, unit, icon: Icon, color = "blue", subtext }: any) => (
    <div className={`bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between h-full hover:border-${color}-300 transition-colors`}>
      <div className="flex items-center gap-2 mb-2 text-slate-500">
        <Icon size={18} className={`text-${color}-500`} />
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-bold text-slate-900`}>{value}</span>
          <span className="text-sm font-semibold text-slate-400">{unit}</span>
        </div>
        {subtext && <p className="text-[10px] text-slate-400 mt-1">{subtext}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - Full Width */}
      <header className="bg-slate-900 text-white py-10 px-12 shadow-xl">
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-blue-500/20 p-3 rounded-2xl border border-blue-500/30">
              <Factory className="text-blue-400" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">
                Molding Engineering <span className="text-blue-400">& Sustainability</span>
              </h1>
              <p className="text-slate-400 mt-1 font-medium">Lifecycle analysis and production planning dashboard</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 backdrop-blur-sm min-w-[200px]">
                <span className="block text-xs text-slate-400 uppercase font-black mb-1">Cycle Time</span>
                <span className="text-4xl font-mono text-blue-400 font-black">{results.totalCycleTimeSec.toFixed(2)}<span className="text-xl ml-1">s</span></span>
             </div>
             <div className="bg-green-500/10 p-5 rounded-2xl border border-green-500/30 backdrop-blur-sm min-w-[200px]">
                <span className="block text-xs text-green-400 uppercase font-black mb-1">Carbon Footprint</span>
                <span className="text-4xl font-mono text-green-400 font-black">{results.totalCo2Kg.toFixed(3)}<span className="text-xl ml-1">kg</span></span>
             </div>
          </div>
        </div>
      </header>

      <main className="w-full px-12 py-12 grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Sidebar: All Inputs */}
        <div className="xl:col-span-3 space-y-6">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-2">
              <Settings className="text-blue-500" size={20} />
              Material
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Grade / Name</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
                  value={selectedMaterialName}
                  onChange={(e) => setSelectedMaterialName(e.target.value)}
                >
                  {MATERIALS.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <span className="text-blue-600 block font-bold mb-1">Density</span>
                  <span className="font-black text-slate-900 text-sm">{selectedMaterial.densityGcm3} g/cm³</span>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                  <span className="text-orange-600 block font-bold mb-1">Melt Temp</span>
                  <span className="font-black text-slate-900 text-sm">{selectedMaterial.meltingTempC}°C</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-2">
              <Ruler className="text-indigo-500" size={20} />
              Part Configuration
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Primary Geometry</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none font-medium"
                  value={shape}
                  onChange={(e) => setShape(e.target.value as Shape)}
                >
                  <option value="RECTANGLE">Rectangle</option>
                  <option value="ROUND">Round</option>
                  <option value="TUBE">Tube</option>
                  <option value="SQUARE">Square</option>
                  <option value="HEXAGONAL">Hexagonal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {shape === 'RECTANGLE' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Length (mm)</label>
                      <input type="number" value={dimensions.length} onChange={(e) => handleDimChange('length', e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Width (mm)</label>
                      <input type="number" value={dimensions.width} onChange={(e) => handleDimChange('width', e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono" />
                    </div>
                  </>
                )}
                {shape === 'ROUND' && (
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Outer Dia (mm)</label>
                    <input type="number" value={dimensions.od} onChange={(e) => handleDimChange('od', e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono" />
                  </div>
                )}
                {shape === 'TUBE' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Outer D (mm)</label>
                      <input type="number" value={dimensions.od} onChange={(e) => handleDimChange('od', e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Inner D (mm)</label>
                      <input type="number" value={dimensions.id} onChange={(e) => handleDimChange('id', e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono" />
                    </div>
                  </>
                )}
                {shape === 'SQUARE' && (
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Side (mm)</label>
                    <input type="number" value={dimensions.side} onChange={(e) => handleDimChange('side', e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono" />
                  </div>
                )}
                {shape === 'HEXAGONAL' && (
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Across Flats (mm)</label>
                    <input type="number" value={dimensions.af} onChange={(e) => handleDimChange('af', e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Wall Thickness (mm)</label>
                <input type="number" value={wallThickness} onChange={(e) => setWallThickness(parseFloat(e.target.value) || 0)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono" />
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-2">
              <Weight className="text-amber-500" size={20} />
              Production Details
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Part Weight (g)</label>
                  <input type="number" value={partWeight} onChange={(e) => setPartWeight(parseFloat(e.target.value) || 0)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Runner %</label>
                  <input type="number" value={runnerPct} onChange={(e) => setRunnerPct(parseFloat(e.target.value) || 0)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">No. Cavities</label>
                  <input type="number" value={cavities} onChange={(e) => setCavities(parseFloat(e.target.value) || 0)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">No. Inserts</label>
                  <input type="number" value={inserts} onChange={(e) => setInserts(parseFloat(e.target.value) || 0)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono" />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-green-50 p-6 rounded-3xl shadow-sm border border-green-100">
            <h3 className="text-lg font-black text-green-800 mb-5 flex items-center gap-2">
              <Globe className="text-green-500" size={20} />
              Eco Parameters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-green-600 uppercase mb-1">Grid Emission Factor (kg CO2/kWh)</label>
                <input 
                  type="number" 
                  step="0.001"
                  value={gridEmissionFactor} 
                  onChange={(e) => setGridEmissionFactor(parseFloat(e.target.value) || 0)} 
                  className="w-full p-2.5 border border-green-200 rounded-xl bg-white font-mono text-green-900" 
                />
                <p className="text-[9px] text-green-600 mt-2 font-medium">Standard factors: US: 0.37, EU: 0.25, Global: 0.475</p>
              </div>
            </div>
          </section>
        </div>

        {/* Center/Right Content Area */}
        <div className="xl:col-span-9 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard label="Required Tonnage" value={results.requiredTonnage.toLocaleString(undefined, { maximumFractionDigits: 1 })} unit="Tons" icon={Settings} color="indigo" subtext={`Assigned: ${results.selectedMachineTons || '-'} Ton Machine`} />
            <MetricCard label="Total Area" value={results.totalProjectedAreaCm2.toLocaleString(undefined, { maximumFractionDigits: 2 })} unit="cm²" icon={Boxes} color="blue" subtext={`${results.areaPerCavityCm2.toFixed(2)} cm² per cavity`} />
            <MetricCard label="Energy Use" value={results.energyConsumptionKwh.toFixed(3)} unit="kWh" icon={Zap} color="orange" subtext="Per complete shot" />
            <MetricCard label="Material Carbon" value={results.materialCo2Kg.toFixed(3)} unit="kg" icon={Leaf} color="green" subtext="Raw mat production impact" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cycle Time Analysis */}
            <div className="lg:col-span-7 bg-white p-8 rounded-[40px] shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <Timer className="text-orange-500" size={28} />
                  Production Cycle Profile
                </h2>
                <div className="px-4 py-2 bg-slate-900 rounded-full text-white text-xs font-black uppercase">
                  {(partWeight * cavities).toFixed(1)}g Shot
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">1. Injection Stage</span>
                    <span className="text-sm font-black text-slate-900">{results.injTimeSec.toFixed(3)}s</span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-1 shadow-inner">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${Math.max(2, (results.injTimeSec / results.totalCycleTimeSec) * 100)}%` }}></div>
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                    <span>Rate: {results.injRateCm3s?.toFixed(1) || '-'} cm³/s</span>
                    <span>Shot Vol: {results.shotVolumeCm3.toFixed(2)} cm³</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">2. Cooling Stage</span>
                    <span className="text-sm font-black text-slate-900">{results.coolTimeSec.toFixed(3)}s</span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-1 shadow-inner">
                    <div className="bg-teal-500 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${Math.max(2, (results.coolTimeSec / results.totalCycleTimeSec) * 100)}%` }}></div>
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                    <span>Thk: {wallThickness}mm</span>
                    <span>Diff: {selectedMaterial.thermalDiffusivityMm2s} mm²/s</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">3. Ejection & Machine Open/Close</span>
                    <span className="text-sm font-black text-slate-900">{(results.ejectionBlockSec + (results.dryCycleSec || 0)).toFixed(1)}s</span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-1 shadow-inner">
                    <div className="bg-purple-500 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${Math.max(2, ((results.ejectionBlockSec + (results.dryCycleSec || 0)) / results.totalCycleTimeSec) * 100)}%` }}></div>
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                    <span>Dry Cycle: {results.dryCycleSec || '-'}s</span>
                    <span>Handling: {results.ejectionBlockSec}s</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">4. Insert Handling (Manual)</span>
                    <span className="text-sm font-black text-slate-900">{results.insertLoadingSec.toFixed(1)}s</span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-1 shadow-inner">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${Math.max(2, (results.insertLoadingSec / results.totalCycleTimeSec) * 100)}%` }}></div>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400 font-bold uppercase text-right">
                    <span>Inserts: {inserts} Units</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-slate-50 border border-slate-200 p-6 rounded-[32px] flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                       <Boxes size={24} className="text-indigo-500" />
                    </div>
                    <div>
                       <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Machine Rank</span>
                       <span className="text-lg font-black text-slate-900">{results.selectedMachineTons || 'N/A'} Tonnes Clamp Force</span>
                    </div>
                 </div>
                 <div className="text-right">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency Benchmark</span>
                    <span className="text-lg font-black text-blue-600">Optimal Match</span>
                 </div>
              </div>
            </div>

            {/* Sustainability Detailed Impact Card */}
            <div className="lg:col-span-5 flex flex-col gap-8">
               <div className="bg-green-900 rounded-[40px] p-8 text-white flex flex-col justify-between h-full relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h2 className="text-2xl font-black flex items-center gap-3">
                          <Globe size={28} className="text-green-400" />
                          ESG Impact
                        </h2>
                        <p className="text-green-200/60 text-xs font-medium mt-1 uppercase tracking-widest">Sustainability analysis per shot</p>
                      </div>
                      <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
                        <Leaf size={20} className="text-green-400" />
                      </div>
                    </div>

                    <div className="space-y-10">
                       <div>
                          <span className="block text-4xl font-black text-green-400 font-mono mb-2">{results.totalCo2Kg.toFixed(4)} kg</span>
                          <span className="text-xs font-bold text-green-200 uppercase tracking-widest">Total CO2e Emissions</span>
                       </div>

                       <div className="grid grid-cols-2 gap-8">
                          <div>
                             <span className="block text-xl font-black text-white">{results.materialCo2Kg.toFixed(4)} kg</span>
                             <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Scope 3 (Material)</span>
                          </div>
                          <div>
                             <span className="block text-xl font-black text-white">{results.processingCo2Kg.toFixed(4)} kg</span>
                             <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Scope 2 (Energy)</span>
                          </div>
                       </div>

                       <div className="pt-8 border-t border-white/10">
                          <div className="flex items-center gap-3 mb-4">
                            <Zap size={18} className="text-amber-400" />
                            <span className="text-xs font-bold uppercase tracking-widest">Grid Mix Breakdown</span>
                          </div>
                          <p className="text-sm text-green-100/70 leading-relaxed font-medium">
                            Based on a grid factor of {gridEmissionFactor} kg CO2/kWh, processing one shot consumes {results.energyConsumptionKwh.toFixed(4)} kWh of energy.
                          </p>
                       </div>
                    </div>
                  </div>

                  <div className="mt-12 bg-white p-6 rounded-[32px] text-slate-900">
                     <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Annual Impact Projection</span>
                     <div className="flex justify-between items-end">
                        <div>
                           <span className="text-2xl font-black">{(results.totalCo2Kg * 100000).toFixed(0)} kg</span>
                           <span className="text-xs block text-slate-500 font-medium">Per 100k cycles</span>
                        </div>
                        <div className="text-right">
                           <span className="text-green-600 font-black text-sm flex items-center gap-1">
                              <Leaf size={14} /> Eco Rating: A
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <section className="bg-blue-50/50 border border-blue-100 p-8 rounded-[40px]">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                   <h4 className="text-blue-900 font-black flex items-center gap-3 mb-5 text-lg">
                      <Info size={22} />
                      Engineering Methodology
                   </h4>
                   <ul className="text-sm text-blue-800 space-y-3 font-medium opacity-80">
                      <li className="flex gap-2">
                         <span className="text-blue-400 font-bold">•</span>
                         Clamping force utilizes a 1.2 safety factor against material clamping pressure benchmarks.
                      </li>
                      <li className="flex gap-2">
                         <span className="text-blue-400 font-bold">•</span>
                         Cooling time logic uses 1D transient heat conduction through the wall thickness.
                      </li>
                      <li className="flex gap-2">
                         <span className="text-blue-400 font-bold">•</span>
                         Handling times are auto-scaled based on required tonnage and machine size complexity.
                      </li>
                   </ul>
                </div>
                <div>
                   <h4 className="text-green-900 font-black flex items-center gap-3 mb-5 text-lg">
                      <Leaf size={22} className="text-green-500" />
                      Sustainability Benchmark
                   </h4>
                   <p className="text-sm text-green-800 leading-relaxed font-medium opacity-80">
                      Material emission factors (Scope 3) are derived from averages for primary polymer production. 
                      Scope 2 calculations assume a modern hydraulic-electric hybrid machine with an energy 
                      efficiency benchmark of 0.6 kWh/kg processed plastic.
                   </p>
                </div>
             </div>
          </section>
        </div>
      </main>

      {/* --- NEW SECTION: CONTACT & COMPANY DETAILS --- */}
      <footer className="w-full bg-slate-900 py-24 px-12 mt-12 border-t border-slate-800">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left: Contact Form */}
          <div className="bg-slate-800/40 p-10 rounded-[40px] border border-slate-700 backdrop-blur-md">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-white mb-4">Send us a Message</h2>
              <p className="text-slate-400 font-medium">Fill out the form below and our team will get back to you within 24 hours.</p>
            </div>

            {formSubmitted ? (
              <div className="bg-green-500/10 border border-green-500/30 p-8 rounded-3xl text-center">
                <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-green-400/80">Thank you for reaching out. We'll contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <User size={14} /> Full Name
                    </label>
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe"
                      className="w-full bg-slate-900/50 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Mail size={14} /> Work Email
                    </label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@company.com"
                      className="w-full bg-slate-900/50 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Phone size={14} /> Phone Number
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-900/50 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Building size={14} /> Company Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="Your Company Ltd."
                      className="w-full bg-slate-900/50 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Hammer size={14} /> Service of Interest
                  </label>
                  <select 
                    className="w-full bg-slate-900/50 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                  >
                    <option>Engineering Services</option>
                    <option>Injection Molding Consulting</option>
                    <option>Sustainability Analysis</option>
                    <option>Custom Tooling Design</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={14} /> How can we help?
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us about your project requirements..."
                    className="w-full bg-slate-900/50 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600 resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Right: Company Info */}
          <div className="flex flex-col justify-center space-y-12">
            <div>
              <div className="flex items-center gap-4 mb-8">
                 <div className="bg-blue-500 p-3 rounded-2xl">
                   <Building className="text-white" size={32} />
                 </div>
                 <h2 className="text-4xl font-black text-white tracking-tight">Blackbuck Tech</h2>
              </div>
              
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="bg-slate-800 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-slate-700">
                    <MapPin className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Our Headquarters</h4>
                    <p className="text-slate-400 font-medium leading-relaxed italic">
                      123 Tech Park, Engineering Blvd<br />
                      Suite 400, Innovation District<br />
                      San Francisco, CA 94107
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="bg-slate-800 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-slate-700">
                    <Mail className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Email Us</h4>
                    <p className="text-slate-500 text-sm font-bold uppercase mb-1">For general inquiries:</p>
                    <a href="mailto:info@blackbucktech.com" className="text-blue-400 font-bold text-xl hover:text-blue-300 transition-colors">
                      info@blackbucktech.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="bg-slate-800 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-slate-700">
                    <Phone className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Call Us</h4>
                    <p className="text-slate-500 text-sm font-bold uppercase mb-1">Mon-Fri from 9am to 6pm PST.</p>
                    <a href="tel:+15551234567" className="text-blue-400 font-bold text-xl hover:text-blue-300 transition-colors">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-slate-800">
              <div className="flex gap-8 items-center opacity-40">
                <Leaf size={40} className="text-green-500" />
                <Globe size={40} className="text-blue-500" />
                <Zap size={40} className="text-amber-500" />
                <p className="text-slate-500 text-sm font-medium">
                  © {new Date().getFullYear()} Blackbuck Tech Engineering. <br />
                  Empowering Sustainable Manufacturing globally.
                </p>
              </div>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default App;
