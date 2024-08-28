import { useEffect, useRef, useState } from "react";
import * as RecordRTC from "recordrtc";
import "./App.css";

function RecordRTCTest() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingRes, setRecordingRes] = useState<Blob>();
  const [isPaused, setIsPaused] = useState(false);
  const streamRef = useRef<MediaStream>();
  const recorderRef = useRef<RecordRTC.RecordRTCPromisesHandler>();
  const tmpRecording = useRef<Blob>();

  useEffect(() => {
    const setupRecorder = async () => {
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        recorderRef.current = new RecordRTC.RecordRTCPromisesHandler(
          streamRef.current,
          {
            type: "audio",
            timeSlice: 2000,
            ondataavailable: async (newChunk: Blob) => {
              console.log(newChunk);
              if (!tmpRecording.current) {
                tmpRecording.current = newChunk;
                return;
              }
              console.log("concatenating");
              tmpRecording.current = new Blob(
                [tmpRecording.current, newChunk],
                {
                  type: newChunk.type,
                }
              );
            },
          }
        );
      } catch (error) {
        console.error("Init recorder error: ", error);
      }
    };

    setupRecorder();
  }, []);

  const startRecording = () => {
    tmpRecording.current = undefined;
    recorderRef.current?.startRecording();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    try {
      await recorderRef.current?.stopRecording();
      const blob = await recorderRef.current?.getBlob();
      setRecordingRes(blob);
      setIsRecording(false);
      setIsPaused(false);
    } catch (error) {
      console.error(error);
    }
  };

  const pauseRecording = async () => {
    await recorderRef.current?.pauseRecording();
    setIsPaused(true);
  };

  const resumeRecording = async () => {
    await recorderRef.current?.resumeRecording();
    setIsPaused(false);
  };

  const handlePauseResumeButtonClick = () => {
    if (isPaused) {
      return resumeRecording();
    }
    pauseRecording();
  };

  const handleStartStopButtonClick = () => {
    if (isRecording) {
      return stopRecording();
    }
    startRecording();
  };

  const audioSrc = recordingRes && URL.createObjectURL(recordingRes);
  return (
    <div className="app">
      <div>
        <button onClick={handleStartStopButtonClick}>
          {isRecording ? "Stop" : "Start"}
        </button>
        {isRecording && (
          <button onClick={handlePauseResumeButtonClick}>
            {isPaused ? "Resume" : "Pause"}
          </button>
        )}
      </div>
      <div>
        <p>{isRecording && !isPaused && "Recording..."}</p>
        <p>{isRecording && isPaused && "Paused..."}</p>
      </div>
      {recordingRes && (
        <>
          <p>Your Recording:</p>
          <audio controls src={audioSrc} style={{ width: "400px" }} />
        </>
      )}
    </div>
  );
}

export default RecordRTCTest;
