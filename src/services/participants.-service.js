import api from "../api/iterceptor";

export const storParticipants = async (payload) => {
  try {
    const response = await api.post("/participants/store-participants", payload);
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getLotteryParticipants = async (payload) => {
  try {
    const response = await api.post("/participants/get-lottery-participants", payload);
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};
