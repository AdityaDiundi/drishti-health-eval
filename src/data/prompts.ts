export interface PromptItem {
  id: string;
  category: string;
  title: string;
  prompt: string;
  rubricFocus: string;
  whyItMatters: string;
  keyVisualCheckpoints: string[];
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
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  {
    id: 'geminipro',
    name: 'Google Gemini 3 Pro Image Preview',
    shortName: 'Gemini 3 Pro',
    codename: 'Nano Banana Pro',
    company: 'Google DeepMind',
    description: 'Flagship high-resolution generative model excelling at complex scenes, lighting physics, and fine photorealistic textures.',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  },
  {
    id: 'openai',
    name: 'OpenAI GPT Image 1',
    shortName: 'GPT Image 1',
    codename: 'DALL-E 3',
    company: 'OpenAI',
    description: 'Industry-standard baseline renowned for detailed scene narrative rendering, text generation, and expressive art styles.',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  }
];
