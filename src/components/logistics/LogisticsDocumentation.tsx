import React, { useState } from 'react';
import { SHIPMENT_DOCUMENTS } from '../../data/mockData';
import { ShipmentDocument } from '../../types';
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck, Download, Search, Check, Sparkles } from 'lucide-react';

export const LogisticsDocumentation: React.FC = () => {
  const [docs, setDocs] = useState<ShipmentDocument[]>(SHIPMENT_DOCUMENTS);
  const [search, setSearch] = useState('');
  const [verificationNotice, setVerificationNotice] = useState<string | null>(null);

  const filteredDocs = docs.filter(d =>
    d.type.toLowerCase().includes(search.toLowerCase()) ||
    d.shipmentId.toLowerCase().includes(search.toLowerCase()) ||
    d.containerId.toLowerCase().includes(search.toLowerCase())
  );

  const handleVerifyAI = (docId: string) => {
    setDocs(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          verifiedByAI: true,
          status: 'valid' as const,
          notes: 'AI Optical Verification complete: HS codes and FAO catch zone electronic hashes reconciled.'
        };
      }
      return d;
    }));

    setVerificationNotice(`Document ${docId} successfully verified by AI compliance model.`);
    setTimeout(() => setVerificationNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Compliance & Shipment Documentation
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            AI-validated maritime Bills of Lading, FAO Catch Certificates, and port veterinary health declarations.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search document type, container..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {verificationNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{verificationNotice}</span>
        </div>
      )}

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Digital Catch & Cargo Dossiers
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated cross-referencing against EU IUU (Illegal, Unreported and Unregulated) fishing registry
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {docs.filter(d => d.verifiedByAI).length} of {docs.length} Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Document Type</th>
                <th className="py-3 px-4">Consignment & Reefer</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">AI Verification</th>
                <th className="py-3 px-4">Compliance Notes</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDocs.map((doc) => {
                const isFlagged = doc.status === 'flagged';

                return (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 block">{doc.type}</span>
                          <span className="font-mono text-slate-400 text-[10px]">{doc.id} · {doc.fileSize}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-semibold text-slate-900 block">{doc.shipmentId}</span>
                      <span className="font-mono text-slate-500 text-[11px] block">{doc.containerId}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">
                      {doc.issueDate}
                    </td>
                    <td className="py-3 px-4">
                      {doc.verifiedByAI ? (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>AI Validated</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Discrepancy</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs leading-relaxed text-[11px]">
                      {doc.notes}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isFlagged ? (
                        <button
                          onClick={() => handleVerifyAI(doc.id)}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Re-Verify</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setVerificationNotice(`Downloading ${doc.type} PDF (${doc.fileSize})...`);
                            setTimeout(() => setVerificationNotice(null), 2500);
                          }}
                          className="px-2.5 py-1 text-slate-600 hover:text-sky-700 hover:bg-sky-50 border border-slate-200 rounded text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
