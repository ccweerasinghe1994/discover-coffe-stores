const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env["AIRTABLE_API_KEY"]}).base(process.env["AIRTABLE_BASE_ID"]);

export const table = base('coffee-stores');


export const getMinifiedCoffeeStores = (records)=>{

    return records.map(({fields}) => ({
        ...fields
    }))
}