let mediaRecorder;
let audioChunks = [];

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
  };
};
