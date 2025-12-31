# Real-Time Browser-Based Audio Emotion Detection Library


A **fully browser-based, real-time emotion detection system** built using **TensorFlow.js**, designed to run **entirely on the client side** with **no backend inference**.

This project represents **Phase-2++**, a stability-focused redesign after identifying deployment limitations in CNN-based browser models.

---

## Project Overview

**Goal:**  
Build a **browser-deployable emotion detection system** that performs real-time inference on microphone audio using a **Dense-only neural network** and **MFCC features**, fully compatible with TensorFlow.js.

**Key Principle:**  
> If it doesn’t run safely in the browser, it doesn’t belong in Phase-2++.

---

## Key Features

- Real-time microphone audio capture (Web Audio API)
- Dense-only neural network (TFJS LayersModel)
- 13-dimensional MFCC feature input
- 100% client-side inference (no backend, no APIs)
- Color-coded emotion confidence bars
- Prediction smoothing (EMA)
- Silence detection & gating
- FPS / latency throttling for performance
- Works in modern browsers (Chrome, Edge, Firefox)

---

## Supported Emotions

The current model is trained to classify **4 emotions**:

| Emotion  | Description |
|--------|-------------|
| Angry   | High-energy negative affect |
| Happy   | Positive / excited affect |
| Sad     | Low-energy negative affect |
| Neutral | Baseline / calm speech |

---

## Repository Structure

Client-Side-Emotion-Detection/
├── public/
│ ├── index.html # Main UI
│ ├── main.js # Audio capture + inference logic
│ └── mfcc.js # MFCC feature extraction (13-D)
├── model/
│ ├── model.json # TFJS LayersModel
│ └── group1-shard1of1.bin
├── README.md
└── .gitignore

yaml
Copy code

---

## How to Run Locally

### ⚠️ Important
Do **NOT** open `index.html` directly using `file://`.  
TensorFlow.js requires an HTTP server.

---

### Option 1: Python HTTP Server (Recommended)

From the project root:

```bash
python -m http.server 8000
Then open in browser:

bash
Copy code
http://localhost:8000/public/index.html
Option 2: VS Code Live Server
Install Live Server extension

Right-click public/index.html

Select “Open with Live Server”

How to Use
Click Initialize

Allow microphone permission

Click Start Detection

Speak normally (try different emotions)

Observe:

Live emotion label

Confidence percentage

Color-coded bars

Silence is automatically detected and gated.

Technical Design (Phase-2++ Rules)
This phase intentionally avoids browser-unsafe designs.

What’s Used
Dense neural network

Single-frame MFCC (no time stacking)

TensorFlow.js LayersModel

Web Audio API

What’s Avoided
CNNs / spectrograms

RNNs / LSTMs

Backend inference

tfjs-node

SavedModel / GraphModel in browser

Dataset & Training (Offline)
Dataset: CREMA-D

Feature: 13-dimensional MFCC

Training: Python (TensorFlow / Keras)

Export: Keras → TensorFlow.js LayersModel

Training scripts and raw datasets are intentionally excluded from this repo to keep it lightweight and deployment-focused.

Known Limitations
Emotion accuracy depends on microphone quality

No temporal context (single-frame inference by design)

Model size and complexity intentionally limited for browser safety

These are acceptable tradeoffs for Phase-2++.

Future Roadmap
Phase-3: Hybrid CNN → Dense (distilled features, browser-safe)

Phase-4: Production hardening (WebWorkers, WASM, mobile optimization)

Emotion timeline visualization

Multi-language emotion labels

Phase Status
Phase-2++ completed successfully
Browser inference stable
Architecture validated

📜 License
This project is intended for educational and research purposes.
Dataset licenses (e.g., CREMA-D) apply to training data separately.

Acknowledgements
TensorFlow.js team

Dataset & Training Disclaimer

This repository does NOT include any training datasets.

Model training was performed offline using publicly available datasets such as CREMA-D, which are governed by their own licenses and usage terms.

Dataset licenses do not transfer with this code

Users are responsible for complying with dataset-specific terms

This repository contains only trained model artifacts and inference code

For dataset licensing details, please refer to the original dataset publishers.


License

This project is licensed under the MIT License.

You are free to use, modify, and distribute this software for both personal
and commercial purposes.

See the LICENSE file for full details.
For enterprise or commercial engagement, see COMMERCIAL.md.



CREMA-D dataset authors

Web Audio API contributors

Author - Neeraj Bhatia
