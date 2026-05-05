import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Wallet, 
  Send, 
  CheckCircle2, 
  Lock,
  Cpu
} from 'lucide-react';

const App = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | 'safe' | 'danger'>(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (err) {
        console.error("Connection failed", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const simulateScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult('safe');
    }, 3000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Navbar */}
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Shield className="text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">GuardianPay</h1>
        </div>
        
        {account ? (
          <div className="glass-card px-4 py-2 text-sm font-medium border-sky-500/30">
            {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        ) : (
          <button onClick={connectWallet} className="btn-primary">
            Connect Wallet
          </button>
        )}
      </nav>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Wallet Info */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6 text-sky-400">
              <Wallet size={20} />
              <h2 className="font-semibold">My Wallet</h2>
            </div>
            <div className="space-y-1">
              <p className="text-text-muted text-sm">Available Balance</p>
              <p className="text-4xl font-bold">12.50 <span className="text-lg font-normal text-text-muted">BNB</span></p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 border-emerald-500/20 bg-emerald-500/5"
          >
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <Cpu size={20} />
              <h2 className="font-semibold">AI Guardian Active</h2>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Your AI Guardian is monitoring the BNB Chain. Every transaction you initiate is simulated in a sandbox to detect malicious logic.
            </p>
          </motion.div>
        </div>

        {/* Middle Column: Send Transaction */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8"
          >
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Send size={20} className="text-sky-400" />
              Transfer Funds
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Recipient Address</label>
                <input 
                  type="text" 
                  placeholder="0x..." 
                  className="input-field"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Amount</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="0.0" 
                    className="input-field pr-16"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-sky-400">BNB</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <AnimatePresence mode="wait">
                  {isScanning ? (
                    <motion.div 
                      key="scanning"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4 py-4"
                    >
                      <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sky-400 font-medium animate-pulse">AI is scanning for risks...</p>
                    </motion.div>
                  ) : scanResult === 'safe' ? (
                    <motion.div 
                      key="safe"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex flex-col md:flex-row items-center gap-4 mb-6"
                    >
                      <CheckCircle2 className="text-emerald-500" size={32} />
                      <div>
                        <p className="text-emerald-400 font-bold">Safe to Execute</p>
                        <p className="text-xs text-emerald-500/80">No malicious patterns detected in target contract.</p>
                      </div>
                      <button className="btn-primary md:ml-auto">
                        Execute Transaction
                      </button>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={simulateScan}
                      disabled={!amount || !recipient}
                      className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Lock size={18} />
                      Verify with AI Guardian
                    </button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

      </main>
    </div>
  );
};

export default App;
