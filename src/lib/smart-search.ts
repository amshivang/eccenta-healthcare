export const ALL_SPECIALIZATIONS = [
  "Cardiologist",
  "Cardiology",
  "Dermatologist",
  "Dermatology",
  "Orthopedic",
  "Orthopedics",
  "Gynecologist",
  "Gynecology",
  "Pediatrician",
  "Pediatrics",
  "Neurologist",
  "Neurology",
  "ENT Specialist",
  "ENT",
  "Psychiatrist",
  "Psychiatry",
  "General Physician",
  "Ophthalmologist",
  "Ophthalmology",
  "Oncologist",
  "Oncology",
  "Physiotherapist",
  "Physiotherapy",
  "Dentist",
  "Dentistry",
  "Gastroenterologist",
  "Gastroenterology",
  "Pulmonologist",
  "Pulmonology",
  "Urologist",
  "Ayurveda Specialist",
  "Homeopathic Specialist"
];

export const SYNONYM_MAP: Record<string, string> = {
  "heart doctor": "Cardiologist",
  "cardiologist": "Cardiologist",
  "chest pain": "Cardiologist",
  "heart attack": "Cardiologist",
  "palpitations": "Cardiologist",
  "blood pressure": "Cardiologist",
  "hypertension": "Cardiologist",
  
  "skin doctor": "Dermatologist",
  "dermatologist": "Dermatologist",
  "pimple": "Dermatologist",
  "acne": "Dermatologist",
  "hair fall": "Dermatologist",
  "rash": "Dermatologist",
  "eczema": "Dermatologist",
  "dandruff": "Dermatologist",
  "skin tag": "Dermatologist",
  
  "child doctor": "Pediatrician",
  "pediatrician": "Pediatrician",
  "baby doctor": "Pediatrician",
  "infant care": "Pediatrician",
  "vaccination": "Pediatrician",
  "kid fever": "Pediatrician",
  
  "bone doctor": "Orthopedic",
  "orthopedic": "Orthopedic",
  "orthopedics": "Orthopedic",
  "joint pain": "Orthopedic",
  "back pain": "Orthopedic",
  "fracture": "Orthopedic",
  "knee pain": "Orthopedic",
  "arthritis": "Orthopedic",
  "sports injury": "Orthopedic",
  "sprain": "Orthopedic",
  
  "eye doctor": "Ophthalmologist",
  "ophthalmologist": "Ophthalmologist",
  "vision": "Ophthalmologist",
  "spectacles": "Ophthalmologist",
  "cataract": "Ophthalmologist",
  "lasik": "Ophthalmologist",
  "dry eyes": "Ophthalmologist",
  "blurred vision": "Ophthalmologist",
  
  "mental doctor": "Psychiatrist",
  "psychiatrist": "Psychiatrist",
  "depression": "Psychiatrist",
  "anxiety": "Psychiatrist",
  "stress": "Psychiatrist",
  "insomnia": "Psychiatrist",
  "bipolar": "Psychiatrist",
  "panic attack": "Psychiatrist",
  
  "brain doctor": "Neurologist",
  "neurologist": "Neurologist",
  "headache": "Neurologist",
  "migraine": "Neurologist",
  "seizure": "Neurologist",
  "stroke": "Neurologist",
  "dizziness": "Neurologist",
  "memory loss": "Neurologist",
  
  "women doctor": "Gynecologist",
  "gynecologist": "Gynecologist",
  "lady doctor": "Gynecologist",
  "pregnancy": "Gynecologist",
  "pcos": "Gynecologist",
  "periods": "Gynecologist",
  "menstruation": "Gynecologist",
  "fertility": "Gynecologist",
  "uterus": "Gynecologist",
  
  "ear doctor": "ENT Specialist",
  "nose doctor": "ENT Specialist",
  "throat": "ENT Specialist",
  "sinus": "ENT Specialist",
  "tonsils": "ENT Specialist",
  "hearing loss": "ENT Specialist",
  "ear ache": "ENT Specialist",
  
  "cancer": "Oncologist",
  "oncologist": "Oncologist",
  "tumor": "Oncologist",
  "chemo": "Oncologist",
  "radiation": "Oncologist",
  "leukemia": "Oncologist",
  
  "teeth": "Dentist",
  "dentist": "Dentist",
  "dental": "Dentist",
  "toothache": "Dentist",
  "root canal": "Dentist",
  "braces": "Dentist",
  "gum bleeding": "Dentist",
  "cavity": "Dentist",
  
  "physio": "Physiotherapist",
  "physiotherapist": "Physiotherapist",
  "rehab": "Physiotherapist",
  "muscle pain": "Physiotherapist",
  "posture": "Physiotherapist",
  "mobility": "Physiotherapist",
  
  "stomach": "Gastroenterologist",
  "gastroenterologist": "Gastroenterologist",
  "acidity": "Gastroenterologist",
  "gas": "Gastroenterologist",
  "ulcer": "Gastroenterologist",
  "liver": "Gastroenterologist",
  "jaundice": "Gastroenterologist",
  "constipation": "Gastroenterologist",
  
  "breathing": "Pulmonologist",
  "pulmonologist": "Pulmonologist",
  "lung": "Pulmonologist",
  "asthma": "Pulmonologist",
  "tb": "Pulmonologist",
  "tuberculosis": "Pulmonologist",
  "bronchitis": "Pulmonologist",
  
  "kidney": "Urologist",
  "urologist": "Urologist",
  "urine": "Urologist",
  "urinary": "Urologist",
  "dialysis": "Urologist",
  "stone": "Urologist",
  "kidney stone": "Urologist",
  
  "ayurveda": "Ayurveda Specialist",
  "ayurvedic": "Ayurveda Specialist",
  "panchakarma": "Ayurveda Specialist",
  "homeopathy": "Homeopathic Specialist",
  "homeopathic": "Homeopathic Specialist",
  
  "fever": "General Physician",
  "cold": "General Physician",
  "cough": "General Physician",
  "general": "General Physician",
  "flu": "General Physician",
  "weakness": "General Physician",
  "viral": "General Physician",
};

export function resolveSearchTerm(query: string): { resolved: string; originalQuery: string; wasResolved: boolean } {
  if (!query) {
    return { resolved: query, originalQuery: query, wasResolved: false };
  }
  
  const lowerQuery = query.toLowerCase().trim();
  
  // Direct match with specialization
  const directMatch = ALL_SPECIALIZATIONS.find(spec => spec.toLowerCase() === lowerQuery);
  if (directMatch) {
    return { resolved: directMatch, originalQuery: query, wasResolved: true };
  }

  // Synonym exact match
  if (SYNONYM_MAP[lowerQuery]) {
    return { resolved: SYNONYM_MAP[lowerQuery], originalQuery: query, wasResolved: true };
  }

  // Partial synonym match (if any word in synonym map is included in the query)
  for (const [key, value] of Object.entries(SYNONYM_MAP)) {
    if (lowerQuery.includes(key)) {
      return { resolved: value, originalQuery: query, wasResolved: true };
    }
  }

  return { resolved: query, originalQuery: query, wasResolved: false };
}

export function getAutocompleteSuggestions(query: string): string[] {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase().trim();
  const suggestions = new Set<string>();

  // Match specializations
  for (const spec of ALL_SPECIALIZATIONS) {
    if (spec.toLowerCase().includes(lowerQuery)) {
      suggestions.add(spec);
    }
  }

  // Match synonyms
  for (const [key, spec] of Object.entries(SYNONYM_MAP)) {
    if (key.includes(lowerQuery)) {
      suggestions.add(`${key} (${spec})`);
    }
  }

  return Array.from(suggestions).slice(0, 8);
}

export const SYMPTOM_TO_SPECIALIST = [
  { symptoms: ["chest pain", "shortness of breath", "palpitations"], specialist: "Cardiologist", confidence: "high" },
  { symptoms: ["high blood pressure", "dizziness"], specialist: "Cardiologist", confidence: "medium" },
  { symptoms: ["acne", "pimple", "rash", "itching"], specialist: "Dermatologist", confidence: "high" },
  { symptoms: ["hair fall", "dandruff"], specialist: "Dermatologist", confidence: "high" },
  { symptoms: ["joint pain", "swelling", "stiffness"], specialist: "Orthopedic", confidence: "high" },
  { symptoms: ["back pain", "muscle spasm"], specialist: "Orthopedic", confidence: "medium" },
  { symptoms: ["fracture", "bone injury"], specialist: "Orthopedic", confidence: "high" },
  { symptoms: ["fever", "cough", "cold"], specialist: "General Physician", confidence: "high" },
  { symptoms: ["weakness", "fatigue", "body ache"], specialist: "General Physician", confidence: "medium" },
  { symptoms: ["stomach ache", "acidity", "gas"], specialist: "Gastroenterologist", confidence: "high" },
  { symptoms: ["constipation", "diarrhea", "vomiting"], specialist: "Gastroenterologist", confidence: "high" },
  { symptoms: ["jaundice", "yellow eyes"], specialist: "Gastroenterologist", confidence: "high" },
  { symptoms: ["headache", "migraine", "nausea"], specialist: "Neurologist", confidence: "high" },
  { symptoms: ["seizure", "fainting"], specialist: "Neurologist", confidence: "high" },
  { symptoms: ["memory loss", "confusion"], specialist: "Neurologist", confidence: "medium" },
  { symptoms: ["blurred vision", "eye pain", "red eye"], specialist: "Ophthalmologist", confidence: "high" },
  { symptoms: ["vision problem", "spectacles"], specialist: "Ophthalmologist", confidence: "high" },
  { symptoms: ["ear ache", "hearing loss"], specialist: "ENT Specialist", confidence: "high" },
  { symptoms: ["sore throat", "tonsils", "difficulty swallowing"], specialist: "ENT Specialist", confidence: "high" },
  { symptoms: ["sinus", "blocked nose", "runny nose"], specialist: "ENT Specialist", confidence: "high" },
  { symptoms: ["irregular periods", "pcos"], specialist: "Gynecologist", confidence: "high" },
  { symptoms: ["pregnancy", "morning sickness"], specialist: "Gynecologist", confidence: "high" },
  { symptoms: ["heavy bleeding", "pelvic pain"], specialist: "Gynecologist", confidence: "high" },
  { symptoms: ["child fever", "kid coughing"], specialist: "Pediatrician", confidence: "high" },
  { symptoms: ["infant crying", "baby rash"], specialist: "Pediatrician", confidence: "high" },
  { symptoms: ["toothache", "bleeding gums", "cavity"], specialist: "Dentist", confidence: "high" },
  { symptoms: ["sensitivity", "jaw pain"], specialist: "Dentist", confidence: "medium" },
  { symptoms: ["breathing difficulty", "asthma", "wheezing"], specialist: "Pulmonologist", confidence: "high" },
  { symptoms: ["chronic cough", "blood in sputum"], specialist: "Pulmonologist", confidence: "high" },
  { symptoms: ["depression", "sadness", "crying spells"], specialist: "Psychiatrist", confidence: "high" },
  { symptoms: ["anxiety", "panic", "racing heart without physical cause"], specialist: "Psychiatrist", confidence: "high" },
  { symptoms: ["insomnia", "lack of sleep"], specialist: "Psychiatrist", confidence: "medium" },
  { symptoms: ["lump", "unexplained weight loss"], specialist: "Oncologist", confidence: "high" },
  { symptoms: ["post surgery stiffness", "mobility issue"], specialist: "Physiotherapist", confidence: "high" },
];

export function recommendSpecialist(symptoms: string[]): { specialist: string; confidence: string; reasoning: string } {
  if (!symptoms || symptoms.length === 0) {
    return { specialist: "General Physician", confidence: "low", reasoning: "No specific symptoms provided." };
  }

  const normalizedSymptoms = symptoms.map(s => s.toLowerCase().trim());
  let bestMatch = null;
  let maxScore = 0;

  for (const rule of SYMPTOM_TO_SPECIALIST) {
    let matchCount = 0;
    
    for (const ruleSymptom of rule.symptoms) {
      if (normalizedSymptoms.some(s => s.includes(ruleSymptom) || ruleSymptom.includes(s))) {
        matchCount++;
      }
    }

    // Weighting factor: if the rule has a 'high' confidence natively, we might bump its score
    const confidenceMultiplier = rule.confidence === "high" ? 1.5 : 1.0;
    const score = matchCount * confidenceMultiplier;

    if (score > maxScore) {
      maxScore = score;
      bestMatch = rule;
    }
  }

  if (bestMatch && maxScore > 0) {
    return {
      specialist: bestMatch.specialist,
      confidence: bestMatch.confidence,
      reasoning: `Based on your symptoms, we found matches with conditions treated by ${bestMatch.specialist}.`
    };
  }

  return {
    specialist: "General Physician",
    confidence: "low",
    reasoning: "We couldn't find a highly specific match, so starting with a General Physician is recommended."
  };
}
