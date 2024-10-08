import { useEffect, useState } from "react";
import { useAudioRecorder } from "react-audio-voice-recorder";
import { digStorage, blobToArrayBuffer, arrayBufferToBlob } from "./indexDB";

type DIGRecordingStorageData = {
  digId: string;
  recording: ArrayBuffer;
  blobType: string;
};

const digId = "123";
const CustomAudioRecorder = () => {
  const [prevRecording, setPrevRecording] = useState<Blob | null>(null);
  const [gettingPrevRecording, setGettingPrevRecording] = useState(true);

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

  const handleDeletePrevRecording = async () => {
    if (!prevRecording) {
      return;
    }

    try {
      await digStorage.deleteData(digId);
      setPrevRecording(null);
    } catch (error) {
      console.error("Delete prev recording error: ", error);
    }
  };

  useEffect(() => {
    const getPrevRecording = async () => {
      try {
        const prevRecordingData =
          await digStorage.getDataByKey<DIGRecordingStorageData>(digId);
        const prevRecordingBlob = arrayBufferToBlob(
          prevRecordingData.recording,
          prevRecordingData.blobType
        );
        setPrevRecording(prevRecordingBlob);
        setGettingPrevRecording(false);
      } catch (error) {
        console.error("Get prev recording error: ", error);
        setGettingPrevRecording(false);
        setPrevRecording(null);
      }
    };

    getPrevRecording();
  }, []);

  useEffect(() => {
    const saveRecordingToIDB = async () => {
      if (!recordingBlob) {
        return;
      }

      const recordingArrayBuffer = await blobToArrayBuffer(recordingBlob);

      if (!(recordingArrayBuffer instanceof ArrayBuffer)) {
        return;
      }

      digStorage.addData<DIGRecordingStorageData>({
        digId,
        recording: recordingArrayBuffer,
        blobType: recordingBlob.type,
      });
    };

    saveRecordingToIDB();
  }, [recordingBlob]);

  if (gettingPrevRecording) {
    return <div>Loading...</div>;
  }

  if (prevRecording) {
    return (
      <div>
        <p>This is recording from IDB</p>
        <div>
          <audio controls src={URL.createObjectURL(prevRecording)} />
        </div>
        <div>
          <button onClick={handleDeletePrevRecording}>Delete</button>
        </div>
      </div>
    );
  }

  const url = recordingBlob && URL.createObjectURL(recordingBlob);
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
