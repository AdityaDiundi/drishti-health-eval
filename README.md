# Drishti-Health: Indian Grassroots Healthcare Visual AI Benchmark
> Independent human evaluation platform measuring cultural fidelity, domain equipment accuracy, and Devanagari Hindi typography across foundation vision models for Bharat.  
> Inspired by Josh Talks AI's **"Voice of India"** philosophy (*"Owning the yardstick for AI in India"*).

---

## 🌟 Overview & Strategic Context

In collaboration with AI4Bharat (IIT Madras), Josh Talks AI built **Voice of India** to benchmark speech models on authentic Indian accents, ambient noise, and vernacular code-switching.

**Drishti-Health** applies this same standard to **Text-to-Image Foundation Models**:
* Standard benchmarks (ImageNet, Artificial Analysis) evaluate Western aesthetics and studio portraits.
* In Indian grassroots healthcare (ASHA workers, Anganwadi nutrition monitoring, Primary Health Centres, immunization cold-chains, and Devanagari Hindi IEC wall paintings), models routinely hallucinate Western clinic tropes, distort sacred or vernacular scripts, or erase authentic rural contexts.
* **Drishti-Health is an independent, blind pairwise human evaluation platform** that tests whether AI models understand authentic grassroots India.

---

## 🤖 Models Evaluated

| Model Display Name | Technical Model ID | Organization | Architecture & Focus |
| :--- | :--- | :--- | :--- |
| **Google Gemini 3.1 Flash Image Preview** | `gemini-3.1-flash-image-preview` *(Nano Banana 2)* | Google DeepMind | High-speed multimodal reasoning vision generator |
| **Google Gemini 3 Pro Image Preview** | `gemini-3-pro-image-preview` *(Nano Banana Pro)* | Google DeepMind | Flagship visual fidelity and lighting physics |
| **OpenAI GPT Image 1** | `gpt-image-1` / `dall-e-3` | OpenAI | Baseline global benchmark for prompt adherence |

---

## 📋 The 10 Grounded Scenarios (P01 – P10)

1. **`P01` (ASHA Attire & Counseling):** Pastel pink cotton saree with dark blue border & register notebook.
2. **`P02` (PHC Clinic Interior):** Pistachio green distemper walls, steel water jug, immunization charts.
3. **`P03` (Hindi Typography IEC):** Village mud wall painting with legible Devanagari text `'साफ पानी, स्वस्थ जीवन'`.
4. **`P04` (Child Growth Monitoring):** Anganwadi worker weighing toddler in a blue hanging Salter spring scale.
5. **`P05` (Immunization Cold Chain):** Village session with standard blue ice-lined vaccine carrier box.
6. **`P06` (Rural Water & Sanitation):** Boiling drinking water over a clean smokeless chulha in a village kitchen.
7. **`P07` (NCD Geriatric Screening):** Blood pressure check inside an Ayushman Arogya Mandir.
8. **`P08` (Chaupal Vector Control):** Village meeting under banyan tree with dengue prevention flipchart.
9. **`P09` (Rural Telemedicine):** eSanjeevani tablet consultation inside a Gram Panchayat office.
10. **`P10` (Dispensary Essential Drugs):** Labeled generic blister strips of Paracetamol, ORS sachets, and IFA tablets.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
* **Backend & Storage:** Supabase Storage (public CDN bucket `eval-images` with CORS) + Supabase Database (`evaluation_items`).
* **Evaluation Protocol:** Blind A/B/C testing with randomized layout to eliminate positional bias, lightbox inspection zoom, and 18+ informed consent gating.

---

## 🚀 Quickstart & Local Setup

```bash
# 1. Clone repository
git clone https://github.com/AdityaDiundi/drishti-health-eval.git
cd drishti-health-eval

# 2. Install dependencies
npm install

# 3. Configure environment variables (.env.local)
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the live app.

---

## ☁️ Vercel Deployment

1. Import this repository in [Vercel](https://vercel.com/new).
2. Add the environment variables:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `SUPABASE_SERVICE_ROLE_KEY`
3. Click **Deploy**!
