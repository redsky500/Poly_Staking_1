import api from "../api/iterceptor";

export const getPrizeList = async () => {
  try {
    const response = await api.get("/prize-list");
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const storPrize = async (payload) => {
  try {
    const response = await api.post("/prize-list/store-prize", payload);
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const deletePrize = async () => {
  try {
    const response = await api.delete("/prize-list/delete-all-prize");
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const updatePrize = async (payload) => {
  try {
    const response = await api.post(`/prize-list/update-prize`, payload);
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const updateClaimPrize = async (payload) => {
  try {
    const response = await api.post(`/prize-list/update-claimed-prize`, payload);
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const getCurrentLotteryById = async (payload) => {
  try {
    const response = await api.post(`/prize-list/currentLottery`, payload);
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
}