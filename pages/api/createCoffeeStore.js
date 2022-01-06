import {getMinifiedCoffeeStores, table} from "../../lib/airtable";



const createCoffeeStore = async (req, res) => {
    if (req.method === "POST") {
        try {

            const {
                id,
                name,
                neighborhood,
                address,
                voting,
                imageUrl
            } = req.body;

            if (id){
                const findCoffeeRecords = await table.select({
                    filterByFormula: `id=${id}`,
                }).firstPage()

                if (findCoffeeRecords.length !== 0) {
                    const records = getMinifiedCoffeeStores(findCoffeeRecords);
                    res.json(records)
                } else {

                    if (name){
                        const createRecord = await table.create([
                            {
                                fields: {
                                    id,
                                    name,
                                    address,
                                    neighborhood,
                                    voting,
                                    imageUrl,
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
            console.log("Error creating or finding store", error)
            res.status(500).json({message: "Error creating or finding store", error})
        }
    } else {
        res.json({message: "this is a GET request"})
    }

}

export default createCoffeeStore;