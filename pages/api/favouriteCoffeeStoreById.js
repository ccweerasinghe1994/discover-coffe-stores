import {findRecordByFilter, getMinifiedCoffeeStores, table} from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
    if (req.method === "PUT") {
        const {id} = req.body;
 try {
     if (id) {
         const records = await findRecordByFilter(id);
         if (records.length!==0){
             const record = records[0];
             const calculateVoting = parseInt(record.voting)+1;
             const updateRecord = await table.update([
                 {
                     id:record.recordId,
                     fields:{
                         voting:calculateVoting
                     }
                 }
             ])
            if (updateRecord){
                const data = getMinifiedCoffeeStores(updateRecord)
             res.json(data)
            }else{
                res.status(500).json({message:"error updating the database"})
            }
         }else{
             res.status().json({message:"id could ot be found on the database"})
         }

     }else{
         res.status(400).json({message:"id is missing"})
     }
 }catch (error) {
     console.error("Something went wrong",error);
     res.status(500).tjson({message:"Something went wrong",error})
 }
    } else {
        res.status(405).json({message: "this method not allowed"})
    }
}

export default favouriteCoffeeStoreById;