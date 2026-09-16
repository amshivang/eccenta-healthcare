// src/lib/medicine-master.ts
export interface MasterMedicine {
  name: string;
  genericName: string;
  manufacturer: string;
  category: string;
  form: string;
  defaultPrice: number;
  description: string;
  keywords: string[];
}

export const MEDICINE_MASTER_CATALOG: MasterMedicine[] = [
  // --- PAIN RELIEF, FEVER & ANTI-INFLAMMATORY ---
  {
    name: "Dolo 650mg",
    genericName: "Paracetamol (Acetaminophen) 650mg",
    manufacturer: "Micro Labs",
    category: "Pain & Fever",
    form: "Tablet",
    defaultPrice: 32.50,
    description: "Fast-acting analgesic and antipyretic for high fever, severe headache, and body aches.",
    keywords: ["fever", "headache", "body ache", "paracetamol", "dolo", "pain", "temperature"]
  },
  {
    name: "Crocin 500mg",
    genericName: "Paracetamol 500mg",
    manufacturer: "GlaxoSmithKline (GSK)",
    category: "Pain & Fever",
    form: "Tablet",
    defaultPrice: 18.00,
    description: "Gentle and reliable fever reducer and pain reliever.",
    keywords: ["fever", "mild pain", "headache", "crocin", "paracetamol", "flu"]
  },
  {
    name: "Crocin 650 Advance",
    genericName: "Paracetamol 650mg with Optizorb",
    manufacturer: "GSK",
    category: "Pain & Fever",
    form: "Tablet",
    defaultPrice: 34.00,
    description: "Fast-absorbing paracetamol formula with Optizorb technology.",
    keywords: ["fever", "severe fever", "headache", "body pain", "crocin advance"]
  },
  {
    name: "Calpol 500mg",
    genericName: "Paracetamol 500mg",
    manufacturer: "GSK",
    category: "Pain & Fever",
    form: "Tablet",
    defaultPrice: 17.50,
    description: "Standard antipyretic and analgesic for fever and pain.",
    keywords: ["fever", "calpol", "paracetamol", "body pain"]
  },
  {
    name: "Combiflam",
    genericName: "Ibuprofen 400mg + Paracetamol 325mg",
    manufacturer: "Sanofi India",
    category: "Pain & Fever",
    form: "Tablet",
    defaultPrice: 42.00,
    description: "Dual-action relief for severe toothache, muscular pain, fever, and arthritis flare-ups.",
    keywords: ["toothache", "muscle pain", "joint pain", "headache", "fever", "combiflam", "inflammation"]
  },
  {
    name: "Zerodol-P",
    genericName: "Aceclofenac 100mg + Paracetamol 325mg",
    manufacturer: "Ipca Laboratories",
    category: "Pain & Fever",
    form: "Tablet",
    defaultPrice: 65.00,
    description: "Potent NSAID combination for acute musculoskeletal pain, spondylitis, and post-injury swelling.",
    keywords: ["back pain", "joint pain", "neck pain", "arthritis", "zerodol", "swelling"]
  },
  {
    name: "Zerodol-SP",
    genericName: "Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg",
    manufacturer: "Ipca Laboratories",
    category: "Pain & Fever",
    form: "Tablet",
    defaultPrice: 115.00,
    description: "Triple-action anti-inflammatory with proteolytic enzyme to rapidly resolve severe tissue swelling and trauma.",
    keywords: ["severe pain", "swelling", "post surgery", "injury", "fracture pain", "zerodol sp"]
  },
  {
    name: "Meftal-Spas",
    genericName: "Mefenamic Acid 250mg + Dicyclomine HCl 10mg",
    manufacturer: "Blue Cross Labs",
    category: "Pain & Fever",
    form: "Tablet",
    defaultPrice: 52.00,
    description: "Effective antispasmodic for menstrual cramps, stomach spasms, and colicky abdominal pain.",
    keywords: ["period pain", "menstrual cramps", "stomach cramp", "abdominal pain", "meftal spas", "spasm"]
  },
  {
    name: "Cyclopam",
    genericName: "Dicyclomine 20mg + Paracetamol 500mg",
    manufacturer: "Indoco Remedies",
    category: "Pain & Fever",
    form: "Tablet",
    defaultPrice: 58.00,
    description: "Relieves intestinal cramps, intestinal colic, and spasmodic abdominal pain.",
    keywords: ["stomach ache", "cramp", "intestinal pain", "cyclopam", "spasm"]
  },
  {
    name: "Disprin Regular",
    genericName: "Aspirin (Acetylsalicylic Acid) 350mg",
    manufacturer: "Reckitt Benckiser",
    category: "Pain & Fever",
    form: "Effervescent Tablet",
    defaultPrice: 15.00,
    description: "Soluble aspirin for rapid relief from acute tension headaches, toothache, and migraines.",
    keywords: ["headache", "migraine", "disprin", "aspirin", "fast relief", "toothache"]
  },
  {
    name: "Ecosprin 75mg",
    genericName: "Aspirin Gastro-resistant 75mg",
    manufacturer: "USV Ltd",
    category: "Cardiac & BP",
    form: "Tablet",
    defaultPrice: 6.50,
    description: "Low-dose blood thinner to prevent heart attacks, stroke, and arterial blood clots.",
    keywords: ["blood thinner", "heart", "aspirin", "ecosprin", "cardiac", "stroke prevention"]
  },
  {
    name: "Ecosprin 150mg",
    genericName: "Aspirin 150mg",
    manufacturer: "USV Ltd",
    category: "Cardiac & BP",
    form: "Tablet",
    defaultPrice: 11.00,
    description: "Antiplatelet therapy for cardiovascular protection post-angioplasty or stent.",
    keywords: ["blood thinner", "heart protection", "cardiac", "ecosprin 150"]
  },

  // --- GASTRO, ACIDITY, PPIs & DIGESTION ---
  {
    name: "Pan 40mg",
    genericName: "Pantoprazole Sodium 40mg",
    manufacturer: "Alkem Laboratories",
    category: "Gastro & Acidity",
    form: "Tablet",
    defaultPrice: 155.00,
    description: "Gold standard Proton Pump Inhibitor for GERD, acid reflux, and stomach ulcers.",
    keywords: ["acidity", "gas", "heartburn", "acid reflux", "gerd", "stomach burning", "pan 40", "pantoprazole"]
  },
  {
    name: "Pan-D",
    genericName: "Pantoprazole 40mg + Domperidone 30mg SR",
    manufacturer: "Alkem Laboratories",
    category: "Gastro & Acidity",
    form: "Capsule",
    defaultPrice: 198.00,
    description: "Sustained release combination for severe acid reflux accompanied by nausea, bloating, and vomiting.",
    keywords: ["acidity", "nausea", "gas", "bloating", "pan d", "acid reflux", "morning sickness"]
  },
  {
    name: "Pantocid 40",
    genericName: "Pantoprazole 40mg",
    manufacturer: "Sun Pharma",
    category: "Gastro & Acidity",
    form: "Tablet",
    defaultPrice: 160.00,
    description: "Controls excessive gastric acid secretion and prevents NSAID-induced ulcers.",
    keywords: ["acidity", "gastric ulcer", "pantocid", "pantoprazole"]
  },
  {
    name: "Pantocid DSR",
    genericName: "Pantoprazole 40mg + Domperidone 30mg SR",
    manufacturer: "Sun Pharma",
    category: "Gastro & Acidity",
    form: "Capsule",
    defaultPrice: 215.00,
    description: "Dual acid-suppression and prokinetic relief for severe GERD and reflux esophagitis.",
    keywords: ["acidity", "gas", "vomiting sensation", "pantocid dsr", "gerd"]
  },
  {
    name: "Omez 20mg",
    genericName: "Omeprazole 20mg",
    manufacturer: "Dr. Reddy's Laboratories",
    category: "Gastro & Acidity",
    form: "Capsule",
    defaultPrice: 58.00,
    description: "Trusted PPI for fast heartburn relief and prevention of gastric ulcers.",
    keywords: ["heartburn", "acidity", "ulcer", "omeprazole", "omez", "gas"]
  },
  {
    name: "Omez-D",
    genericName: "Omeprazole 20mg + Domperidone 10mg",
    manufacturer: "Dr. Reddy's",
    category: "Gastro & Acidity",
    form: "Capsule",
    defaultPrice: 85.00,
    description: "Addresses acid hypersecretion combined with delayed stomach emptying.",
    keywords: ["acidity", "belching", "bloating", "omez d", "nausea"]
  },
  {
    name: "Rablet 20",
    genericName: "Rabeprazole Sodium 20mg",
    manufacturer: "Lupin",
    category: "Gastro & Acidity",
    form: "Tablet",
    defaultPrice: 95.00,
    description: "Fast-acting rabeprazole for rapid acid suppression within 1 hour.",
    keywords: ["acidity", "rapid relief", "rabeprazole", "rablet", "chest burning"]
  },
  {
    name: "Razo-D",
    genericName: "Rabeprazole 20mg + Domperidone 30mg SR",
    manufacturer: "Dr. Reddy's",
    category: "Gastro & Acidity",
    form: "Capsule",
    defaultPrice: 175.00,
    description: "Rapid relief from heartburn, indigestion, and indigestion-induced nausea.",
    keywords: ["acidity", "razo d", "rabeprazole", "gas", "indigestion"]
  },
  {
    name: "Digene Gel Mint 200ml",
    genericName: "Magnesium Hydroxide + Aluminium Hydroxide + Simethicone",
    manufacturer: "Abbott India",
    category: "Gastro & Acidity",
    form: "Syrup",
    defaultPrice: 145.00,
    description: "Antacid liquid for instant cooling relief from burning stomach and flatulence.",
    keywords: ["acidity syrup", "digene", "heartburn", "gas syrup", "instant antacid", "stomach burn"]
  },
  {
    name: "Gelusil MPS Liquid 200ml",
    genericName: "Aluminium Hydroxide + Magnesium Hydroxide + Dimethicone",
    manufacturer: "Pfizer India",
    category: "Gastro & Acidity",
    form: "Syrup",
    defaultPrice: 138.00,
    description: "Soothing antacid suspension for relief from gas, acidity, and bloated belly.",
    keywords: ["gelusil", "acidity", "gas", "bloating", "antacid suspension"]
  },
  {
    name: "Eno Fruit Salt (Lemon)",
    genericName: "Sodium Bicarbonate + Citric Acid",
    manufacturer: "GSK",
    category: "Gastro & Acidity",
    form: "Sachet",
    defaultPrice: 9.00,
    description: "Gets to work in 6 seconds against sudden acidity and heaviness.",
    keywords: ["eno", "acidity", "gas sachet", "instant relief", "indigestion"]
  },
  {
    name: "Pudinhara Pearls",
    genericName: "Mentha Piperita (Pudina Extract)",
    manufacturer: "Dabur India",
    category: "Gastro & Acidity",
    form: "Capsule",
    defaultPrice: 30.00,
    description: "Natural herbal carminative for gas, stomach ache, and mild indigestion.",
    keywords: ["pudinhara", "stomach pain", "gas", "herbal antacid", "dabur"]
  },
  {
    name: "Cremaffin Syrup 225ml",
    genericName: "Liquid Paraffin + Milk of Magnesia",
    manufacturer: "Abbott",
    category: "Gastro & Acidity",
    form: "Syrup",
    defaultPrice: 220.00,
    description: "Gentle overnight laxative emulsion for chronic constipation and piles comfort.",
    keywords: ["constipation", "laxative", "cremaffin", "stool softener", "piles"]
  },
  {
    name: "Dulcolax 5mg",
    genericName: "Bisacodyl 5mg",
    manufacturer: "Sanofi",
    category: "Gastro & Acidity",
    form: "Tablet",
    defaultPrice: 12.00,
    description: "Stimulant laxative providing dependable constipation relief within 6 to 8 hours.",
    keywords: ["constipation", "dulcolax", "laxative tablet", "hard stool"]
  },
  {
    name: "Looz Syrup 200ml",
    genericName: "Lactulose 10g/15ml",
    manufacturer: "Intas Pharma",
    category: "Gastro & Acidity",
    form: "Syrup",
    defaultPrice: 240.00,
    description: "Osmotic laxative safe for long-term management of constipation and hepatic encephalopathy.",
    keywords: ["lactulose", "constipation", "looz", "gentle laxative"]
  },
  {
    name: "Isabgol Husk 100g",
    genericName: "Psyllium Husk 100%",
    manufacturer: "Baidyanath",
    category: "Gastro & Acidity",
    form: "Powder",
    defaultPrice: 110.00,
    description: "Natural dietary fiber to regularize bowel movements and improve gut microbiota.",
    keywords: ["isabgol", "fiber", "constipation", "digestion", "natural"]
  },

  // --- ANTIBIOTICS & ANTI-INFECTIVES ---
  {
    name: "Augmentin 625 Duo",
    genericName: "Amoxicillin 500mg + Clavulanic Acid 125mg",
    manufacturer: "GSK",
    category: "Antibiotics",
    form: "Tablet",
    defaultPrice: 205.00,
    description: "Broad-spectrum beta-lactamase resistant antibiotic for chest, sinus, dental, and skin infections.",
    keywords: ["antibiotic", "amoxicillin", "clavulanate", "augmentin", "dental infection", "chest infection", "throat infection"]
  },
  {
    name: "Clavam 625",
    genericName: "Amoxicillin 500mg + Potassium Clavulanate 125mg",
    manufacturer: "Alkem Laboratories",
    category: "Antibiotics",
    form: "Tablet",
    defaultPrice: 195.00,
    description: "High-grade antibiotic for ENT, respiratory tract, and urinary tract bacterial infections.",
    keywords: ["antibiotic", "clavam", "bacterial infection", "ear infection", "pneumonia"]
  },
  {
    name: "Azithral 500",
    genericName: "Azithromycin 500mg",
    manufacturer: "Alembic Pharma",
    category: "Antibiotics",
    form: "Tablet",
    defaultPrice: 120.00,
    description: "Macrolide antibiotic 3-day course for bronchitis, pharyngitis, sinusitis, and typhoid fever.",
    keywords: ["azithromycin", "azithral", "throat pain", "cough infection", "tonsils", "antibiotic"]
  },
  {
    name: "Azee 500",
    genericName: "Azithromycin 500mg",
    manufacturer: "Cipla",
    category: "Antibiotics",
    form: "Tablet",
    defaultPrice: 118.00,
    description: "Standard therapy for upper and lower respiratory tract bacterial infections.",
    keywords: ["azee", "azithromycin", "antibiotic", "sore throat", "bronchitis"]
  },
  {
    name: "Ciplox 500",
    genericName: "Ciprofloxacin 500mg",
    manufacturer: "Cipla",
    category: "Antibiotics",
    form: "Tablet",
    defaultPrice: 48.00,
    description: "Fluoroquinolone antibiotic for severe UTI, bacterial diarrhea, and typhoid fever.",
    keywords: ["ciplox", "ciprofloxacin", "uti", "urine infection", "diarrhea", "typhoid", "antibiotic"]
  },
  {
    name: "Zifi 200",
    genericName: "Cefixime 200mg",
    manufacturer: "FDC Ltd",
    category: "Antibiotics",
    form: "Tablet",
    defaultPrice: 108.00,
    description: "Third-generation cephalosporin for uncomplicated urinary tract infections, gonorrhea, and otitis media.",
    keywords: ["zifi", "cefixime", "fever infection", "uti", "antibiotic", "ear pain"]
  },
  {
    name: "Taxim-O 200",
    genericName: "Cefixime 200mg",
    manufacturer: "Alkem Laboratories",
    category: "Antibiotics",
    form: "Tablet",
    defaultPrice: 112.00,
    description: "Oral cephalosporin for resistant bacterial bronchitis and urinary infections.",
    keywords: ["taxim o", "cefixime", "antibiotic", "fever", "respiratory"]
  },
  {
    name: "Metrogyl 400",
    genericName: "Metronidazole 400mg",
    manufacturer: "J.B. Chemicals",
    category: "Antibiotics",
    form: "Tablet",
    defaultPrice: 22.00,
    description: "Antiprotozoal and anaerobic antibiotic for amoebiasis, loose motions, and dental abscesses.",
    keywords: ["metrogyl", "loose motion", "stomach infection", "dysentery", "diarrhea", "dental abscess"]
  },
  {
    name: "Norflox TZ",
    genericName: "Norfloxacin 400mg + Tinidazole 600mg",
    manufacturer: "Cipla",
    category: "Antibiotics",
    form: "Tablet",
    defaultPrice: 98.00,
    description: "Combined therapy for acute infectious diarrhea, food poisoning, and gastrointestinal infections.",
    keywords: ["loose motion", "food poisoning", "norflox tz", "diarrhea", "stomach cramps"]
  },
  {
    name: "Doxicip 100",
    genericName: "Doxycycline 100mg",
    manufacturer: "Cipla",
    category: "Antibiotics",
    form: "Capsule",
    defaultPrice: 45.00,
    description: "Broad-spectrum tetracycline for acne vulgaris, rickettsia, cholera, and respiratory infections.",
    keywords: ["doxycycline", "acne", "pimples", "doxicip", "skin infection", "malaria prophylaxis"]
  },

  // --- ALLERGY, COUGH, COLD & RESPIRATORY ---
  {
    name: "Allegra 120mg",
    genericName: "Fexofenadine Hydrochloride 120mg",
    manufacturer: "Sanofi India",
    category: "Cold & Allergy",
    form: "Tablet",
    defaultPrice: 198.00,
    description: "Non-drowsy second-generation antihistamine for seasonal allergic rhinitis, sneezing, and hives.",
    keywords: ["allegra", "allergy", "fexofenadine", "sneezing", "skin allergy", "non drowsy", "runny nose"]
  },
  {
    name: "Allegra 180mg",
    genericName: "Fexofenadine 180mg",
    manufacturer: "Sanofi India",
    category: "Cold & Allergy",
    form: "Tablet",
    defaultPrice: 245.00,
    description: "Maximum-strength non-sedating relief for chronic urticaria (severe itching and skin welts).",
    keywords: ["severe allergy", "itching", "urticaria", "allegra 180", "hives"]
  },
  {
    name: "Cetzine 10mg",
    genericName: "Cetirizine Hydrochloride 10mg",
    manufacturer: "GSK",
    category: "Cold & Allergy",
    form: "Tablet",
    defaultPrice: 24.00,
    description: "Prompt relief from runny nose, watering eyes, allergic rashes, and insect bites.",
    keywords: ["cetirizine", "cetzine", "cold", "runny nose", "sneezing", "itching", "allergy"]
  },
  {
    name: "Okacet",
    genericName: "Cetirizine 10mg",
    manufacturer: "Cipla",
    category: "Cold & Allergy",
    form: "Tablet",
    defaultPrice: 20.00,
    description: "Everyday antihistamine for quick control of allergic symptoms.",
    keywords: ["okacet", "cetirizine", "allergy", "cold"]
  },
  {
    name: "Montair-LC",
    genericName: "Levocetirizine 5mg + Montelukast 10mg",
    manufacturer: "Cipla",
    category: "Cold & Allergy",
    form: "Tablet",
    defaultPrice: 190.00,
    description: "Leukotriene receptor antagonist plus antihistamine for allergic asthma and persistent rhinitis.",
    keywords: ["montair lc", "breathing allergy", "dust allergy", "asthma allergy", "running nose", "cough"]
  },
  {
    name: "Monticope",
    genericName: "Levocetirizine + Montelukast",
    manufacturer: "Mankind Pharma",
    category: "Cold & Allergy",
    form: "Tablet",
    defaultPrice: 145.00,
    description: "Prevents nighttime asthma symptoms, seasonal allergies, and bronchial constriction.",
    keywords: ["monticope", "asthma", "allergy", "levocetirizine", "montelukast"]
  },
  {
    name: "Avil 25mg",
    genericName: "Pheniramine Maleate 25mg",
    manufacturer: "Sanofi",
    category: "Cold & Allergy",
    form: "Tablet",
    defaultPrice: 12.00,
    description: "Classic fast-acting antihistamine for sudden food or drug allergies and motion sickness.",
    keywords: ["avil", "drug allergy", "food allergy", "itching", "motion sickness", "vomiting traveling"]
  },
  {
    name: "Sinarest New",
    genericName: "Paracetamol + Phenylephrine + Chlorpheniramine",
    manufacturer: "Centaur Pharma",
    category: "Cold & Allergy",
    form: "Tablet",
    defaultPrice: 65.00,
    description: "Complete formula for cold: unblocks nasal congestion, stops sneezing, and soothes fever and headache.",
    keywords: ["sinarest", "cold", "blocked nose", "fever and cold", "runny nose", "sinus headache"]
  },
  {
    name: "Cheston Cold",
    genericName: "Cetirizine + Paracetamol + Phenylephrine",
    manufacturer: "Cipla",
    category: "Cold & Allergy",
    form: "Tablet",
    defaultPrice: 52.00,
    description: "All-in-one remedy for feverish colds, heavy head, and congested sinuses.",
    keywords: ["cheston cold", "cold", "fever", "stuffy nose", "cipla cold"]
  },
  {
    name: "Ascoril-D Plus Syrup 100ml",
    genericName: "Dextromethorphan + Phenylephrine + Chlorpheniramine",
    manufacturer: "Glenmark",
    category: "Cold & Allergy",
    form: "Syrup",
    defaultPrice: 135.00,
    description: "Dry cough suppressor liquid: quietens tickly non-productive coughing without burning.",
    keywords: ["dry cough", "cough syrup", "ascoril d", "throat tickle", "non productive cough"]
  },
  {
    name: "Ascoril-LS Syrup 100ml",
    genericName: "Levosalbutamol + Ambroxol + Guaiphenesin",
    manufacturer: "Glenmark",
    category: "Cold & Allergy",
    form: "Syrup",
    defaultPrice: 125.00,
    description: "Mucolytic expectorant: liquefies sticky phlegm and expands airways for chesty, wet coughs.",
    keywords: ["wet cough", "phlegm", "chest congestion", "ascoril ls", "expectorant", "cough syrup"]
  },
  {
    name: "Benadryl Cough Syrup 100ml",
    genericName: "Diphenhydramine + Ammonium Chloride + Sodium Citrate",
    manufacturer: "Johnson & Johnson",
    category: "Cold & Allergy",
    form: "Syrup",
    defaultPrice: 110.00,
    description: "Soothing nighttime cough syrup for irritating cough and scratchy throat.",
    keywords: ["benadryl", "cough syrup", "throat irritation", "soothing cough", "cough"]
  },
  {
    name: "Alex Syrup 100ml",
    genericName: "Dextromethorphan + Chlorpheniramine + Phenylephrine",
    manufacturer: "Glenmark",
    category: "Cold & Allergy",
    form: "Syrup",
    defaultPrice: 130.00,
    description: "Pleasant-tasting dry cough formula for continuous coughing bouts.",
    keywords: ["alex syrup", "dry cough", "cough", "throat tickle"]
  },
  {
    name: "Grilinctus Syrup 100ml",
    genericName: "Dextromethorphan + Chlorpheniramine + Guaifenesin",
    manufacturer: "Franco-Indian",
    category: "Cold & Allergy",
    form: "Syrup",
    defaultPrice: 120.00,
    description: "Reliable cough suppressant and expectorant for all types of seasonal coughs.",
    keywords: ["grilinctus", "cough syrup", "throat infection", "cough"]
  },
  {
    name: "Otrivin Oxy Fast Relief Nasal Spray 10ml",
    genericName: "Oxymetazoline Hydrochloride 0.05%",
    manufacturer: "GSK",
    category: "Cold & Allergy",
    form: "Drops",
    defaultPrice: 105.00,
    description: "Unblocks stuffy nose within 25 seconds; provides up to 12 hours of easy breathing.",
    keywords: ["otrivin", "nasal spray", "blocked nose", "stuffy nose", "sinus relief", "breathing drops"]
  },
  {
    name: "Asthalin Inhaler 100mcg",
    genericName: "Salbutamol 100mcg (200 MDI doses)",
    manufacturer: "Cipla",
    category: "Cold & Allergy",
    form: "Inhaler",
    defaultPrice: 165.00,
    description: "Quick-relief bronchodilator rescue inhaler for asthma attacks, wheezing, and COPD shortness of breath.",
    keywords: ["asthma", "inhaler", "salbutamol", "asthalin", "wheezing", "breathlessness", "emergency inhaler"]
  },
  {
    name: "Budecort 200 Inhaler",
    genericName: "Budesonide 200mcg",
    manufacturer: "Cipla",
    category: "Cold & Allergy",
    form: "Inhaler",
    defaultPrice: 380.00,
    description: "Inhaled corticosteroid maintenance therapy to reduce airway inflammation and prevent asthma episodes.",
    keywords: ["budecort", "asthma prevention", "inhaler", "corticosteroid", "budesonide"]
  },
  {
    name: "Foracort 200 Rotacaps",
    genericName: "Formoterol 6mcg + Budesonide 200mcg",
    manufacturer: "Cipla",
    category: "Cold & Allergy",
    form: "Inhaler",
    defaultPrice: 285.00,
    description: "Long-acting bronchodilator plus steroid for moderate to severe persistent asthma control.",
    keywords: ["foracort", "rotacaps", "asthma inhaler", "breathlessness", "copd"]
  },

  // --- CARDIAC, BLOOD PRESSURE & CHOLESTEROL ---
  {
    name: "Telma 40mg",
    genericName: "Telmisartan 40mg",
    manufacturer: "Glenmark Pharmaceuticals",
    category: "Cardiac & BP",
    form: "Tablet",
    defaultPrice: 135.00,
    description: "Angiotensin Receptor Blocker for primary hypertension and cardiovascular risk reduction.",
    keywords: ["telmisartan", "telma 40", "high blood pressure", "hypertension", "bp medicine", "cardiac"]
  },
  {
    name: "Telma-H",
    genericName: "Telmisartan 40mg + Hydrochlorothiazide 12.5mg",
    manufacturer: "Glenmark",
    category: "Cardiac & BP",
    form: "Tablet",
    defaultPrice: 175.00,
    description: "Combination antihypertensive with thiazide diuretic for uncontrolled high blood pressure.",
    keywords: ["telma h", "high bp", "water retention", "blood pressure", "telmisartan hydrochlorothiazide"]
  },
  {
    name: "Telmikind 40",
    genericName: "Telmisartan 40mg",
    manufacturer: "Mankind Pharma",
    category: "Cardiac & BP",
    form: "Tablet",
    defaultPrice: 48.00,
    description: "Economical quality telmisartan for chronic blood pressure regulation.",
    keywords: ["telmikind", "bp", "blood pressure", "telmisartan", "mankind"]
  },
  {
    name: "Amlong 5mg",
    genericName: "Amlodipine Besylate 5mg",
    manufacturer: "Micro Labs",
    category: "Cardiac & BP",
    form: "Tablet",
    defaultPrice: 45.00,
    description: "Calcium Channel Blocker for hypertension and chronic stable angina (chest pain).",
    keywords: ["amlodipine", "amlong", "high bp", "angina", "chest pressure"]
  },
  {
    name: "Metolar 25",
    genericName: "Metoprolol Succinate 25mg ER",
    manufacturer: "Cipla",
    category: "Cardiac & BP",
    form: "Tablet",
    defaultPrice: 92.00,
    description: "Beta-blocker for tachycardia, heart rate control, hypertension, and post-infarction care.",
    keywords: ["metoprolol", "metolar", "heart rate", "palpitations", "beta blocker", "cardiac"]
  },
  {
    name: "Atorva 10mg",
    genericName: "Atorvastatin 10mg",
    manufacturer: "Zydus Cadila",
    category: "Cardiac & BP",
    form: "Tablet",
    defaultPrice: 95.00,
    description: "HMG-CoA reductase inhibitor to lower LDL cholesterol, triglycerides, and prevent plaque buildup.",
    keywords: ["cholesterol", "atorvastatin", "atorva", "lipid", "heart health", "triglycerides"]
  },
  {
    name: "Atorva 20mg",
    genericName: "Atorvastatin 20mg",
    manufacturer: "Zydus Cadila",
    category: "Cardiac & BP",
    form: "Tablet",
    defaultPrice: 165.00,
    description: "Higher-strength statin for patients with dyslipidemia and high cardiac risk.",
    keywords: ["high cholesterol", "atorva 20", "heart plaque", "statin"]
  },
  {
    name: "Rosuvas 10",
    genericName: "Rosuvastatin 10mg",
    manufacturer: "Sun Pharma",
    category: "Cardiac & BP",
    form: "Tablet",
    defaultPrice: 195.00,
    description: "High-intensity statin proven to significantly elevate HDL ('good') and clear LDL cholesterol.",
    keywords: ["rosuvastatin", "rosuvas", "cholesterol", "sun pharma", "statin"]
  },
  {
    name: "Clopilet 75",
    genericName: "Clopidogrel 75mg",
    manufacturer: "Sun Pharma",
    category: "Cardiac & BP",
    form: "Tablet",
    defaultPrice: 140.00,
    description: "Antiplatelet drug preventing dangerous blood clots after stents, bypass, or stroke.",
    keywords: ["clopidogrel", "clopilet", "blood clot", "stent", "blood thinner"]
  },

  // --- DIABETES & THYROID ---
  {
    name: "Glycomet 500mg",
    genericName: "Metformin Hydrochloride 500mg",
    manufacturer: "USV Ltd",
    category: "Diabetes",
    form: "Tablet",
    defaultPrice: 26.00,
    description: "First-line oral antidiabetic improving insulin sensitivity and controlling HbA1c in Type 2 diabetes.",
    keywords: ["diabetes", "sugar", "metformin", "glycomet", "blood sugar", "hba1c"]
  },
  {
    name: "Glycomet-GP 1",
    genericName: "Metformin 500mg + Glimepiride 1mg",
    manufacturer: "USV Ltd",
    category: "Diabetes",
    form: "Tablet",
    defaultPrice: 72.00,
    description: "Dual therapy to stimulate pancreatic insulin secretion and enhance peripheral glucose uptake.",
    keywords: ["diabetes", "sugar tablet", "glycomet gp", "glimepiride metformin", "type 2 diabetes"]
  },
  {
    name: "Glycomet-GP 2",
    genericName: "Metformin 500mg + Glimepiride 2mg",
    manufacturer: "USV Ltd",
    category: "Diabetes",
    form: "Tablet",
    defaultPrice: 105.00,
    description: "Advanced dual therapy for persistent hyperglycemia in Type 2 diabetics.",
    keywords: ["sugar medicine", "glycomet gp 2", "glimepiride 2mg", "diabetes"]
  },
  {
    name: "Amaryl 2mg",
    genericName: "Glimepiride 2mg",
    manufacturer: "Sanofi",
    category: "Diabetes",
    form: "Tablet",
    defaultPrice: 165.00,
    description: "Potent sulfonylurea triggering natural pancreatic insulin release with meals.",
    keywords: ["glimepiride", "amaryl", "diabetes", "sugar"]
  },
  {
    name: "Januvia 100mg",
    genericName: "Sitagliptin 100mg",
    manufacturer: "MSD Pharmaceuticals",
    category: "Diabetes",
    form: "Tablet",
    defaultPrice: 420.00,
    description: "DPP-4 inhibitor regulating post-meal blood sugars without causing weight gain or hypoglycemia.",
    keywords: ["januvia", "sitagliptin", "diabetes", "dpp4 inhibitor", "blood sugar"]
  },
  {
    name: "Galvus 50mg",
    genericName: "Vildagliptin 50mg",
    manufacturer: "Novartis",
    category: "Diabetes",
    form: "Tablet",
    defaultPrice: 320.00,
    description: "Incretin enhancer to optimize glycemic balance.",
    keywords: ["galvus", "vildagliptin", "diabetes", "sugar control"]
  },
  {
    name: "Forxiga 10mg",
    genericName: "Dapagliflozin 10mg",
    manufacturer: "AstraZeneca",
    category: "Diabetes",
    form: "Tablet",
    defaultPrice: 620.00,
    description: "SGLT2 inhibitor expelling surplus glucose through urine with renal and cardiac protection benefits.",
    keywords: ["forxiga", "dapagliflozin", "sugar excretion", "kidney protection diabetes", "sglt2"]
  },
  {
    name: "Human Mixtard 30/70 40IU/ml",
    genericName: "Biphasic Isophane Insulin",
    manufacturer: "Novo Nordisk",
    category: "Diabetes",
    form: "Injection",
    defaultPrice: 195.00,
    description: "Balanced dual-acting insulin providing baseline and mealtime glucose control.",
    keywords: ["insulin", "mixtard", "sugar injection", "diabetes insulin", "novo nordisk"]
  },
  {
    name: "Lantus Solostar Pen 100IU/ml",
    genericName: "Insulin Glargine",
    manufacturer: "Sanofi",
    category: "Diabetes",
    form: "Injection",
    defaultPrice: 790.00,
    description: "Once-daily ultra-long acting peakless basal insulin in convenient disposable prefilled pen.",
    keywords: ["lantus", "glargine", "insulin pen", "once daily insulin", "diabetes"]
  },
  {
    name: "Thyronorm 50mcg",
    genericName: "Levothyroxine Sodium 50mcg",
    manufacturer: "Abbott",
    category: "Diabetes",
    form: "Tablet",
    defaultPrice: 155.00,
    description: "Daily thyroid hormone replacement for hypothyroidism, fatigue, and thyroid gland regulation.",
    keywords: ["thyroid", "thyronorm", "hypothyroidism", "tsh", "levothyroxine", "weight gain thyroid"]
  },
  {
    name: "Thyronorm 100mcg",
    genericName: "Levothyroxine Sodium 100mcg",
    manufacturer: "Abbott",
    category: "Diabetes",
    form: "Tablet",
    defaultPrice: 175.00,
    description: "Full replacement thyroid therapy taken empty stomach in the morning.",
    keywords: ["thyroid 100", "thyronorm 100", "levothyroxine", "tsh high"]
  },
  {
    name: "Eltroxin 50mcg",
    genericName: "Thyroxine Sodium 50mcg",
    manufacturer: "GSK",
    category: "Diabetes",
    form: "Tablet",
    defaultPrice: 145.00,
    description: "Synthetic thyroxine compensating for thyroid deficiency.",
    keywords: ["eltroxin", "thyroid", "thyroxine", "tsh"]
  },

  // --- ANTI-EMETICS, MOTION SICKNESS & STOMACH INFECTIONS ---
  {
    name: "Ondem 4mg",
    genericName: "Ondansetron 4mg",
    manufacturer: "Alkem",
    category: "Gastro & Acidity",
    form: "Tablet",
    defaultPrice: 52.00,
    description: "Rapidly silences severe nausea, vomiting, stomach bug nausea, and post-chemo sickness.",
    keywords: ["vomiting", "nausea", "ondansetron", "ondem", "ultee", "stomach bug"]
  },
  {
    name: "Emeset 4mg",
    genericName: "Ondansetron 4mg",
    manufacturer: "Cipla",
    category: "Gastro & Acidity",
    form: "Tablet",
    defaultPrice: 48.00,
    description: "5-HT3 receptor blocker stopping vomiting signals to the brain.",
    keywords: ["vomiting tablet", "emeset", "nausea", "food poisoning vomiting"]
  },
  {
    name: "Domstal 10mg",
    genericName: "Domperidone 10mg",
    manufacturer: "Torrent Pharma",
    category: "Gastro & Acidity",
    form: "Tablet",
    defaultPrice: 38.00,
    description: "Prokinetic agent to stop nausea, indigestion fullness, and gastroesophageal reflux.",
    keywords: ["nausea", "domstal", "domperidone", "indigestion", "belching"]
  },
  {
    name: "Lopamide 2mg",
    genericName: "Loperamide Hydrochloride 2mg",
    manufacturer: "Torrent Pharma",
    category: "Gastro & Acidity",
    form: "Tablet",
    defaultPrice: 25.00,
    description: "Fast antidiarrheal slowing gut motility to stop acute loose motions.",
    keywords: ["loose motion", "diarrhea", "loperamide", "lopamide", "stomach upset"]
  },
  {
    name: "Electral Powder 21.8g",
    genericName: "Oral Rehydration Salts (WHO Formula)",
    manufacturer: "FDC Ltd",
    category: "Gastro & Acidity",
    form: "Sachet",
    defaultPrice: 22.00,
    description: "WHO approved isotonic oral electrolyte solution restoring hydration lost in diarrhea and heat.",
    keywords: ["ors", "electral", "hydration", "electrolytes", "dehydration", "loose motion", "weakness"]
  },

  // --- FIRST AID, ANTISEPTICS & TOPICAL PAIN ---
  {
    name: "Betadine 10% Ointment 20g",
    genericName: "Povidone Iodine 10% w/w",
    manufacturer: "Win-Medicare",
    category: "First Aid & Skin",
    form: "Ointment",
    defaultPrice: 110.00,
    description: "Broad-spectrum microbicidal antiseptic protecting cuts, abrasions, burns, and surgical wounds.",
    keywords: ["betadine", "antiseptic", "povidone iodine", "wound", "cut", "injury", "infection cream"]
  },
  {
    name: "Soframycin Skin Cream 30g",
    genericName: "Framycetin Sulphate 1% w/w",
    manufacturer: "Sanofi India",
    category: "First Aid & Skin",
    form: "Cream",
    defaultPrice: 65.00,
    description: "Antibacterial topical cream healing cuts, scrapes, superficial burns, and skin ulcers.",
    keywords: ["soframycin", "wound cream", "burns", "scratches", "skin infection", "antibiotic cream"]
  },
  {
    name: "Burnol Cream 20g",
    genericName: "Aminacrine HCl + Cetrimide",
    manufacturer: "Dr. Morepen",
    category: "First Aid & Skin",
    form: "Cream",
    defaultPrice: 85.00,
    description: "Immediate relief and cooling antiseptic action on kitchen burns, scalds, and minor abrasions.",
    keywords: ["burnol", "burns", "skin burn", "scalds", "antiseptic cream"]
  },
  {
    name: "Volini Pain Relief Gel 50g",
    genericName: "Diclofenac Diethylamine + Linseed Oil + Methyl Salicylate + Menthol",
    manufacturer: "Sun Pharma",
    category: "First Aid & Skin",
    form: "Gel",
    defaultPrice: 165.00,
    description: "Deep penetrating formula for rapid relief from sprains, backaches, neck stiffness, and joint pain.",
    keywords: ["volini", "pain gel", "back pain", "sprain", "joint pain", "muscle spray", "moov alternative"]
  },
  {
    name: "Moov Pain Relief Spray 50g",
    genericName: "Oil of Wintergreen + Mint Extract + Turpentine Oil + Eucalyptus",
    manufacturer: "Reckitt Benckiser",
    category: "First Aid & Skin",
    form: "Spray",
    defaultPrice: 185.00,
    description: "100% Ayurvedic fast warming spray for lower back ache, shoulder pain, and sports sprains.",
    keywords: ["moov", "pain spray", "backache", "sprain", "ayurvedic pain", "quick relief"]
  },
  {
    name: "Iodex Balm 40g",
    genericName: "Gandhapuro Oil + Pudina ka Phool + Nilgiri Oil",
    manufacturer: "GSK",
    category: "First Aid & Skin",
    form: "Balm",
    defaultPrice: 145.00,
    description: "Warm soothing balm providing deep comfort against musculoskeletal pain and blunt injury.",
    keywords: ["iodex", "balm", "body pain", "joint ache", "swelling"]
  },
  {
    name: "Dettol Antiseptic Liquid 250ml",
    genericName: "Chloroxylenol (C8H9ClO)",
    manufacturer: "Reckitt Benckiser",
    category: "First Aid & Skin",
    form: "Liquid",
    defaultPrice: 125.00,
    description: "Standard disinfectant for first aid wound cleansing, personal hygiene, and surface protection.",
    keywords: ["dettol", "antiseptic", "wound wash", "disinfectant", "first aid"]
  },
  {
    name: "Savlon Antiseptic Liquid 250ml",
    genericName: "Chlorhexidine Gluconate + Cetrimide",
    manufacturer: "ITC Ltd",
    category: "First Aid & Skin",
    form: "Liquid",
    defaultPrice: 115.00,
    description: "Zero-sting antiseptic formula for gentle wound care and infection prevention.",
    keywords: ["savlon", "antiseptic", "no sting", "wound cleaning", "first aid liquid"]
  },

  // --- ANTIFUNGAL & DERMATOLOGY ---
  {
    name: "Candid Dusting Powder 100g",
    genericName: "Clotrimazole 1% w/w",
    manufacturer: "Glenmark",
    category: "First Aid & Skin",
    form: "Powder",
    defaultPrice: 145.00,
    description: "India's #1 antifungal powder for prickly heat, jock itch, athlete's foot, and skin sweat rash.",
    keywords: ["fungal powder", "candid", "clotrimazole", "itching powder", "jock itch", "sweat rash"]
  },
  {
    name: "Surfaz-SN Cream 15g",
    genericName: "Clotrimazole + Betamethasone + Neomycin",
    manufacturer: "Franco-Indian",
    category: "First Aid & Skin",
    form: "Cream",
    defaultPrice: 85.00,
    description: "Triple protection against inflamed, itchy, fungal and bacterial skin infections.",
    keywords: ["itching", "ringworm", "fungal cream", "surfaz", "skin rash"]
  },
  {
    name: "Itaspor 100mg",
    genericName: "Itraconazole 100mg",
    manufacturer: "Intas Pharma",
    category: "First Aid & Skin",
    form: "Capsule",
    defaultPrice: 165.00,
    description: "Systemic oral antifungal treating stubborn ringworm, tinea corporis, and fungal nail infections.",
    keywords: ["itraconazole", "fungal tablet", "itaspor", "ringworm", "dhad", "severe itching"]
  },
  {
    name: "Forcan 150mg",
    genericName: "Fluconazole 150mg",
    manufacturer: "Cipla",
    category: "First Aid & Skin",
    form: "Tablet",
    defaultPrice: 16.00,
    description: "Single-dose oral antifungal for vaginal candidiasis, oral thrush, and cutaneous fungal flareups.",
    keywords: ["fluconazole", "forcan", "fungal infection", "yeast infection", "itching"]
  },
  {
    name: "Betnovate-C Cream 30g",
    genericName: "Betamethasone 0.1% + Clioquinol 3%",
    manufacturer: "GSK",
    category: "First Aid & Skin",
    form: "Cream",
    defaultPrice: 65.00,
    description: "Potent anti-inflammatory steroid cream for resistant eczema, psoriasis, and severe dermatitis.",
    keywords: ["eczema", "betnovate c", "skin redness", "itching cream", "steroid cream"]
  },
  {
    name: "Betnovate-N Cream 20g",
    genericName: "Betamethasone Valerate + Neomycin Sulphate",
    manufacturer: "GSK",
    category: "First Aid & Skin",
    form: "Cream",
    defaultPrice: 55.00,
    description: "Addresses bacterial-infected eczema, allergic skin lesions, and localized inflammation.",
    keywords: ["betnovate n", "skin allergy", "insect bite swelling", "dermatitis"]
  },

  // --- VITAMINS, MINERALS & NUTRITION ---
  {
    name: "Becosules Z Capsules",
    genericName: "B-Complex + Vitamin C + Zinc",
    manufacturer: "Pfizer",
    category: "Vitamins & Supplements",
    form: "Capsule",
    defaultPrice: 52.00,
    description: "Essential multivitamin combating mouth ulcers, physical fatigue, and replenishing daily B-vitamins.",
    keywords: ["mouth ulcer", "weakness", "becosules", "b complex", "vitamin b", "zinc", "energy"]
  },
  {
    name: "Limcee 500mg Chewable",
    genericName: "Vitamin C (Ascorbic Acid) 500mg",
    manufacturer: "Abbott",
    category: "Vitamins & Supplements",
    form: "Tablet",
    defaultPrice: 28.00,
    description: "Tasty orange chewable antioxidant boosting immune defenses, collagen synthesis, and iron absorption.",
    keywords: ["vitamin c", "limcee", "immunity", "skin glow", "antioxidant", "cold resistance"]
  },
  {
    name: "Shelcal 500mg",
    genericName: "Calcium Carbonate 1250mg (Eq to 500mg Calcium) + Vitamin D3 250IU",
    manufacturer: "Torrent Pharma",
    category: "Vitamins & Supplements",
    form: "Tablet",
    defaultPrice: 125.00,
    description: "High-absorption calcium supplement strengthening bones, teeth, and preventing osteoporosis.",
    keywords: ["calcium", "shelcal", "vitamin d3", "bone strength", "joint weakness", "osteoporosis"]
  },
  {
    name: "Calcirol 60K Sachet 1g",
    genericName: "Cholecalciferol (Vitamin D3) 60,000 IU",
    manufacturer: "Cadila Pharma",
    category: "Vitamins & Supplements",
    form: "Sachet",
    defaultPrice: 62.00,
    description: "Once-weekly high-potency Vitamin D3 granule sachet overcoming chronic Vitamin D deficiency.",
    keywords: ["vitamin d3", "calcirol", "60000 iu", "bone pain", "deficiency", "weekly sachet"]
  },
  {
    name: "Neurobion Forte",
    genericName: "Vitamin B1 + B2 + B3 + B5 + B6 + B12 (Cyanocobalamin)",
    manufacturer: "Procter & Gamble (P&G)",
    category: "Vitamins & Supplements",
    form: "Tablet",
    defaultPrice: 38.00,
    description: "Specialized neurotropic vitamin formulation relieving nerve numbness, tingling, and diabetic neuropathy.",
    keywords: ["nerve pain", "numbness", "tingling sensation", "neurobion forte", "vitamin b12", "cyanocobalamin"]
  },
  {
    name: "Zincovit Tablet",
    genericName: "Multivitamin + Multimineral with Grape Seed Extract",
    manufacturer: "Apex Laboratories",
    category: "Vitamins & Supplements",
    form: "Tablet",
    defaultPrice: 110.00,
    description: "Comprehensive daily immunity and vitality booster with essential trace minerals and grape seed antioxidants.",
    keywords: ["multivitamin", "zincovit", "immunity", "appetite", "energy", "vitamins"]
  },
  {
    name: "Revital H Daily Health",
    genericName: "Ginseng + 10 Vitamins + 9 Minerals",
    manufacturer: "Sun Pharma",
    category: "Vitamins & Supplements",
    form: "Capsule",
    defaultPrice: 120.00,
    description: "Combats day-long fatigue, enhances stamina, and sharpens mental concentration with Korean Ginseng.",
    keywords: ["revital", "energy capsule", "stamina", "ginseng", "weakness", "active life"]
  },
  {
    name: "Liv.52 DS",
    genericName: "Himsra + Kasani Ayurvedic Hepatoprotective Formulation",
    manufacturer: "Himalaya Wellness",
    category: "Vitamins & Supplements",
    form: "Tablet",
    defaultPrice: 175.00,
    description: "Double-strength herbal liver tonic guarding against toxins, improving appetite, and aiding digestion.",
    keywords: ["liv 52", "liver tonic", "himalaya", "appetite", "fatty liver", "jaundice recovery"]
  },

  // --- EYE & EAR DROPS ---
  {
    name: "Ciplox Eye/Ear Drops 10ml",
    genericName: "Ciprofloxacin 0.3% w/v",
    manufacturer: "Cipla",
    category: "First Aid & Skin",
    form: "Drops",
    defaultPrice: 20.00,
    description: "Sterile antibacterial solution for pink eye (conjunctivitis), corneal ulcers, and outer ear canal infections.",
    keywords: ["eye drops", "ear drops", "ciplox", "conjunctivitis", "red eyes", "eye infection", "ear infection"]
  },
  {
    name: "Refresh Tears Eye Drops 10ml",
    genericName: "Carboxymethylcellulose Sodium 0.5%",
    manufacturer: "Allergan",
    category: "First Aid & Skin",
    form: "Drops",
    defaultPrice: 165.00,
    description: "Preservative-free artificial tear lubricant soothing dry, burning, computer-screen irritated eyes.",
    keywords: ["dry eyes", "refresh tears", "eye drops", "computer vision", "burning eyes", "lubricant drops"]
  },
  {
    name: "Waxolve Ear Drops 10ml",
    genericName: "Paradichlorobenzene + Benzocaine + Chlorbutol + Turpentine Oil",
    manufacturer: "Cadila",
    category: "First Aid & Skin",
    form: "Drops",
    defaultPrice: 85.00,
    description: "Cerumenolytic ear drops to painlessly dissolve and loosen hardened impacted ear wax.",
    keywords: ["ear wax", "ear drops", "ear blockage", "ear cleaning", "waxolve"]
  },
  {
    name: "Ozempic 0.5mg/1mg Pen",
    genericName: "Semaglutide",
    manufacturer: "Novo Nordisk",
    category: "Diabetes & Endocrine",
    form: "Pre-filled Pen",
    defaultPrice: 8500.00,
    description: "GLP-1 receptor agonist indicated for type 2 diabetes and glycemic control.",
    keywords: ["ozempic", "semaglutide", "diabetes", "weight", "sugar", "insulin", "glp-1"]
  }
];
