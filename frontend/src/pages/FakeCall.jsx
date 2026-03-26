import { useState, useRef } from "react";

export default function FakeCall() {
  const [incoming, setIncoming] = useState(false);
  const [active, setActive] = useState(false);
  const [time, setTime] = useState(0);

  const ringtoneRef = useRef(null);
  const voiceRef = useRef(null);
  const timerRef = useRef(null);

  const triggerCall = () => {
    setIncoming(true);

    // play ringtone
    ringtoneRef.current = new Audio("/ringtone.mp3");
    ringtoneRef.current.loop = true;
    ringtoneRef.current.play();
  };

  const acceptCall = () => {
    setIncoming(false);
    setActive(true);

    // stop ringtone
    if (ringtoneRef.current) ringtoneRef.current.pause();

    // play voice message after 2 sec
    setTimeout(() => {
      voiceRef.current = new Audio("/voice.mp3");
      voiceRef.current.play();
    }, 2000);

    // start timer
    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const endCall = () => {
    setIncoming(false);
    setActive(false);
    setTime(0);

    if (ringtoneRef.current) ringtoneRef.current.pause();
    if (voiceRef.current) voiceRef.current.pause();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (t) => {
    const min = String(Math.floor(t / 60)).padStart(2, "0");
    const sec = String(t % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <button
        onClick={triggerCall}
        className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg"
      >
        🚨 Trigger Fake Call
      </button>

      {/* Incoming */}
      {incoming && (
        <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center">
          <p className="mb-2">Incoming Call</p>

          <div className="w-28 h-28 bg-gray-700 rounded-full flex items-center justify-center text-3xl mb-4">
            😎
          </div>

          <h1 className="text-3xl">Brother ❤️</h1>
          <p className="text-gray-400 mb-10">+91 9876543210</p>

          <div className="flex gap-10">
            <button
              onClick={acceptCall}
              className="w-16 h-16 bg-green-500 rounded-full text-xl"
            >
              📞
            </button>

            <button
              onClick={endCall}
              className="w-16 h-16 bg-red-500 rounded-full text-xl"
            >
              ❌
            </button>
          </div>
        </div>
      )}

      {/* Active */}
      {active && (
        <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center">
          <p>On Call</p>

          <div className="w-28 h-28 bg-gray-700 rounded-full flex items-center justify-center text-3xl mb-4">
            😎
          </div>

          <h1 className="text-3xl">Brother ❤️</h1>
          <p className="text-gray-400 mb-10">{formatTime(time)}</p>

          <button
            onClick={endCall}
            className="px-8 py-3 bg-red-600 rounded-full"
          >
            End Call
          </button>
        </div>
      )}
    </div>
  );
}
