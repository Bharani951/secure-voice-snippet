import { useEffect, useRef, useState } from "react";
import RecordRTC from "recordrtc";

const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);

  // Clean up function
  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create recorder
      const recorder = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm",
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
        disableLogs: true,
      });

      recorderRef.current = recorder;

      // Start recording
      recorder.startRecording();
      setIsRecording(true);
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;

      // Start duration timer
      timerRef.current = setInterval(() => {
        if (!isPaused) {
          const currentDuration =
            (Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000;
          setDuration(currentDuration);
        }
      }, 100);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        setAudioBlob(blob);

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop stream tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        setIsRecording(false);
        setIsPaused(false);
      });
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (recorderRef.current && isRecording && !isPaused) {
      recorderRef.current.pauseRecording();
      pausedTimeRef.current =
        Date.now() - startTimeRef.current - pausedTimeRef.current;
      setIsPaused(true);
    }
  };

  // Resume recording
  const resumeRecording = () => {
    if (recorderRef.current && isRecording && isPaused) {
      recorderRef.current.resumeRecording();
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      setIsPaused(false);
    }
  };

  // Cancel recording
  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
  };

  // Convert recorded audio to different format if needed
  const convertAudio = (targetType = "audio/mp3") => {
    return new Promise((resolve, reject) => {
      if (!audioBlob) {
        reject(new Error("No recording available"));
        return;
      }

      // Use RecordRTC's converter
      RecordRTC.convertToMP3(audioBlob, (buffer) => {
        const mp3Blob = new Blob([buffer], { type: targetType });
        resolve(mp3Blob);
      });
    });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    audioUrl,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
    convertAudio,
  };
};

export default useAudioRecorder;
