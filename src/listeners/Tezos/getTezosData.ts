import axios from "axios";

export const getTezosCollectionData = async (hash: string) => {
    try {
        let contractAdd;
        let collectionName;
        let contractData;
        let data;
        let uri;

        for (let i = 0; i < 20; i++) {
            data = await axios.get(`https://api.tzkt.io/v1/operations/${hash}`)
            if (data?.data) {
                break;
            }
        }
        if (!data) return;

        const entrypoint = data.data[0]?.parameter?.entrypoint;
        const tokenId = data.data[0]?.parameter?.value?.token_id

        if (entrypoint === "withdraw_nft") {
            contractAdd = data.data[0]?.parameter?.value?.burner;
            collectionName = "WNFT";
        } else {
            contractAdd = data.data[1]?.target?.address;
            collectionName = data.data[1]?.target?.alias?.toUpperCase();
        }

        if (!collectionName && contractAdd) {
            for (let i = 0; i < 20; i++) {
                contractData = await axios.get(`https://api.better-call.dev/v1/contract/mainnet/${contractAdd}`)
                if (contractData?.data) {
                    collectionName = contractData?.data?.alias?.toUpperCase();
                    break;
                }
            }
        }

        if (tokenId && contractAdd) {
            for (let i = 0; i < 20; i++) {
                let uriData = await axios.get(`https://api.better-call.dev/v1/tokens/mainnet/metadata?token_id=${tokenId}&contract=${contractAdd}`)
                if (uriData?.data) {
                    uri = uriData?.data[0]?.display_uri ||  uriData?.data[0]?.artifact_uri || uriData?.data[0]?.thumbnail_uri
                    break;
                }
            }
        }

        console.log("tokenId:", tokenId);
        console.log("contractAdd:", contractAdd);
        console.log("collectionName:", collectionName);
        console.log("uri" ,uri )

        return { tokenId, contractAdd, collectionName, uri }
    } catch (err) {
        console.log(err)
    }
}
