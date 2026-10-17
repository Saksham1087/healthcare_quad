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
      <div className="bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 flex items-center justify-center text-[#2D6A4F] dark:text-[#52B788] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1B2A22] dark:text-[#F3EBD3] tracking-tight">DPDP Act 2023 Compliance &amp; Cryptographic Audit Ledger</h2>
              <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] mt-0.5">
                Every record access, AI extraction, doctor view, and emergency break-glass is recorded in an immutable, tamper-evident audit trail.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl bg-[#2D6A4F]/15 border border-[#2D6A4F]/30 text-[#17483A] dark:text-[#C5E99B]">
              Sovereign Cloud: GCP asia-south1 (Mumbai)
            </span>
          </div>
        </div>
      </div>

      {/* DPDP Safeguards Grid (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white dark:bg-[#0E2A21] border border-[#C9A24B]/35 dark:border-slate-800 rounded-2xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-[#2D6A4F] dark:text-[#52B788] font-bold">
            <Database className="w-4 h-4" />
            <span>Data Residency (Section 8)</span>
          </div>
          <p className="text-[#3D5A4C] dark:text-[#A3C5B8] leading-relaxed">
            All clinical payloads, imaging scans, and extracted FHIR resources are stored in encrypted Indian cloud buckets with AES-256-GCM envelope encryption.
          </p>
          <span className="text-[10px] font-mono text-[#17483A] dark:text-slate-400 font-semibold block">KMS Key Rotation: Daily</span>
        </div>

        <div className="bg-white dark:bg-[#0E2A21] border border-[#C9A24B]/35 dark:border-slate-800 rounded-2xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-[#2D6A4F] dark:text-[#52B788] font-bold">
            <Key className="w-4 h-4" />
            <span>Purpose-Limited Consent (Section 6)</span>
          </div>
          <p className="text-[#3D5A4C] dark:text-[#A3C5B8] leading-relaxed">
            No universal bucket sharing. Ephemeral links explicitly enforce single-doctor purpose limits and auto-expire within minutes to prevent accidental leaks.
          </p>
          <span className="text-[10px] font-mono text-[#17483A] dark:text-slate-400 font-semibold block">Zero Training on Customer PHI</span>
        </div>

        <div className="bg-white dark:bg-[#0E2A21] border border-[#C9A24B]/35 dark:border-slate-800 rounded-2xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-[#2D6A4F] dark:text-[#52B788] font-bold">
            <Trash2 className="w-4 h-4" />
            <span>Right to Erasure (Section 12)</span>
          </div>
          <p className="text-[#3D5A4C] dark:text-[#A3C5B8] leading-relaxed">
            Cryptographic key destruction shreds identifiable health records on demand, while maintaining cryptographic audit logs required for medical-legal defense.
          </p>
          <span className="text-[10px] font-mono text-[#17483A] dark:text-slate-400 font-semibold block">NMC 3-Year Audit Retention Compliant</span>
        </div>
      </div>

      {/* Main Immutable Audit Log Table */}
      <div className="bg-[#FAF6EA] dark:bg-[#14372C] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#1B2A22] dark:text-[#F3EBD3] tracking-tight">Append-Only Clinical Audit Ledger</h3>
            <p className="text-xs text-[#3D5A4C] dark:text-[#A3C5B8] mt-0.5">
              Cryptographically verified event logs ({auditLogs.length} entries on ledger)
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-3.5 h-3.5 text-[#3D5A4C] dark:text-[#A3C5B8] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
                className="bg-white dark:bg-[#0E2A21] border border-[#C9A24B]/40 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#1B2A22] dark:text-[#F3EBD3] placeholder:text-[#3D5A4C]/60 focus:outline-none focus:border-[#2D6A4F] w-full sm:w-48"
              />
            </div>

            <button
              type="button"
              onClick={onExportAuditLedger}
              className="px-3 py-1.5 bg-white dark:bg-[#0E2A21] hover:bg-[#EFE6CD] text-[#17483A] dark:text-[#F3EBD3] border border-[#C9A24B]/40 dark:border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#2D6A4F] dark:text-[#52B788]" />
              <span>Download Ledger CSV</span>
            </button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto border border-[#C9A24B]/35 dark:border-slate-800 rounded-xl bg-white dark:bg-[#0E2A21] shadow-inner">
          <table className="w-full text-left text-xs text-[#1B2A22] dark:text-[#F3EBD3]">
            <thead className="bg-[#EFE6CD] dark:bg-[#0B1F18] text-[#1B2A22] dark:text-[#F3EBD3] font-bold border-b border-[#C9A24B]/30 dark:border-slate-800 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Timestamp (UTC)</th>
                <th className="py-2.5 px-3">Actor / Entity</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Clinical Purpose</th>
                <th className="py-2.5 px-3">Resource Target</th>
                <th className="py-2.5 px-3">IP &amp; SHA-256 Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C9A24B]/20 dark:divide-slate-800 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF6EA] dark:hover:bg-[#194336] transition-colors">
                  <td className="py-2.5 px-3 whitespace-nowrap text-[#3D5A4C] dark:text-[#A3C5B8] tabular-nums font-semibold">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-bold text-[#1B2A22] dark:text-white font-sans">
                    {log.actor}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-lg bg-[#2D6A4F]/15 text-[#17483A] dark:text-[#C5E99B] font-mono text-[10px] font-bold border border-[#2D6A4F]/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-[#3D5A4C] dark:text-slate-300 font-medium">
                    {log.purpose}
                  </td>
                  <td className="py-2.5 px-3 text-[#3D5A4C] dark:text-[#A3C5B8] max-w-xs truncate font-medium">
                    {log.resourceType}
                  </td>
                  <td className="py-2.5 px-3 text-[#3D5A4C] dark:text-slate-400 max-w-xs truncate" title={log.verificationHash}>
                    {log.ipAddress} · <span className="text-[10px] text-[#C9A24B] font-bold">{log.verificationHash.slice(0, 16)}...</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cryptographic Right-to-Erasure Demonstration Box */}
      <div className="bg-rose-50/80 dark:bg-rose-950/30 border-2 border-rose-200 dark:border-rose-900/60 rounded-2xl p-5 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-[#991B1B] dark:text-rose-400 uppercase tracking-wider font-mono">
          <Trash2 className="w-4 h-4" />
          <span>Exercise Data Principal Right to Erasure (DPDP Act Sec 12)</span>
        </div>

        <p className="text-xs text-[#1B2A22] dark:text-slate-300 leading-relaxed font-medium">
          Demonstrate cryptographic key shredding: securely destroys personal health decryption keys, rendering historical prescriptions and lab scans mathematically unrecoverable while preserving anonymous medical defense logs.
        </p>

        {erasureConfirmed ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 p-3.5 rounded-xl text-xs text-[#17483A] dark:text-emerald-200 font-bold flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] dark:text-emerald-400 shrink-0" />
            <span>
              Cryptographic keys shredded successfully. Patient clinical documents purged from local cache.
            </span>
          </div>
        ) : (
          <button
            type="button"
            disabled={isShredding}
            onClick={handleRunShredder}
            className="px-4 py-2.5 bg-[#991B1B] hover:bg-[#7F1D1D] disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md"
          >
            {isShredding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            <span>{isShredding ? 'Executing Key Shredding...' : 'Simulate Cryptographic Data Erasure'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
