import { motion } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';
import heroBg from '@/assets/hero-banner.jpg';

export function HeroBanner({ onScrollDown }: { onScrollDown: () => void }) {
  return (
    <section className="relative h-[50vh] min-h-[360px] max-h-[500px] overflow-hidden">
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      
      <div className="relative h-full container flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI-Powered</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Can Your PC <br />
            <span className="text-gradient-primary">Run It?</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md">
            Check if your PC can handle 700+ games. Compare specs, get performance estimates, and find the best games for your hardware.
          </p>
          <button
            onClick={onScrollDown}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
          >
            Explore Games
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
