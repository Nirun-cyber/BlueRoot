import React from 'react';
import { 
  Sprout, 
  Cpu, 
  Droplets, 
  ShieldCheck
} from 'lucide-react';
import { StatusBadge } from '../components/Common';

const About: React.FC = () => {
  const features = [
    { icon: Droplets, title: 'Smart Irrigation', desc: 'Precision water management based on real-time soil moisture monitoring.' },
    { icon: Cpu, title: 'IoT Integration', desc: 'Seamlessly connects with ESP32 and Arduino based sensor networks.' },
    { icon: ShieldCheck, title: 'Safety Protocols', desc: 'Automated shutdown logic for pH and TDS levels to protect crop health.' },
  ];

  return (
    <div className="p-8 space-y-12 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-agri-green/10 text-agri-green border border-agri-green/20 mb-4">
           <Sprout size={16} />
           <span className="text-xs font-bold uppercase tracking-widest">Project Exhibition 2026</span>
        </div>
        <h1 className="text-5xl font-black bg-gradient-to-r from-agri-green to-agri-blue bg-clip-text text-transparent">
           Smart Water & Fertigation
        </h1>
        <p className="text-lg text-black/60 dark:text-white/60 max-w-2xl mx-auto font-medium">
           A futuristic precision agriculture solution designed to optimize water usage and nutrient distribution through real-time sensor analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="glass rounded-3xl p-8 border border-black/5 dark:border-white/5 hover:border-agri-green/30 transition-all group">
             <f.icon size={32} className="text-agri-green mb-4 group-hover:scale-110 transition-transform" />
             <h3 className="text-xl font-bold mb-2">{f.title}</h3>
             <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <section className="glass rounded-[2rem] p-10 border border-black/5 dark:border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 -mr-32 -mt-32 bg-agri-green/5 rounded-full blur-3xl"></div>
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
               <h2 className="text-3xl font-bold">Technical Architecture</h2>
               <p className="text-black/60 dark:text-white/60 leading-relaxed">
                  The system is built on a modular React architecture with a real-time state engine. It simulates an IoT environment capable of handling high-frequency sensor data, implementing safety logic at the edge, and providing intuitive visualization through advanced chart modules.
               </p>
               <div className="flex flex-wrap gap-2">
                  <StatusBadge status="idle" label="React 18" />
                  <StatusBadge status="idle" label="TypeScript" />
                  <StatusBadge status="idle" label="Tailwind v3" />
                  <StatusBadge status="idle" label="Framer Motion" />
                  <StatusBadge status="idle" label="Recharts" />
               </div>
            </div>
            <div className="bg-black/5 dark:bg-white/5 rounded-3xl p-8 border border-black/10 dark:border-white/10 font-mono text-sm space-y-4">
               <div className="flex items-center gap-2 text-agri-green">
                  <div className="w-2 h-2 rounded-full bg-agri-green"></div>
                  <span className="font-bold">System Status: Nominal</span>
               </div>
               <div className="space-y-1">
                  <p className="text-black/40 dark:text-white/40">// Hardware Simulation Active</p>
                  <p><span className="text-purple-500">const</span> <span className="text-agri-blue">config</span> = {'{'}</p>
                  <p className="pl-4">samplingRate: <span className="text-amber-500">"3000ms"</span>,</p>
                  <p className="pl-4">safePH: [<span className="text-amber-500">6.0, 7.5</span>],</p>
                  <p className="pl-4">autoIrrigation: <span className="text-amber-500">true</span></p>
                  <p>{'}'}</p>
               </div>
            </div>
         </div>
      </section>


    </div>
  );
};

export default About;
