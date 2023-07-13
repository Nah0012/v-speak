
const toggleBtn = document.querySelector('#toggle-btn');
const resultDiv = document.querySelector('#result-div');
const textArea = document.querySelector('#text-area');
const voiceNamesSelect = document.getElementById("voice-names");
const rate = document.querySelector('#rate');
const speakBtn = document.querySelector('#speak-btn');
const pauseBtn = document.querySelector('#pause-btn');
const resumeBtn = document.querySelector('#resume-btn');
const cancelBtn = document.querySelector('#cancel-btn');
const start = document.querySelector('#start');
const stop = document.querySelector('#stop');

let isRecognitionActive = false;

if (!("speechSynthesis" in window)) {
  const msgElement = document.getElementById("msg");
  msgElement.innerHTML =
    "このブラウザは音声合成に対応していません。😭";
} else {
  const msgElement = document.getElementById("msg");
  msgElement.innerHTML = "このブラウザは音声合成に対応しています。🎉";
}


//音声認識
SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
let recognition = new SpeechRecognition();

recognition.lang = 'ja-JP';
recognition.interimResults = true;
recognition.continuous = true;

// 音声認識の状態が変化したときのイベント
recognition.onsoundstart = function(){
  document.getElementById('status').innerHTML = "認識中";
};
recognition.onnomatch = function(){
  document.getElementById('status').innerHTML = "もう一度試してください";
};
recognition.onerror= function(){
  document.getElementById('status').innerHTML = "エラー";
};
recognition.onsoundend = function(){
  document.getElementById('status').innerHTML = "停止中";
};

let finalTranscript = ''; // 確定した(黒の)認識結果

recognition.onresult = (event) => {
  let interimTranscript = ''; // 暫定(灰色)の認識結果
  for (let i = event.resultIndex; i < event.results.length; i++) {
    let transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscript += transcript;
    } else {
      interimTranscript = transcript;
    }
  }
  resultDiv.innerHTML = '<i style="color:#ddd;">' + interimTranscript + '</i>';

  textArea.value = finalTranscript;
}

toggleBtn.onclick = () => {
  if (isRecognitionActive) {
    recognition.stop();
    toggleBtn.classList.toggle("active");
  } else {
    recognition.start();
	toggleBtn.classList.toggle("active");
  }
  
  isRecognitionActive = !isRecognitionActive;
}

//音声合成
// Fetch the list of voices and populate the voice options.

function loadVoices() {
  // Fetch the available voices in English US.
  let voices = speechSynthesis.getVoices();
  voiceNamesSelect.innerHTML = "";
  voices.forEach(function (voice, i) {
    const option = document.createElement("option");
    option.value = voice.name;
    option.text = voice.name + " (" + voice.lang + ")";
    if (voice.name === "Google US English") {
      option.selected = true;
    }
    voiceNamesSelect.appendChild(option);
  });
}

// Execute loadVoices.
loadVoices();

// Chrome loads voices asynchronously.
window.speechSynthesis.onvoiceschanged = function (e) {
  loadVoices();
};

const uttr = new SpeechSynthesisUtterance();

// Set up an event listener for when the 'speak' button is clicked.
// Create a new utterance for the specified text and add it to the queue.
speakBtn.addEventListener("click", function () {
  uttr.text = textArea.value;
  uttr.rate = parseFloat(rate.value);
  // If a voice has been selected, find the voice and set the
  // utterance instance's voice attribute.
  const selectedVoiceName = voiceNamesSelect.value;
  if (selectedVoiceName) {
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find((voice) => voice.name === selectedVoiceName);
    if (selectedVoice) {
      uttr.voice = selectedVoice;
    }
  }
  speechSynthesis.speak(uttr);
  uttr.onend = function () {
    // hoge
  };
});

pauseBtn.addEventListener("click", function () {
  speechSynthesis.pause();
});

resumeBtn.addEventListener("click", function () {
  speechSynthesis.resume();
});

cancelBtn.addEventListener("click", function () {
  speechSynthesis.cancel();
});

