'use client';

import React, { useState } from 'react';

export default function Home() {
  const [page, setPage] = useState('home');
  const [step, setStep] = useState('form');
  const [proofStatus, setProofStatus] = useState('idle');
  const [commitment, setCommitment] = useState('');
  const [result, setResult] = useState<any>(null);

  const initialInput = { income: '', debt: '', employment: 'Employed', housing: 'Own' };
  const [input, setInput] = useState(initialInput);

  // Simulate scoring
  const handleCalculate = async () => {
    setStep('scoring');
    await new Promise(r => setTimeout(r, 1800));
    const score = Math.floor(Math.random() * 60) + 30;
    setResult({
      score,
      eligibility: score > 50 ? 'ELIGIBLE' : 'REVIEW',
      tier: score > 75 ? 2 : (score > 45 ? 1 : 0)
    });
    setStep('result');
  };

  // Simulate ZK proof
  const handleSubmitProof = async () => {
    setStep('proof');
    setProofStatus('generating');
    await new Promise(r => setTimeout(r, 2400));
    setCommitment('0x' + Array.from({length:6},()=>Math.floor(Math.random()*0xFFFF).toString(16).padStart(4,'0')).join('') + '...');
    setProofStatus('submitted');
  };

  // Reset all
  const resetAll = () => {
    setInput(initialInput);
    setResult(null);
    setCommitment('');
    setProofStatus('idle');
    setStep('form');
  };

  // Navigation handlers
  const goHome = () => setPage('home');
  const goHow = () => setPage('how');
  const goApp = () => { setPage('app'); setStep('form'); };

  // Mastercard color palette
  const mcRed = '#EB001B';
  const mcOrange = '#F79E1B';
  const mcDark = '#1A1A2E';

  // Eligibility color
  const eligibilityColor = (e: string) => {
    if (e === 'ELIGIBLE') return mcOrange;
    return mcRed;
  };

  // Score bar color
  const scoreBarColor = (score: number) => {
    if (score >= 70) return mcOrange;
    return mcRed;
  };

  // Tier names
  const TN = ['Low', 'Medium', 'High'];

  return (
    <main style={{ minHeight: '100vh', background: mcDark, color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      {/* Navigation Bar */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 56, background: mcDark, borderBottom: '1px solid #222' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: mcRed, opacity: 0.95 }} />
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: mcOrange, opacity: 0.95, marginLeft: -10 }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 500, color: '#fff', marginLeft: 10, letterSpacing: 0.3 }}>ShieldScore</span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', background: 'transparent', border: 'none', padding: '7px 12px', cursor: 'pointer' }} onClick={goHome}>Home</button>
          <button style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', background: 'transparent', border: 'none', padding: '7px 12px', cursor: 'pointer' }} onClick={goHow}>How it works</button>
          <button style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', background: 'transparent', border: 'none', padding: '7px 12px', cursor: 'pointer' }} onClick={goApp}>App</button>
          <button style={{ fontSize: 13, fontWeight: 500, padding: '7px 16px', background: mcRed, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', marginLeft: 6 }} onClick={goApp}>Launch app</button>
        </div>
      </nav>

      <div style={{ padding: 40, textAlign: 'center' }}>
        {page === 'home' && (
          <div>
            <h1>ShieldScore</h1>
            <p>Private, AI-powered credit scoring.</p>
            <button style={{ padding: '12px 24px', background: mcRed, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }} onClick={goApp}>Get Started</button>
          </div>
        )}
        {page === 'app' && (
           <div style={{ maxWidth: 400, margin: '0 auto', background: '#222', padding: 30, borderRadius: 12 }}>
             {step === 'form' && (
               <div>
                 <h2 style={{ marginBottom: 20 }}>Estimate Eligibility</h2>
                 <input type="text" placeholder="Annual Income" style={{ width: '100%', marginBottom: 10, padding: 10 }} />
                 <button style={{ width: '100%', padding: 12, background: mcOrange, border: 'none', borderRadius: 8, color: '#fff' }} onClick={handleCalculate}>Calculate</button>
               </div>
             )}
             {step === 'scoring' && <p>Scoring in progress...</p>}
             {step === 'result' && (
               <div>
                 <h2>Your Score: {result?.score}</h2>
                 <p>Status: <span style={{ color: eligibilityColor(result?.eligibility) }}>{result?.eligibility}</span></p>
                 <button onClick={handleSubmitProof} style={{ padding: 10, background: mcRed, border: 'none', color: '#fff' }}>Submit Proof</button>
                 <button onClick={resetAll} style={{ marginLeft: 10, padding: 10, background: '#444', border: 'none', color: '#fff' }}>Reset</button>
               </div>
             )}
             {step === 'proof' && (
               <div>
                 <p>{proofStatus === 'generating' ? 'Generating ZK Proof...' : 'Proof Submitted!'}</p>
                 {commitment && <p style={{ fontSize: 12, wordBreak: 'break-all' }}>Commitment: {commitment}</p>}
                 {proofStatus === 'submitted' && <button onClick={resetAll} style={{ padding: 10, background: mcRed, border: 'none', color: '#fff' }}>Back to Start</button>}
               </div>
             )}
           </div>
        )}
        {page === 'how' && (
          <div>
            <h2>How it works</h2>
            <p>Your data is processed locally to generate a score and a zero-knowledge proof.</p>
            <button onClick={goHome} style={{ padding: 10, background: '#444', border: 'none', color: '#fff' }}>Back Home</button>
          </div>
        )}
      </div>
    </main>
  );
}
