const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env["AIRTABLE_API_KEY"]}).base(process.env["AIRTABLE_BASE_ID"]);

export const table = base('coffee-stores');


export const getMinifiedCoffeeStores = (records) => {

    return records.map(({fields,id}) => ({
        ...fields,
        recordId:id
    }))
}

export const findRecordByFilter = async (id) => {
    const findCoffeeRecords = await table.select({
        filterByFormula: `id="${id}"`,
    }).firstPage()

    return getMinifiedCoffeeStores(findCoffeeRecords);

}