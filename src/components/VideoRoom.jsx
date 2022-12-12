import React, { useEffect, useState } from 'react';
import AgoraRTC, { createClient } from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { IoMdMicOff, IoMdMic } from 'react-icons/io';
import { HiOutlinePhoneMissedCall } from 'react-icons/hi';
import { AiOutlineFileAdd } from 'react-icons/ai';
import { BsCameraVideo, BsCameraVideoOff, BsChatDots } from 'react-icons/bs';
import { useNavigate } from 'react-router';
import BookingAPI from '../api/bookingAPI';
import UserApi from '../api/UserAPI'
import consultationAPI from "../api/consultation"

const APP_ID = '487313108aca464bb93de894daedc887';
const TOKEN =
  '007eJxTYNgof2dTbM+W06ufGeR5XInaws01r2Zx+dLLhuYr2Z65+6goMJhYmBsbGhsaWCQmJ5qYmSQlWRqnpFpYmqQkpqYkW1iYe0VOSW4IZGTQtfNhYmSAQBCflSGwtCi1goEBAFsqHrY=';

const CHANNEL = 'Qurex';

AgoraRTC.setLogLevel(4);

let agoraCommandQueue = Promise.resolve();

const createAgoraClient = ({
  onVideoTrack,
  onUserDisconnected,
  room_id,
  user_id,
}) => {
  const client = createClient({
    mode: 'rtc',
    codec: 'vp8',
  });

  let tracks;

  const waitForConnectionState = (connectionState) => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (client.connectionState === connectionState) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  };

  const connect = async () => {
   
    await waitForConnectionState('DISCONNECTED');

    const uid = await client.join(APP_ID, 'Qurex' || room_id, TOKEN, user_id);

    client.on('user-published', (user, mediaType) => {
      client.subscribe(user, mediaType).then(() => {
        if (mediaType === 'video') {
          onVideoTrack(user);
        }
      });
    });

    client.on('user-left', (user) => {
      onUserDisconnected(user);
    });

    tracks = await AgoraRTC.createMicrophoneAndCameraTracks();

    await client.publish(tracks);

    return {
      tracks,
      uid,
    };
  };

  const disconnect = async () => {
    await waitForConnectionState('CONNECTED');
    client.removeAllListeners();
    for (let track of tracks) {
      track.stop();
      track.close();
    }
    await client.unpublish(tracks);
    await client.leave();
  };

  return {
    disconnect,
    connect,
    client,
  };
};

export const VideoRoom = ({ roomid: room_id, userID: user_id }) => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [muteText, setMuteText] = useState('Mute');
  const [pauseVideoText, setPauseVideoText] = useState('Pause Video');
  const [uid, setUid] = useState(user_id);
  const [reload, setReload] = useState(false);
  const [onForm, setOnForm] = useState(false);
  const auth = useSelector((state) => state.auth.authData);
  const [bookingDetails,setBookingDetails] = useState();
  const [patientDetails,setPatientDetail] = useState();
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search) 
    const id = params.get('user_id') // 123 
    getBookingDetails(id,auth.token)
}, [])
  const getBookingDetails =async(id,token) =>{
   try {
    const bookingData = await BookingAPI.getBookingById(id,token)
    if(bookingData){
      setBookingDetails(bookingData)
        const patientData = await UserApi.getUser(bookingData.patientId);
        if(patientData){
          setPatientDetail(patientData);
        }else{
          console.log(patientData);
        }
    }else{
      console.log(bookingData);
    }
   } catch (error) {
    console.log(error);
   } 
  } 
  const setup = async () => {
    const { tracks, uid } = await connect();
    setCurrentUser({
      uid,
      audioTrack: tracks[0],
      videoTrack: tracks[1],
    });
    setUid(uid);
  };

  const cleanup = async (disconnect) => {
    if (typeof disconnect === 'function') await disconnect();

    setUid(null);
    setUsers([]);
  };
  const onVideoTrack = (user) => {
    if (user) {
      user?.audioTrack?.play();
      setUsers((previousUsers) => [...previousUsers, user]);
    }
  };

  const onUserDisconnected = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };
  let connect, disconnect, client;
  useEffect(() => {
    const createAC = createAgoraClient({
      onVideoTrack,
      onUserDisconnected,
      room_id,
      user_id,
    });
    connect = createAC?.connect;
    disconnect = createAC?.disconnect;
    client = createAC?.client;

    // setup();
    agoraCommandQueue = agoraCommandQueue.then(setup);
    if (!reload || !currentUser?.videoTrack) {
      setTimeout(() => {
        setReload(true);
      }, 5000);
    }
    return () => {
      // cleanup();
      leave();
      agoraCommandQueue = agoraCommandQueue.then(cleanup);
    };
  }, []);


  const formik = useFormik({
    initialValues: {
      issue: '',
      since: '',
      diagnosis: '',
      medication: '',
      advice: '',
    },
    validationSchema: Yup.object({
      issue: Yup.string()
        .max(20, 'Name must be 20 Characters or less')
        .required('Required'),
      since: Yup.string().required('Required'),
    }),
    onSubmit: async (values,{resetForm}) => {
      const postUpdatedData = {
        issue: values.issue,
        since: values.since,
        diagnosis: values.diagnosis,
        medicine: values.medicine,
        doctorAdvice: values.advice,
        patientId:bookingDetails.patientId,
        bookingId:bookingDetails.bookingId,
        consultationId:bookingDetails.bookingId,
        doctorId:bookingDetails.doctorId,
      };
      
      try {
        if (navigator.onLine) {
          const response = await consultationAPI.createConsultation(postUpdatedData,auth.token)
          if (response) {
            resetForm()
            alert('Succesfully Updated');
          }
        } else {
        }
      } catch (error) {
        console.log(error);
        alert('Error Updating Data');
      }
    },
  });

  const handleMute = () => {
    if (muteText == 'Mute') {
      currentUser?.audioTrack?.setMuted(true);
      setMuteText('Unmute');
    } else {
      currentUser?.audioTrack?.setMuted(false);
      setMuteText('Mute');
    }
  };
  const handlePauseVideo = () => {
    if (pauseVideoText == 'Pause Video') {
      currentUser?.videoTrack.setMuted(true);
      setPauseVideoText('Unpause Video');
    } else {
      currentUser?.videoTrack.setMuted(false);
      setPauseVideoText('Pause Video');

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  async function leave() {
    currentUser?.audioTrack.setMuted(true);
    currentUser?.videoTrack.setMuted(true);
    cleanup(disconnect);
    // remove remote users and player views
    setUsers({});

    // leave the channel
    // await client?.leave();
    console.log('client leaves channel success');
    navigate(-1);
  }
  console.log(
    '🚀 ~ file: VideoRoom.jsx ~ line 190 ~ handleMute ~ currentUser',
    currentUser
  );
  console.log(users);
  return (
    <>
      <div
        className={`mx-3 grid grid-cols-1 ${
          auth?.role === 'doctor' ? 'md:grid-cols-4' : 'md:grid-cols-3'
        }  gap-5`}
      >
        <div className="col-span-3">
          <div className="flex w-full h-96">
            <div className="relative z-0 w-full mx-20 bg-gray-400 h-96">
              {users && users.length
                ? users.map((user) => (
                    <VideoPlayer
                      className="col-span-2"
                      key={user.uid + new Date().getTime()}
                      user={user}
                    />
                  ))
                : ''}
              {/* {currentUser?.uid && (
                <VideoPlayer
                  className="h-96"
                  key={currentUser.uid}
                  user={currentUser}
                />
              )} */}
              <div className="absolute inset-0 z-10 flex w-40 h-40 bg-red-900">
                {currentUser?.uid && (
                  <VideoPlayer
                    key={currentUser.uid + new Date().getTime()}
                    user={currentUser}
                  />
                )}
              </div>
              <div className="absolute inset-0 flex justify-center items-center z-10 mt-[34rem]">
                <button
                  className="btn btn-lg btn-primary rounded-pill "
                  onClick={handleMute}
                >
                  {muteText === 'Mute' ? <IoMdMic /> : <IoMdMicOff />}
                </button>
                <button
                  className="ml-3 btn btn-lg btn-light rounded-pill "
                  onClick={handlePauseVideo}
                >
                  {pauseVideoText === 'Pause Video' ? (
                    <BsCameraVideo />
                  ) : (
                    <BsCameraVideoOff />
                  )}
                </button>
                <button className="ml-3 btn btn-lg btn-light rounded-pill ">
                  <BsChatDots />
                </button>
                <button
                  className="ml-3 btn btn-lg btn-light rounded-pill "
                  onClick={() => setOnForm(true)}
                >
                  <AiOutlineFileAdd />
                </button>
                <button
                  className="ml-3 btn btn-lg btn-danger rounded-pill "
                  onClick={leave}
                >
                  <HiOutlinePhoneMissedCall />
                </button>
              </div>
            </div>
          </div>
        </div>
        {auth?.role === 'doctor' && onForm ? (
          <div className="col-span-1">
            <form>
              <div className="sticky flex flex-col col-span-2 px-3 py-2 shadow-lg md:col-span-1 xl:col-span-1 lg:col-span-1">
                <div className="px-5 py-2 rounded-md t412 mt-4 bg-[#FEE1DD] text-[#D47373] ">
                  Please fill the prescription or check prescription not
                  required before leaving consultation.
                </div>
                <div className="t414 text-[#1C1C1C] mt-4">Name: {patientDetails?.name} </div>
                <div className="t414 text-[#1C1C1C] mt-4">Symtoms/Issue</div>
                <div className="mt-1">
                  <input
                    className="py-2 pl-2 rounded-md border w-full text-[12px] font-normal text-[#666666] outline-none"
                    placeholder="STI"
                    id="issue"
                    name="issue"
                    type="text"
                    value={formik.values.issue}
                    onChange={formik.handleChange}
                  />
                </div>
                {formik.errors.issue ? (
                  <p className="text-xs text-red-600 ">{formik.errors.issue}</p>
                ) : null}
                <div className="t414 text-[#1C1C1C] mt-4">Facing Since</div>
                <div className="mt-1">
                  <input
                    className="py-2 pl-2 rounded-md border w-full text-[12px] font-normal text-[#666666] outline-none"
                    placeholder="Since 2 months"
                    id="since"
                    name="since"
                    type="text"
                    value={formik.values.since}
                    onChange={formik.handleChange}
                  />
                </div>
                {formik.errors.since ? (
                  <p className="text-xs text-red-600 ">{formik.errors.since}</p>
                ) : null}
                <div className="t414 text-[#1C1C1C] mt-4">Diagnosis</div>
                <div className="mt-1">
                  <input
                    className="py-2 pl-2 rounded-md border w-full text-[12px] font-normal text-[#666666] outline-none"
                    placeholder="e.g: Mild Balantis"
                    id="diagnosis"
                    name="diagnosis"
                    type="text"
                    value={formik.values.diagnosis}
                    onChange={formik.handleChange}
                  />
                </div>
                {formik.errors.diagnosis ? (
                  <p className="text-xs text-red-600 ">
                    {formik.errors.diagnosis}
                  </p>
                ) : null}
                <div className="t414 text-[#1C1C1C] mt-4">
                  Treatment & Medication
                </div>
                <div className="mt-1">
                  <input
                    className="py-2 pl-2 rounded-md border w-full text-[12px] font-normal text-[#666666] outline-none"
                    placeholder="e.g: Ibuprofen 500mg"
                    id="medicine"
                    name="medicine"
                    type="text"
                    value={formik.values.medicine}
                    onChange={formik.handleChange}
                  />
                </div>
                {formik.errors.medication ? (
                  <p className="text-xs text-red-600 ">
                    {formik.errors.medication}
                  </p>
                ) : null}
                <div className="t414 text-[#1C1C1C] mt-4">General Advice</div>
                <div className="mt-1">
                  <input
                    className="py-2 pl-2 rounded-md border w-full text-[12px] font-normal text-[#666666] outline-none"
                    placeholder="e.g: Avoid oily foods"
                    id="advice"
                    name="advice"
                    type="text"
                    value={formik.values.advice}
                    onChange={formik.handleChange}
                  />
                </div>
                {formik.errors.advice ? (
                  <p className="text-xs text-red-600 ">
                    {formik.errors.advice}
                  </p>
                ) : null}
                <div
                  className="mt-4 flex justify-center cursor-pointer hover:shadow-lg bg-[#7367f0] text-white rounded-md px-5 py-1.5 mx-1"
                  onClick={formik.handleSubmit}
                >
                  Save
                </div>
              </div>
            </form>
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
};
