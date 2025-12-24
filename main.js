// ================================
// Phase-2++ Client-Side Emotion Detection
// main.js (FINAL, STABLE, ENHANCED)
// ================================

let audioCtx;
let processor;
let micStream;
let emotionModel = null;

// -------------------------------
// CONFIG
// -------------------------------
const EMOTIONS = ["Angry", "Happy", "Sad", "Neutral"];

const EMOTION_COLORS = {
    Angry: "#e74c3c",
    Happy: "#f1c40f",
    Sad: "#3498db",
    Neutral: "#95a5a6"
};

// EMA smoothing
let smoothedScores = new Array(4).fill(0);
const EMA_ALPHA = 0.3;

// FPS / throttling
let lastInferenceTime = 0;
const INFERENCE_INTERVAL = 150; // ms (~6–7 FPS)

// -------------------------------
// UI ELEMENTS
// -------------------------------
const initBtn = document.getElementById("initBtn");
const startBtn = document.getElementById("startBtn");
const statusDiv = document.getElementById("status");
const resultDiv = document.getElementById("result");
const barsDiv = document.getElementById("bars");

// -------------------------------
// INITIALIZATION
// -------------------------------
initBtn.onclick = async () => {
    statusDiv.innerText = "Loading model...";

    // Load TFJS LayersModel
    emotionModel = await tf.loadLayersModel("./model/model.json");
    console.log("✅ Emotion model loaded");

    // Init bars UI
    initBars();

    // Audio context
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const source = audioCtx.createMediaStreamSource(micStream);
    processor = audioCtx.createScriptProcessor(1024, 1, 1);

    source.connect(processor);
    processor.connect(audioCtx.destination);

    processor.onaudioprocess = onAudioProcess;

    startBtn.disabled = false;
    statusDiv.innerText = "Initialized. Click Start Detection.";
};

startBtn.onclick = () => {
    statusDiv.innerText = "Listening...";
};

// -------------------------------
// AUDIO PROCESSING
// -------------------------------
function onAudioProcess(event) {
    if (!emotionModel) return;

    const now = performance.now();
    if (now - lastInferenceTime < INFERENCE_INTERVAL) return;
    lastInferenceTime = now;

    const input = event.inputBuffer.getChannelData(0);

    // Silence gating
    if (isSilent(input)) {
        resultDiv.innerText = "Emotion: Silence";
        resultDiv.style.color = "#777";
        return;
    }

    // MFCC extraction (13)
    const mfcc = extractMFCC(input);

    const inputTensor = tf.tensor2d([mfcc], [1, 13]);

    const prediction = emotionModel.predict(inputTensor);
    const rawScores = prediction.dataSync();

    inputTensor.dispose();
    prediction.dispose();

    // EMA smoothing
    for (let i = 0; i < rawScores.length; i++) {
        smoothedScores[i] =
            EMA_ALPHA * rawScores[i] +
            (1 - EMA_ALPHA) * smoothedScores[i];
    }

    // Result
    const result = getTopEmotion(smoothedScores);

    resultDiv.innerText =
        `Emotion: ${result.label} (${(result.confidence * 100).toFixed(1)}%)`;
    resultDiv.style.color = EMOTION_COLORS[result.label];

    updateBars(smoothedScores);
}

// -------------------------------
// HELPERS
// -------------------------------
function isSilent(audioBuffer) {
    let sum = 0;
    for (let i = 0; i < audioBuffer.length; i++) {
        sum += audioBuffer[i] * audioBuffer[i];
    }
    const rms = Math.sqrt(sum / audioBuffer.length);
    return rms < 0.01; // silence threshold
}

function getTopEmotion(scores) {
    let maxIdx = 0;
    for (let i = 1; i < scores.length; i++) {
        if (scores[i] > scores[maxIdx]) maxIdx = i;
    }
    return {
        label: EMOTIONS[maxIdx],
        confidence: scores[maxIdx]
    };
}

// -------------------------------
// BAR VISUALIZATION
// -------------------------------
function initBars() {
    barsDiv.innerHTML = "";
    EMOTIONS.forEach(e => {
        barsDiv.innerHTML += `
          <div style="margin-top:8px;">
            ${e}
            <div class="bar">
              <div class="bar-fill" id="bar-${e}"></div>
            </div>
          </div>`;
    });
}

function updateBars(scores) {
    scores.forEach((v, i) => {
        const bar = document.getElementById(`bar-${EMOTIONS[i]}`);
        bar.style.width = `${(v * 100).toFixed(1)}%`;
        bar.style.backgroundColor = EMOTION_COLORS[EMOTIONS[i]];
    });
}

