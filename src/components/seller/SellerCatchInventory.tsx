import React, { useState } from 'react';
import { CatchBatch } from '../../types';
import {
  Plus,
  Search,
  Filter,
  Snowflake,
  QrCode,
  FileCheck2,
  Anchor,
  X,
  CheckCircle2,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Thermometer,
  Printer
} from 'lucide-react';

interface SellerCatchInventoryProps {
  batches: CatchBatch[];
  onAddBatch: (batch: CatchBatch) => void;
  onUpdateBatchStatus: (batchId: string, status: CatchBatch['status']) => void;
  isAddModalOpenInitially?: boolean;
}

export const SellerCatchInventory: React.FC<SellerCatchInventoryProps> = ({
  batches,
  onAddBatch,
  onUpdateBatchStatus,
  isAddModalOpenInitially = false
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(isAddModalOpenInitially);
  const [selectedBatchForQr, setSelectedBatchForQr] = useState<CatchBatch | null>(null);

  // Form State for New Batch
  const [formSpecies, setFormSpecies] = useState<string>('Live Cantang Grouper (Kerapu Cantang)');
  const [formMethod, setFormMethod] = useState<CatchBatch['harvestMethod']>('Sustainable Aquaculture');
  const [formZone, setFormZone] = useState<string>('WPP-NRI 711 (Batam Barelang Waters)');
  const [formQuantity, setFormQuantity] = useState<number>(2500);
  const [formTemp, setFormTemp] = useState<number>(3.0);
  const [formPrice, setFormPrice] = useState<number>(15.00);
  const [formGrade, setFormGrade] = useState<string>('Grade AAA Super Fresh (Live Tank)');

  const handleSpeciesPreset = (name: string, temp: number, price: number, zone: string, method: CatchBatch['harvestMethod']) => {
    setFormSpecies(name);
    setFormTemp(temp);
    setFormPrice(price);
    setFormZone(zone);
    setFormMethod(method);
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBatch: CatchBatch = {
      id: `BATCH-ID-${Date.now().toString().slice(-4)}`,
      batchNumber: `BTM-${new Date().getFullYear()}-CT${randomSuffix}`,
      species: formSpecies,
      harvestMethod: formMethod,
      catchZone: formZone,
      harvestDate: new Date().toISOString().split('T')[0],
      quantityKg: Number(formQuantity),
      availableKg: Number(formQuantity),
      storageTemp: Number(formTemp),
      qimGrade: formGrade,
      phLevel: 6.7,
      pricePerKgUSD: Number(formPrice),
      status: 'chilled_ready',
      certificationNumber: `BKIPM/BTM/EXP/2026/${randomSuffix}`
    };

    onAddBatch(newBatch);
    setIsAddModalOpen(false);
  };

  const filteredBatches = batches.filter((b) => {
    const matchesSearch = b.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.catchZone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Catch Manifest & Cryogenic Warehousing
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Seafood Inventory & Harvest Records
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time cold-storage batches inspected for Singapore export readiness.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 transition-all shadow-md active:scale-95 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Register New Catch Batch</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by species, batch ID, or zone..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Batches</option>
            <option value="chilled_ready">Chilled & Ready</option>
            <option value="allocated">Allocated to Order</option>
            <option value="harvested">Recently Harvested</option>
            <option value="dispatched">Dispatched to Reefer</option>
          </select>
        </div>
      </div>

      {/* Inventory Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Batch Number</th>
                <th className="py-3.5 px-4">Species & Catch Zone</th>
                <th className="py-3.5 px-4">Harvest Method</th>
                <th className="py-3.5 px-4">Quantity Available</th>
                <th className="py-3.5 px-4">Cold-Storage Temp</th>
                <th className="py-3.5 px-4">QIM Grade</th>
                <th className="py-3.5 px-4">Price / kg</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900 block">
                      {batch.batchNumber}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Harvest: {batch.harvestDate}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">
                      {batch.species}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate max-w-xs">
                      {batch.catchZone}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    {batch.harvestMethod}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900 block">
                      {batch.availableKg.toLocaleString()} kg
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Total: {batch.quantityKg.toLocaleString()} kg
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                      <Snowflake className="w-3 h-3 text-teal-600" />
                      {batch.storageTemp > 0 ? `+${batch.storageTemp}°C` : `${batch.storageTemp}°C`}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800 block">
                      {batch.qimGrade}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      pH: {batch.phLevel}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                    ${batch.pricePerKgUSD.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      batch.status === 'chilled_ready'
                        ? 'bg-emerald-100 text-emerald-800'
                        : batch.status === 'allocated'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}>
                      {batch.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedBatchForQr(batch)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Print QR Traceability Tag"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      {batch.status === 'harvested' && (
                        <button
                          onClick={() => onUpdateBatchStatus(batch.id, 'chilled_ready')}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded text-[11px] border border-emerald-200 transition-colors cursor-pointer"
                        >
                          Mark Ready
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Showing {filteredBatches.length} of {batches.length} active cold-storage batches</span>
          <span className="font-mono text-teal-600 font-medium">
            Created by Serenade Data · ISO 22000 Catch Verifier
          </span>
        </div>
      </div>

      {/* REGISTER NEW CATCH BATCH MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Anchor className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Register New Catch Batch
                  </h3>
                  <p className="text-xs text-slate-500">
                    Input harvest manifest into the cold-chain export registry.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Presets Chips */}
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                  Quick Select Indonesian Seafood Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSpeciesPreset('Live Cantang Grouper (Kerapu Cantang)', 3.2, 14.50, 'WPP-NRI 711 (Batam Barelang Waters)', 'Sustainable Aquaculture')}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 font-medium cursor-pointer"
                  >
                    Cantang Grouper (Batam)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSpeciesPreset('Giant Tiger Prawns (Udang Windu)', -20.0, 18.50, 'WPP-NRI 711 (Natuna Mangrove)', 'Sustainable Aquaculture')}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 font-medium cursor-pointer"
                  >
                    Tiger Prawns (Natuna)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSpeciesPreset('Yellowfin Tuna Sashimi Grade AAA', -22.5, 21.00, 'WPP-NRI 572 (Samudera Hindia)', 'Deep Sea Longline')}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 font-medium cursor-pointer"
                  >
                    Yellowfin Tuna (Jakarta)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSpeciesPreset('Live Mud Crabs (Kepiting Bakau)', 12.0, 19.50, 'WPP-NRI 713 (Bali & Alas)', 'Wild Caught')}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 font-medium cursor-pointer"
                  >
                    Mud Crabs (Bali)
                  </button>
                </div>
              </div>

              {/* Species Name */}
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Species & Commercial Name
                </label>
                <input
                  type="text"
                  value={formSpecies}
                  onChange={(e) => setFormSpecies(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Grid: Method & Catch Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Harvest Method
                  </label>
                  <select
                    value={formMethod}
                    onChange={(e: any) => setFormMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Sustainable Aquaculture">Sustainable Aquaculture (Keramba Jaring Apung)</option>
                    <option value="Wild Caught">Wild Caught (Tangkapan Ramah Lingkungan)</option>
                    <option value="Deep Sea Longline">Deep Sea Longline (Pancing Ulur Samudera)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Catch / Pen Zone (WPP-NRI)
                  </label>
                  <input
                    type="text"
                    value={formZone}
                    onChange={(e) => setFormZone(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Grid: Quantity, Storage Temp, Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Harvest Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value))}
                    min={100}
                    step={50}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Storage Temp (°C)
                  </label>
                  <input
                    type="number"
                    value={formTemp}
                    onChange={(e) => setFormTemp(Number(e.target.value))}
                    step={0.5}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Price / kg (USD)
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    step={0.1}
                    min={1}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Grade */}
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Quality & Freshness Standard
                </label>
                <select
                  value={formGrade}
                  onChange={(e) => setFormGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Grade AAA Super Fresh (Live Tank)">Grade AAA Super Fresh (Live Tank / Oxygenated)</option>
                  <option value="Grade AAA Export Frozen IQF">Grade AAA Export Frozen IQF (-22°C)</option>
                  <option value="Grade AA Export Quality Chilled">Grade AA Export Quality Chilled (0°C to 2°C)</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Upon registering, an electronic BKIPM traceability certificate number will be generated immediately.</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Register Catch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT QR TRACEABILITY MODAL */}
      {selectedBatchForQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 text-center space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
                <QrCode className="w-4 h-4" />
                <span>Cold-Chain Provenance QR Tag</span>
              </span>
              <button
                onClick={() => setSelectedBatchForQr(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center space-y-3">
              {/* SVG Mock QR Code */}
              <div className="w-40 h-40 bg-white p-2 rounded-lg shadow-sm border border-slate-200 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 p-2 rounded flex flex-col items-center justify-center text-teal-300">
                  <QrCode className="w-24 h-24 text-white" />
                  <span className="text-[9px] font-mono mt-1 text-slate-300">SCAN AT RESTAURANT</span>
                </div>
              </div>

              <div className="text-xs space-y-0.5">
                <span className="font-mono font-bold text-slate-900 block text-sm">
                  {selectedBatchForQr.batchNumber}
                </span>
                <span className="font-semibold text-slate-800 block">
                  {selectedBatchForQr.species}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Origin: {selectedBatchForQr.catchZone}
                </span>
                <span className="text-[11px] font-mono text-teal-700 font-bold block">
                  Temp Target: {selectedBatchForQr.storageTemp > 0 ? `+${selectedBatchForQr.storageTemp}°C` : `${selectedBatchForQr.storageTemp}°C`}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Verified BKIPM # {selectedBatchForQr.certificationNumber.split('/').pop()}</span>
              <span className="font-mono text-teal-600 font-semibold">Created by Serenade Data</span>
            </div>

            <button
              onClick={() => {
                window.print();
                setSelectedBatchForQr(null);
              }}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Crate Provenance Label</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
