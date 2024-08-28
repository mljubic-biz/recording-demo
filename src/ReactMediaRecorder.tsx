import { ReactMediaRecorder } from "react-media-recorder";

const ReactMediaRecorderTest = () => {
  return (
    <ReactMediaRecorder
      video={false}
      audio
      render={({
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl,
        previewAudioStream,
      }) => {
        console.log(previewAudioStream);
        return (
          <div>
            <p>{status}</p>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            <audio controls src={mediaBlobUrl} style={{ width: "400px" }} />
          </div>
        );
      }}
    />
  );
};

export default ReactMediaRecorderTest;
