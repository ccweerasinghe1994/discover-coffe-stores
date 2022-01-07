import {findRecordByFilter, getMinifiedCoffeeStores, table} from "../../lib/airtable";



const createCoffeeStore = async (req, res) => {
    if (req.method === "POST") {
        try {

            const {
                id,
                name,
                locality,
                region,
                voting,
                imageUrl,
                cross_street
            } = req.body;

            if (id){
                const records = await findRecordByFilter(id)

                if (records.length !== 0) {
                    res.json(records)
                } else {

                    if (name){
                        const createRecord = await table.create([
                            {
                                fields: {
                                    id,
                                    name,
                                    locality,
                                    region,
                                    voting,
                                    imageUrl,
                                    cross_street
                                }
                            }
                        ])
                        const record = getMinifiedCoffeeStores(createRecord)
                        res.json(record)
                    }else{
                        res.status(400).json({message:"name is missing"})
                    }

                }

            }else{
                res.status(400).json({message:"id is missing"})
            }

        } catch (error) {
            console.error("Error creating or finding store", error)
            res.status(500).json({message: "Error creating or finding store", error})
        }
    } else {
        res.json({message: "this is a GET request"})
    }

}

export default createCoffeeStore;