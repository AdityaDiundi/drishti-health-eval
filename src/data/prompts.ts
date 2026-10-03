export interface EvaluationQuestion {
  id: string;
  dimension: 'cultural' | 'medical' | 'typography';
  dimensionTitle: string;
  question: string;
  options: {
    label: string;
    description: string;
    score: number;
  }[];
}

export interface PromptItem {
  id: string;
  category: string;
  title: string;
  prompt: string;
  rubricFocus: string;
  whyItMatters: string;
  keyVisualCheckpoints: string[];
  evaluationQuestions: EvaluationQuestion[];
}

export const PROMPTS_DATA: PromptItem[] = [
  {
    id: 'P01',
    category: 'Community Health Worker & Attire',
    title: 'ASHA Worker Counseling',
    prompt: 'An Indian ASHA worker wearing a pastel pink cotton saree with a dark blue border, holding a register and counseling a mother in a rural courtyard.',
    rubricFocus: 'Uniform Fidelity & Grassroots Interaction',
    whyItMatters: 'ASHA workers are the frontline of India’s 1.4B healthcare system. Their government-mandated pink saree with blue border is their official identity. Western models often default to generic bridal sarees or medical lab coats.',
    keyVisualCheckpoints: [
      'Correct pink saree with dark blue border (not red/bridal)',
      'Holding an official paper register/notebook',
      'Realistic rural courtyard (charpai, mud plaster or brick)',
      'Dignified, non-caricatured village interaction'
    ],
    evaluationQuestions: [
      {
        id: 'q1',
        dimension: 'cultural',
        dimensionTitle: 'ASHA Uniform & Attire Fidelity',
        question: 'Does the selected model accurately render the government-mandated pastel pink cotton saree with dark blue border?',
        options: [
          { label: 'Accurate Pink & Blue Border', description: 'Authentic ASHA uniform without bridal embellishments', score: 5 },
          { label: 'Partially Compliant', description: 'Pink saree but missing the distinct blue border or overly modern', score: 3 },
          { label: 'Severe Hallucination', description: 'Western lab coat, bridal red saree, or generic dress', score: 1 }
        ]
      },
      {
        id: 'q2',
        dimension: 'medical',
        dimensionTitle: 'Healthcare Counseling Context',
        question: 'Is the healthcare counseling context and field register portrayed realistically for a village home visit?',
        options: [
          { label: 'Realistic Rural Visit', description: 'Holding authentic paper health register/survey notebook', score: 5 },
          { label: 'Acceptable Context', description: 'Recognizable counseling but missing typical field register', score: 3 },
          { label: 'Unrealistic Setting', description: 'Futuristic hospital setup or artificial caricatured staging', score: 1 }
        ]
      },
      {
        id: 'q3',
        dimension: 'typography',
        dimensionTitle: 'Dignity & Non-Caricature Representation',
        question: 'Does the model portray the rural mother and healthcare worker with professional dignity without Western AI stereotypes?',
        options: [
          { label: 'Respectful & Dignified', description: 'Natural posture, respectful community interaction', score: 5 },
          { label: 'Moderate Stereotyping', description: 'Slightly stylized or polished stock-photo look', score: 3 },
          { label: 'Heavy Caricature / Artifacts', description: 'Distorted facial features, limbs, or exaggerated poverty', score: 1 }
        ]
      }
    ]
  },
  {
    id: 'P02',
    category: 'Rural Healthcare Infrastructure',
    title: 'Primary Health Centre (PHC) Interior',
    prompt: 'Interior of an Indian village Primary Health Centre (PHC) with green distemper walls, a wooden desk with a stainless steel water jug, and immunization charts on the wall.',
    rubricFocus: 'Public Clinic Realism vs Western Tropes',
    whyItMatters: 'Rural PHCs have distinct architecture: pistachio-green distemper paint, steel water vessels, and specific MoHFW bilingual vaccination posters. Models should not hallucinate private high-tech Western clinics.',
    keyVisualCheckpoints: [
      'Pistachio/light green distemper wall paint',
      'Traditional stainless steel water jug (surahi or cylindrical)',
      'Government immunization schedules on walls',
      'Modest wooden clinic furniture'
    ],
    evaluationQuestions: [
      {
        id: 'q1',
        dimension: 'cultural',
        dimensionTitle: 'Rural PHC Architectural Realism',
        question: 'Does the clinic room exhibit authentic Indian PHC architecture (pistachio-green distemper walls, simple ceiling fan)?',
        options: [
          { label: 'Authentic Green PHC', description: 'True to Indian public health sub-centre architectural norms', score: 5 },
          { label: 'Generic Asian Clinic', description: 'Basic clinic but lacking distinctive Indian distemper wall colors', score: 3 },
          { label: 'Western Hospital Hallucination', description: 'Private luxury corporate clinic or glass-walled room', score: 1 }
        ]
      },
      {
        id: 'q2',
        dimension: 'medical',
        dimensionTitle: 'Equipment & Fixtures Grounding',
        question: 'Are standard Indian public clinic fixtures (stainless steel water surahi, wooden desk) present?',
        options: [
          { label: 'Faithful Steel Fixtures', description: 'Traditional stainless steel jug/tumbler on wooden doctor desk', score: 5 },
          { label: 'Basic Fixtures', description: 'Standard desk but missing traditional water vessel', score: 3 },
          { label: 'Distorted / Missing', description: 'Western plastic water dispensers or high-tech digital consoles', score: 1 }
        ]
      },
      {
        id: 'q3',
        dimension: 'typography',
        dimensionTitle: 'Public Health Poster Plausibility',
        question: 'Are wall charts representative of Indian National Health Mission (NHM) immunization schedules?',
        options: [
          { label: 'Authentic NHM Posters', description: 'Bilingual health wall charts with recognizable color blocks', score: 5 },
          { label: 'Generic Medical Signs', description: 'Vague medical diagrams without Indian public health identity', score: 3 },
          { label: 'Severe Distortion', description: 'Illegible pseudo-Latin symbols or blank clinical walls', score: 1 }
        ]
      }
    ]
  },
  {
    id: 'P03',
    category: 'Regional Typography & IEC Material',
    title: 'Hindi Public Health Wall Painting',
    prompt: "A public health awareness wall painting on a rural Indian village mud wall with the Hindi text 'साफ पानी, स्वस्थ जीवन' clearly legible.",
    rubricFocus: 'Devanagari Non-Latin Typography',
    whyItMatters: 'Public health IEC in India relies overwhelmingly on village wall murals painted in regional scripts. Generative AI frequently mangles Devanagari matras and conjunct consonants into unreadable squiggles.',
    keyVisualCheckpoints: [
      "Legible Devanagari script: 'साफ पानी, स्वस्थ जीवन' (Clean Water, Healthy Life)",
      'Correct matras (ी, ्र, etc.) without gibberish characters',
      'Village wall texture (mud/brick whitewashed backdrop)',
      'Authentic hand-painted mural aesthetic'
    ],
    evaluationQuestions: [
      {
        id: 'q1',
        dimension: 'typography',
        dimensionTitle: 'Devanagari Orthographic Legibility',
        question: "Is the Hindi phrase 'साफ पानी, स्वस्थ जीवन' rendered with correct Devanagari characters and matras?",
        options: [
          { label: 'Flawless Devanagari', description: 'Completely readable Hindi text without spelling or conjunct flaws', score: 5 },
          { label: 'Partially Readable', description: 'Recognizable Hindi words but minor matra or ligature glitches', score: 3 },
          { label: 'Unreadable Gibberish', description: 'Hallucinated faux-Devanagari squiggles or English substitution', score: 1 }
        ]
      },
      {
        id: 'q2',
        dimension: 'cultural',
        dimensionTitle: 'Village IEC Wall Painting Aesthetic',
        question: 'Does the wall mural reflect genuine rural Indian public health information campaigns (IEC)?',
        options: [
          { label: 'Authentic Village Mural', description: 'Hand-painted block lettering on whitewashed mud/brick wall', score: 5 },
          { label: 'Digital Print Look', description: 'Looks like a modern printed vinyl banner rather than a wall painting', score: 3 },
          { label: 'Urban Graffiti / Inauthentic', description: 'Western street art style completely unnatural to Indian villages', score: 1 }
        ]
      },
      {
        id: 'q3',
        dimension: 'medical',
        dimensionTitle: 'Health Awareness Communication',
        question: 'Does the visual artwork convey clean drinking water and sanitation messaging clearly?',
        options: [
          { label: 'Clear Public Health Message', description: 'Cohesive illustration reinforcing the clean water slogan', score: 5 },
          { label: 'Vague Graphic', description: 'Water drop or pot illustration but disconnected from health context', score: 3 },
          { label: 'Confusing / Contradictory', description: 'No clear health context or misleading visual artifacts', score: 1 }
        ]
      }
    ]
  },
  {
    id: 'P04',
    category: 'Child Nutrition & Growth Monitoring',
    title: 'Anganwadi Salter Scale Growth Check',
    prompt: 'An Anganwadi worker weighing a rural Indian toddler in a blue hanging salter scale while the grandmother watches closely under an open village veranda.',
    rubricFocus: 'Grassroots Diagnostic Equipment',
    whyItMatters: 'Under POSHAN Abhiyaan, Anganwadi centers track stunting and wasting using hanging spring Salter scales. Models frequently generate standard baby weighing pans or modern digital hospital cradles.',
    keyVisualCheckpoints: [
      'Hanging spring Salter scale with sling/harness for toddler',
      'Anganwadi worker operating the scale carefully',
      'Multi-generational rural family (grandmother watching)',
      'Village veranda (baramda) setting'
    ],
    evaluationQuestions: [
      {
        id: 'q1',
        dimension: 'medical',
        dimensionTitle: 'Salter Scale Equipment Fidelity',
        question: 'Is the toddler being weighed using an authentic blue hanging spring Salter scale with weighing pants/sling?',
        options: [
          { label: 'Correct Hanging Salter Scale', description: 'Accurate tubular spring scale suspended from beam/ceiling', score: 5 },
          { label: 'Generic Scale', description: 'Weighing scale present but non-standard form factor', score: 3 },
          { label: 'Incorrect Western Cradle', description: 'Digital tabletop infant scale or western clinic crib', score: 1 }
        ]
      },
      {
        id: 'q2',
        dimension: 'cultural',
        dimensionTitle: 'Multi-Generational Kinship Realism',
        question: 'Does the image naturally portray the rural grandmother and Anganwadi worker relationship?',
        options: [
          { label: 'Authentic Village Kinship', description: 'Natural grandmother figure in traditional rural attire watching protectively', score: 5 },
          { label: 'Acceptable Depiction', description: 'Characters present but somewhat stylized or generic', score: 3 },
          { label: 'Awkward / Distorted', description: 'Facial deformities, missing figures, or anatomical glitches', score: 1 }
        ]
      },
      {
        id: 'q3',
        dimension: 'typography',
        dimensionTitle: 'Anganwadi Center Environment',
        question: 'Is the open veranda (baramda) setting representative of rural Anganwadi community centres?',
        options: [
          { label: 'True Village Veranda', description: 'Baramda with rustic pillars, clay tiles, and village courtyard backdrop', score: 5 },
          { label: 'Basic Room', description: 'Generic room without distinct rural architectural context', score: 3 },
          { label: 'Artificial / Inaccurate', description: 'Western day-care center or high-tech institutional nursery', score: 1 }
        ]
      }
    ]
  },
  {
    id: 'P05',
    category: 'Immunization & Cold Chain',
    title: 'Village Immunization Day (VHSND)',
    prompt: 'A rural Indian immunization session where an Auxiliary Nurse Midwife (ANM) prepares an injection from a blue ice-lined vaccine carrier box in a village schoolroom.',
    rubricFocus: 'Cold-Chain Logistics & Protocol',
    whyItMatters: 'India’s Universal Immunization Programme relies on portable blue cold-boxes with four conditioned ice-packs to keep vaccines between 2°C and 8°C in remote villages.',
    keyVisualCheckpoints: [
      'Standard blue rectangular insulated vaccine carrier box',
      'ANM in professional nursing attire preparing vaccine vial',
      'Repurposed village schoolroom or community hall setting',
      'Cold-chain realism (vials, ice-packs, safety box)'
    ],
    evaluationQuestions: [
      {
        id: 'q1',
        dimension: 'medical',
        dimensionTitle: 'Cold-Chain Vaccine Box Fidelity',
        question: 'Is the blue ice-lined vaccine carrier box rendered with correct form factor (rectangular hard-plastic insulated cold box)?',
        options: [
          { label: 'Accurate MoHFW Vaccine Carrier', description: 'Classic blue rectangular cold box with carry strap', score: 5 },
          { label: 'Generic Cooler', description: 'Blue box but resembles a picnic cooler or generic lunchbox', score: 3 },
          { label: 'Incorrect / Hallucinated', description: 'Metallic sci-fi canister, refrigeration appliance, or missing', score: 1 }
        ]
      },
      {
        id: 'q2',
        dimension: 'cultural',
        dimensionTitle: 'ANM Grassroots Healthcare Attire',
        question: 'Is the Auxiliary Nurse Midwife (ANM) dressed in appropriate Indian public health clinical attire?',
        options: [
          { label: 'Authentic ANM Attire', description: 'Professional nurse saree or lab coat over salwar kameez', score: 5 },
          { label: 'Acceptable Uniform', description: 'Generic nurse scrubs or medical uniform', score: 3 },
          { label: 'Inappropriate Attire', description: 'Casual home clothes, bridal dress, or surgeon scrubs', score: 1 }
        ]
      },
      {
        id: 'q3',
        dimension: 'typography',
        dimensionTitle: 'VHSND Village Session Realism',
        question: 'Does the scene convey an authentic Village Health Sanitation and Nutrition Day (VHSND) session?',
        options: [
          { label: 'Authentic VHSND Setup', description: 'Village classroom blackboard, desks, mothers waiting with infants', score: 5 },
          { label: 'Basic Clinic Room', description: 'Simple room with medical supplies but missing community vibe', score: 3 },
          { label: 'Clinical Hospital Ward', description: 'Intensive care ward or sterile private surgery room', score: 1 }
        ]
      }
    ]
  },
  {
    id: 'P06',
    category: 'Rural Sanitation & Clean Water',
    title: 'Boiled Drinking Water & Clean Chulha',
    prompt: 'An Indian rural woman boiling drinking water in a traditional brass pot over a clean smokeless chulha in a rustic village courtyard kitchen.',
    rubricFocus: 'Rural Hygiene & Clean Energy Realism',
    whyItMatters: 'Waterborne diseases cause significant pediatric mortality in rural India. Boiling water and adopting clean cooking stoves (smokeless chulha / Ujjwala) are primary health campaign targets.',
    keyVisualCheckpoints: [
      'Traditional brass or earthen pot on a smokeless clay stove',
      'Clean rustic courtyard kitchen (earthen utensils, firewood/cowdung cakes neatly stacked)',
      'Authentic village attire without exaggerated poverty tropes',
      'Boiling steam and sanitary handling'
    ],
    evaluationQuestions: [
      {
        id: 'q1',
        dimension: 'cultural',
        dimensionTitle: 'Smokeless Chulha & Cookware Authenticity',
        question: 'Does the stove reflect an improved/smokeless chulha or clean village cookstove with authentic brass/earthen cookware?',
        options: [
          { label: 'Authentic Clean Cookstove', description: 'Well-molded clay smokeless chulha with traditional degchi/handi', score: 5 },
          { label: 'Traditional Open Chulha', description: 'Regular smoky 3-stone fire rather than clean improved stove', score: 3 },
          { label: 'Modern Western Kitchen', description: 'Electric induction cooktop or modern stainless steel modular kitchen', score: 1 }
        ]
      },
      {
        id: 'q2',
        dimension: 'medical',
        dimensionTitle: 'Water Sanitation & Hygiene Representation',
        question: 'Is the water boiling depicted realistically as a public health water purification practice?',
        options: [
          { label: 'Clear Boiling Process', description: 'Visible steam, sanitary water handling, and clean storage vessels', score: 5 },
          { label: 'Moderate Realism', description: 'Pot on heat but unclear whether water boiling is intended', score: 3 },
          { label: 'Unsanitary Depiction', description: 'Visible contamination, filthy water handling, or confusing food prep', score: 1 }
        ]
      },
      {
        id: 'q3',
        dimension: 'typography',
        dimensionTitle: 'Dignity in Rural Household Depiction',
        question: 'Does the scene maintain human dignity without falling into sensationalized poverty-porn stereotypes?',
        options: [
          { label: 'Dignified & Tidy', description: 'Clean rural courtyard, organized firewood, proud homemaker', score: 5 },
          { label: 'Acceptable', description: 'Standard rustic setting with minor AI stock-photo polish', score: 3 },
          { label: 'Exaggerated Squallor', description: 'Artificially filthy environment or caricatured despair', score: 1 }
        ]
      }
    ]
  },
  {
    id: 'P07',
    category: 'Geriatric Screening & NCDs',
    title: 'Blood Pressure Check at Ayushman Arogya Mandir',
    prompt: 'An elderly Indian village farmer having his blood pressure checked with a sphygmomanometer by a Community Health Officer inside an Ayushman Bharat Health and Wellness Centre.',
    rubricFocus: 'Non-Communicable Diseases (NCD) & Branding',
    whyItMatters: 'With hypertension rising across rural India, 160,000+ Health & Wellness Centres (Ayushman Arogya Mandirs) provide free NCD screening to rural elders.',
    keyVisualCheckpoints: [
      'Elderly farmer with turban/gamchha and weathered countenance',
      'Community Health Officer with BP cuff / sphygmomanometer',
      'Ayushman Arogya Mandir / Health & Wellness Centre ambiance',
      'Empathetic doctor-patient rapport'
    ],
    evaluationQuestions: [
      {
        id: 'q1',
        dimension: 'medical',
        dimensionTitle: 'Clinical BP Sphygmomanometer Accuracy',
        question: 'Is the Community Health Officer operating a clinically plausible BP cuff and sphygmomanometer/stethoscope?',
        options: [
          { label: 'Clinically Accurate BP Setup', description: 'Proper arm cuff placement and realistic sphygmomanometer/gauge', score: 5 },
          { label: 'Partially Realistic', description: 'BP apparatus visible but cuff placement slightly loose or awkward', score: 3 },
          { label: 'Severe Hallucination', description: 'Tubes attached nowhere, distorted limbs, or fictional digital devices', score: 1 }
        ]
      },
      {
        id: 'q2',
        dimension: 'cultural',
        dimensionTitle: 'Elderly Rural Farmer Identity',
        question: 'Does the elderly patient accurately represent a North/Central Indian rural farmer (gamchha/kurta/turban)?',
        options: [
          { label: 'Authentic Farmer Demographics', description: 'Weathered dignified farmer in kurta and cotton gamchha', score: 5 },
          { label: 'Generic Elder', description: 'Generic older man lacking specific rural Indian attire', score: 3 },
          { label: 'Westernized / Cartoonish', description: 'Western elderly man or caricature with exaggerated AI features', score: 1 }
        ]
      },
      {
        id: 'q3',
        dimension: 'typography',
        dimensionTitle: 'Ayushman Arogya Mandir Setting',
        question: 'Does the health facility capture the branding and cleanliness of Ayushman Bharat Health & Wellness Centres?',
        options: [
          { label: 'Faithful Ayushman Centre', description: 'Branded color palette, clinical examination couch, NCD register', score: 5 },
          { label: 'Basic Clinic Room', description: 'Generic clinical examination room without specific branding', score: 3 },
          { label: 'Western ER / Dilapidated Shed', description: 'High-tech American ER or crumbling inaccurate shack', score: 1 }
        ]
      }
    ]
  },
  {
    id: 'P08',
    category: 'Vector Control & Community Education',
    title: 'Chaupal Dengue Prevention Flipchart',
    prompt: 'A village community meeting gathered under a banyan tree, where a community health worker shows a flipchart explaining dengue prevention and eliminating stagnant water.',
    rubricFocus: 'Community Dynamics & Educational Aids',
    whyItMatters: 'The village chaupal (tree gathering) is India’s most influential grassroots decision-making space. IEC campaigns succeed when health workers use visual flipcharts to mobilize community action.',
    keyVisualCheckpoints: [
      'Large shaded banyan tree with village elders and women gathered',
      'Health educator presenting a clear visual flipchart/poster',
      'Graphic showing mosquito larva or stagnant water containers',
      'Natural, engaged rural crowd posture'
    ],
    evaluationQuestions: [
      {
        id: 'q1',
        dimension: 'cultural',
        dimensionTitle: 'Banyan Tree Chaupal Assembly Realism',
        question: 'Does the meeting reflect an authentic Indian village chaupal gathered respectfully under a banyan tree?',
        options: [
          { label: 'Authentic Village Chaupal', description: 'Broad banyan canopy, aerial roots, elders on charpai/mats', score: 5 },
          { label: 'Generic Outdoor Gathering', description: 'People under a tree but missing cultural chaupal composition', score: 3 },
          { label: 'Western Park Meeting', description: 'Picnic bench setting or synthetic European park scenery', score: 1 }
        ]
      },
      {
        id: 'q2',
        dimension: 'typography',
        dimensionTitle: 'Dengue Vector IEC Flipchart Clarity',
        question: 'Does the flipchart educational aid clearly demonstrate mosquito breeding / stagnant water prevention?',
        options: [
          { label: 'Clear Vector Control Graphic', description: 'Visible mosquito lifecycle or inverted water container diagram', score: 5 },
          { label: 'Vague Health Chart', description: 'Color blocks or diagrams but mosquito subject matter is ambiguous', score: 3 },
          { label: 'Blank / Distorted Canvas', description: 'Blank flipchart or chaotic scribbles with no educational message', score: 1 }
        ]
      },
      {
        id: 'q3',
        dimension: 'medical',
        dimensionTitle: 'Community Engagement & Participation',
        question: 'Are village men, women, and community health leaders depicted participating attentively?',
        options: [
          { label: 'Engaged Community Members', description: 'Attentive, respectful village audience listening to the health worker', score: 5 },
          { label: 'Neutral Crowd', description: 'Passive background figures with minor rendering repetitions', score: 3 },
          { label: 'Distorted Multi-Limb Crowd', description: 'Severe crowd AI artifacts (fused faces, mutant hands)', score: 1 }
        ]
      }
    ]
  },
  {
    id: 'P09',
    category: 'Digital Health & Telemedicine',
    title: 'E-Sanjeevani Teleconsultation in Panchayat',
    prompt: 'A rural Indian telemedicine consultation where a village patient speaks to a doctor displayed on a tablet computer inside a gram panchayat office.',
    rubricFocus: 'Digital Public Infrastructure (eSanjeevani)',
    whyItMatters: 'India’s eSanjeevani platform is the world’s largest national telemedicine system. Teleconsultations happen via tablets in Gram Panchayat offices assisted by village health facilitators.',
    keyVisualCheckpoints: [
      'Doctor in white coat visible on tablet screen interface',
      'Rural patient seated in a village panchayat hall',
      'Assisted digital healthcare interaction',
      'Official panchayat register, Indian flag, or government stationery'
    ],
    evaluationQuestions: [
      {
        id: 'q1',
        dimension: 'medical',
        dimensionTitle: 'eSanjeevani Telemedicine Workflow',
        question: 'Is the tablet telemedicine consultation depicted with believable digital healthcare ergonomics?',
        options: [
          { label: 'Authentic Teleconsultation', description: 'Doctor clearly visible on video call screen giving medical advice', score: 5 },
          { label: 'Basic Tablet Setup', description: 'Tablet visible but screen interface is blank or ambiguous', score: 3 },
          { label: 'Futuristic Sci-Fi Gadget', description: 'Holograms, transparent screens, or non-functional props', score: 1 }
        ]
      },
      {
        id: 'q2',
        dimension: 'cultural',
        dimensionTitle: 'Gram Panchayat Office Setting',
        question: 'Does the room feel like an authentic Indian Gram Panchayat or CSC (Common Service Centre) office?',
        options: [
          { label: 'Faithful Panchayat Office', description: 'Government registers, notice boards, wooden tables, official stationery', score: 5 },
          { label: 'Generic Office', description: 'Simple desk room without specific rural Indian governance cues', score: 3 },
          { label: 'Silicon Valley Tech Office', description: 'Ultra-modern glass cubicle or luxury boardroom', score: 1 }
        ]
      },
      {
        id: 'q3',
        dimension: 'typography',
        dimensionTitle: 'Digital Inclusion & Assisted Interaction',
        question: 'Does the scene realistically capture digital health delivery for rural citizens?',
        options: [
          { label: 'Assisted Digital Delivery', description: 'Community health worker or VLE assisting patient with technology', score: 5 },
          { label: 'Solo Patient Interaction', description: 'Patient alone using tablet reasonably well', score: 3 },
          { label: 'Confused / Distorted', description: 'Unnatural hand poses, mangled tablet proportions', score: 1 }
        ]
      }
    ]
  },
  {
    id: 'P10',
    category: 'Essential Drug Supply & Packaging',
    title: 'Rural Clinic Medicine Dispensary',
    prompt: 'A neatly arranged medicine dispensary shelf in a rural government clinic stocked with labeled blister strips of Paracetamol, ORS sachets, and Iron Folic Acid tablets.',
    rubricFocus: 'Pharmaceutical Realism (Generic Medicine Packaging)',
    whyItMatters: 'Government dispensaries provide standardized generic blister strips and ORS sachets. Models must depict realistic Indian generic pharma packaging rather than western prescription pill bottles.',
    keyVisualCheckpoints: [
      'Foil blister strips with blue/red lettering',
      'Bilingual ORS (Oral Rehydration Salts) sachets',
      'Iron & Folic Acid (IFA) small red/blue strips',
      'Numbered wooden/metal dispensary shelving'
    ],
    evaluationQuestions: [
      {
        id: 'q1',
        dimension: 'medical',
        dimensionTitle: 'Indian Generic Pharma Packaging Realism',
        question: 'Are medicines packaged in authentic Indian generic foil blister strips and ORS paper/foil sachets?',
        options: [
          { label: 'Authentic Blister Strips & ORS', description: 'Silver foil blister packs and recognizable ORS powder sachets', score: 5 },
          { label: 'Generic Medicine Packs', description: 'Pills in boxes but missing distinct Indian blister strip aesthetic', score: 3 },
          { label: 'Western Amber Pill Bottles', description: 'American orange prescription vials with childproof white caps', score: 1 }
        ]
      },
      {
        id: 'q2',
        dimension: 'typography',
        dimensionTitle: 'Pharmaceutical Strip Typography & Labels',
        question: 'Are medicine labels and blister backing text rendered cleanly without severe character hallucination?',
        options: [
          { label: 'Clean Pharma Typography', description: 'Crisp bilingual/English drug names and dosage indications', score: 5 },
          { label: 'Plausible Medicine Pattern', description: 'Looks like pharmaceutical strip text with minor blur/artifacts', score: 3 },
          { label: 'Severe Gibberish / Melting Text', description: 'Alien illegible characters, melting foil, or glitched stripes', score: 1 }
        ]
      },
      {
        id: 'q3',
        dimension: 'cultural',
        dimensionTitle: 'Rural Public Clinic Pharmacy Ambiance',
        question: 'Does the dispensary shelving reflect an authentic Indian government PHC/CHC drug store?',
        options: [
          { label: 'Authentic PHC Dispensary', description: 'Modular metal/wooden racks with organized public healthcare supplies', score: 5 },
          { label: 'Standard Retail Chemist', description: 'Looks more like a commercial private pharmacy shop', score: 3 },
          { label: 'Industrial Chemical Lab', description: 'Sterile chemical warehouse or high-tech automated pharmacy', score: 1 }
        ]
      }
    ]
  }
];

export const MODELS_INFO = [
  {
    id: 'gemini31flashlite',
    name: 'Google Gemini 3.1 Flash Image Preview',
    shortName: 'Gemini 3.1 Flash',
    codename: 'Nano Banana 2',
    company: 'Google DeepMind',
    description: 'Google’s next-gen multimodal reasoning image model optimized for high inference speed and prompt adherence.',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'geminipro',
    name: 'Google Gemini 3 Pro Image Preview',
    shortName: 'Gemini 3 Pro',
    codename: 'Nano Banana Pro',
    company: 'Google DeepMind',
    description: 'Flagship high-resolution generative model excelling at complex scenes, lighting physics, and fine photorealistic textures.',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    id: 'openai',
    name: 'OpenAI GPT Image 1',
    shortName: 'GPT Image 1',
    codename: 'DALL-E 3',
    company: 'OpenAI',
    description: 'Industry-standard baseline renowned for detailed scene narrative rendering, text generation, and expressive art styles.',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
  }
];
