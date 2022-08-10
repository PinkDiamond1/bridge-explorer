import axios from "axios";

const call_uri = async (nftUri:any) => {
    try {
        const res = await axios.get(nftUri);
        return res.data;
    } catch (error:any) {
        console.log(error?.message);
    }
};

const parse_Data = async (uridata:any) => {
    let originalTokenId = "";
    const originalChainNonce = uridata?.wrapped?.origin;

    if (originalChainNonce === "2") {
        let nonce: any = Number(uridata?.wrapped?.nonce);
        nonce = nonce.toString(16);
        originalTokenId = uridata?.wrapped?.tokenId + `-0${nonce}`;
    } else {
        originalTokenId = uridata?.wrapped?.tokenId;
    }

    const originalContract = uridata?.wrapped?.contract;
    console.log({
        originalContract,
        originalTokenId: originalTokenId?.toString(),
        originalChainNonce,
    });
    return { originalContract, originalTokenId, originalChainNonce };
};


export const updateUnfreezTrxs = async (unfreezTrxs:any) => {
    for (const item of unfreezTrxs) {
        console.log(item.fromHash);
        if (item.nftUri === "") continue;
        const uriResp = await call_uri(item.nftUri);
        if (!uriResp) continue;
        const parsedData = await parse_Data(uriResp);
        if (!parsedData.originalTokenId) continue;
        return parsedData;
    }
};
