class RawAudioProcessor extends AudioWorkletProcessor {
    process(inputs) {
      const input = inputs[0];
      if (input && input[0]) {
        this.port.postMessage(input[0]);
      }
      return true; // Keep processor alive
    }
}
  
registerProcessor('raw-audio-processor', RawAudioProcessor);  