// This service uses the Web Speech API for transcription

const speechService = {
  // Check if speech recognition is supported
  isSupported: () => {
    return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
  },

  // Initialize speech recognition
  initRecognition: (onResult, onEnd, onError) => {
    if (!speechService.isSupported()) {
      if (onError)
        onError("Speech recognition is not supported in this browser");
      return null;
    }

    // Create recognition instance
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US"; // Default to English

    // Set up event handlers
    recognition.onresult = (event) => {
      if (onResult) {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;
        const isFinal = result.isFinal;

        onResult(transcript, isFinal);
      }
    };

    recognition.onend = () => {
      if (onEnd) onEnd();
    };

    recognition.onerror = (event) => {
      if (onError) onError(`Error occurred in recognition: ${event.error}`);
    };

    return recognition;
  },

  // Start transcription
  startTranscription: (recognition) => {
    if (recognition) {
      try {
        recognition.start();
        return true;
      } catch (error) {
        console.error("Error starting transcription:", error);
        return false;
      }
    }
    return false;
  },

  // Stop transcription
  stopTranscription: (recognition) => {
    if (recognition) {
      try {
        recognition.stop();
        return true;
      } catch (error) {
        console.error("Error stopping transcription:", error);
        return false;
      }
    }
    return false;
  },
};

export default speechService;
