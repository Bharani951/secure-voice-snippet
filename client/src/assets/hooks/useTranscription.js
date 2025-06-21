import { useState, useEffect, useRef } from "react";
import speechService from "../services/speech";

const useTranscription = (audioUrl) => {
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  // Check if speech recognition is supported
  useEffect(() => {
    const supported = speechService.isSupported();
    setIsSupported(supported);

    if (!supported) {
      setError("Speech recognition is not supported in this browser");
    }
  }, []);

  // Initialize recognition
  const initRecognition = () => {
    // Clean up any existing recognition
    if (recognitionRef.current) {
      speechService.stopTranscription(recognitionRef.current);
    }

    // Initialize new recognition
    const recognition = speechService.initRecognition(
      // Result handler
      (text, isFinal) => {
        if (isFinal) {
          setTranscript((prev) => prev + " " + text);
        }
      },
      // End handler
      () => {
        setIsTranscribing(false);
      },
      // Error handler
      (errorMessage) => {
        setError(errorMessage);
        setIsTranscribing(false);
      }
    );

    recognitionRef.current = recognition;
    return recognition;
  };

  // Start transcription from live audio (microphone)
  const startLiveTranscription = () => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser");
      return false;
    }

    try {
      setError(null);
      const recognition = initRecognition();

      if (recognition) {
        setIsTranscribing(true);
        speechService.startTranscription(recognition);
        return true;
      }

      return false;
    } catch (err) {
      setError("Failed to start transcription: " + err.message);
      return false;
    }
  };

  // Start transcription from recorded audio
  const transcribeAudio = (audioBlob) => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser");
      return false;
    }

    try {
      setError(null);
      setTranscript("");

      // Create audio element
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audioRef.current = audio;

      // Initialize recognition
      const recognition = initRecognition();

      if (recognition) {
        // Start recognition
        setIsTranscribing(true);
        speechService.startTranscription(recognition);

        // Play audio
        audio.play();

        // Stop recognition when audio ends
        audio.onended = () => {
          speechService.stopTranscription(recognition);
          setIsTranscribing(false);
        };

        return true;
      }

      return false;
    } catch (err) {
      setError("Failed to transcribe audio: " + err.message);
      return false;
    }
  };

  // Stop transcription
  const stopTranscription = () => {
    if (recognitionRef.current) {
      speechService.stopTranscription(recognitionRef.current);
      setIsTranscribing(false);

      // Stop audio if it's playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      return true;
    }

    return false;
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        speechService.stopTranscription(recognitionRef.current);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    transcript,
    isTranscribing,
    isSupported,
    error,
    startLiveTranscription,
    transcribeAudio,
    stopTranscription,
  };
};

export default useTranscription;
