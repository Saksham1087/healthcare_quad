import {
  UnifiedMedication,
  UnifiedAllergy,
  ClinicalSafetyAlert,
} from '../types/fhir';

/**
 * Curated Indian Drug Formulary (Branded Generics to Active Generic Ingredients)
 * Covers common chronic, acute, and multi-molecule FDC (Fixed-Dose Combination) drugs.
 */
export interface IndianDrugDefinition {
  brandName: string;
  genericName: string;
  therapeuticClass: string;
  snomedConcept: string;
  activeIngredients: {
    name: string;
    strengthMg: number;
    unit: string;
  }[];
  standardMaxDailyDoseMg?: { [ingredient: string]: number };
  contraindicatedAllergies?: string[];
  majorInteractionsWith?: string[]; // Generic names
}

export const INDIAN_DRUG_DATABASE: IndianDrugDefinition[] = [
  {
    brandName: 'Telma-H',
    genericName: 'Telmisartan + Hydrochlorothiazide',
    therapeuticClass: 'Antihypertensive Combination (ARB + Thiazide Diuretic)',
    snomedConcept: '702871004',
    activeIngredients: [
      { name: 'Telmisartan', strengthMg: 40, unit: 'mg' },
      { name: 'Hydrochlorothiazide', strengthMg: 12.5, unit: 'mg' },
    ],
    standardMaxDailyDoseMg: {
      Telmisartan: 80,
      Hydrochlorothiazide: 25,
    },
    contraindicatedAllergies: ['Sulfa', 'Sulfonamide', 'Thiazide'],
    majorInteractionsWith: ['Spironolactone', 'Potassium Chloride', 'Lithium', 'Enalapril', 'Ramipril'],
  },
  {
    brandName: 'Telma 40',
    genericName: 'Telmisartan',
    therapeuticClass: 'Angiotensin II Receptor Blocker (ARB)',
    snomedConcept: '386864001',
    activeIngredients: [
      { name: 'Telmisartan', strengthMg: 40, unit: 'mg' },
    ],
    standardMaxDailyDoseMg: {
      Telmisartan: 80,
    },
    majorInteractionsWith: ['Ramipril', 'Lisinopril', 'Spironolactone'],
  },
  {
    brandName: 'Dolo 650',
    genericName: 'Paracetamol',
    therapeuticClass: 'Antipyretic / Analgesic',
    snomedConcept: '387517004',
    activeIngredients: [
      { name: 'Paracetamol', strengthMg: 650, unit: 'mg' },
    ],
    standardMaxDailyDoseMg: {
      Paracetamol: 4000,
    },
    contraindicatedAllergies: ['Paracetamol', 'Acetaminophen'],
    majorInteractionsWith: ['Warfarin'],
  },
  {
    brandName: 'Calpol 500',
    genericName: 'Paracetamol',
    therapeuticClass: 'Antipyretic / Analgesic',
    snomedConcept: '387517004',
    activeIngredients: [
      { name: 'Paracetamol', strengthMg: 500, unit: 'mg' },
    ],
    standardMaxDailyDoseMg: {
      Paracetamol: 4000,
    },
    contraindicatedAllergies: ['Paracetamol', 'Acetaminophen'],
  },
  {
    brandName: 'Combiflam',
    genericName: 'Ibuprofen + Paracetamol',
    therapeuticClass: 'NSAID + Analgesic Combination',
    snomedConcept: '412613008',
    activeIngredients: [
      { name: 'Ibuprofen', strengthMg: 400, unit: 'mg' },
      { name: 'Paracetamol', strengthMg: 325, unit: 'mg' },
    ],
    standardMaxDailyDoseMg: {
      Ibuprofen: 2400,
      Paracetamol: 4000,
    },
    contraindicatedAllergies: ['Aspirin', 'Ibuprofen', 'NSAID'],
    majorInteractionsWith: ['Warfarin', 'Aspirin', 'Methotrexate', 'Lisinopril', 'Telmisartan'],
  },
  {
    brandName: 'Augmentin 625 Duo',
    genericName: 'Amoxicillin + Clavulanic Acid',
    therapeuticClass: 'Potentiated Penicillin Antibiotic',
    snomedConcept: '372687004',
    activeIngredients: [
      { name: 'Amoxicillin', strengthMg: 500, unit: 'mg' },
      { name: 'Clavulanic Acid', strengthMg: 125, unit: 'mg' },
    ],
    contraindicatedAllergies: ['Penicillin', 'Amoxicillin', 'Ampicillin', 'Beta-Lactam'],
    majorInteractionsWith: ['Methotrexate', 'Warfarin'],
  },
  {
    brandName: 'Pan-D',
    genericName: 'Pantoprazole + Domperidone',
    therapeuticClass: 'Proton Pump Inhibitor + Prokinetic',
    snomedConcept: '768782006',
    activeIngredients: [
      { name: 'Pantoprazole', strengthMg: 40, unit: 'mg' },
      { name: 'Domperidone', strengthMg: 30, unit: 'mg' },
    ],
    majorInteractionsWith: ['Ketoconazole', 'Clopidogrel'],
  },
  {
    brandName: 'Glycomet-GP 2',
    genericName: 'Metformin + Glimepiride',
    therapeuticClass: 'Oral Antidiabetic Dual Therapy (Biguanide + Sulfonylurea)',
    snomedConcept: '427218002',
    activeIngredients: [
      { name: 'Metformin', strengthMg: 500, unit: 'mg' },
      { name: 'Glimepiride', strengthMg: 2, unit: 'mg' },
    ],
    contraindicatedAllergies: ['Sulfonylurea', 'Sulfa'],
    majorInteractionsWith: ['Ciprofloxacin', 'Alcohol'],
  },
  {
    brandName: 'Rosuvas 10',
    genericName: 'Rosuvastatin',
    therapeuticClass: 'HMG-CoA Reductase Inhibitor (Statin)',
    snomedConcept: '412262004',
    activeIngredients: [
      { name: 'Rosuvastatin', strengthMg: 10, unit: 'mg' },
    ],
    standardMaxDailyDoseMg: {
      Rosuvastatin: 40,
    },
    majorInteractionsWith: ['Gemfibrozil', 'Cyclosporine', 'Antacids'],
  },
  {
    brandName: 'Atorva 20',
    genericName: 'Atorvastatin',
    therapeuticClass: 'HMG-CoA Reductase Inhibitor (Statin)',
    snomedConcept: '387584000',
    activeIngredients: [
      { name: 'Atorvastatin', strengthMg: 20, unit: 'mg' },
    ],
    standardMaxDailyDoseMg: {
      Atorvastatin: 80,
    },
    majorInteractionsWith: ['Clarithromycin', 'Itraconazole', 'Grapefruit Juice'],
  },
  {
    brandName: 'Ecosprin 75',
    genericName: 'Aspirin (Acetylsalicylic Acid)',
    therapeuticClass: 'Antiplatelet Agent',
    snomedConcept: '387458008',
    activeIngredients: [
      { name: 'Aspirin', strengthMg: 75, unit: 'mg' },
    ],
    contraindicatedAllergies: ['Aspirin', 'Salicylate', 'NSAID'],
    majorInteractionsWith: ['Ibuprofen', 'Combiflam', 'Warfarin', 'Clopidogrel'],
  },
];

/**
 * Searches and maps a brand name or trade generic to its normalized Indian definition.
 */
export function lookupDrugDefinition(name: string): IndianDrugDefinition | undefined {
  const clean = name.trim().toLowerCase();
  return INDIAN_DRUG_DATABASE.find((d) => {
    const brandLower = d.brandName.toLowerCase();
    const genericLower = d.genericName.toLowerCase();
    return (
      clean.includes(brandLower) ||
      brandLower.includes(clean) ||
      clean.includes(genericLower) ||
      genericLower.includes(clean)
    );
  });
}

/**
 * Performs rigorous deterministic safety checks across all active medications and allergies.
 * Evaluates:
 * 1. Duplicate active ingredients (e.g. Paracetamol in Dolo 650 + Combiflam)
 * 2. Cross-provider double prescriptions (e.g. Telmisartan from two cardiologists)
 * 3. Drug-Allergy contraindications (e.g. Penicillin allergy vs Augmentin)
 * 4. Dangerous Drug-Drug interactions (e.g. Aspirin + Ibuprofen platelet competition)
 */
export function evaluateClinicalSafety(
  medications: UnifiedMedication[],
  allergies: UnifiedAllergy[]
): ClinicalSafetyAlert[] {
  const alerts: ClinicalSafetyAlert[] = [];
  const activeMeds = medications.filter((m) => m.status === 'active');

  // 1. Check for Duplicate Active Ingredients
  const ingredientMap: {
    [ingredient: string]: {
      totalStrength: number;
      prescriptions: { med: UnifiedMedication; strength: number }[];
    };
  } = {};

  for (const med of activeMeds) {
    for (const ing of med.activeIngredients) {
      const ingName = ing.name.toLowerCase();
      if (!ingredientMap[ingName]) {
        ingredientMap[ingName] = { totalStrength: 0, prescriptions: [] };
      }
      ingredientMap[ingName].totalStrength += ing.strengthMg;
      ingredientMap[ingName].prescriptions.push({ med, strength: ing.strengthMg });
    }
  }

  for (const [ingredient, data] of Object.entries(ingredientMap)) {
    if (data.prescriptions.length > 1) {
      const medNames = data.prescriptions.map((p) => `${p.med.brandName} (${p.med.prescribingFacility})`);
      const isCrossProvider = new Set(data.prescriptions.map((p) => p.med.prescribingFacility)).size > 1;

      alerts.push({
        id: `alert-dupe-${ingredient}-${data.prescriptions.map((p) => p.med.id).sort().join('-')}`,
        severity: ingredient === 'paracetamol' || ingredient === 'telmisartan' ? 'critical' : 'major',
        type: 'duplicate-ingredient',
        title: `Duplicate Active Ingredient: ${ingredient.toUpperCase()}`,
        description: `Patient is concurrently prescribed ${data.prescriptions.length} medications containing active ${ingredient}: ${medNames.join(' and ')}. Total concurrent single-dose load: ${data.totalStrength}mg.`,
        involvedMedications: data.prescriptions.map((p) => p.med.brandName),
        clinicalRationale: isCrossProvider
          ? `Prescribed by different healthcare providers without unified reconciliation. High risk of accidental overdose and organ toxicity.`
          : `Multiple concurrent prescriptions share this active chemical ingredient.`,
        recommendedAction: `Flag to physician to discontinue duplicate formulation or consolidate into a single dosage regimen.`,
        detectedAt: new Date().toISOString(),
      });
    }
  }

  // 2. Check for Drug-Allergy Conflicts
  for (const med of activeMeds) {
    const drugDef = lookupDrugDefinition(med.brandName) || lookupDrugDefinition(med.genericName);
    const contraindications = drugDef?.contraindicatedAllergies || [];

    for (const allergy of allergies) {
      const allergySubstance = allergy.substance.toLowerCase();
      const medBrand = med.brandName.toLowerCase();
      const medGeneric = med.genericName.toLowerCase();

      const directMatch =
        medBrand.includes(allergySubstance) ||
        medGeneric.includes(allergySubstance) ||
        contraindications.some((c) => c.toLowerCase().includes(allergySubstance) || allergySubstance.includes(c.toLowerCase()));

      // Specific clinical rules (e.g. Penicillin allergy vs Amoxicillin / Augmentin)
      const isPenicillinCrossReactivity =
        allergySubstance.includes('penicillin') &&
        (medGeneric.includes('amoxicillin') || medGeneric.includes('ampicillin') || medBrand.includes('augmentin'));

      const isAspirinNsaidCrossReactivity =
        (allergySubstance.includes('aspirin') || allergySubstance.includes('nsaid')) &&
        (medGeneric.includes('ibuprofen') || medGeneric.includes('aceclofenac') || medGeneric.includes('diclofenac') || medBrand.includes('combiflam'));

      if (directMatch || isPenicillinCrossReactivity || isAspirinNsaidCrossReactivity) {
        alerts.push({
          id: `alert-allergy-${med.id}-${allergy.id}`,
          severity: allergy.criticality === 'high' ? 'critical' : 'major',
          type: 'allergy-conflict',
          title: `Severe Allergy Conflict: ${allergy.substance} vs ${med.brandName}`,
          description: `Patient has documented allergy to "${allergy.substance}" (${allergy.manifestation}), but was prescribed ${med.brandName} (${med.genericName}) at ${med.prescribingFacility}.`,
          involvedMedications: [med.brandName],
          clinicalRationale: `Beta-lactam / NSAID cross-reactivity documented. Risk of immediate hypersensitivity, severe bronchospasm, or anaphylaxis.`,
          recommendedAction: `Withhold medication immediately and notify prescriber for non-cross-reactive alternative.`,
          detectedAt: new Date().toISOString(),
        });
      }
    }
  }

  // 3. Drug-Drug Interactions (e.g., Aspirin + NSAID / Ibuprofen, ARB + ACE-i)
  const seenInteractions = new Set<string>();

  for (let i = 0; i < activeMeds.length; i++) {
    for (let j = i + 1; j < activeMeds.length; j++) {
      const medA = activeMeds[i];
      const medB = activeMeds[j];
      const pairKey = [medA.id, medB.id].sort().join('-');

      if (seenInteractions.has(pairKey)) {
        continue;
      }

      const defA = lookupDrugDefinition(medA.brandName) || lookupDrugDefinition(medA.genericName);
      const defB = lookupDrugDefinition(medB.brandName) || lookupDrugDefinition(medB.genericName);

      const aInteractsWithB = defA?.majorInteractionsWith?.some(
        (target) => {
          const t = target.toLowerCase();
          return (
            medB.genericName.toLowerCase().includes(t) ||
            medB.brandName.toLowerCase().includes(t) ||
            medB.activeIngredients?.some((ing) => ing.name.toLowerCase().includes(t))
          );
        }
      );

      const bInteractsWithA = defB?.majorInteractionsWith?.some(
        (target) => {
          const t = target.toLowerCase();
          return (
            medA.genericName.toLowerCase().includes(t) ||
            medA.brandName.toLowerCase().includes(t) ||
            medA.activeIngredients?.some((ing) => ing.name.toLowerCase().includes(t))
          );
        }
      );

      if (aInteractsWithB || bInteractsWithA) {
        seenInteractions.add(pairKey);
        alerts.push({
          id: `alert-ddi-${pairKey}`,
          severity: 'major',
          type: 'drug-drug-interaction',
          title: `Drug Interaction: ${medA.brandName} + ${medB.brandName}`,
          description: `Concurrent administration of ${medA.brandName} (${medA.genericName}) and ${medB.brandName} (${medB.genericName}) has known pharmacological interference.`,
          involvedMedications: [medA.brandName, medB.brandName],
          clinicalRationale: `Interference between active drug classes increases gastrointestinal bleeding or blunts therapeutic efficacy.`,
          recommendedAction: `Space administration or adjust dosing schedule under clinical supervision.`,
          detectedAt: new Date().toISOString(),
        });
      }
    }
  }

  return alerts;
}

/**
 * Standardizes common clinical condition strings to SNOMED CT concepts.
 */
export function normalizeConditionTerm(rawTerm: string): { code: string; display: string } {
  const term = rawTerm.trim().toLowerCase();

  if (term.includes('sugar') || term.includes('t2dm') || term.includes('type 2') || term.includes('diabetes')) {
    return { code: '44054006', display: 'Type 2 diabetes mellitus' };
  }
  if (term.includes('bp') || term.includes('htn') || term.includes('hypertension') || term.includes('high pressure')) {
    return { code: '59621000', display: 'Essential hypertension' };
  }
  if (term.includes('lipid') || term.includes('cholesterol') || term.includes('dyslipidemia')) {
    return { code: '398036000', display: 'Hypercholesterolemia' };
  }
  if (term.includes('cad') || term.includes('coronary') || term.includes('ischemic heart')) {
    return { code: '414545008', display: 'Ischemic heart disease' };
  }
  if (term.includes('asthma') || term.includes('bronchial')) {
    return { code: '195967001', display: 'Asthma' };
  }
  if (term.includes('gerd') || term.includes('reflux') || term.includes('acidity')) {
    return { code: '235595009', display: 'Gastroesophageal reflux disease' };
  }

  return { code: '404684003', display: rawTerm };
}
