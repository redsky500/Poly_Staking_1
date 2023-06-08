import api from "../api/iterceptor";

export const setNFTCollection = async (payload) => {
  try {
    const response = await api.post("/nft/store-nft", payload);
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getNFTCollection = async () => {
  try {
    const response = await api.get("/nft/get-nft");
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const updateNFT = async (payload) => {
  try {
    const response = await api.post(`/nft/update-nft`, payload);
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const updateAllNFT = async (payload) => {
  try {
    const response = await api.post(`/nft/update-all-nft`, payload);
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const lotteryTableContent = async () => {
  try {
    const response = await api.get(`/nft/lottery-table-nfts`);
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const updateLevelAfterLotteryEnd = async () => {
  try {
    const response = await api.get(`/nft/update-staked-level`);
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
}
