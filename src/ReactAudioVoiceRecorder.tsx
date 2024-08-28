import { useEffect, useRef, useState } from "react";
import { useAudioRecorder } from "react-audio-voice-recorder";

const CustomAudioRecorder = () => {
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
  } = useAudioRecorder();

  const handleStartRecording = () => {
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const url = recordingBlob && URL.createObjectURL(recordingBlob);
  console.log(recordingBlob?.type);
  return (
    <div>
      <div>
        <p>Recording time: {recordingTime}</p>
        <p>Recording: {isRecording ? "on" : "off"}</p>
        <p>Paused: {isPaused ? "on" : "off"}</p>
      </div>
      <button onClick={handleStartRecording}>Start Recording</button>
      <button onClick={handleStopRecording}>Stop Recording</button>
      <button onClick={togglePauseResume}>
        {isPaused ? "Resume" : "Pause"}
      </button>
      <audio controls src={url} style={{ width: "400px" }} />
    </div>
  );
};

export default CustomAudioRecorder;
