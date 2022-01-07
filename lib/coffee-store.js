import {createApi} from 'unsplash-js';

// on your node server


const getCoffeeStoresNearMeLocations = async (query = "coffee", latlong = '6.91%2C79.86', limit = 10) => {
    try {
        const options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: process.env["NEXT_PUBLIC_FOUR_SQUARE_PLACES_API_KEY"]
            }
        };

        const response = await fetch(`https://api.foursquare.com/v3/places/nearby?ll=${latlong}&query=${query}&limit=${limit}`, options);

        const {results} = await response.json();
        return results.map(({name, fsq_id, location: {locality, cross_street, region}}) => ({
            name,
            id: fsq_id,
            locality,
            cross_street,
            region,
            voting:0
        }));
    } catch (error) {
        console.error("getting error trying to get Foursquare api data", error)
    }


}
const getImagesFromUnsplashApi = async (limit = 10) => {


    try {
        const unsplashApi = createApi({
            accessKey: process.env["NEXT_PUBLIC_UNSPLASH_ACCESS_KEY"],
            //...other fetch options
        });

        const photos = await unsplashApi.search.getPhotos({
            query: 'coffee shops',
            perPage: limit,

        });

        return photos.response.results.map(
            result => result.urls.small
        )
    } catch (error) {
        console.error("error trying to get images from unsplash API", error)
    }

}

export const fetchCoffeeStores = async (latlong, limit) => {
    const PhotosLinks = await getImagesFromUnsplashApi(limit);
    const coffeeStoreNearMe = await getCoffeeStoresNearMeLocations("coffee", latlong, limit);


    return coffeeStoreNearMe.map(
        (coffeeData, index) => {
            return {
                ...coffeeData,
                region: coffeeData.region || "Western Province",
                locality: coffeeData.locality || "Colombo",
                cross_street: coffeeData.cross_street || "",
                imageUrl: PhotosLinks[index]
            }
        }
    )


}

