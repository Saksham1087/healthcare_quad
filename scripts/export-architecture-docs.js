#!/usr/bin/env node

/**
 * MediScript Architecture Documentation Exporter
 * 
 * Automatically parses `docs/architecture/stack_communication_architecture.md`,
 * compiles all Mermaid diagrams into crisp vector SVG files,
 * builds a self-contained, publication-ready Semantic HTML report,
 * and exports a vector PDF distribution file.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs', 'architecture');
const puppeteerConfig = path.join(__dirname, 'puppeteer-config.json');

console.log('🌿 [MediScript Architecture Exporter] Initializing export pipeline...');

// Ensure output directories exist
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const mdPath = path.join(docsDir, 'stack_communication_architecture.md');
if (!fs.existsSync(mdPath)) {
  console.error(`❌ Source markdown not found at: ${mdPath}`);
  process.exit(1);
}

const mdContent = fs.readFileSync(mdPath, 'utf8');

// Extract all mermaid blocks accurately between ```mermaid and ```
const mermaidBlocks = [];
const mermaidRegex = /```mermaid\s*\n([\s\S]*?)\n```/g;
let m;
while ((m = mermaidRegex.exec(mdContent)) !== null) {
  mermaidBlocks.push(m[1].trim());
}

// Diagram metadata mapping
const diagramDefinitions = [
  {
    name: 'high_level_stack_architecture',
    title: '1. High-Level Stack Architecture',
  },
  {
    name: 'multimodal_prescription_ocr_flow',
    title: '2.1 Multimodal Prescription OCR Pipeline',
  },
  {
    name: 'voice_assistant_push_to_talk_flow',
    title: '2.2 Push-to-Talk Multilingual Voice Assistant Flow',
  },
  {
    name: 'doctor_ephemeral_consent_flow',
    title: '2.3 Ephemeral Doctor View & Consent-Gated Access',
  },
  {
    name: 'emergency_break_glass_flow',
    title: '2.4 Break-Glass Emergency Offline Pass Flow',
  },
  {
    name: 'security_identity_boundaries',
    title: '4. Security, Identity & Regulatory Boundaries',
  },
];

const generatedSvgs = {};

console.log(`📐 Compiling ${mermaidBlocks.length} vector SVG diagrams via Mermaid CLI...`);

for (let i = 0; i < diagramDefinitions.length; i++) {
  const def = diagramDefinitions[i];
  const mermaidSource = mermaidBlocks[i];
  if (!mermaidSource) {
    console.warn(`⚠️ Warning: No mermaid block found at index ${i} for "${def.name}".`);
    continue;
  }

  const tempMmd = path.join(docsDir, `${def.name}.temp.mmd`);
  const outputSvg = path.join(docsDir, `${def.name}.svg`);

  fs.writeFileSync(tempMmd, mermaidSource, 'utf8');

  try {
    console.log(`  -> Rendering ${def.name}.svg...`);
    execSync(
      `npx @mermaid-js/mermaid-cli -i "${tempMmd}" -o "${outputSvg}" -p "${puppeteerConfig}" -b transparent`,
      { cwd: rootDir, stdio: 'pipe' }
    );
    console.log(`  ✓ Generated: ${outputSvg}`);
    generatedSvgs[def.name] = fs.readFileSync(outputSvg, 'utf8');
  } catch (err) {
    console.error(`❌ Failed to render ${def.name}.svg:`, err.message);
  } finally {
    if (fs.existsSync(tempMmd)) fs.unlinkSync(tempMmd);
  }
}

// Generate the self-contained HTML publication
console.log('📄 Building standalone self-contained HTML document (index.html)...');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MediScript: Stack Communication Architecture</title>
  <style>
    :root {
      --bg-primary: #FAF6EA;
      --bg-surface: #FFFFFF;
      --text-main: #14372C;
      --text-muted: #2E5C4E;
      --border-color: #D9CEB6;
      --accent-forest: #17483A;
      --accent-gold: #C9A24B;
      --accent-teal: #3FA796;
      --code-bg: #F4EEDC;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg-primary: #0A1C16;
        --bg-surface: #0E2A21;
        --text-main: #F3EBD3;
        --text-muted: #A3C5B8;
        --border-color: #2D5A4C;
        --accent-forest: #3FA796;
        --accent-gold: #E5BE65;
        --accent-teal: #7BC96F;
        --code-bg: #071711;
      }
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg-primary);
      color: var(--text-main);
      line-height: 1.6;
      padding: 2.5rem 1.5rem;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
    }

    header.doc-header {
      border-bottom: 2px solid var(--accent-gold);
      padding-bottom: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.65rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      border-radius: 9999px;
      background: rgba(63, 167, 150, 0.15);
      color: var(--accent-teal);
      border: 1px solid var(--accent-teal);
      text-transform: uppercase;
      margin-bottom: 0.75rem;
    }

    h1 {
      font-size: 2.4rem;
      font-weight: 800;
      color: var(--accent-forest);
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-size: 1.1rem;
      color: var(--text-muted);
    }

    section {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      padding: 1.75rem;
      margin-bottom: 2.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
      break-inside: avoid;
    }

    h2 {
      font-size: 1.45rem;
      color: var(--accent-forest);
      border-left: 4px solid var(--accent-gold);
      padding-left: 0.75rem;
      margin-bottom: 1.25rem;
    }

    h3 {
      font-size: 1.15rem;
      margin: 1.25rem 0 0.75rem 0;
      color: var(--text-main);
    }

    p { margin-bottom: 1rem; }

    .diagram-wrapper {
      background: #FFFFFF;
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      padding: 1.25rem;
      margin: 1.25rem 0;
      overflow-x: auto;
      text-align: center;
    }

    .diagram-wrapper svg {
      max-width: 100%;
      height: auto;
      display: inline-block;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.25rem 0;
      font-size: 0.9rem;
    }

    th, td {
      border: 1px solid var(--border-color);
      padding: 0.65rem 0.85rem;
      text-align: left;
    }

    th {
      background-color: var(--code-bg);
      color: var(--accent-forest);
      font-weight: 700;
    }

    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.85em;
      background: var(--code-bg);
      padding: 0.2em 0.4em;
      border-radius: 0.3em;
    }

    pre {
      background: var(--code-bg);
      border: 1px solid var(--border-color);
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      font-size: 0.85rem;
      margin: 1rem 0;
    }

    footer {
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }

    @media print {
      body {
        background: #FFFFFF;
        color: #000000;
        padding: 0;
        font-size: 11pt;
      }
      .container { max-width: 100%; }
      section {
        box-shadow: none;
        border: 1px solid #CCC;
        page-break-inside: avoid;
        margin-bottom: 1.5rem;
        padding: 1rem;
      }
      .diagram-wrapper {
        border: none;
        padding: 0;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="doc-header">
      <span class="badge">Architecture Specification · Edition 2026</span>
      <h1>MediScript: Stack Communication Architecture</h1>
      <p class="subtitle">Complete technical blueprint of application topography, multimodal AI pipelines, real-time protocols, and regulatory security boundaries.</p>
    </header>

    <main>
      <section>
        <h2>1. High-Level Stack Architecture</h2>
        <p>End-to-end integration topology between the client workspace, the Node.js Express Gateway, the Google Gemini Multimodal Vision & Speech tier, and national health standards (ABDM / NRCES / DPDP 2023).</p>
        <div class="diagram-wrapper">
          ${generatedSvgs['high_level_stack_architecture'] || '<p>Diagram rendering in progress...</p>'}
        </div>
      </section>

      <section>
        <h2>2. Communication Sequences & Protocols</h2>
        
        <h3>2.1 Multimodal Prescription OCR Pipeline</h3>
        <p>Direct upload, 2D normalized coordinate box extraction <code>[ymin, xmin, ymax, xmax]</code>, token confidence scoring, and pharmacological safety review.</p>
        <div class="diagram-wrapper">
          ${generatedSvgs['multimodal_prescription_ocr_flow'] || ''}
        </div>

        <h3>2.2 Push-to-Talk Multilingual Voice Assistant</h3>
        <p>Real-time binary audio stream over WebSockets with Gemini speech-to-text transcription and natural TTS voice playback in English, Hindi, and Marathi.</p>
        <div class="diagram-wrapper">
          ${generatedSvgs['voice_assistant_push_to_talk_flow'] || ''}
        </div>

        <h3>2.3 Ephemeral Doctor View & Consent-Gated Access</h3>
        <p>ABDM & DPDP-compliant time-to-live (TTL) links, verbal 4-digit PIN verification, scoped clinical data filtering, and zero-knowledge doctor curation.</p>
        <div class="diagram-wrapper">
          ${generatedSvgs['doctor_ephemeral_consent_flow'] || ''}
        </div>

        <h3>2.4 Break-Glass Emergency Offline Pass</h3>
        <p>Offline zero-connectivity emergency card with mandatory National Medical Commission (NMC) registration attestation, cryptographic auditing, and instant caregiver SMS alerting.</p>
        <div class="diagram-wrapper">
          ${generatedSvgs['emergency_break_glass_flow'] || ''}
        </div>
      </section>

      <section>
        <h2>3. Communication Protocols & Payload Matrix</h2>
        <table>
          <thead>
            <tr>
              <th>Channel</th>
              <th>Endpoint</th>
              <th>Protocol</th>
              <th>Payload Format</th>
              <th>Typical Size</th>
              <th>Latency Budget</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>OCR Ingestion</strong></td>
              <td><code>/api/scan-prescription</code></td>
              <td>HTTPS POST</td>
              <td>JSON (Base64)</td>
              <td>2 MB – 30 MB</td>
              <td>800ms – 2500ms</td>
              <td>High-res Rx image transcription & 2D coordinate box parsing</td>
            </tr>
            <tr>
              <td><strong>Voice Chat</strong></td>
              <td><code>/api/voice-chat</code></td>
              <td>HTTPS POST</td>
              <td>JSON</td>
              <td>&lt; 10 KB</td>
              <td>500ms – 1200ms</td>
              <td>Conversational clinical assistant query & TTS audio generation</td>
            </tr>
            <tr>
              <td><strong>Voice Streaming</strong></td>
              <td><code>/ws/live-audio</code></td>
              <td>WSS Binary</td>
              <td>Binary Buffer</td>
              <td>~4 KB / frame</td>
              <td>&lt; 150ms</td>
              <td>Real-time push-to-talk speech-to-text transcription</td>
            </tr>
            <tr>
              <td><strong>FHIR Export</strong></td>
              <td><code>/api/export-fhir</code></td>
              <td>HTTPS POST</td>
              <td>JSON</td>
              <td>20 KB – 200 KB</td>
              <td>&lt; 100ms</td>
              <td>ABDM / NRCES compliant HL7 FHIR R4 Bundle packaging</td>
            </tr>
            <tr>
              <td><strong>Break-Glass Pass</strong></td>
              <td><code>/api/break-glass</code></td>
              <td>HTTPS POST</td>
              <td>JSON</td>
              <td>&lt; 5 KB</td>
              <td>&lt; 200ms</td>
              <td>Clinician registration attestation & SMS notification trigger</td>
            </tr>
            <tr>
              <td><strong>Health Telemetry</strong></td>
              <td><code>/api/health</code></td>
              <td>HTTPS GET</td>
              <td>JSON</td>
              <td>&lt; 1 KB</td>
              <td>&lt; 20ms</td>
              <td>Server readiness, active Gemini model & telemetry probe</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>4. Security, Identity & Regulatory Boundaries</h2>
        <div class="diagram-wrapper">
          ${generatedSvgs['security_identity_boundaries'] || ''}
        </div>
        <ul>
          <li><strong>Zero-Trust Server Boundary:</strong> <code>GEMINI_API_KEY</code> is loaded strictly server-side in <code>server.ts</code> and is never delivered to client code.</li>
          <li><strong>Offline Disaster Survivability:</strong> Critical emergency vitals, blood type, and allergy alerts reside in encrypted browser cache for instant emergency retrieval during zero network conditions.</li>
          <li><strong>DPDP Act 2023 Sovereignty:</strong> Purpose-limited ephemeral consent, automatic TTL expiration, and cryptographic event auditing.</li>
        </ul>
      </section>
    </main>

    <footer>
      <p>MediScript Healthcare Continuity Platform · Architectural Documentation & Distribution Build</p>
    </footer>
  </div>
</body>
</html>
`;

const htmlPath = path.join(docsDir, 'index.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log(`✓ Standalone HTML report generated: ${htmlPath}`);

// Generate vector PDF distribution file
const pdfPath = path.join(docsDir, 'stack_communication_architecture.pdf');
console.log('📕 Exporting vector PDF via Headless Chromium/Brave...');

try {
  const browserBin = fs.existsSync('/usr/bin/brave-browser') ? '/usr/bin/brave-browser' : 'brave-browser';
  execSync(
    `"${browserBin}" --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --print-to-pdf="${pdfPath}" "${htmlPath}"`,
    { stdio: 'pipe' }
  );
  const pdfStats = fs.statSync(pdfPath);
  console.log(`✓ PDF successfully generated: ${pdfPath} (${(pdfStats.size / 1024).toFixed(1)} KB)`);
} catch (pdfErr) {
  console.error('❌ PDF generation failed:', pdfErr.message);
}

// Write catalog README.md in docs/architecture
const catalogReadme = `# MediScript Architecture Documentation & Vector Exports

This directory contains the authoritative architecture diagrams and distribution exports for the **MediScript Healthcare Continuity Platform**.

## Export Artifacts
- **Vector PDF Document:** [stack_communication_architecture.pdf](./stack_communication_architecture.pdf)
- **Standalone HTML Report:** [index.html](./index.html)
- **Specification Source:** [stack_communication_architecture.md](./stack_communication_architecture.md)

## Standalone Vector SVG Diagrams
1. **[high_level_stack_architecture.svg](./high_level_stack_architecture.svg)** - High-level system architecture and integration topology.
2. **[multimodal_prescription_ocr_flow.svg](./multimodal_prescription_ocr_flow.svg)** - Multimodal OCR ingestion sequence and 2D coordinate box parsing.
3. **[voice_assistant_push_to_talk_flow.svg](./voice_assistant_push_to_talk_flow.svg)** - Real-time WebSocket audio streaming and multilingual voice Q&A.
4. **[doctor_ephemeral_consent_flow.svg](./doctor_ephemeral_consent_flow.svg)** - Time-to-live consent grant and verbal PIN doctor view.
5. **[emergency_break_glass_flow.svg](./emergency_break_glass_flow.svg)** - Break-glass offline emergency pass and audit dispatch.
6. **[security_identity_boundaries.svg](./security_identity_boundaries.svg)** - Security, identity, and DPDP 2023 regulatory boundaries.

## Re-generating Exports
To re-compile all SVG diagrams, HTML, and PDF distribution files:
\`\`\`bash
npm run export:docs
\`\`\`
`;

fs.writeFileSync(path.join(docsDir, 'README.md'), catalogReadme, 'utf8');
console.log('✨ Architecture documentation export pipeline completed successfully!');
