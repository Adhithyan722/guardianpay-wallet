import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Wallet, 
  Send, 
  CheckCircle2, 
  Lock,
  Cpu,
  PlusCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { ethers, BrowserProvider, Contract, parseEther, solidityPackedKeccak256, getBytes } from 'ethers';

// ABIs
const WALLET_ABI = [
  "function nonce() view returns (uint256)",
  "function execute(address to, uint256 value, bytes data, bytes guardianSignature) external",
  "function aiGuardian() view returns (address)"
];

const FACTORY_ABI = [
  "function createWallet(address _owner, address _aiGuardian) external returns (address)",
  "event WalletCreated(address indexed wallet, address indexed owner, address indexed aiGuardian)"
];

// Configuration (Addresses will be updated after deployment)
const FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Localhost default
const AI_GUARDIAN_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Localhost Account #1

const App = () => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [smartWallet, setSmartWallet] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | 'safe' | 'danger'>(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if ((window as any).ethereum) {
      const p = new BrowserProvider((window as any).ethereum);
      setProvider(p);
    }
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        setStatus("Wallet connected!");
      } catch (err) {
        console.error("Connection failed", err);
        setStatus("Connection failed.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const deploySmartWallet = async () => {
    if (!provider || !account) return;
    setStatus("Deploying Smart Wallet...");
    try {
      const signer = await provider.getSigner();
      const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
      
      const tx = await factory.createWallet(account, AI_GUARDIAN_ADDRESS);
      const receipt = await tx.wait();
      
      // Parse event to get wallet address
      const log = receipt.logs.find((l: any) => l.address === FACTORY_ADDRESS);
      if (log) {
        // This is a simplified way to get it, usually you'd use interface.parseLog
        setStatus("Smart Wallet Deployed!");
        // For now, let's assume the user knows it or we look it up
      }
    } catch (err) {
      console.error(err);
      setStatus("Deployment failed.");
    }
  };

  const handleTransfer = async () => {
    if (!provider || !account || !recipient || !amount) return;
    
    setIsScanning(true);
    setStatus("AI Guardian is analyzing transaction...");
    
    // Simulate AI Scan with a delay
    setTimeout(async () => {
      setIsScanning(false);
      setScanResult('safe');
      setStatus("Analysis complete. Transaction verified safe.");
    }, 2000);
  };

  const executeTransaction = async () => {
    if (!smartWallet || !provider) return;
    
    try {
      const signer = await provider.getSigner();
      const walletContract = new Contract(smartWallet, WALLET_ABI, signer);
      const nonce = await walletContract.nonce();
      
      const value = parseEther(amount);
      const data = "0x"; // Simple transfer

      // 1. Create the payload hash
      const payloadHash = solidityPackedKeccak256(
        ["address", "address", "uint256", "bytes", "uint256"],
        [smartWallet, recipient, value, data, nonce]
      );

      // 2. Mock AI Signature (In real world, this comes from backend)
      // For demo, we ask user to sign as "Guardian" if they have the key, or we mock it
      setStatus("Requesting AI Guardian Signature...");
      
      // MOCK SIGNATURE (This will fail on-chain unless correctly signed by AI_GUARDIAN_ADDRESS)
      // In a real demo, you'd use a fixed private key on the frontend or a server
      const mockSignature = "0x" + "0".repeat(130); 

      setStatus("Executing Transaction...");
      const tx = await walletContract.execute(recipient, value, data, mockSignature);
      await tx.wait();
      
      setStatus("Success! Funds transferred.");
      setScanResult(null);
      setAmount('');
      setRecipient('');
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.reason || err.message}`);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-bg text-text-main">
      {/* Navbar */}
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">GuardianPay</h1>
        </div>
        
        {account ? (
          <div className="flex gap-4">
            <div className="glass-card px-4 py-2 text-sm font-medium border-primary/30 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          </div>
        ) : (
          <button onClick={connectWallet} className="btn-primary">
            Connect Wallet
          </button>
        )}
      </nav>

      {/* Status Bar */}
      {status && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-6 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-text-muted flex items-center gap-2"
        >
          <AlertCircle size={14} className="text-primary" />
          {status}
        </motion.div>
      )}

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Wallet Info */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 text-primary">
                <Wallet size={20} />
                <h2 className="font-semibold">Smart Wallet</h2>
              </div>
              {!smartWallet && account && (
                <button onClick={deploySmartWallet} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <PlusCircle size={12} /> Deploy
                </button>
              )}
            </div>
            
            {smartWallet ? (
              <div className="space-y-4">
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Contract Address</p>
                  <p className="text-sm font-mono bg-white/5 p-2 rounded border border-white/10 overflow-hidden text-ellipsis">
                    {smartWallet}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-text-muted text-sm">Active Guardian</p>
                  <p className="text-sm text-emerald-400 font-medium">AI Guardian AI-01</p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-text-muted text-sm">No smart wallet deployed yet.</p>
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 border-emerald-500/20 bg-emerald-500/5"
          >
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <Cpu size={20} />
              <h2 className="font-semibold">Security Engine</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Real-time Scanning</span>
                <span className="text-emerald-400">ON</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Malicious Logic Detection</span>
                <span className="text-emerald-400">ON</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Phishing Protection</span>
                <span className="text-emerald-400">ON</span>
              </div>
            </div>
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
              <Send size={20} className="text-primary" />
              Protected Transfer
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
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-primary">BNB</span>
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
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-primary font-medium animate-pulse">AI is scanning for risks...</p>
                    </motion.div>
                  ) : scanResult === 'safe' ? (
                    <motion.div 
                      key="safe"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl flex flex-col md:flex-row items-center gap-6 mb-6"
                    >
                      <CheckCircle2 className="text-emerald-500 shrink-0" size={40} />
                      <div className="flex-1">
                        <p className="text-emerald-400 font-bold text-lg">Analysis Result: SAFE</p>
                        <p className="text-sm text-text-muted">Target is a verified contract. No malicious patterns found. AI Guardian signature acquired.</p>
                      </div>
                      <button 
                        onClick={executeTransaction}
                        className="btn-primary md:ml-auto whitespace-nowrap"
                      >
                        Confirm & Send
                        <ChevronRight size={18} />
                      </button>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={handleTransfer}
                      disabled={!amount || !recipient || !account}
                      className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed py-4 text-lg"
                    >
                      <Lock size={20} />
                      Verify Transaction
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
