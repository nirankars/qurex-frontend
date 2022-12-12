import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "487313108aca464bb93de894daedc887";
const token =
  "007eJxTYAgRvZivzK/DtYhRgmPWEqUV11eospcsTVBODN0hN/VJ6V4FBhMLc2NDY0MDi8TkRBMzk6QkS+OUVAtLk5TE1JRkCwvzgOPTkhsCGRmu7f7KwsgAgSA+K0NgaVFqBQMDAFaaHcM=";

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "Qurex";
