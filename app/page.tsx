'use client';

// Mastercard-inspired ShieldScore React page
import { useState } from 'react';
import { computeScore, FinancialInput, ScoreResult } from './lib/scoring';

const initialInput: FinancialInput = {
  annualIncome: 65000,
  monthlyDebt: 800,
  totalAssets: 120000,
  employmentYears: 3,
  creditHistory: 5,
  missedPayments: 0,
};


type Page = 'home' | 'how' | 'app';
type AppStep = 'form' | 'scoring' | 'result' | 'proof';

export default function ShieldScoreMastercard() {
  const [page, setPage] = useState<Page>('home');
  const [step, setStep] = useState<AppStep>('form');
  const [input, setInput] = useState<FinancialInput>(initialInput);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [commitment, setCommitment] = useState<string>('');
  const [proofStatus, setProofStatus] = useState<'idle' | 'generating' | 'submitted'>('idle');


  // Handle input changes
  const handleChange = (field: keyof FinancialInput, value: string) => {
    setInput(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  // Run scoring
  const handleSubmit = async () => {
    setStep('scoring');
    await new Promise(r => setTimeout(r, 1700));
    const score = computeScore(input);
    setResult(score);
    setStep('result');
  };

  // Simulate ZK proof
  const handleSubmitProof = async () => {
    setStep('proof');
    setProofStatus('generating');
    await new Promise(r => setTimeout(r, 2400));
    // Fake commitment hash
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
  const mcRedMuted = '#FDDDE0';
  const mcOrangeMuted = '#FDEFD0';

  // Eligibility color
  const eligibilityColor = (e: string) => {
    if (e === 'ELIGIBLE') return mcOrange;
    if (e === 'REVIEW') return mcRed;
    return mcRed;
  };

  // Score bar color
  const scoreBarColor = (score: number) => {
    if (score >= 70) return mcOrange;
    if (score >= 40) return mcRed;
    return mcRed;
  };

  // Tier names
  const TN = ['Low', 'Medium', 'High'];

  return (
    <main style={{ minHeight: '100vh', background: mcDark, color: '#222', fontFamily: 'Inter, sans-serif' }}>
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
          <button className="nav-link" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', background: 'transparent', border: 'none', padding: '7px 12px', borderRadius: 8, cursor: 'pointer' }} onClick={goHome}>Home</button>
          <button className="nav-link" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', background: 'transparent', border: 'none', padding: '7px 12px', borderRadius: 8, cursor: 'pointer' }} onClick={goHow}>How it works</button>
          <button className="nav-link" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', background: 'transparent', border: 'none', padding: '7px 12px', borderRadius: 8, cursor: 'pointer' }} onClick={goApp}>App</button>
          <button className="nav-cta" style={{ fontSize: 13, fontWeight: 500, padding: '7px 16px', background: mcRed, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', marginLeft: 6 }} onClick={goApp}>Launch app</button>
        </div>
      </nav>

      {/* Home Page */}
      {page === 'home' && (
        <div style={{ background: mcDark, padding: '56px 28px 64px', textAlign: 'center', borderBottom: '1px solid #222' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: mcRed }} />
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: mcOrange, marginLeft: -22, opacity: 0.9 }} />
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 500, color: '#fff', lineHeight: 1.2, marginBottom: 14, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
            Credit eligibility — private, verified, instant
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, maxWidth: 420, margin: '0 auto 32px' }}>
            AI scores your creditworthiness on your device. A zero-knowledge proof goes to Midnight Network. Lenders verify your result — never your data.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-mc-primary" style={{ padding: '12px 26px', background: mcRed, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }} onClick={goApp}>Check my eligibility</button>
            <button className="btn-mc-outline" style={{ padding: '12px 26px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 8, fontSize: 14, cursor: 'pointer' }} onClick={goHow}>How it works</button>
          </div>
        </div>
      )}

      {/* How It Works Page */}
      {page === 'how' && (
        <div style={{ background: mcDark, padding: '56px 28px 64px', textAlign: 'center', borderBottom: '1px solid #222', color: '#fff' }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>How ShieldScore works</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 32 }}>Four steps from raw data to on-chain proof — your sensitive information never leaves step one.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
            <div style={{ background: mcRedMuted, borderRadius: 12, padding: 20, minWidth: 120 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: mcRed, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, margin: '0 auto 10px' }}>1</div>
              <div style={{ fontWeight: 500, color: mcRed, marginBottom: 4 }}>Fill the form</div>
              <div style={{ fontSize: 12, color: '#A0001B' }}>Income, debt, assets — entered locally in browser</div>
            </div>
            <div style={{ background: mcDark, borderRadius: 12, padding: 20, minWidth: 120, border: '1px solid #222' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, margin: '0 auto 10px' }}>2</div>
              <div style={{ fontWeight: 500, color: '#fff', marginBottom: 4 }}>AI scores locally</div>
              <div style={{ fontSize: 12, color: '#fff' }}>Model computes risk tier on your device only</div>
            </div>
            <div style={{ background: mcOrangeMuted, borderRadius: 12, padding: 20, minWidth: 120 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: mcOrange, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, margin: '0 auto 10px' }}>3</div>
              <div style={{ fontWeight: 500, color: '#8B5A00', marginBottom: 4 }}>ZK proof generated</div>
              <div style={{ fontSize: 12, color: '#8B5A00' }}>Compact circuit proves result without revealing inputs</div>
            </div>
            <div style={{ background: '#16213E', borderRadius: 12, padding: 20, minWidth: 120 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, margin: '0 auto 10px' }}>4</div>
              <div style={{ fontWeight: 500, color: '#fff', marginBottom: 4 }}>Proof on Midnight</div>
              <div style={{ fontSize: 12, color: '#fff' }}>Only eligibility result stored — nothing else</div>
            </div>
          </div>
          <button className="btn-mc-primary" style={{ padding: '12px 26px', background: mcRed, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }} onClick={goApp}>Try it now</button>
        </div>
      )}

      {/* App Page (Financial Profile, Scoring, Result, Proof) */}
      {page === 'app' && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 24, maxWidth: 1100, margin: '0 auto' }}>
          {/* Left panel: form/result */}
          <div style={{ width: 420, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.04)', padding: 32, marginRight: 32, minHeight: 480 }}>
          {step === 'form' && (
            <>
              <div style={{ fontSize: 18, fontWeight: 600, color: mcDark, marginBottom: 8 }}>Your financial profile</div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 18 }}>Stays on your device — never transmitted</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, color: '#888', marginBottom: 5, display: 'block' }}>Annual income ($)</label><input type="number" value={input.annualIncome} onChange={e => handleChange('annualIncome', e.target.value)} style={{ width: '100%', fontSize: 14, padding: 8, borderRadius: 6, border: '1px solid #eee' }} /></div>
                <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, color: '#888', marginBottom: 5, display: 'block' }}>Monthly debt ($)</label><input type="number" value={input.monthlyDebt} onChange={e => handleChange('monthlyDebt', e.target.value)} style={{ width: '100%', fontSize: 14, padding: 8, borderRadius: 6, border: '1px solid #eee' }} /></div>
                <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, color: '#888', marginBottom: 5, display: 'block' }}>Total assets ($)</label><input type="number" value={input.totalAssets} onChange={e => handleChange('totalAssets', e.target.value)} style={{ width: '100%', fontSize: 14, padding: 8, borderRadius: 6, border: '1px solid #eee' }} /></div>
                <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, color: '#888', marginBottom: 5, display: 'block' }}>Employment (yrs)</label><input type="number" value={input.employmentYears} onChange={e => handleChange('employmentYears', e.target.value)} style={{ width: '100%', fontSize: 14, padding: 8, borderRadius: 6, border: '1px solid #eee' }} /></div>
                <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, color: '#888', marginBottom: 5, display: 'block' }}>Credit history (yrs)</label><input type="number" value={input.creditHistory} onChange={e => handleChange('creditHistory', e.target.value)} style={{ width: '100%', fontSize: 14, padding: 8, borderRadius: 6, border: '1px solid #eee' }} /></div>
                <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, color: '#888', marginBottom: 5, display: 'block' }}>Missed payments</label><input type="number" value={input.missedPayments} onChange={e => handleChange('missedPayments', e.target.value)} style={{ width: '100%', fontSize: 14, padding: 8, borderRadius: 6, border: '1px solid #eee' }} /></div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 8, background: mcRedMuted, border: '0.5px solid #FBBCC3', margin: '14px 0', fontSize: 12, color: '#A0001B', lineHeight: 1.5 }}>
                <span style={{ fontSize: 14, marginTop: 1 }}>🔒</span>
                <span>Zero-knowledge proof only — your raw numbers never leave this page.</span>
              </div>
              <button onClick={handleSubmit} style={{ width: '100%', padding: 12, fontSize: 13, fontWeight: 500, cursor: 'pointer', borderRadius: 8, border: 'none', background: mcRed, color: '#fff' }}>Analyze my eligibility</button>
            </>
          )}
          {step === 'scoring' && (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 24 }}>⚙️</div>
              <div style={{ fontSize: 13, letterSpacing: 3, color: '#555' }}>RUNNING LOCAL AI MODEL</div>
              <div style={{ marginTop: 16, color: '#333', fontSize: 12 }}>Your data is being analyzed entirely on your device...</div>
            </div>
          )}
          {step === 'result' && result && (
            <>
              <div style={{ fontSize: 18, fontWeight: 600, color: mcDark, marginBottom: 8 }}>Analysis complete</div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 18 }}>Computed locally on your device</div>
              <div style={{ background: mcOrangeMuted, borderRadius: 8, padding: 16, marginBottom: 16, border: '0.5px solid #FBDBA8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><p style={{ fontSize: 12, color: '#888', marginBottom: 3 }}>Shield score</p><p style={{ fontSize: 24, fontWeight: 500, color: mcOrange }}>{result.aiScore}<span style={{ fontSize: 14, color: '#888' }}>/100</span></p></div>
                  <div style={{ textAlign: 'right' }}><p style={{ fontSize: 12, color: '#888', marginBottom: 3 }}>Result</p><p style={{ fontSize: 15, fontWeight: 500, color: mcOrange }}>{result.eligibility}</p></div>
                </div>
              </div>
              <button onClick={handleSubmitProof} style={{ width: '100%', padding: 12, fontSize: 13, fontWeight: 500, cursor: 'pointer', borderRadius: 8, border: 'none', background: mcDark, color: mcOrange, borderColor: mcOrange, marginBottom: 8 }}>Submit ZK proof to Midnight</button>
              <button onClick={resetAll} style={{ width: '100%', padding: 12, fontSize: 13, fontWeight: 500, cursor: 'pointer', borderRadius: 8, border: '0.5px solid #eee', background: 'transparent', color: '#888', marginTop: 8 }}>Start over</button>
            </>
          )}
          {step === 'proof' && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              {proofStatus === 'generating' && (
                <>
                  <div style={{ fontSize: 40, marginBottom: 20 }}>🔐</div>
                  <div style={{ fontSize: 13, letterSpacing: 3, color: '#555' }}>GENERATING ZERO-KNOWLEDGE PROOF</div>
                  <div style={{ color: '#333', fontSize: 12, marginTop: 12 }}>Connecting to Midnight proof server...</div>
                </>
              )}
              {proofStatus === 'submitted' && (
                <>
                  <div style={{ fontSize: 40, marginBottom: 20 }}>✅</div>
                  <div style={{ fontSize: 13, letterSpacing: 3, color: mcOrange, marginBottom: 24 }}>PROOF SUBMITTED TO MIDNIGHT</div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 11, color: '#333', letterSpacing: 2, marginBottom: 12 }}>ON-CHAIN RECORD</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', marginBottom: 6, background: '#FDEFD0', borderRadius: 6, border: '1px solid #FBDBA8', fontSize: 12 }}>
                      <span style={{ color: '#8B5A00' }}>Commitment</span>
                      <span style={{ color: '#8B5A00', fontFamily: 'monospace' }}>{commitment}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', marginBottom: 6, background: '#FDEFD0', borderRadius: 6, border: '1px solid #FBDBA8', fontSize: 12 }}>
                      <span style={{ color: '#8B5A00' }}>Eligibility result</span>
                      <span style={{ color: '#8B5A00', fontWeight: 500 }}>{result?.eligibility}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', marginBottom: 6, background: '#FDEFD0', borderRadius: 6, border: '1px solid #FBDBA8', fontSize: 12 }}>
                      <span style={{ color: '#8B5A00' }}>Raw financial data</span>
                      <span style={{ color: mcRed, fontWeight: 500 }}>Never stored</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', marginBottom: 6, background: '#FDEFD0', borderRadius: 6, border: '1px solid #FBDBA8', fontSize: 12 }}>
                      <span style={{ color: '#8B5A00' }}>Network</span>
                      <span style={{ color: '#8B5A00' }}>Midnight mainnet</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', marginBottom: 6, background: '#FDEFD0', borderRadius: 6, border: '1px solid #FBDBA8', fontSize: 12 }}>
                      <span style={{ color: '#8B5A00' }}>Proof status</span>
                      <span style={{ color: '#8B5A00', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 500 }}>✔️ Verified</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 14, padding: 12, background: mcOrangeMuted, border: '0.5px solid #FBDBA8', borderRadius: 8 }}>
                    <p style={{ fontSize: 12, color: '#8B5A00', lineHeight: 1.5 }}>Any lender can verify your eligibility on Midnight — without ever seeing your income, debts, or assets.</p>
                  </div>
                  <button onClick={resetAll} style={{ width: '100%', padding: 12, fontSize: 13, fontWeight: 500, cursor: 'pointer', borderRadius: 8, border: 'none', background: mcRed, color: '#fff', marginTop: 18 }}>Check another profile</button>
                </>
              )}
            </div>
          )}
        </div>
        {/* Right panel: live preview */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 1.5, color: '#888', textTransform: 'uppercase', marginBottom: 14 }}>Live preview</div>
          {step === 'form' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 260, gap: 14, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: mcRed, opacity: 0.15 }} />
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: mcOrange, opacity: 0.15, marginLeft: -18 }} />
              </div>
              <p style={{ fontSize: 13, color: '#888', maxWidth: 180, lineHeight: 1.5 }}>Fill in your profile and hit analyze to see your ShieldScore result</p>
            </div>
          )}
          {step === 'scoring' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 260, gap: 12, textAlign: 'center' }}>
              <span style={{ fontSize: 28, color: mcRed }}>⚙️</span>
              <p style={{ fontSize: 13, color: '#888' }}>Running local AI model...</p>
              <p style={{ fontSize: 12, color: '#bbb' }}>Your data stays on this device</p>
              <div style={{ width: 200, height: 4, background: '#eee', borderRadius: 2, overflow: 'hidden', marginTop: 10 }}>
                <div style={{ height: '100%', borderRadius: 2, background: mcRed, width: '88%' }} />
              </div>
            </div>
          )}
          {step === 'result' && result && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                  <span style={{ fontSize: 12, color: '#888' }}>Shield score</span>
                  <span style={{ fontSize: 28, fontWeight: 500, color: mcOrange }}>{result.aiScore}/100</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, overflow: 'hidden', background: '#eee' }}>
                  <div style={{ height: '100%', borderRadius: 3, background: mcOrange, width: `${result.aiScore}%`, transition: 'width 0.9s ease' }} />
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 18px', borderRadius: 100, fontSize: 13, fontWeight: 500, margin: '14px 0 18px', background: mcOrangeMuted, color: '#8B5A00', border: '0.5px solid #FBDBA8' }}>{result.eligibility}</div>
              <div style={{ fontSize: 11, color: '#888', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Key factors</div>
              <div>{result.reasons.map((x, i) => <div key={i} style={{ padding: '8px 12px', background: '#fff', border: '0.5px solid #eee', borderRadius: 8, fontSize: 12, color: '#888', marginBottom: 5 }}>· {x}</div>)}</div>
              <div style={{ fontSize: 11, color: '#888', letterSpacing: 1, textTransform: 'uppercase', margin: '14px 0 8px' }}>ZK circuit inputs (bucketed — not raw)</div>
              <div style={{ background: '#fff', border: '0.5px solid #eee', borderRadius: 8, fontSize: 12, marginBottom: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}><span style={{ color: '#888' }}>Income tier</span><span style={{ color: '#888' }}>{TN[result.incomeTier]}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}><span style={{ color: '#888' }}>Debt ratio tier</span><span style={{ color: '#888' }}>{TN[result.debtRatioTier]}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}><span style={{ color: '#888' }}>Asset tier</span><span style={{ color: '#888' }}>{TN[result.assetTier]}</span></div>
              </div>
            </div>
          )}
          {step === 'proof' && proofStatus === 'submitted' && (
            <div style={{ marginTop: 24, fontSize: 12, color: '#8B5A00' }}>Anyone can verify your eligibility on Midnight — without ever seeing your income, debts, or assets.</div>
          )}
        </div>
      </div>
    </main>
  );
}
