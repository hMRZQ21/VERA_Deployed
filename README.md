<div>
    <h1  align="center" >Voice Emotion Recognition of Audio 🔊</h1>
</div>

## INTRODUCTION

<p align="center">
   <a
      href="https://stock.adobe.com/search?k=waveform&asset_id=327369570" target="_blank">
      <img src="templates\Waveform.jpg"
      alt="Waveform illustration" width="600" height="300"/>
   </a>
</p>

VERA is an emotion classification model which takes audio files recorded from  speech, primarily in .wav format, and predicts the emotions conveyed from voices.

## NOTEBOOK VIEWER LINK

You can check the [Jupyter Notebook](https://nbviewer.org/github/hMRZQ21/VERA_CTP/blob/main/backend/vera-notebook.ipynb) for model creation here.

## TECHNOLOGIES

* [Librosa](https://librosa.org): for audio processing and feature extraction

* [Tensorflow/Keras](https://www.tensorflow.org/): for model creation and training

* [Scikit-Learn](https://scikit-learn.org/stable/): also for model creation and training

* [Pandas](https://pandas.pydata.org/): for data cleaning and manipulation

* [Numpy](https://numpy.org/): for data manipulation

* [Seaborn](https://seaborn.pydata.org/): for data visualization

* [Plotly](https://plotly.com/): also for data visualization

* [Kaggle](https://www.kaggle.com/): where we found the data

* [Flask](https://flask.palletsprojects.com/en/3.0.x/): for backend services

* [Deployment platform](): work in progress...


## DATASETS USED

I've combined the following four datasets. This left us with a total of 12,162 audio files voiced by 121 actors, with 229 phrases spoken and expressing 7 emotions across them. After performing data augmentation, 12,162 audio files became 48,648 files. Each original file was stretched, noise injected, and pitched, effectively quadrupling the dataset size. 

1. [RAVDESS Emotional Speech Dataset on Kaggle](https://www.kaggle.com/uwrfkaggler/ravdess-emotional-speech-audio)
   <br />
   <p>This portion of the RAVDESS contains 1440 files: 60 trials per actor x 24 actors = 1440. RAVDESS contains 24 professional actors (12 female, 12 male), vocalizing two lexically-matched statements in a neutral North American accent. Speech emotions includes calm, happy, sad, angry, fearful, surprise, and disgust expressions. Each expression is produced at two levels of emotional intensity (normal, strong), with an additional neutral expression.</p>

2. [CREMA-D: Crowd Sourced Emotional Multimodal Actors Dataset](https://www.kaggle.com/datasets/ejlok1/cremad)
   <br>
   <p>CREMA-D is a data set of 7,442 original clips from 91 actors. These clips were from 48 male and 43 female actors between the ages of 20 and 74 coming from a variety of races and ethnicities (African America, Asian, Caucasian, Hispanic, and Unspecified). Actors spoke from a selection of 12 sentences. The sentences were presented using one of six different emotions (Anger, Disgust, Fear, Happy, Neutral, and Sad) and four different emotion levels (Low, Medium, High, and Unspecified).</p>

3. [SAVEE: Surrey Audio-Visual Expressed Emotion](https://www.kaggle.com/datasets/ejlok1/surrey-audiovisual-expressed-emotion-savee)
   <br>
   <p>The SAVEE database was recorded from four native English male speakers (identified as DC, JE, JK, KL), postgraduate students and researchers at the University of Surrey aged from 27 to 31 years. Emotion has been described psychologically in discrete categories: anger, disgust, fear, happiness, sadness and surprise. A neutral category is also added to provide recordings of 7 emotion categories.<br>

   The text material consisted of 15 TIMIT sentences per emotion: 3 common, 2 emotion-specific and 10 generic sentences that were different for each emotion and phonetically-balanced. The 3 common and 2 × 6 = 12 emotion-specific sentences were recorded as neutral to give 30 neutral sentences. This resulted in a total of 120 utterances per speaker.</p>

4. [TESS: Toronto Emotional Speech Set](https://www.kaggle.com/datasets/ejlok1/toronto-emotional-speech-set-tess)
   <br>
   <p>There are a set of 200 target words were spoken in the carrier phrase "Say the word __' by two actresses (aged 26 and 64 years) and recordings were made of the set portraying each of seven emotions (anger, disgust, fear, happiness, pleasant surprise, sadness, and neutral). There are 2800 data points (audio files) in total. <br>

## SPECIAL MENTIONS

[Vijay Anandan](https://www.linkedin.com/in/vijay-anadan) who helped coordinate with the ideation and guidance in the project.

## CONTRIBUTION AND FEEDBACK

If you would like to contribute or have any feedback for this project please feel free to contact any one of the contributors.
