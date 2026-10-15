# 🌊 SereSeaShip Guard

### AI-Powered Seafood Trade & Maritime Risk Intelligence

**Smarter Seafood Trade. Safer Cold Chains. Less Waste.**

[**Live Application**](https://sereseaguard.ai.studio/)

**Google Cloud AI Builder Cup 2026 | Sustainability & Social Impact**

---

## 1. Project Overview

**SereSeaShip Guard** is an AI-powered seafood trade and maritime logistics intelligence platform designed to support seafood exporters in Indonesia and importers in Singapore.

The application combines seafood trading workflows, cold-chain risk monitoring, shipment intelligence, and interactive logistics simulations in a single digital environment.

Powered by **Google Gemini 2.5 Flash**, SereSeaShip Guard helps users interpret operational information, assess potential shipment risks, and explore corrective actions that may reduce seafood spoilage and supply chain inefficiencies.

The platform introduces a gamified maritime control center to make complex logistics information easier to understand and manage.

**Live Prototype:** https://sereseaguard.ai.studio/

## 2. Problem Statement

Seafood is highly sensitive to storage conditions, transportation delays, and handling practices. Disruptions across the supply chain can affect product quality, increase operational costs, and contribute to food loss.

Small and medium-sized seafood businesses may face challenges such as:

- Limited visibility into cold-chain conditions.
- Delayed identification of refrigeration problems.
- Fragmented communication between exporters and importers.
- Difficulty interpreting technical logistics data.
- Limited access to AI-assisted risk assessment.
- Potential seafood waste caused by operational disruptions.

These challenges create opportunities for accessible, data-driven tools that support more informed seafood logistics decisions.

## 3. Proposed Solution

SereSeaShip Guard brings together three key capabilities.

**Intelligent Seafood Commerce**

A digital environment for connecting seafood sellers and buyers, managing purchase orders, and organizing shipment information.

**Gemini-Powered Risk Intelligence**

AI-assisted interpretation of seafood quality indicators, cold-chain conditions, refrigeration issues, and potential operational disruptions.

**Gamified Maritime Operations**

Interactive visualizations and logistics simulations that make operational risks easier to explore and understand.

The goal is to support earlier risk identification, more informed corrective actions, and more sustainable seafood supply chains.

## 4. Core Features

### 4.1 Seller and Buyer Experience

The platform supports two primary user roles.

| Seller / Exporter | Buyer / Importer |
|---|---|
| Manage seafood products | Explore seafood products |
| Review purchase orders | Submit purchasing requests |
| Manage shipment information | Review order progress |
| Record logistics conditions | Access relevant trade information |
| Access operational AI assistance | Access buyer-oriented AI assistance |

Firebase Authentication provides account access, while Cloud Firestore supports persistent application records.

### 4.2 Buyer Copilot

Powered by Google Gemini 2.5 Flash.

Designed to support:

- Seafood purchasing intelligence.
- Seasonal supply considerations.
- Wholesale price risk interpretation.
- Supplier RFQ recommendations.
- Freshness-related decision support.

AI-generated market insights must be distinguished from verified external market data.

### 4.3 Logistics Operations Copilot

Supports operational decision-making through:

- Reefer refrigeration error interpretation.
- Temperature anomaly assessment.
- Cold-chain risk explanations.
- Potential cargo recovery recommendations.
- Shipment disruption analysis.
- Document review assistance.

The copilot provides decision support rather than certified food safety or regulatory decisions.

### 4.4 Seafood Quality Intelligence

The application incorporates domain-specific quality assessment concepts.

**Quality Index Method (QIM)**

QIM evaluates observable sensory characteristics, such as:

- Eye appearance.
- Gill condition.
- Flesh texture.
- Other species-relevant quality indicators.

The application describes a quality score from 0 to 20. This should be treated as an application-specific implementation rather than a universal quality threshold for all seafood species.

**Arrhenius-Based Degradation Estimation**

Temperature-dependent degradation models are used to estimate how temperature variations may affect product quality over time.

**Total Volatile Basic Nitrogen (TVB-N)**

TVB-N is considered as a seafood freshness and spoilage-related indicator.

Model-derived TVB-N estimates are not equivalent to laboratory measurements.

These methods provide estimates and must be interpreted according to species, product conditions, model assumptions, and available data.

### 4.5 Maritime Radar Dashboard

A maritime operations interface featuring:

- SVG-based maritime route visualization.
- Vessel position indicators.
- GPS coordinate presentation.
- Vessel speed in knots.
- Compass heading.
- Shipment route information.

Where live positioning integrations are unavailable, route and vessel information should be treated as simulated or user-provided data.

### 4.6 Reefer Tetris

An interactive cargo arrangement simulation inspired by container loading operations.

The simulation includes:

- Grid-based cargo placement.
- Seafood box arrangement.
- Container space visualization.
- Cold-air circulation considerations.
- T-bar floor airflow concepts.

Reefer Tetris is intended as an educational and operational planning aid, not a certified container-loading or refrigeration engineering tool.

### 4.7 Intelligent Fallback Engine

The application architecture includes a domain-oriented heuristic fallback mechanism intended to maintain basic decision support when Gemini is unavailable.

Fallback outputs must be clearly distinguished from Gemini-generated responses.

A heuristic fallback does not provide the same capabilities as a live generative AI model.

## 5. Technology Stack

| Component | Technology |
|---|---|
| Runtime & Development | Node.js 22+ |
| Programming Language | TypeScript |
| Frontend | React 19 |
| Build Tool | Vite |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Animation | Motion |
| Authentication | Firebase Authentication |
| Database | Google Cloud Firestore |
| AI SDK | Google GenAI SDK (`@google/genai`) |
| AI Model | Gemini 2.5 Flash |
| Deployment | Google AI Studio deployment |
| Version Control | GitHub |

**Typography**

- Plus Jakarta Sans for interface text and headings.
- JetBrains Mono for telemetry values, coordinates, and numerical indicators.

## 6. System Architecture

```text
             SereSeaShip Guard
                     |
          React 19 + TypeScript
                     |
       +-------------+-------------+
       |                           |
 Seller / Exporter          Buyer / Importer
       |                           |
       +-------------+-------------+
                     |
           Firebase Authentication
                     |
              Cloud Firestore
                     |
       Products / Orders / Shipments
                     |
          AI Integration Layer
                     |
           Google Gemini 2.5 Flash
                     |
        AI-Assisted Risk Intelligence
                     |
         Maritime Operations Dashboard
```

The intended architecture separates user interaction, data persistence, and AI reasoning.

Sensitive Gemini credentials should be accessed only through a secure server-side integration.

## 7. AI Implementation

### Model

**Google Gemini 2.5 Flash**

The application uses the Google GenAI SDK to support seafood trade and logistics reasoning.

### AI Workflow

1. A user enters seafood, shipment, or operational information.
2. The application validates the provided inputs.
3. Domain-specific calculations are performed where applicable.
4. Relevant context is prepared for Gemini.
5. Gemini generates an explanation or recommendation.
6. Results are presented through the relevant copilot interface.

### AI and Deterministic Algorithms

SereSeaShip Guard combines two complementary approaches.

**Deterministic Computation**

Used for mathematical calculations and rule-based indicators, including temperature differences, quality scores, and logistics metrics.

**Generative AI Reasoning**

Used for interpreting operational conditions, explaining potential risks, and suggesting practical next steps.

This separation is intended to improve transparency and reduce unsupported AI-generated numerical claims.

### Responsible AI

AI outputs are advisory.

The system should not be used as the sole basis for:

- Seafood safety certification.
- Regulatory compliance approval.
- Laboratory quality assessment.
- Commercial pricing guarantees.
- High-stakes logistics decisions.

Users should verify important recommendations against reliable operational evidence and applicable requirements.

## 8. Firebase Integration

### Authentication

The application uses Firebase Authentication, with support described for:

- Google Sign-In.
- Passwordless access flows.

Authentication methods depend on the enabled Firebase provider configuration.

### Cloud Firestore

Firestore is used to support persistent application information, including:

- User profiles.
- Purchase orders.
- Container records.
- Relevant logistics data.

### Security Rules

The repository includes `firestore.rules` for database access control.

Security enforcement depends on the rules actually deployed to the Firebase project.

Role-based restrictions and access permissions should be verified through testing before production use.

## 9. Getting Started

### Prerequisites

- Node.js 22 or newer.
- A Google AI Studio account.
- A Gemini API key.
- A configured Firebase project.
- Access to the required Firebase services.

### Installation

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_FOLDER>
```

Install dependencies:

```bash
npm install
```

Alternatively, if using Bun:

```bash
bun install
```

Create an environment configuration file based on `.env.example`.

On macOS/Linux:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure the environment variables required by the current project.

Start the development server:

```bash
npm run dev
```

Or, with Bun:

```bash
bun run dev
```

The available scripts should be checked in `package.json`.

### Environment Variables

Use the repository's `.env.example` as the authoritative configuration template.

A typical configuration may include:

```env
# Server-side Gemini API key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# Firebase web configuration
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

**Security requirements:**

- Never commit actual secrets to GitHub.
- Never expose Gemini API keys through frontend environment variables.
- Do not use `VITE_` for Gemini secrets.
- Configure production secrets using supported server-side secret management.
- Apply appropriate Firestore Security Rules.

## 10. Live Demo

**Application:** https://sereseaguard.ai.studio/

Suggested demonstration workflow:

1. Open SereSeaShip Guard.
2. Sign in using an available authentication method.
3. Explore the Seller or Buyer workspace.
4. Enter seafood trading or shipment information.
5. Open the relevant AI Copilot.
6. Submit operational information for analysis.
7. Review the resulting risk explanation and recommendations.
8. Explore the maritime radar interface.
9. Test the Reefer Tetris simulation.
10. Review the available logistics and quality indicators.

The final demonstration should show which features use real Gemini responses, which use deterministic calculations, and which represent simulations.

## 11. Sustainability and Social Impact

SereSeaShip Guard aligns with the **Sustainability & Social Impact** challenge through its focus on reducing potential seafood supply chain losses.

### Resource Efficiency

Earlier identification of cold-chain problems may help businesses respond before disruptions lead to unnecessary waste.

### Supply Chain Resilience

AI-assisted risk interpretation can support more informed responses to refrigeration failures, delays, and logistics disruptions.

### Community Support

The platform is designed to make operational intelligence more accessible to seafood exporters, importers, and smaller businesses.

### Informed Decision-Making

Complex operational data can be translated into more understandable explanations and recommendations.

### Potential Impact Indicators

- Number of shipments assessed.
- Temperature anomaly events.
- Quantity of cargo potentially exposed to risk.
- Operational alerts generated.
- Corrective actions recorded.
- Shipment delays identified.

These indicators represent potential evaluation measures. Actual seafood waste reduction has not been independently demonstrated.

## 12. Innovation and Differentiation

SereSeaShip Guard brings together:

1. **Generative AI:** Gemini-powered seafood trade and logistics reasoning.
2. **Domain Intelligence:** QIM, temperature degradation concepts, and freshness-related assessment.
3. **Gamified Operations:** Interactive maritime radar and Reefer Tetris.
4. **Cross-Border Collaboration:** An Indonesia–Singapore seafood trading context.
5. **Sustainability:** Risk awareness focused on reducing potential food loss.

The combination aims to make complex seafood logistics information more accessible, interactive, and actionable.

## 13. Limitations

SereSeaShip Guard is a working prototype under development and evaluation.

Current limitations may include:

- Reliance on manually entered operational information.
- Limited or simulated vessel tracking data.
- No guaranteed live IoT temperature integration.
- Model-based quality estimates rather than laboratory testing.
- AI recommendations that require human verification.
- No independently validated reduction in seafood waste.
- Dependence on available Gemini and Firebase service quotas.

The application should not be represented as a certified food safety or maritime compliance system.

## 14. Future Roadmap

Potential next steps include:

- Live IoT cold-chain monitoring.
- Real-time maritime tracking integration.
- Seafood species-specific quality models.
- External weather and port disruption data.
- Advanced supplier matching.
- Verified regulatory document workflows.
- Blockchain-based seafood traceability.
- Predictive food loss estimation.
- Multilingual support.
- Pilot studies with Indonesian exporters and Singaporean importers.

## 15. Hackathon Submission

| Item | Details |
|---|---|
| Event | Google Cloud AI Builder Cup 2026 |
| Theme | Sustainability & Social Impact |
| Project | SereSeaShip Guard |
| AI Model | Gemini 2.5 Flash |
| Google Cloud Services | Firebase Authentication, Cloud Firestore |
| Live Application | https://sereseaguard.ai.studio/ |
| Source Code | This repository |
| Demo Video | To be added |
| Pitch Deck | To be added |

## 16. Project Status

**Deployed Prototype**

The project is available through its public application URL.

Individual features, integrations, and end-to-end workflows should be validated against the deployed build before being considered production-ready.

---

### SereSeaShip Guard

**Smarter Seafood Trade. Safer Cold Chains. Less Waste.**

*Built for Google Cloud AI Builder Cup 2026.*

