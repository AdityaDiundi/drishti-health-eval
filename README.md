# JANEVAL (Drishti-Health): Frontier Vision AI Benchmark for Bharat
> **Author:** Aditya Diundi  
> **Submission:** Josh Talks AI Product Task (July 2026) — Question 1 (Solo Technical Submission)  
> **Live Benchmark Web App:** [janeval.vercel.app](https://janeval.vercel.app)  
> **Compulsory Video Walkthrough:** [youtu.be/t2rf1MK2XFs](https://youtu.be/t2rf1MK2XFs)

---

## 🌟 Overview & Strategic Context

This project is an **independent, solo assignment submission** designed and built from scratch by **Aditya Diundi** for the **Josh Talks AI Product Task (July 2026)**.

The evaluation architecture draws philosophical inspiration from the benchmarking ethos of Josh Talks AI's **"Voice of India"** (*"Owning the yardstick for AI in India"*):
* Standard global vision benchmarks (ImageNet, Artificial Analysis Image Arena) measure Western aesthetics, generic photorealism, and studio portraits.
* In Indian frontline public healthcare (ASHA worker counseling, Anganwadi Salter-scale growth monitoring, Primary Health Centre infrastructure, UIP cold-chain vaccine carriers, and Devanagari Hindi IEC wall paintings), foundation models routinely hallucinate Western clinic tropes, distort vernacular scripts, or erase authentic grassroots contexts.
* **JANEVAL (Drishti-Health)** is an independent, double-blind pairwise human evaluation platform with Bradley-Terry MLE scoring, testing whether frontier image generation models faithfully represent Indian grassroots reality.

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

## 📐 Mathematical Formulation & Combinatorial Experimental Design

To eliminate individual score inflation, subjective calibration shifts across annotators, and arbitrary heuristics, JANEVAL implements a closed-form **Bradley-Terry (1952) Maximum Likelihood Estimation (MLE)** solver with **Hunter's (2004) Minorize-Maximization (MM) algorithm**, paired with **Fisher Information 95% confidence intervals**.

### 1. Combinatorics & Balanced Incomplete Block Design (BIBD)
Evaluating $K = 3$ models across $S = 10$ standardized clinical scenarios requires a symmetric combinatorial structure to guarantee equal statistical power across all pairings:
* **Unordered Model Matchups:** $\binom{K}{2} = \binom{3}{2} = 3$ unique pairings:
  $$\{\text{GPT Image 1}, \text{Gemini 3 Pro}\}, \quad \{\text{GPT Image 1}, \text{Gemini 3.1 Flash}\}, \quad \{\text{Gemini 3 Pro}, \text{Gemini 3.1 Flash}\}$$
* **Spatial Permutations (Debiasing):** $2! = 2$ ordered presentations per pair: $(A, B)$ and $(B, A)$ counterbalanced to completely eliminate presentation position bias (left vs. right).
* **Sample Size & Battle Allocation:** With $M = 12$ independent raters completing the 10-scenario battery, exactly $N = 120$ pairwise decisions were collected:
  $$n_{ij} = \frac{N}{\binom{K}{2}} = \frac{120}{3} = 40 \text{ head-to-head battles per pair}$$
* **Appearance Conservation Identity:** Each match involves exactly 2 models, yielding $2 \times 120 = 240$ total model appearances across the dataset:
  $$N_{\text{appearances}, i} = \frac{2 \times N}{K} = \frac{240}{3} = 80 \text{ appearances per model}$$

---

### 2. Outcome Allocation & Appearance-Based Win Rates
In pairwise human evaluation, each match allocates points according to:
$$w_{ij} = \text{Wins}_{ij} + 0.5 \times \text{Ties}_{ij}$$

Across the 120 verified evaluator decisions:
* **Decisive Wins:** 110 matches ($53 + 34 + 23 = 110$)
* **Authenticated Ties:** 5 matches ($5 \times 0.5 \times 2 = 5.0$ points per side)
* **Total Points Conserved:** $\sum_{i} W_i = 110 + 5.0 + 5.0 = 120.0 \text{ points}$

True win rates are computed over a model's **80 appearances** (games actually played), avoiding the flawed denominator of 120:
$$\text{Win Rate}_i = \frac{W_i}{N_{\text{appearances}, i}} = \frac{\text{Wins}_i + 0.5 \times \text{Ties}_i}{80}$$

* **OpenAI GPT Image 1:** $\frac{53 + 0.5 \times 6}{80} = \frac{56.0}{80} = \mathbf{70.0\%}$
* **Google Gemini 3 Pro:** $\frac{34 + 0.5 \times 4}{80} = \frac{36.0}{80} = \mathbf{45.0\%}$
* **Google Gemini 3.1 Flash:** $\frac{23 + 0.5 \times 0}{80} = \frac{23.0}{80} = \mathbf{28.7\%}$

---

### 3. Bradley-Terry (1952) Likelihood Formulation
The Bradley-Terry model specifies the probability that model $i$ is preferred over model $j$ as a function of latent positive skill parameters $\pi_i, \pi_j > 0$:
$$P(i \succ j) = \frac{\pi_i}{\pi_i + \pi_j}$$

Given observed wins $w_{ij}$ across $n_{ij}$ head-to-head trials, the log-likelihood function is:
$$\ln \mathcal{L}(\boldsymbol{\pi}) = \sum_{i < j} \left[ w_{ij} \ln(\pi_i) + w_{ji} \ln(\pi_j) - n_{ij} \ln(\pi_i + \pi_j) \right]$$

---

### 4. Hunter's (2004) Minorize-Maximization (MM) Algorithm
Rather than heuristic gradient stepping or uncalibrated sequential Elo updates, JANEVAL computes the exact global MLE via **Hunter's Minorize-Maximization (MM) algorithm**. At iteration $t$:
$$\pi_i^{(t+1)} = \frac{W_i}{\sum_{j \ne i} \frac{n_{ij}}{\pi_i^{(t)} + \pi_j^{(t)}}}, \quad \text{where } W_i = \sum_{j \ne i} w_{ij}$$

Normalized at each step to enforce geometric mean centering:
$$\pi_i^{(t+1)} \leftarrow \frac{\pi_i^{(t+1)}}{\left(\prod_{k=1}^K \pi_k^{(t+1)}\right)^{1/K}}$$

Iterations terminate when $\|\boldsymbol{\pi}^{(t+1)} - \boldsymbol{\pi}^{(t)}\|_\infty < 10^{-6}$.

---

### 5. Logistic Elo Scale Mapping & Calibration
The latent skill parameters $\pi_i$ are mapped onto the canonical Elo domain centered at baseline $R_0 = 1200$:
$$R_i = 1200 + 400 \log_{10}(\pi_i)$$

* **OpenAI GPT Image 1:** $\hat{\pi}_1 = 2.45 \implies R_1 = 1200 + 400 \log_{10}(2.45) = \mathbf{1356}$
* **Google Gemini 3 Pro:** $\hat{\pi}_2 = 0.82 \implies R_2 = 1200 + 400 \log_{10}(0.82) = \mathbf{1166}$
* **Google Gemini 3.1 Flash:** $\hat{\pi}_3 = 0.50 \implies R_3 = 1200 + 400 \log_{10}(0.50) = \mathbf{1078}$

---

### 6. Fisher Information Curvature & 95% Confidence Intervals
The observed Fisher Information $\mathcal{I}_i$ for parameter $\pi_i$ is given by the negative second derivative of the log-likelihood:
$$\mathcal{I}_i = -\frac{\partial^2 \ln \mathcal{L}}{\partial \pi_i^2} = \sum_{j \ne i} \frac{n_{ij} \hat{\pi}_j}{(\hat{\pi}_i + \hat{\pi}_j)^2}$$

Using the Delta Method, the asymptotic standard error on the Elo scale is:
$$SE(R_i) = \frac{400}{\ln 10} \cdot \frac{1}{\hat{\pi}_i \sqrt{\mathcal{I}_i}}$$
$$\text{CI}_{95\%}(R_i) = R_i \pm 1.96 \cdot SE(R_i)$$

* **OpenAI GPT Image 1:** $1356 \pm 85 \implies [1271, 1441]$
* **Google Gemini 3 Pro:** $1166 \pm 79 \implies [1087, 1245]$
* **Google Gemini 3.1 Flash:** $1078 \pm 84 \implies [994, 1162]$

---

### 7. Hypothesis Testing & "Gap Could Be Chance" Justification
* **GPT Image 1 vs. Gemini 3 Pro:** The gap is $\Delta = +190$ Elo points ($p < 0.01$, disjoint confidence bands $[1271, 1441]$ vs $[1087, 1245]$).
* **Gemini 3 Pro vs. Gemini 3.1 Flash:** The gap is $\Delta = +88$ Elo points. The confidence intervals overlap across the $[1087, 1162]$ interval. At $N = 120$ observations, we cannot reject the null hypothesis of equivalence ($H_0: \pi_{\text{Pro}} = \pi_{\text{Flash}}$) at $\alpha = 0.05$. The platform highlights this on the leaderboard as an honest indeterminate margin: **"Gap could be chance"**.

---

### 8. Master Empirical Reconciliation Matrix

| Model | Total Appearances | Decisive Wins | Ties | Total Points ($W_i$) | Win Rate % | Latent Skill ($\hat{\pi}_i$) | Elo Rating | 95% Confidence Interval |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **OpenAI GPT Image 1** | 80 | 53 | 6 | 56.0 | **70.0%** | 2.45 | **1356** | 1356 ± 85 $[1271, 1441]$ |
| **Google Gemini 3 Pro** | 80 | 34 | 4 | 36.0 | **45.0%** | 0.82 | **1166** | 1166 ± 79 $[1087, 1245]$ |
| **Google Gemini 3.1 Flash** | 80 | 23 | 0 | 23.0 | **28.7%** | 0.50 | **1078** | 1078 ± 84 $[994, 1162]$ |

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

# 3. Start local development server (runs out-of-the-box with offline bundled data)
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the live app.

### 🔒 Local Development & Data Isolation
* **Zero-Config Local Run:** The repository is 100% self-contained. When cloned and run locally without environment variables, the platform automatically serves the bundled dataset of 120 verified evaluator votes (`src/data/pairwiseVotes.json`) and image manifests.
* **Database Isolation:** Reviewers and developers can safely test the Arena and inspect rankings locally without needing a Supabase account or environment variables. Production database credentials remain securely isolated in production environment variables, protecting production ratings from local mutations.

---

## ☁️ Production Deployment (Vercel)

1. Import this repository in [Vercel](https://vercel.com/new).
2. Configure production environment variables in the Vercel dashboard:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `SUPABASE_SERVICE_ROLE_KEY`
   * `GEMINI_API_KEY` (for JANEVAL Assistant)
3. Click **Deploy**!
