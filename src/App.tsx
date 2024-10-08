import { useEffect, useState } from "react";
import "./App.css";
import CustomAudioRecorder from "./ReactAudioVoiceRecorder";
import { digStorage } from "./indexDB";

function App() {
  const [isDBReady, setIsDbReady] = useState(false);

  useEffect(() => {
    const initializeIDB = async () => {
      await digStorage.initializedDB();
      setIsDbReady(true);
    };

    initializeIDB();
  }, []);

  if (!isDBReady) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <CustomAudioRecorder />
    </div>
  );
}

export default App;
