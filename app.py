from flask import Flask, request, jsonify, render_template
from tensorflow.keras.models import load_model
from warnings import filterwarnings
from io import BytesIO  # A binary stream using an in-memory bytes buffer
import numpy as np
import joblib   # For loading model scaler
import librosa  # For audio analysis
import soundfile as sf

filterwarnings('ignore')
app = Flask(__name__)

# Load trained model & scaler
model = load_model('model/model.h5')
scaler = joblib.load('model/standard_scaler.save')

@app.route('/')
def index():  # Runs the HTML file
    return render_template('index.html')

# Route to handle audio file upload and classification
@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files: 
        return jsonify({"error": "No audio file found"}), 400

    # Get audio file directly from the request
    # audio_file = request.files['audio']
    # ^ werkzeug.datastructures.file_storage.FileStorage type
    
    # Read the file as bytes (in-memory)
    # audio_bytes = audio_file.read()  # byte type
    audio_bytes = BytesIO(request.files['audio'].read())
    audio_data, sample_rate = sf.read(audio_bytes)

    # Convert the audio bytes to a numpy array using librosa
    # audio_data, sample_rate = librosa.load(BytesIO(audio_bytes), sr=None) 

    # Processing the audio_data with our speech classification model:
    features = feature_extraction(audio_data, sample_rate)

    # Determine if ndarray needs to be increased in dimensions.
    features_reshaped = reshape_dims(features)

    # Scale the features
    features_scaled = scaler.transform(features_reshaped)
    
    # Make a prediction using the loaded model
    prediction = model.predict(features_scaled)

    # Get the predicted class
    predicted_class = np.argmax(prediction, axis=1)[0] 
    # print(np.argmax(prediction, axis=1))
    # print(predicted_class)

    predicted_emotion = emotions[predicted_class]
    # print(predicted_emotion)
   
    # Return the predicted emotion
    return jsonify({"message": "Audio file processed successfully",
                    "predicted_emotion": predicted_emotion})

# helper functions:
def feature_extraction(data, sample_rate): # pipeline for 3 feature extractions
    # Mel Frequency Cepstral Coefficients (MFCCs):
    mfccs = np.ravel(librosa.feature.mfcc(y=data, sr=sample_rate).T)

    # Zero Crossing Rate (ZCR):
    zcr = np.squeeze(librosa.feature.zero_crossing_rate(y=data, frame_length=2048, hop_length=512))

    # Root Mean Square (RMS):
    rms = np.squeeze(librosa.feature.rms(y=data, frame_length=2048, hop_length=512))

    # Combine all features into a single array
    return np.hstack((zcr, rms, mfccs))

def reshape_dims(features): # reshape ndarray dimensions to [4,2376]
    # using padding to reach target array size
    target_size = 4 * 2376
    pad_size = target_size - features.size

    # zero padding is added to the right of the arr
    arr_padded = np.pad(features, (0, pad_size), 'constant')
    return arr_padded.reshape(4, 2376)

# lookup table
emotions = {
  0: "angry",
  1: "calm",
  2: "disgust",
  3: "fear",
  4: "happy",
  5: "neutral",
  6: "sad",
  7: "surprise",
}

if __name__ == '__main__':
    app.run(debug=True)