let mediaRecorder;
let audioChunks = [];

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
  "Kids are talking by the door.",
  "Dogs are sitting by the door.",
  "It's eleven o'clock.",
  "That is exactly what happened.",
  "I'm on my way to the meeting.",
  "I wonder what this is about.",
  "The airplane is almost full.",
  "Maybe tomorrow it will be cold.",
  "I think I have a doctor's appointment.",
  "Say the word apple.",
];

document.getElementById("record").onclick = async () => {
  // Get the user's microphone input
  let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  
  // Start recording
  mediaRecorder.start();
  document.getElementById("stop").disabled = false;
  document.getElementById("record").disabled = true;
  audioChunks = [];

  // Collect audio data
  mediaRecorder.ondataavailable = event => {
    audioChunks.push(event.data);
  };
};

document.getElementById("stop").onclick = () => {
  // Stop recording and create an audio blob
  mediaRecorder.stop();
  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);

    // Play the recorded audio
    const audioPlayback = document.getElementById("audioPlayback");
    audioPlayback.src = audioUrl;

    // Enable record button and disable stop button
    document.getElementById("record").disabled = false;
    document.getElementById("stop").disabled = true;

    // Send the audioBlob to the Flask server
    sendAudioToFlask(audioBlob);
  };
};

// Function to send the audio Blob to Flask backend
function sendAudioToFlask(audioBlob) {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.wav'); // Append the Blob and give it a filename

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
    const predictedEmotion = emotions[data.predicted_class] || "Unknown emotion.";
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