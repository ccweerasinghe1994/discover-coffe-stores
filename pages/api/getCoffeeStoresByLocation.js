import {fetchCoffeeStores} from "../../lib/coffee-store";

const getCoffeeStoresByLocation = async (req,res)=>{

    try {
        const {latLong,limit} =req.query;
        const data = await fetchCoffeeStores(latLong, limit);
        res.status(200).json(data)
    }catch (error) {
        console.log("ops something went wrong",error);
        res.status(500).json({message:"internal server error",error})
    }

}


export default getCoffeeStoresByLocation;