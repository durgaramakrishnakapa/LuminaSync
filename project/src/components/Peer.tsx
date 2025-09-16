import React from 'react';
import { useVideo } from "@100mslive/react-sdk";

interface PeerProps {
  peer: any;
}

const Peer: React.FC<PeerProps> = ({ peer }) => {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack,
  });

  return (
    <div className="peer-container bg-gray-800 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className={`peer-video w-full h-full object-cover ${peer.isLocal ? "local" : ""}`}
        autoPlay
        muted
        playsInline
      ></video>
      <div className="peer-name absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        {peer.name} {peer.isLocal ? "(You)" : ""}
      </div>
    </div>
  );
};

export default Peer;