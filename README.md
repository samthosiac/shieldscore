# 🛡️ ShieldScore

> Privacy-preserving AI credit eligibility checker built on [Midnight Network](https://midnight.network)

## What it does

ShieldScore lets users check their credit/loan eligibility using AI — without ever exposing their financial data on-chain.

1. **User fills out a financial form** (income, debt, assets) — entirely in the browser
2. **AI scores them locally** — no data sent to any server
3. **A ZK proof of the result** is submitted to Midnight Network
4. **The chain records only**: `"wallet X = ELIGIBLE"` — never the raw data
5. **Anyone can verify** the proof on-chain without seeing the user's finances

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js + TypeScript |
| Smart Contract | Compact (Midnight) |
| ZK Proofs | Midnight Proof Server |
| Wallet | Lace Wallet |
| Network | Midnight Mainnet |

## Project Structure

```
shieldscore/
├── frontend/
│   ├── app/
│   ├── components/
│   └── lib/          # AI scoring + Midnight SDK
├── contracts/
│   └── shieldscore.compact
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker Desktop
- [Lace Wallet](https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk) (Chrome)
- WSL2 (Windows users)

### Install

```bash
git clone https://github.com/samthosiac/shieldscore
cd shieldscore/frontend
npm install
npm run dev
```

### Run the Midnight Proof Server

```bash
docker run -p 6300:6300 midnightntwrk/proof-server:8.0.3 midnight-proof-server -v
```

### Compile the Contract

```bash
cd contracts
compact compile shieldscore.compact
```

## How Privacy Works

ShieldScore uses Midnight's zero-knowledge proof system. Your financial inputs are processed entirely client-side. The AI model computes a risk tier locally, and only a cryptographic proof of that result — not the inputs — is sent to the blockchain.

```
[User Data] → [Local AI Model] → [Risk Tier] → [ZK Proof] → [Midnight Chain]
     ↑                                                              ↑
 Never leaves                                              Only this is public
  the browser
```

## Built At

Midnight Hackathon 2026 — AI + DeFi Track

## License

MIT
