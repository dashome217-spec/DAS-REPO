/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flower, Sparkles, ChevronUp, History, Download, RefreshCw, X } from "lucide-react";
import { generateFlower, FlowerData } from "./services/flowerService";

export default function App() {
  const [currentFlower, setCurrentFlower] = useState<FlowerData | null>(null);
  const [gallery, setGallery] = useState<FlowerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("flower_gallery");
    if (saved) {
      setGallery(JSON.parse(saved));
    }
  }, []);

  const handleBloom = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }

      const flower = await generateFlower();
      setCurrentFlower(flower);
      
      const newGallery = [flower, ...gallery].slice(0, 50);
      setGallery(newGallery);
      localStorage.setItem("flower_gallery", JSON.stringify(newGallery));
    } catch (err) {
      setErrorMessage("Garden sync failed. Please attempt bloom again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (flower: FlowerData) => {
    const link = document.createElement("a");
    link.href = flower.imageUrl;
    link.download = `${flower.name.replace(/\s+/g, "_")}.png`;
    link.click();
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-stone selection:bg-orange-500/20">
      <AnimatePresence mode="wait">
        {!currentFlower && !loading && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="z-10 flex flex-col items-center text-center px-10 py-12 minimal-card max-w-[85vw]"
          >
            <div className="label-micro mb-6 text-orange-500">Project Specification</div>
            <h1 className="text-4xl font-light leading-tight tracking-tight text-neutral-900 mb-6">
              POCO X5 Pro<br /><span className="font-bold">Full-Screen Flora</span>
            </h1>
            
            <div className="space-y-3 mb-10">
              <div className="flex items-center justify-center gap-3 text-sm text-neutral-500">
                <div className="indicator-dot" /> <span>AI Synthesis Engine</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-neutral-500">
                <div className="indicator-dot" /> <span>Portrait Optimization</span>
              </div>
            </div>

            <button
              onClick={handleBloom}
              className="group w-full py-4 bg-neutral-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-neutral-900/20"
            >
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="uppercase tracking-widest text-xs">Begin Synthesis</span>
            </button>
          </motion.div>
        )}

        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-20 absolute inset-0 flex flex-col items-center justify-center bg-stone/90 backdrop-blur-xl"
          >
            <div className="relative mb-8">
              <RefreshCw className="w-10 h-10 text-neutral-900 animate-[spin_2s_linear_infinite]" />
              <div className="absolute inset-0 blur-sm bg-orange-500/20 animate-pulse" />
            </div>
            <h3 className="text-xl font-medium text-neutral-900">Cultivating Assets</h3>
            <p className="label-micro mt-1">Status: Generative dreaming...</p>
          </motion.div>
        )}

        {currentFlower && !loading && (
          <motion.div
            key="flower"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-10 absolute inset-0 flex flex-col bg-black"
          >
            <div className="relative flex-1 w-full overflow-hidden">
              <img
                src={currentFlower.imageUrl}
                alt={currentFlower.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-32 left-0 right-0 px-8"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                  <span className="label-micro text-orange-500 mb-2 block">Currently Displaying</span>
                  <h2 className="text-2xl font-light text-white tracking-tight uppercase mb-1">
                    {currentFlower.name}
                  </h2>
                  <p className="text-white/60 text-[10px] uppercase tracking-widest leading-relaxed">
                    {currentFlower.description}
                  </p>
                </div>
              </motion.div>

              <div className="absolute top-12 left-0 right-0 px-6 flex justify-between items-center z-30">
                <button 
                  onClick={() => setCurrentFlower(null)}
                  className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white flex items-center justify-center active:scale-90 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDownload(currentFlower)}
                    className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleBloom}
                    className="w-11 h-11 bg-orange-500 rounded-full text-white flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-orange-500/30"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-24 z-50 px-5 py-3 bg-red-50 text-red-600 border border-red-100 shadow-sm rounded-2xl text-[10px] font-bold uppercase tracking-wider mx-4"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center z-40 px-8">
          <div className="bg-white/90 backdrop-blur-xl py-3 px-8 rounded-full flex items-center gap-10 shadow-xl border border-neutral-200">
            <button 
              onClick={() => setIsGalleryOpen(true)}
              className="flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity"
            >
              <History className="w-5 h-5 text-neutral-900" />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Vault</span>
            </button>
            <div className="h-4 w-px bg-neutral-200" />
            <button 
              onClick={handleBloom}
              className="flex flex-col items-center gap-1.5 text-orange-500"
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Harvest</span>
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isGalleryOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGalleryOpen(false)}
              className="absolute inset-0 bg-neutral-900/40 z-[60] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 h-[80vh] bg-stone z-[70] rounded-t-[40px] flex flex-col p-8 border-t border-white"
            >
              <div className="w-12 h-1 bg-neutral-200 rounded-full self-center mb-10" />
              
              <div className="flex justify-between items-start mb-10 px-2">
                <div>
                  <h3 className="text-3xl font-light text-neutral-900 tracking-tight">The <span className="font-bold">Conservatory</span></h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="indicator-dot" />
                    <p className="label-micro">
                      {gallery.length} SYNTHESIZED OBJECTS
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsGalleryOpen(false)}
                  className="bg-neutral-100 p-2.5 rounded-full text-neutral-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-2 gap-5 pb-20 px-2">
                {gallery.length === 0 ? (
                  <div className="col-span-2 py-20 text-center text-neutral-300 font-medium italic">
                    Digital garden currently void.
                  </div>
                ) : (
                  gallery.map((flower) => (
                    <motion.div 
                      key={flower.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        setCurrentFlower(flower);
                        setIsGalleryOpen(false);
                      }}
                      className="aspect-[3/4] rounded-3xl overflow-hidden relative group bg-white shadow-sm border border-neutral-100"
                    >
                      <img 
                        src={flower.imageUrl} 
                        alt={flower.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        <p className="text-[10px] font-bold text-white uppercase tracking-wider truncate">{flower.name}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


