import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Download,
  Printer,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Anchor,
  Sparkles,
  ExternalLink,
  X,
  FileCheck2,
  Scale
} from 'lucide-react';
import { CatchBatch, SellerOrder } from '../../types';

interface SellerExportComplianceProps {
  batches: CatchBatch[];
  orders: SellerOrder[];
}

interface ExportPermitDoc {
  id: string;
  docCode: string;
  title: string;
  issuingAuthority: string;
  country: 'Indonesia' | 'Singapore' | 'Bilateral';
  targetSpecies: string;
  status: 'approved' | 'in_review' | 'expiring_soon';
  expiryDate: string;
  referenceBatch: string;
  referenceOrder?: string;
  digitalSealHash: string;
}

const INITIAL_PERMITS: ExportPermitDoc[] = [
  {
    id: 'DOC-BKIPM-01',
    docCode: 'BKIPM/BTM/EXP/2026/0441',
    title: 'Health Certificate for Fish & Fishery Products (e-HC)',
    issuingAuthority: 'Balai Karantina Ikan (BKIPM Batam - KKP Indonesia)',
    country: 'Indonesia',
    targetSpecies: 'Yellowfin Tuna (Thunnus albacares)',
    status: 'approved',
    expiryDate: '2026-10-22',
    referenceBatch: 'BATCH-ID-2026-TUNA01',
    referenceOrder: 'ORD-SG-2026-081',
    digitalSealHash: '0x9E7F4B2A8C1033D5-SERENADE-SEAL'
  },
  {
    id: 'DOC-SFA-99',
    docCode: 'SFA-SG-IMP-2026-8831',
    title: 'Singapore SFA Electronic Import Pre-Clearance Permit',
    issuingAuthority: 'Singapore Food Agency (SFA) & Singapore Customs TradeNet',
    country: 'Singapore',
    targetSpecies: 'Yellowfin Tuna & Red Snapper',
    status: 'approved',
    expiryDate: '2026-10-25',
    referenceBatch: 'BATCH-ID-2026-TUNA01',
    referenceOrder: 'ORD-SG-2026-081',
    digitalSealHash: '0xSFA4472E81A099FF-TRADENET-VERIFIED'
  },
  {
    id: 'DOC-CDS-03',
    docCode: 'RFMO-IOTC-CDS-2026-192',
    title: 'Catch Documentation Scheme (CDS) & Anti-IUU Certification',
    issuingAuthority: 'Indonesian Ministry of Marine Affairs & Fisheries (KKP)',
    country: 'Indonesia',
    targetSpecies: 'Yellowfin Tuna (Thunnus albacares)',
    status: 'approved',
    expiryDate: '2026-11-15',
    referenceBatch: 'BATCH-ID-2026-TUNA01',
    referenceOrder: 'ORD-SG-2026-081',
    digitalSealHash: '0xIUU99217B1E32A4-IOTC-APPROVED'
  },
  {
    id: 'DOC-ASEAN-04',
    docCode: 'FORM-D-ASEAN-2026-00431',
    title: 'ASEAN Trade in Goods Agreement (ATIGA) Preferential Certificate of Origin (Form D)',
    issuingAuthority: 'Ministry of Trade Republic of Indonesia (Kemendag)',
    country: 'Bilateral',
    targetSpecies: 'Red Snapper (Lutjanus campechanus)',
    status: 'in_review',
    expiryDate: '2026-11-30',
    referenceBatch: 'BATCH-ID-2026-SNAP02',
    referenceOrder: 'ORD-SG-2026-082',
    digitalSealHash: '0xATIGA0933C61D2B-PENDING-SIGN'
  }
];

export const SellerExportCompliance: React.FC<SellerExportComplianceProps> = ({
  batches,
  orders
}) => {
  const [permits, setPermits] = useState<ExportPermitDoc[]>(INITIAL_PERMITS);
  const [selectedPermitForPreview, setSelectedPermitForPreview] = useState<ExportPermitDoc | null>(null);
  const [isGeneratingNew, setIsGeneratingNew] = useState(false);
  const [newBatchSelect, setNewBatchSelect] = useState(batches[0]?.batchNumber || '');
  const [newDocType, setNewDocType] = useState('BKIPM e-HC');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleGenerateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBatch = batches.find(b => b.batchNumber === newBatchSelect) || batches[0];
    const generated: ExportPermitDoc = {
      id: `DOC-${Date.now().toString().slice(-5)}`,
      docCode: `BKIPM/BTM/EXP/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${newDocType} Sanitary & Quality Certificate`,
      issuingAuthority: 'Balai Karantina Hewan, Ikan, dan Tumbuhan (BKHIT Riau-Kepri)',
      country: 'Indonesia',
      targetSpecies: targetBatch ? `${targetBatch.species} (${targetBatch.qimGrade})` : 'Export Grade Seafood',
      status: 'approved',
      expiryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      referenceBatch: targetBatch?.batchNumber || 'BATCH-NEW',
      digitalSealHash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}-SERENADE-SEAL`
    };

    setPermits([generated, ...permits]);
    setIsGeneratingNew(false);
    setSuccessToast(`New ${newDocType} generated and signed with Serenade Data cryptographic proof!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 text-sm shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-600 hover:text-emerald-800 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Regulatory Gateway • Bilateral Hub
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Indonesia – Singapore Export Health & Customs Compliance
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pre-cleared electronic documentation connected to BKIPM (Indonesia) and Singapore Food Agency (SFA) TradeNet.
          </p>
        </div>

        <button
          onClick={() => setIsGeneratingNew(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs rounded-xl shadow-sm transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-sky-200" />
          Generate New Digital Clearance
        </button>
      </div>

      {/* Quick Status Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">BKIPM Quarantine Status</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">100% Cleared</p>
            <p className="text-[10px] text-emerald-600 font-medium">Batam & Karimun Outposts</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Singapore SFA Permit Sync</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">Active Sync</p>
            <p className="text-[10px] text-sky-600 font-medium">TradeNet Electronic Gateway</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Anti-IUU Compliance</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">Grade A (Verified)</p>
            <p className="text-[10px] text-indigo-600 font-medium">RFMO / IOTC Registered Boats</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Security & Signatures</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">Serenade Cryptoseal</p>
            <p className="text-[10px] text-purple-600 font-medium">Tamper-Proof Traceability</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <QrCode className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Compliance Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Active Cross-Border Certificates</h3>
            <p className="text-xs text-slate-500">Legal documents tied to export lots crossing the Singapore Strait</p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {permits.length} Registered Certificates
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Document / Code</th>
                <th className="py-3 px-4">Authority & Jurisdiction</th>
                <th className="py-3 px-4">Target Lot / Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Valid Until</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {permits.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{doc.title}</div>
                        <div className="font-mono text-[11px] text-sky-600">{doc.docCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{doc.issuingAuthority}</div>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 mt-0.5 font-medium">
                      {doc.country}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-medium text-slate-900">{doc.referenceBatch}</div>
                    <div className="text-[11px] text-slate-500">{doc.targetSpecies}</div>
                    {doc.referenceOrder && (
                      <span className="text-[10px] text-slate-400">Order: {doc.referenceOrder}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {doc.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Approved & Valid
                      </span>
                    )}
                    {doc.status === 'in_review' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Under Review
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">
                    {doc.expiryDate}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedPermitForPreview(doc)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5 text-slate-500" />
                      View Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate New Modal */}
      {isGeneratingNew && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Generate Electronic Clearance Certificate
                </h3>
              </div>
              <button
                onClick={() => setIsGeneratingNew(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateDoc} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document Type
                </label>
                <select
                  value={newDocType}
                  onChange={e => setNewDocType(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="BKIPM e-HC">BKIPM Indonesia Electronic Health Certificate (e-HC)</option>
                  <option value="SFA Pre-Import Notification">Singapore SFA Import Pre-Notification (TradeNet)</option>
                  <option value="ASEAN Form D">ASEAN ATIGA Certificate of Origin (Form D)</option>
                  <option value="RFMO Catch Log">RFMO/IOTC Legal Catch Documentation (CDS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Associate with Landed Batch
                </label>
                <select
                  value={newBatchSelect}
                  onChange={e => setNewBatchSelect(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.batchNumber}>
                      {b.batchNumber} — {b.species} ({b.quantityKg} kg, Zone {b.catchZone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Serenade Data Automated Validation Protocol
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Upon issuance, this digital document will receive a cryptographic seal from Serenade Data, instantly queryable by Singapore SFA and Jurong Port inspection terminals.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGeneratingNew(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs"
                >
                  Issue & Seal Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {selectedPermitForPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPermitForPreview(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Header */}
            <div className="text-center pb-4 border-b-2 border-slate-800">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span className="text-xs font-black tracking-widest text-slate-700 uppercase">
                  REPUBLIC OF INDONESIA & REPUBLIC OF SINGAPORE
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 uppercase">
                {selectedPermitForPreview.title}
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Permit Reference No: {selectedPermitForPreview.docCode}
              </p>
            </div>

            {/* Certificate Content Grid */}
            <div className="py-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Issuing Authority</span>
                  <span className="font-semibold text-slate-900">{selectedPermitForPreview.issuingAuthority}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Jurisdiction</span>
                  <span className="font-semibold text-slate-900">{selectedPermitForPreview.country} Maritime Export</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Certified Species</span>
                  <span className="font-semibold text-slate-900">{selectedPermitForPreview.targetSpecies}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Associated Batch</span>
                  <span className="font-mono font-semibold text-sky-700">{selectedPermitForPreview.referenceBatch}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Valid Until</span>
                  <span className="font-semibold text-slate-900">{selectedPermitForPreview.expiryDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Biosecurity Clearance</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> SFA Histamine & Pathogen Pass
                  </span>
                </div>
              </div>

              {/* Cryptographic Verification Seal */}
              <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sky-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    Created by Serenade Data Verification Protocol
                  </div>
                  <p className="text-[11px] text-sky-700 font-mono">
                    Digital Seal: {selectedPermitForPreview.digitalSealHash}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Timestamp: 2026-10-16 08:32:10 UTC • Immutable Ledger Entry #SG-ID-88412
                  </p>
                </div>
                <div className="w-16 h-16 bg-white p-1 rounded-lg border border-sky-300 flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-14 h-14 text-slate-800" />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-[11px] text-slate-500">
                Official electronic copy ready for Jurong Customs presentation
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    alert(`Printing official copy for ${selectedPermitForPreview.docCode}`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Permit
                </button>
                <button
                  onClick={() => {
                    alert(`Exporting PDF manifest with Serenade Data cryptographic proof`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
