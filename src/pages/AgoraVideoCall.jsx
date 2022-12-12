import { useState, React } from "react";
import { useSearchParams } from "react-router-dom";
import VideoCall from "../components/AgoraVideoCall/VideoCall";

export default function AgoraVideoCall() {
  // get unique room id
  const [inCall, setInCall] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <div className="App" style={{ height: "100%" }}>
        {inCall ? (
          <VideoCall 
		  	setInCall={setInCall} 
			roomid={searchParams.get("room_name")}
			userID={searchParams.get("booking_id")}
		/>
        ) : (
          // eslint-disable-next-line react/jsx-no-undef
          <button
            variant="contained"
            color="primary"
            onClick={() => setInCall(true)}
          >
            Join Call
          </button>
        )}
      </div>
    </>
  );
}
