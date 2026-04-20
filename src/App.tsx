/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Hash, 
  Binary, 
  Settings, 
  AlertCircle, 
  Copy, 
  Check, 
  RefreshCw,
  Languages
} from 'lucide-react';
import { translations, Language } from './translations';

type Base = 2 | 8 | 10 | 16;

interface ConversionResult {
  decimal: string;
  binary: string;
  octal: string;
  hexadecimal: string;
  octToHex: string;
  octToDec: string;
  isValid: boolean;
  error?: string;
}

export default function App() {
  const [input, setInput] = useState<string>('');
  const [selectedBase, setSelectedBase] = useState<Base>(10);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [isProcessing, setIsProcessing] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    if (input) {
      setIsProcessing(true);
      const timer = setTimeout(() => setIsProcessing(false), 150);
      return () => clearTimeout(timer);
    }
  }, [input, selectedBase]);

  const results = useMemo((): ConversionResult => {
    if (!input.trim()) {
      return {
        decimal: '0',
        binary: '0',
        octal: '0',
        hexadecimal: '0',
        octToHex: '0 → 0',
        octToDec: '0 → 0',
        isValid: true,
      };
    }

    try {
      let decimalValue: bigint;
      
      const cleanInput = input.trim();
      
      if (selectedBase === 10) {
        if (!/^-?\d+$/.test(cleanInput)) {
          throw new Error(`${t.error}: Decimal - 0-9 & Minus`);
        }
        decimalValue = BigInt(cleanInput);
      } else if (selectedBase === 2) {
        if (!/^[01]+$/.test(cleanInput)) {
          throw new Error(`${t.error}: Binary - 0, 1`);
        }
        decimalValue = BigInt(`0b${cleanInput}`);
      } else if (selectedBase === 8) {
        if (!/^[0-7]+$/.test(cleanInput)) {
          throw new Error(`${t.error}: Octal - 0-7`);
        }
        decimalValue = BigInt(`0o${cleanInput}`);
      } else {
        if (!/^[0-9a-fA-F]+$/.test(cleanInput)) {
          throw new Error(`${t.error}: Hex - 0-9, A-F`);
        }
        decimalValue = BigInt(`0x${cleanInput}`);
      }

      return {
        decimal: decimalValue.toString(10),
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        hexadecimal: decimalValue.toString(16).toUpperCase(),
        octToHex: `${decimalValue.toString(8)} → ${decimalValue.toString(16).toUpperCase()}`,
        octToDec: `${decimalValue.toString(8)} → ${decimalValue.toString(10)}`,
        isValid: true,
      };
    } catch (e) {
      return {
        decimal: '-',
        binary: '-',
        octal: '-',
        hexadecimal: '-',
        octToHex: '- → -',
        octToDec: '- → -',
        isValid: false,
        error: e instanceof Error ? e.message : t.error,
      };
    }
  }, [input, selectedBase, t.error]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleClear = () => {
    setInput('');
  };

  const handleCopyAll = () => {
    const text = [
      `Decimal: ${results.decimal}`,
      `Binary: ${results.binary}`,
      `Octal: ${results.octal}`,
      `Hexadecimal: ${results.hexadecimal}`,
      `Oct ➔ Hex: ${results.octToHex}`,
      `Oct ➔ Dec: ${results.octToDec}`
    ].join('\n');
    handleCopy(text, 'ALL');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if Alt key is pressed to avoid interference with typing
      if (e.altKey) {
        const key = e.key.toLowerCase();
        if (key === 'd') {
          e.preventDefault();
          setSelectedBase(10);
        } else if (key === 'b') {
          e.preventDefault();
          setSelectedBase(2);
        } else if (key === 'o') {
          e.preventDefault();
          setSelectedBase(8);
        } else if (key === 'h') {
          e.preventDefault();
          setSelectedBase(16);
        } else if (key === 'x') {
          e.preventDefault();
          handleClear();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const bases: { label: string; value: Base; icon: any; shortcut: string }[] = [
    { label: 'Decimal', value: 10, icon: Hash, shortcut: 'D' },
    { label: 'Binary', value: 2, icon: Binary, shortcut: 'B' },
    { label: 'Octal', value: 8, icon: Settings, shortcut: 'O' },
    { label: 'Hex', value: 16, icon: Calculator, shortcut: 'H' },
  ];

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-color-hw-bg font-sans selection:bg-hw-lcd-text selection:text-hw-lcd-bg">
      <div className="w-full max-w-[900px] bg-hw-panel border-2 border-hw-zinc-dark shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_20px_50px_rgba(0,0,0,0.5)] rounded-lg p-8 relative flex flex-col min-h-[600px]">
        {/* Decorative Screws */}
        <div className="screw top-2.5 left-2.5" />
        <div className="screw top-2.5 right-2.5" />
        <div className="screw bottom-2.5 left-2.5" />
        <div className="screw bottom-2.5 right-2.5" />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-zinc-400 uppercase leading-none">{t.title}</h1>
            <p className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase mt-1">{t.model}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-2 bg-black/30 border border-hw-border rounded p-1">
              <Languages size={14} className="text-zinc-500 ml-1" />
              {(['en', 'am', 'om'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${
                    lang === l ? 'bg-hw-lcd-text/20 text-hw-lcd-text' : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <motion.span 
                  className={`status-led ${results.isValid ? 'active' : ''}`} 
                  animate={isProcessing ? { opacity: [1, 0.4, 1], scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.1, repeat: isProcessing ? Infinity : 0 }}
                />
                <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">{t.signal}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="status-led active" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">{t.power}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary LCD Display */}
        <div className="bg-hw-lcd-bg border-4 border-black rounded-sm p-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative mb-8 overflow-hidden">
          <div className="absolute top-2 left-3 text-[10px] text-[#2d5c4b] font-bold uppercase tracking-widest z-10 flex items-center gap-2">
            {t.activeOutput}
            <AnimatePresence>
              {isProcessing && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#2d5c4b] text-hw-lcd-bg px-1 rounded-[1px] text-[8px] animate-pulse"
                >
                  BUSY_PROC
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <motion.div 
            key={results.binary}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="text-hw-lcd-text lcd-glow text-4xl md:text-5xl font-bold text-right tracking-tight truncate min-h-[1.2em]"
          >
            {results.binary}
          </motion.div>
          <div className="absolute bottom-2 right-3 text-[12px] text-[#2d5c4b] font-bold uppercase">
            BIN MODE
          </div>
        </div>

        {/* Control Interface */}
        <div className="border-t border-dashed border-hw-border pt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Input Side */}
          <div className="space-y-6 md:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2a2c2f] to-[#151619] rounded-full border-2 border-hw-border relative shadow-lg">
                <motion.div 
                  className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-3 bg-hw-lcd-text rounded-full origin-bottom"
                  animate={{ rotate: (selectedBase / 16) * 360 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
              </div>
              <div>
                <div className="text-[10px] uppercase text-zinc-500 tracking-wider font-bold mb-1">{t.baseSelect}</div>
                <div className="text-xs font-bold text-hw-lcd-text">BASE [{selectedBase}]</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {bases.map((base) => (
                <button
                  key={base.value}
                  onClick={() => setSelectedBase(base.value)}
                  title={`Alt + ${base.shortcut}`}
                  className={`py-2 px-3 border rounded text-[10px] font-bold uppercase tracking-widest transition-all relative group/btn ${
                    selectedBase === base.value 
                      ? 'bg-hw-lcd-text/10 border-hw-lcd-text text-hw-lcd-text' 
                      : 'bg-black/20 border-hw-border text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span className="relative z-10">
                    {base.label === 'Decimal' ? 'DEC' : base.label === 'Binary' ? 'BIN' : base.label === 'Octal' ? 'OCT' : 'HEX'}
                  </span>
                  <span className="absolute right-1 bottom-0.5 text-[6px] opacity-0 group-hover/btn:opacity-30 transition-opacity">
                    ALT+{base.shortcut}
                  </span>
                </button>
              ))}
            </div>

            <div className="bg-black/30 p-4 border border-zinc-800 rounded relative group min-h-[80px]">
              <div className="text-[10px] uppercase text-zinc-600 tracking-wider font-bold mb-2 flex justify-between relative z-20">
                <span>{t.inputValue}</span>
                {input && (
                  <button 
                    onClick={handleClear} 
                    title="Alt + X"
                    className="text-zinc-700 hover:text-zinc-400 flex items-center gap-1 transition-colors group/reset"
                  >
                    <RefreshCw size={8} /> {t.reset}
                    <span className="text-[6px] ml-1 opacity-0 group-hover/reset:opacity-50 tracking-tighter">[ALT+X]</span>
                  </button>
                )}
              </div>
              
              <div className="relative font-mono text-2xl w-full">
                {/* Highlight Layer */}
                <div 
                  className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-all select-none"
                  aria-hidden="true"
                >
                  {input.split('').map((char, index) => {
                    let isValid = true;
                    const c = char.toLowerCase();
                    if (selectedBase === 10) {
                      isValid = /^[0-9]$/.test(char) || (index === 0 && char === '-');
                    } else if (selectedBase === 2) {
                      isValid = /^[01]$/.test(char);
                    } else if (selectedBase === 8) {
                      isValid = /^[0-7]$/.test(char);
                    } else if (selectedBase === 16) {
                      isValid = /^[0-9a-f]$/.test(c);
                    }

                    return (
                      <span 
                        key={index}
                        className={isValid ? 'text-white' : 'bg-red-500/40 text-white rounded-[2px] ring-1 ring-red-500/50'}
                      >
                        {char}
                      </span>
                    );
                  })}
                  {!input && <span className="text-zinc-800">{t.readyInput}</span>}
                </div>

                {/* Actual Input Layer (Transparent) */}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-transparent text-white/0 caret-hw-lcd-text relative z-10 focus:outline-none whitespace-pre-wrap break-all"
                  spellCheck={false}
                  autoFocus
                />
              </div>
            </div>

            {/* Direct Octal to Hex/Dec Conversion Bridges */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-black/40 border border-hw-border p-3 rounded flex flex-col items-center justify-center space-y-1">
                <div className="text-[7px] uppercase text-zinc-600 tracking-[0.1em] font-bold">{t.octToHex}</div>
                <div className="text-[11px] font-mono text-hw-lcd-text tracking-tighter truncate w-full text-center">
                  {results.octToHex}
                </div>
              </div>
              <div className="bg-black/40 border border-hw-border p-3 rounded flex flex-col items-center justify-center space-y-1">
                <div className="text-[7px] uppercase text-zinc-600 tracking-[0.1em] font-bold">{t.octToDec}</div>
                <div className="text-[11px] font-mono text-hw-lcd-text tracking-tighter truncate w-full text-center">
                  {results.octToDec}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {!results.isValid && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-500 text-[10px] font-bold uppercase tracking-widest"
                >
                  <AlertCircle size={14} />
                  <span className="truncate">{results.error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Output Side */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-1">
              <div className="text-[10px] uppercase text-zinc-600 tracking-[0.2em] font-bold">Conversion Matrix</div>
              <button 
                onClick={handleCopyAll}
                className={`text-[9px] font-bold uppercase py-1.5 px-3 border rounded transition-all flex items-center gap-2 ${
                  copyStatus === 'ALL' 
                    ? 'bg-hw-lcd-text/20 border-hw-lcd-text text-hw-lcd-text' 
                    : 'bg-black/40 border-hw-border text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {copyStatus === 'ALL' ? (
                  <><Check size={10} /> {t.copyAllSuccess}</>
                ) : (
                  <><Copy size={10} /> {t.copyAll}</>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <OutputCard 
                label={t.decimal} 
              value={results.decimal} 
              onCopy={() => handleCopy(results.decimal, 'DEC')}
              isCopied={copyStatus === 'DEC'}
              t={t}
            />
            <OutputCard 
              label={t.hexadecimal} 
              value={results.hexadecimal} 
              onCopy={() => handleCopy(results.hexadecimal, 'HEX')}
              isCopied={copyStatus === 'HEX'}
              t={t}
            />
            <OutputCard 
              label={t.octal} 
              value={results.octal} 
              onCopy={() => handleCopy(results.octal, 'OCT')}
              isCopied={copyStatus === 'OCT'}
              t={t}
            />
            <OutputCard 
              label={t.octToDec} 
              value={results.octToDec} 
              onCopy={() => handleCopy(results.octToDec, 'OCTDEC')}
              isCopied={copyStatus === 'OCTDEC'}
              t={t}
            />
            <div className="sm:col-span-2">
              <div className="bg-black/20 border border-hw-border p-4 rounded h-full flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase text-zinc-600 tracking-wider font-bold mb-2">{t.sysLog}</div>
                  <div className="text-[11px] text-zinc-500 font-mono italic">
                    [INFO] {t.status}: {results.isValid ? t.stable : t.error}. Buffer: {input.length}b. {results.isValid ? t.checksum : t.interrupt}.
                  </div>
                </div>
                {results.isValid && input && (selectedBase === 8 || selectedBase === 16) && (
                  <div className="mt-4 pt-4 border-t border-zinc-800/30 overflow-x-auto">
                    <div className="text-[9px] uppercase text-hw-lcd-text/60 tracking-[0.2em] font-bold mb-2">Internal Bit Re-alignment</div>
                    <div className="flex flex-col gap-2 font-mono text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-600 w-12 shrink-0">SOURCE:</span>
                        <span className="text-white truncate">{input.split('').map(char => `<${char}>`).join(' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-600 w-12 shrink-0">BINARY:</span>
                        <span className="text-hw-lcd-text/40 truncate">
                          {results.binary.padStart(Math.ceil(results.binary.length / (selectedBase === 16 ? 4 : 3)) * (selectedBase === 16 ? 4 : 3), '0').match(new RegExp(`.{${selectedBase === 16 ? 4 : 3}}`, 'g'))?.join(' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-600 w-12 shrink-0">TARGET:</span>
                        <span className="text-white truncate">
                          {results.binary.padStart(Math.ceil(results.binary.length / (selectedBase === 16 ? 3 : 4)) * (selectedBase === 16 ? 3 : 4), '0').match(new RegExp(`.{${selectedBase === 16 ? 3 : 4}}`, 'g'))?.join(' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
        <div className="mt-auto pt-6 flex justify-between border-t border-zinc-800/50">
          <div className="text-[10px] text-zinc-700 font-mono">SYS_CORE::0x8F2A_V10</div>
          <div className="flex gap-6 text-[10px] text-zinc-700 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-hw-lcd-text rounded-full" /> {t.status}: {t.online}</span>
            <span>Mem: 4KB</span>
            <span>ID: 0x8F2A</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutputCard({ 
  label, 
  value, 
  onCopy, 
  isCopied,
  t
}: { 
  label: string; 
  value: string; 
  onCopy: () => void;
  isCopied: boolean;
  t: any;
}) {
  return (
    <div className="bg-black/20 border border-hw-border p-4 rounded group transition-all hover:bg-black/30 hover:border-zinc-700">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[9px] uppercase text-zinc-600 tracking-widest font-bold">{label}</span>
        <button 
          onClick={onCopy}
          className={`text-[9px] font-bold uppercase transition-all flex items-center gap-1 ${
            isCopied ? 'text-hw-lcd-text' : 'text-zinc-700 group-hover:text-zinc-400'
          }`}
        >
          {isCopied ? <><Check size={10} /> {t.copied}</> : <><Copy size={10} /> {t.copy}</>}
        </button>
      </div>
      <motion.div 
        key={value}
        initial={{ opacity: 0.3, filter: 'blur(2px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.15 }}
        className={`text-xl font-mono truncate tracking-tighter ${isCopied ? 'text-hw-lcd-text/80' : 'text-white'}`}
      >
        {value}
      </motion.div>
    </div>
  );
}
