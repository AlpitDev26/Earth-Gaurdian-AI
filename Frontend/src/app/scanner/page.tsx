"use client";
import { useState, useRef } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Camera, Image as ImageIcon, CheckCircle2, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Scanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [results, setResults] = useState<{item: string, co2: number, alternative?: string}[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Resize width to 800px for AI performance
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const newFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(newFile);
            } else {
              reject(new Error('Compression failed'));
            }
          }, 'image/jpeg', 0.7); // Compress to 70% quality
        };
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          setError('Please select a valid image file.');
          return;
        }
        setError(null);
        
        // Fast compression before AI
        setIsScanning(true);
        const compressedFile = await compressImage(file);
        
        const imageUrl = URL.createObjectURL(compressedFile);
        setImagePreview(imageUrl);
        await performScan(compressedFile);
      }
    } catch (err) {
      setError('Camera access failed or was denied.');
    }
  };

  const performScan = async (file: File) => {
    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use the Spring Boot API Gateway instead of direct FastAPI!
      const response = await fetch('/api/v1/receipts/scan', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process receipt');
      }

      const rawData = await response.json();
      const data = rawData.data; // Unwrap the Spring Boot ApiResponse wrapper
      // Mapping API response to our UI state
      setResults(data.items.map((i: any) => ({ item: i.name, co2: i.co2, alternative: i.alternative })));
    } catch (err) {
      setError('AI Processing failed. Make sure your FastAPI backend is running.');
      setResults(null);
    } finally {
      setIsScanning(false);
    }
  };

  const resetScanner = () => {
    setResults(null);
    setImagePreview(null);
  };

  const totalCo2 = results?.reduce((acc, curr) => acc + curr.co2, 0).toFixed(1);

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <header className="flex items-center gap-4 mb-8 relative z-10">
        <Link href="/">
          <div className="bg-white/5 p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </div>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">AI Receipt Scanner</h1>
      </header>

      <AnimatePresence mode="wait">
        {!results ? (
          <motion.div 
            key="scanner-input"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <GlassCard className="flex flex-col items-center justify-center h-[450px] border-dashed border-2 border-white/20 relative overflow-hidden">
              
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                ref={fileInputRef}
                onChange={handleImageCapture}
                className="hidden" 
              />
              
              <input 
                type="file" 
                accept="image/*" 
                ref={galleryInputRef}
                onChange={handleImageCapture}
                className="hidden" 
              />

              {imagePreview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Receipt preview" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                  {isScanning && (
                    <>
                      {/* Laser scanning animation */}
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                        className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(16,185,129,1)] z-20" 
                      />
                      <div className="relative z-30 flex flex-col items-center p-6 bg-[#0B0F19]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                        <Sparkles className="text-primary mb-3 animate-pulse" size={32} />
                        <p className="font-bold text-lg tracking-tight text-white">Extracting items...</p>
                        <p className="text-xs text-gray-400 mt-1 text-center">Cross-referencing global emission databases</p>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="bg-white/5 p-6 rounded-full border border-white/10 mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <Camera size={48} className="text-gray-300" />
                  </div>
                  <h2 className="font-bold text-xl tracking-tight mb-2">Capture Receipt</h2>
                  <p className="text-sm text-gray-400 mb-8 px-4 leading-relaxed">Ensure all line items and totals are clearly visible in the frame.</p>
                  
                  <div className="flex gap-4 w-full">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 bg-primary hover:bg-emerald-400 text-[#0B0F19] font-bold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                      <Camera size={18} /> Camera
                    </button>
                    <button 
                      onClick={() => galleryInputRef.current?.click()}
                      className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <ImageIcon size={18} /> Gallery
                    </button>
                  </div>
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="text-danger bg-danger/10 border border-danger/30 px-4 py-2 rounded-lg mt-6 text-sm font-bold"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
              )}
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div 
            key="scanner-results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
          >
            <GlassCard>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <CheckCircle2 size={20} />
                    <h2 className="text-lg font-bold tracking-tight text-white">Scan Complete</h2>
                  </div>
                  <p className="text-xs text-gray-400">4 items extracted successfully</p>
                </div>
                <button onClick={resetScanner} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                  <RefreshCw size={18} className="text-gray-400" />
                </button>
              </div>

              <div className="bg-[#0B0F19]/50 rounded-xl p-1 mb-6 border border-white/5">
                {results.map((r, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="p-3 border-b border-white/5 last:border-0"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-gray-200">{r.item}</span>
                      <span className={r.co2 > 5 ? "text-danger font-bold text-sm bg-danger/10 px-2 py-1 rounded-md" : "text-primary font-bold text-sm"}>
                        {r.co2} kg
                      </span>
                    </div>
                    {r.alternative && r.alternative.trim() !== "" && r.co2 > 1 && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-2 py-1.5 rounded-md border border-primary/20">
                        <Sparkles size={12} className="shrink-0" /> 
                        <span className="font-medium">Try next time:</span> {r.alternative}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-8 px-2">
                <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Impact</span>
                <span className="text-2xl font-bold tracking-tighter text-white">{totalCo2} <span className="text-sm font-normal text-gray-500">kg CO2</span></span>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`p-4 rounded-xl mb-8 border ${Number(totalCo2) > 10 ? 'bg-danger/10 border-danger/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]'}`}
              >
                <h3 className={`font-black text-xs tracking-wider uppercase mb-2 flex items-center gap-2 ${Number(totalCo2) > 10 ? 'text-danger' : 'text-primary'}`}>
                  {Number(totalCo2) > 10 ? '⚠️ High Emission Alert' : '🌱 Eco-Warrior Status'}
                </h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {Number(totalCo2) > 10 
                    ? <span>Your footprint is a heavy <strong className="text-white text-base">{totalCo2} kg CO2</strong>. <br/><br/><strong className="text-danger">MOTIVATION:</strong> Small changes matter! Swap red meat for plant-based proteins to instantly reduce your impact by up to 80%!</span>
                    : <span>Your footprint is a light <strong className="text-white text-base">{totalCo2} kg CO2</strong>. <br/><br/><strong className="text-primary">MOTIVATION:</strong> You are protecting the Digital Twin! Keep buying local to maintain a thriving ecosystem!</span>}
                </p>
              </motion.div>

              <Link href="/">
                <button className="w-full bg-primary hover:bg-emerald-400 transition-colors text-[#0B0F19] font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 transform duration-200">
                  Save & Update Twin
                </button>
              </Link>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
