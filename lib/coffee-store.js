import { createApi } from 'unsplash-js';
import coffeeStoresData from "../data/coffe-stores.json";
// on your node server
const unsplashApi = createApi({
    accessKey: process.env["NEXT_PUBLIC_UNSPLASH_ACCESS_KEY"],
    //...other fetch options
});



export const fetchCoffeeStores = async (latLong ="7.1503,80.058",limit="6")=>{


    const photos = await unsplashApi.search.getPhotos({
        query: 'coffee shops',
        perPage: 10,

    });
    const PhotosLinks = photos.response.results.map(
        result=>result.urls.small
    )
    return coffeeStoresData.map(
        (coffeeData,index)=>{
            return{
                ...coffeeData,
                imageUrl:PhotosLinks[index]
            }
        }
    )

}