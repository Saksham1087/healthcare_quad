import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Check,
  ChevronDown,
  Search,
  Sparkles,
  Shield,
  Heart,
  Pill,
  X,
} from 'lucide-react';
import { PatientProfile, PatientRecordStore } from '../types/fhir';
import { BulbSeedIcon } from './BulbasaurThemeAssets';

interface PatientProfileSwitcherProps {
  currentPatientId: string;
  patientsDatabase: Record<string, PatientRecordStore>;
  onSelectPatient: (patientId: string) => void;
  onCreatePatient: (newProfile: PatientProfile) => void;
}

export const PatientProfileSwitcher: React.FC<PatientProfileSwitcherProps> = ({
  currentPatientId,
  patientsDatabase,
  onSelectPatient,
  onCreatePatient,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (!isCreateModalOpen && !isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCreateModalOpen) {
          setIsCreateModalOpen(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreateModalOpen, isOpen]);

  // Form state for creating a new patient profile
  const [newName, setNewName] = useState<string>('');
  const [newAge, setNewAge] = useState<string>('35');
  const [newGender, setNewGender] = useState<'male' | 'female' | 'other'>('male');
  const [newBloodGroup, setNewBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('B+');
  const [newPhone, setNewPhone] = useState<string>('+91 98');
  const [newCity, setNewCity] = useState<string>('New Delhi');
  const [newAllergies, setNewAllergies] = useState<string>('No Known Drug Allergies (NKDA)');
  const [newIceName, setNewIceName] = useState<string>('');
  const [newIcePhone, setNewIcePhone] = useState<string>('+91 98');

  const currentStore = patientsDatabase[currentPatientId] || Object.values(patientsDatabase)[0];
  const currentPatient = currentStore?.patient;

  const patientList = Object.entries(patientsDatabase).filter(([_, store]) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      store.patient.fullName.toLowerCase().includes(q) ||
      store.patient.abhaId.toLowerCase().includes(q) ||
      store.patient.city.toLowerCase().includes(q)
    );
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const clean = newName.trim();
    const id = `pat-${clean.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const abhaId = `91-${randomCode}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const username = clean.split(' ')[0].toLowerCase();

    const createdProfile: PatientProfile = {
      id,
      abhaId,
      abhaAddress: `${username}.${randomCode}@abdm`,
      fullName: clean,
      dateOfBirth: `${2026 - (parseInt(newAge, 10) || 35)}-01-01`,
      age: parseInt(newAge, 10) || 35,
      gender: newGender,
      bloodGroup: newBloodGroup,
      phone: newPhone,
      email: `${username}@gmail.com`,
      emergencyContact: {
        name: newIceName || 'Primary Family Member',
        relationship: 'Caregiver / ICE',
        phone: newIcePhone,
      },
      city: newCity,
      state: 'Delhi',
    };

    onCreatePatient(createdProfile);
    setIsCreateModalOpen(false);
    setIsOpen(false);
    setNewName('');
  };

  return (
    <div className="relative">
      {/* Current Active Patient Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="flex items-center gap-3 p-1.5 pr-3 min-h-[44px] rounded-2xl bg-white/70 dark:bg-[#122B22]/80 hover:bg-white dark:hover:bg-[#17382D] border border-[#3FA796]/30 shadow-sm transition-all hover:scale-[1.01] text-left"
        aria-label="Switch active patient profile"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F3D2E] to-[#3FA796] flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0">
          {currentPatient?.fullName.split(' ').map((n) => n[0]).join('') || 'PT'}
        </div>

        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#0F3D2E] dark:text-[#F4FAF3] tracking-tight">
              {currentPatient?.fullName}
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-[#3FA796]/15 text-[#3FA796] dark:text-[#B8E986]">
              {currentPatient?.bloodGroup}
            </span>
          </div>
          <p className="text-[10px] text-[#4B6E60] dark:text-[#95BDB0] font-mono truncate max-w-[150px]">
            ABHA: {currentPatient?.abhaId}
          </p>
        </div>

        <ChevronDown className={`w-4 h-4 text-[#4B6E60] dark:text-[#95BDB0] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 rounded-2xl glass-panel shadow-2xl border border-[#3FA796]/30 p-3 space-y-3 font-sans animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between px-2 pt-1">
              <div>
                <h4 className="text-xs font-bold text-[#0F3D2E] dark:text-[#F4FAF3] tracking-tight">
                  Patient Health Profiles
                </h4>
                <p className="text-[10px] text-[#4B6E60] dark:text-[#95BDB0]">
                  Select profile to view individual records & safety alerts
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsCreateModalOpen(true);
                }}
                aria-label="Create new patient profile"
                className="min-h-[44px] px-3 py-1.5 rounded-xl bg-[#3FA796]/15 hover:bg-[#3FA796]/25 text-[#0F3D2E] dark:text-[#B8E986] transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
              >
                <UserPlus className="w-4 h-4 text-[#3FA796]" aria-hidden="true" />
                <span>+ New</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative px-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" aria-hidden="true" />
              <input
                type="text"
                aria-label="Search patient by name or ABHA"
                placeholder="Search patient by name or ABHA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F4FAF3] dark:bg-[#071711] border border-[#3FA796]/25 rounded-xl pl-8 pr-3 py-2 text-xs text-[#0F3D2E] dark:text-[#F4FAF3] placeholder:text-slate-400 focus:outline-none focus:border-[#3FA796]"
              />
            </div>

            {/* Patient Cards List */}
            <div className="max-h-64 overflow-y-auto space-y-1.5 px-1">
              {patientList.map(([id, store]) => {
                const isSelected = id === currentPatientId;
                const p = store.patient;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onSelectPatient(id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#3FA796]/15 border-[#3FA796] shadow-sm'
                        : 'bg-white/60 dark:bg-[#122B22]/60 border-transparent hover:border-[#3FA796]/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ${
                          isSelected
                            ? 'bg-[#3FA796] text-white'
                            : 'bg-slate-200 dark:bg-[#1E4637] text-[#0F3D2E] dark:text-[#F4FAF3]'
                        }`}
                      >
                        {p.fullName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#0F3D2E] dark:text-[#F4FAF3]">
                            {p.fullName}
                          </span>
                          <span className="text-[10px] font-mono text-[#4B6E60] dark:text-[#95BDB0]">
                            ({p.age}y, {p.gender.toUpperCase()})
                          </span>
                        </div>
                        <p className="text-[10px] text-[#4B6E60] dark:text-[#95BDB0] font-mono">
                          {p.city} · {store.medications.length} meds · {store.conditions.length} conditions
                        </p>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-[#3FA796] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Modal: Create New Patient Profile */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-patient-modal-title"
            className="bg-[var(--bg-card)] border border-[#3FA796]/30 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between border-b border-[#3FA796]/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-[#3FA796]/15 text-[#3FA796]">
                  <UserPlus className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 id="create-patient-modal-title" className="text-sm font-bold text-[#0F3D2E] dark:text-[#F4FAF3]">
                    Create New Patient Profile
                  </h3>
                  <p className="text-[11px] text-[#4B6E60] dark:text-[#95BDB0]">
                    Segment medical records individually per family member
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                aria-label="Close dialog"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#3D5A4C] dark:text-slate-400 hover:text-rose-600 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-bold"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label htmlFor="new-patient-name" className="text-[#1B2A22] dark:text-[#E2ECE9] font-bold block mb-1">Patient Full Name *</label>
                <input
                  id="new-patient-name"
                  name="new-patient-name"
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma, Ananya Rao"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#FAF6EA] dark:bg-[#071711] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl px-3 py-2 text-xs text-[#1B2A22] dark:text-[#F4FAF3] focus:outline-none focus:border-[#2D6A4F]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="new-patient-age" className="text-[#1B2A22] dark:text-[#E2ECE9] font-bold block mb-1">Age *</label>
                  <input
                    id="new-patient-age"
                    name="new-patient-age"
                    type="number"
                    required
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full bg-[#FAF6EA] dark:bg-[#071711] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl px-3 py-2 text-xs text-[#1B2A22] dark:text-[#F4FAF3] font-mono focus:outline-none focus:border-[#2D6A4F]"
                  />
                </div>
                <div>
                  <label htmlFor="new-patient-gender" className="text-[#1B2A22] dark:text-[#E2ECE9] font-bold block mb-1">Gender</label>
                  <select
                    id="new-patient-gender"
                    name="new-patient-gender"
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full bg-[#FAF6EA] dark:bg-[#071711] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl px-2 py-2 text-xs text-[#1B2A22] dark:text-[#F4FAF3] focus:outline-none focus:border-[#2D6A4F]"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="new-patient-blood-group" className="text-[#1B2A22] dark:text-[#E2ECE9] font-bold block mb-1">Blood Group</label>
                  <select
                    id="new-patient-blood-group"
                    name="new-patient-blood-group"
                    value={newBloodGroup}
                    onChange={(e) => setNewBloodGroup(e.target.value as any)}
                    className="w-full bg-[#FAF6EA] dark:bg-[#071711] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl px-2 py-2 text-xs text-[#1B2A22] dark:text-[#F4FAF3] font-mono focus:outline-none focus:border-[#2D6A4F]"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="new-patient-phone" className="text-[#1B2A22] dark:text-[#E2ECE9] font-bold block mb-1">Phone Number</label>
                  <input
                    id="new-patient-phone"
                    name="new-patient-phone"
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-[#FAF6EA] dark:bg-[#071711] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl px-3 py-2 text-xs text-[#1B2A22] dark:text-[#F4FAF3] font-mono focus:outline-none focus:border-[#2D6A4F]"
                  />
                </div>
                <div>
                  <label htmlFor="new-patient-city" className="text-[#1B2A22] dark:text-[#E2ECE9] font-bold block mb-1">City</label>
                  <input
                    id="new-patient-city"
                    name="new-patient-city"
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-[#FAF6EA] dark:bg-[#071711] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl px-3 py-2 text-xs text-[#1B2A22] dark:text-[#F4FAF3] focus:outline-none focus:border-[#2D6A4F]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="new-patient-allergies" className="text-[#1B2A22] dark:text-[#E2ECE9] font-bold block mb-1">Known Drug Allergies</label>
                <input
                  id="new-patient-allergies"
                  name="new-patient-allergies"
                  type="text"
                  placeholder="e.g. Penicillin, Sulfa, Aspirin, or NKDA"
                  value={newAllergies}
                  onChange={(e) => setNewAllergies(e.target.value)}
                  className="w-full bg-[#FAF6EA] dark:bg-[#071711] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl px-3 py-2 text-xs text-[#1B2A22] dark:text-[#F4FAF3] focus:outline-none focus:border-[#2D6A4F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="new-patient-ice-name" className="text-[#1B2A22] dark:text-[#E2ECE9] font-bold block mb-1">Emergency ICE Contact Name</label>
                  <input
                    id="new-patient-ice-name"
                    name="new-patient-ice-name"
                    type="text"
                    placeholder="e.g. Ramesh Sharma"
                    value={newIceName}
                    onChange={(e) => setNewIceName(e.target.value)}
                    className="w-full bg-[#FAF6EA] dark:bg-[#071711] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl px-3 py-2 text-xs text-[#1B2A22] dark:text-[#F4FAF3] focus:outline-none focus:border-[#2D6A4F]"
                  />
                </div>
                <div>
                  <label htmlFor="new-patient-ice-phone" className="text-[#1B2A22] dark:text-[#E2ECE9] font-bold block mb-1">ICE Contact Phone</label>
                  <input
                    id="new-patient-ice-phone"
                    name="new-patient-ice-phone"
                    type="text"
                    value={newIcePhone}
                    onChange={(e) => setNewIcePhone(e.target.value)}
                    className="w-full bg-[#FAF6EA] dark:bg-[#071711] border border-[#C9A24B]/35 dark:border-[#3FA796]/30 rounded-xl px-3 py-2 text-xs text-[#1B2A22] dark:text-[#F4FAF3] font-mono focus:outline-none focus:border-[#2D6A4F]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#C9A24B]/20 dark:border-[#3FA796]/20">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 bg-white dark:bg-[#122B22] text-[#1B2A22] dark:text-[#95BDB0] rounded-xl font-semibold hover:bg-[#FAF6EA] border border-[#C9A24B]/35 dark:border-none shadow-sm flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 bg-[#17483A] dark:bg-[#3FA796] hover:bg-[#2D6A4F] dark:hover:bg-[#4CB8A4] text-white dark:text-[#0E2A21] rounded-xl font-bold shadow-md shadow-[#17483A]/20 flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create &amp; Activate Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
