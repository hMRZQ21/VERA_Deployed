const emotions = {
  "angry": "Angry 😡",
  "calm": "Calm 😌",
  "disgust": "Disgusted 🤢",
  "fear": "Scared 😨",
  "happy": "Happy 😆",
  "neutral": "Neutral 🙂",
  "sad": "Sad 😢",
  "surprise": "Surprised 😳",
};

const prompts = [
  "Kids are talking by the door",
  "Dogs are sitting by the door",
  "It's eleven o'clock",
  "That is exactly what happened",
  "I'm on my way to the meeting",
  "I wonder what this is about",
  "The airplane is almost full",
  "Maybe tomorrow it will be cold",
  "I think I have a doctor's appointment",
  "Say the word apple",
];

document.getElementById("record").onclick = async () => {
  // Get the user's microphone input
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  // mediaRecorder = new MediaRecorder(stream);
  
  // Load the audio worklet
  await audioContext.audioWorklet.addModule('processor.js');
  const workletNode = new AudioWorkletNode(audioContext, 'raw-audio-processor');

  // Handle audio data
  workletNode.port.onmessage = (event) => {
    const audioData = event.data;
    // You can collect this data to send later or process in real-time
    audioChunks.push(audioData);
  };

  // Connect the source to the worklet and start recording
  source.connect(workletNode);
  workletNode.connect(audioContext.destination);
  document.getElementById("stop").disabled = false;
  document.getElementById("record").disabled = true;

  audioChunks = []; // Array to hold audio data
};

document.getElementById("stop").onclick = () => {
  // Disconnect everything to stop recording
  workletNode.disconnect();
  source.disconnect();

  // Process collected raw audio data
  const audioBuffer = new Blob(audioChunks, { type: 'audio/raw' });

  // Enable record button and disable stop button
  document.getElementById("record").disabled = false;
  document.getElementById("stop").disabled = true;

  // Send the raw audio data to the Flask server
  sendAudioToFlask(audioBuffer);

  // Stop recording and create an audio blob
  // mediaRecorder.stop();
  // mediaRecorder.onstop = () => {
  //   const audioBlob = new Blob(audioChunks, { type: 'audio/ogg; codecs=opus' });
  //   const audioUrl = URL.createObjectURL(audioBlob);

  //   // Play the recorded audio
  //   const audioPlayback = document.getElementById("audioPlayback");
  //   audioPlayback.src = audioUrl;

  //   // Enable record button and disable stop button
  //   document.getElementById("record").disabled = false;
  //   document.getElementById("stop").disabled = true;

  //   // Send the audioBlob to the Flask server
  //   sendAudioToFlask(audioBlob);
  // };
};

// Function to send the raw audio data to Flask backend
function sendAudioToFlask(audioBuffer) {
  const formData = new FormData();
  formData.append('audio', audioBuffer, 'recording.raw');

  // Use fetch to POST the formData to the Flask server
  fetch('/upload_audio', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Handle the server's response as JSON
  })
  .then(data => {
    console.log('Server response:', data);
    // Update the classification result based on the predicted class
    const predictedEmotion = emotions[data.predicted_emotion] || "Unknown emotion.";
    document.getElementById("classificationResult").innerText = predictedEmotion;
  })
  .catch(error => {
    console.error('Error uploading audio:', error);
    document.getElementById("classificationResult").innerText = "Error processing audio.";
  });
}

// Function to select a random prompt
document.getElementById("selectPrompt").onclick = () => {
  const randomIndex = Math.floor(Math.random() * prompts.length);
  const selectedPrompt = prompts[randomIndex];
  document.getElementById("randomPrompt").innerText = selectedPrompt;
};

// Function to select a random emotion
document.getElementById("selectEmotion").onclick = () => {
  const randomEmotionKey = Object.keys(emotions)[Math.floor(Math.random() * Object.keys(emotions).length)];
  const selectedEmotion = emotions[randomEmotionKey];
  document.getElementById("randomEmotion").innerText = selectedEmotion;
};