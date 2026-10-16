import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileText,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle2,
  Building,
  Key,
  Database,
  RefreshCw,
  Search,
} from 'lucide-react';

import { AuditTrailEvent } from '../types/fhir';

interface ComplianceAuditCenterProps {
  auditLogs: AuditTrailEvent[];
  onExportAuditLedger: () => void;
  onSimulateErasure: () => void;
}

export const ComplianceAuditCenter: React.FC<ComplianceAuditCenterProps> = ({
  auditLogs,
  onExportAuditLedger,
  onSimulateErasure,
}) => {
  const [searchLog, setSearchLog] = useState<string>('');
  const [erasureConfirmed, setErasureConfirmed] = useState<boolean>(false);
  const [isShredding, setIsShredding] = useState<boolean>(false);

  const filteredLogs = auditLogs.filter((log) => {
    if (!searchLog.trim()) return true;
    const q = searchLog.toLowerCase();
    return (
      log.actor.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.purpose.toLowerCase().includes(q) ||
      log.resourceType.toLowerCase().includes(q)
    );
  });

  const handleRunShredder = () => {
    setIsShredding(true);
    setTimeout(() => {
      setIsShredding(false);
      setErasureConfirmed(true);
      onSimulateErasure();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">DPDP Act 2023 Compliance & Cryptographic Audit Ledger</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every record access, AI extraction, doctor view, and emergency break-glass is recorded in an immutable, tamper-evident audit trail.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300">
              Sovereign Cloud: GCP asia-south1 (Mumbai)
            </span>
          </div>
        </div>
      </div>

      {/* DPDP Safeguards Grid (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-semibold">
            <Database className="w-4 h-4" />
            <span>Data Residency (Section 8)</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            All clinical payloads, imaging scans, and extracted FHIR resources are stored in encrypted Indian cloud buckets with AES-256-GCM envelope encryption.
          </p>
          <span className="text-[10px] font-mono text-slate-500 block">KMS Key Rotation: Daily</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-semibold">
            <Key className="w-4 h-4" />
            <span>Purpose-Limited Consent (Section 6)</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            No universal bucket sharing. Ephemeral links explicitly enforce single-doctor purpose limits and auto-expire within minutes to prevent accidental leaks.
          </p>
          <span className="text-[10px] font-mono text-slate-500 block">Zero Training on Customer PHI</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-semibold">
            <Trash2 className="w-4 h-4" />
            <span>Right to Erasure (Section 12)</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Cryptographic key destruction shreds identifiable health records on demand, while maintaining cryptographic audit logs required for medical-legal defense.
          </p>
          <span className="text-[10px] font-mono text-slate-500 block">NMC 3-Year Audit Retention Compliant</span>
        </div>
      </div>

      {/* Main Immutable Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Append-Only Clinical Audit Ledger</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cryptographically verified event logs ({auditLogs.length} entries on ledger)
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 w-full sm:w-48"
              />
            </div>

            <button
              type="button"
              onClick={onExportAuditLedger}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Download Ledger CSV</span>
            </button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Timestamp (UTC)</th>
                <th className="py-2.5 px-3">Actor / Entity</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Clinical Purpose</th>
                <th className="py-2.5 px-3">Resource Target</th>
                <th className="py-2.5 px-3">IP & SHA-256 Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-400 tabular-nums">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-semibold text-white font-sans">
                    {log.actor}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 font-mono text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">
                    {log.purpose}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate">
                    {log.resourceType}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate" title={log.verificationHash}>
                    {log.ipAddress} · <span className="text-[10px] text-slate-600">{log.verificationHash.slice(0, 16)}...</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cryptographic Right-to-Erasure Demonstration Box */}
      <div className="bg-rose-950/30 border border-rose-900/60 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
          <Trash2 className="w-4 h-4" />
          <span>Exercise Data Principal Right to Erasure (DPDP Act Sec 12)</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Demonstrate cryptographic key shredding: securely destroys personal health decryption keys, rendering historical prescriptions and lab scans mathematically unrecoverable while preserving anonymous medical defense logs.
        </p>

        {erasureConfirmed ? (
          <div className="bg-emerald-950/60 border border-emerald-800 p-3 rounded-lg text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Cryptographic keys shredded successfully. Patient clinical documents purged from local cache.
            </span>
          </div>
        ) : (
          <button
            type="button"
            disabled={isShredding}
            onClick={handleRunShredder}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5"
          >
            {isShredding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            <span>{isShredding ? 'Executing Key Shredding...' : 'Simulate Cryptographic Data Erasure'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
