from flask import Flask, request, jsonify, render_template
import io, librosa, joblib
from tensorflow.keras.models import load_model
import numpy as np
from gc import collect

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
    if 'audio' not in request.files: return jsonify({"error": "No audio file found"}), 400

    # Get the audio file directly from the request
    audio_file = request.files['audio']
    
    # Read the file as bytes (in-memory)
    audio_data = audio_file.read()

    # Convert the audio bytes to a numpy array using librosa
    y, sr = librosa.load(io.BytesIO(audio_data), sr=None)

    # Processing the audio_data with our speech classification model:
    features = feature_extraction(y, sr)

    # Determine if ndarray needs to be increased in size.
    if features.ndim < 2 or features.shape[1] < 2376: 
        features = increase_ndarray_size(features)
    
    # Scale the features
    features_scaled = scaler.transform([features])

    # Make a prediction using the loaded model
    prediction = model.predict(features_scaled)

    # Get the predicted class
    predicted_class = np.argmax(prediction, axis=1)[0]

    predicted_emotion = emotions[predicted_class]    

    # Return the predicted emotion
    return jsonify({"message": "Audio file processed successfully", "predicted_emotion": predicted_emotion})

def feature_extraction(y, sr):
    # Mel Frequency Cepstral Coefficients (MFCC):
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfccs_processed = np.mean(mfccs.T, axis=0)  # Average across time

    # Zero Crossing Rate (ZCR):
    zcr = librosa.feature.zero_crossing_rate(y=y, frame_length=2048, hop_length=512)
    zcr_processed = np.mean(zcr.T, axis=0)  # Average across time

    # Root Mean Square (RMS):
    rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=512)
    rms_processed = np.mean(rms.T, axis=0)  # Average across time

    # Combine all features into a single array
    features = np.hstack([mfccs_processed, zcr_processed, rms_processed])
    return features

def increase_ndarray_size(features_test):
    # Increase ndarray dimensions to [4,2376].
    tmp = np.zeros([4, 2377])
    offsets = [0, 1]
    insert_here = tuple([
        slice(offsets[dim], offsets[dim] + features_test.shape[dim])
        for dim in range(features_test.ndim)
    ])

    tmp[insert_here] = features_test
    features_test = tmp
    del tmp; collect()

    features_test = np.delete(features_test, 0, axis=1)

    return features_test

emotions = {
  "angry": "Angry 😡",
  "calm": "Calm 😌",
  "disgust": "Disgusted 🤢",
  "fear": "Scared 😨",
  "happy": "Happy 😆",
  "neutral": "Neutral 🙂",
  "sad": "Sad 😢",
  "surprise": "Surprised 😳",
}

if __name__ == '__main__':
    app.run(debug=True)