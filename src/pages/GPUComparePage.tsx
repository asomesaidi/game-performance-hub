import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Monitor, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { useGames } from '@/hooks/useGames';

// GPU database with tiers
const GPU_LIST = [
  { name: 'RTX 5090', tier: 200 }, { name: 'RTX 5080', tier: 190 }, { name: 'RTX 5070 Ti', tier: 180 },
  { name: 'RTX 5070', tier: 175 }, { name: 'RTX 5060', tier: 165 },
  { name: 'RTX 4090', tier: 160 }, { name: 'RTX 4080', tier: 150 }, { name: 'RTX 4070 Ti', tier: 145 },
  { name: 'RTX 4070', tier: 140 }, { name: 'RTX 4060 Ti', tier: 135 }, { name: 'RTX 4060', tier: 130 },
  { name: 'RTX 3090', tier: 125 }, { name: 'RTX 3080', tier: 120 }, { name: 'RTX 3070 Ti', tier: 115 },
  { name: 'RTX 3070', tier: 110 }, { name: 'RTX 3060 Ti', tier: 105 }, { name: 'RTX 3060', tier: 100 },
  { name: 'RTX 3050', tier: 90 },
  { name: 'RTX 2080 Ti', tier: 108 }, { name: 'RTX 2080', tier: 102 }, { name: 'RTX 2070', tier: 95 },
  { name: 'RTX 2060', tier: 88 },
  { name: 'GTX 1080 Ti', tier: 85 }, { name: 'GTX 1080', tier: 80 }, { name: 'GTX 1070', tier: 75 },
  { name: 'GTX 1060', tier: 63 }, { name: 'GTX 1050 Ti', tier: 55 }, { name: 'GTX 1050', tier: 50 },
  { name: 'RX 7900 XTX', tier: 155 }, { name: 'RX 7900 XT', tier: 148 }, { name: 'RX 7800 XT', tier: 130 },
  { name: 'RX 7700 XT', tier: 120 }, { name: 'RX 7600', tier: 100 },
  { name: 'RX 6900 XT', tier: 135 }, { name: 'RX 6800 XT', tier: 125 }, { name: 'RX 6700 XT', tier: 105 },
  { name: 'RX 6600 XT', tier: 92 }, { name: 'RX 6600', tier: 88 },
  { name: 'RX 5700 XT', tier: 95 }, { name: 'RX 580', tier: 60 }, { name: 'RX 570', tier: 55 },
  { name: 'Intel Arc A770', tier: 95 }, { name: 'Intel Arc A750', tier: 88 },
].sort((a, b) => b.tier - a.tier);

const inputClass = "w-full px-3 py-2.5 rounded-lg bg-background/80 border border-border/60 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

export default function GPUComparePage() {
  const [gpu1, setGpu1] = useState('');
  const [gpu2, setGpu2] = useState('');
  const { games } = useGames();

  const gpu1Data = GPU_LIST.find(g => g.name === gpu1);
  const gpu2Data = GPU_LIST.find(g => g.name === gpu2);

  const comparisonData = useMemo(() => {
    if (!gpu1Data || !gpu2Data) return [];
    return [
      { name: 'Performance Tier', gpu1: gpu1Data.tier, gpu2: gpu2Data.tier },
      { name: 'Raw Power', gpu1: Math.round(gpu1Data.tier * 1.2), gpu2: Math.round(gpu2Data.tier * 1.2) },
      { name: '1080p Gaming', gpu1: Math.min(100, Math.round(gpu1Data.tier * 0.85)), gpu2: Math.min(100, Math.round(gpu2Data.tier * 0.85)) },
      { name: '1440p Gaming', gpu1: Math.min(100, Math.round(gpu1Data.tier * 0.65)), gpu2: Math.min(100, Math.round(gpu2Data.tier * 0.65)) },
      { name: '4K Gaming', gpu1: Math.min(100, Math.round(gpu1Data.tier * 0.45)), gpu2: Math.min(100, Math.round(gpu2Data.tier * 0.45)) },
    ];
  }, [gpu1Data, gpu2Data]);

  const gameCompatibility = useMemo(() => {
    if (!gpu1Data || !gpu2Data) return [];
    // Sample 10 popular games
    const sample = games.slice(0, 10);
    return sample.map(game => {
      const getLevel = (tier: number) => {
        if (tier >= 130) return 'Ultra';
        if (tier >= 100) return 'High';
        if (tier >= 70) return 'Medium';
        if (tier >= 50) return 'Low';
        return 'Unplayable';
      };
      return {
        name: game.name.length > 20 ? game.name.slice(0, 20) + '...' : game.name,
        gpu1Level: getLevel(gpu1Data.tier),
        gpu2Level: getLevel(gpu2Data.tier),
      };
    });
  }, [gpu1Data, gpu2Data, games]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Compare GPUs – GameSpec AI</title>
        <meta name="description" content="Compare two GPUs side by side and see which games each can run at different settings." />
      </Helmet>

      <header className="border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="container py-4 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Compare GPUs</h1>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* GPU Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <label className="flex items-center gap-2 text-sm font-medium text-primary mb-3">
              <Monitor className="w-4 h-4" /> GPU 1
            </label>
            <select className={inputClass} value={gpu1} onChange={e => setGpu1(e.target.value)}>
              <option value="">Select GPU</option>
              {GPU_LIST.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
            </select>
            {gpu1Data && (
              <div className="mt-4 text-sm text-muted-foreground">
                Performance Tier: <span className="text-primary font-semibold">{gpu1Data.tier}/200</span>
              </div>
            )}
          </div>
          <div className="glass-card p-6">
            <label className="flex items-center gap-2 text-sm font-medium text-warning mb-3">
              <Monitor className="w-4 h-4" /> GPU 2
            </label>
            <select className={inputClass} value={gpu2} onChange={e => setGpu2(e.target.value)}>
              <option value="">Select GPU</option>
              {GPU_LIST.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
            </select>
            {gpu2Data && (
              <div className="mt-4 text-sm text-muted-foreground">
                Performance Tier: <span className="text-warning font-semibold">{gpu2Data.tier}/200</span>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Chart */}
        {comparisonData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Performance Comparison</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} barCategoryGap="15%">
                  <XAxis dataKey="name" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[0, 240]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(220, 20%, 10%)',
                      border: '1px solid hsl(220, 15%, 20%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 40%, 93%)',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="gpu1" name={gpu1 || 'GPU 1'} fill="hsl(190, 100%, 50%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gpu2" name={gpu2 || 'GPU 2'} fill="hsl(32, 95%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Verdict */}
            {gpu1Data && gpu2Data && (
              <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border/30">
                <p className="text-sm text-foreground">
                  <span className="font-semibold text-primary">{gpu1}</span> is{' '}
                  <span className="font-bold">
                    {Math.round(Math.abs(gpu1Data.tier - gpu2Data.tier) / Math.min(gpu1Data.tier, gpu2Data.tier) * 100)}%
                  </span>{' '}
                  {gpu1Data.tier > gpu2Data.tier ? 'faster' : 'slower'} than{' '}
                  <span className="font-semibold text-warning">{gpu2}</span>
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Game Compatibility Table */}
        {gameCompatibility.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Game Settings Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Game</th>
                    <th className="text-center py-3 px-2 text-primary font-medium">{gpu1}</th>
                    <th className="text-center py-3 px-2 text-warning font-medium">{gpu2}</th>
                  </tr>
                </thead>
                <tbody>
                  {gameCompatibility.map((row, i) => (
                    <tr key={i} className="border-b border-border/10">
                      <td className="py-3 px-2 text-foreground">{row.name}</td>
                      <td className="py-3 px-2 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          row.gpu1Level === 'Ultra' ? 'performance-ultra bg-success/10' :
                          row.gpu1Level === 'High' ? 'performance-high bg-info/10' :
                          row.gpu1Level === 'Medium' ? 'performance-medium bg-warning/10' :
                          'performance-low bg-destructive/10'
                        }`}>{row.gpu1Level}</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          row.gpu2Level === 'Ultra' ? 'performance-ultra bg-success/10' :
                          row.gpu2Level === 'High' ? 'performance-high bg-info/10' :
                          row.gpu2Level === 'Medium' ? 'performance-medium bg-warning/10' :
                          'performance-low bg-destructive/10'
                        }`}>{row.gpu2Level}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {!gpu1 && !gpu2 && (
          <div className="text-center py-16">
            <Monitor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Select two GPUs above to compare their gaming performance</p>
          </div>
        )}
      </main>
    </div>
  );
}
