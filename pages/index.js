import Head from "next/head";
import Image from "next/image";
import Banner from "../components/banner.component";
import Card from "../components/card/card.component";
import {fetchCoffeeStores} from "../lib/coffee-store";
import useTrackLocation from '../hooks/user-track-location.hooks';
import {useContext, useEffect, useState} from "react";
import {ACTION_TYPES, StoreContext} from "../store/store-context";


export async function getStaticProps(context) {
    const coffeeStores = await fetchCoffeeStores();


    return {
        props: {
            coffeeStores
        }
    }

}

export default function Home({coffeeStores}) {
    const {dispatch,state} = useContext(StoreContext);
    const {latLong,coffeeStoresFromContext}  = state;
    const [coffeeStoresFromState, setCoffeeStores] = useState("");
    const [coffeeStoresError, setCoffeeStoresError] = useState(null);

    const {locationErrorMessage, handleTrackLocation, isFindingLocation} = useTrackLocation();
    const handleOnBannerButtonClick = () => {
        handleTrackLocation();
    };
    useEffect(async () => {

        if (latLong) {
            try {

                const limit = 12;
                const response = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=${limit}`);
                const data = await response.json();

                dispatch({
                    type:ACTION_TYPES.SET_COFFEE_STORES,
                    payload:data
                })
            } catch (error) {
               setCoffeeStoresError(error.message)
            }
        }


    }, [dispatch,latLong])
    return (
        <div className="home-page">
            <Head>
                <title>Coffee connoisseur</title>
                <meta name="description" content="Generated by create next app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="home-page__main">
                <Banner
                    buttonText={isFindingLocation ? "Locating..." : "View Stores nearby"}
                    handleOnClick={handleOnBannerButtonClick}
                />
                {
                    locationErrorMessage && <p>Something went Wrong:{locationErrorMessage}</p>
                }
                {
                    coffeeStoresError &&  <p>Something went Wrong:{coffeeStoresError}</p>
                }
                <div className="hero-image">
                    <Image src={"/static/coffee.png"} width={512} height={512} alt={"hero image"}/>
                </div>
                {
                    coffeeStoresFromContext.length>0 &&(
                        <div className={"m-t-4"} >
                            <h2 className="heading-secondary ">Coffee Shops near you</h2>
                            <div className="card-layout m-t-4 ">
                                {

                                    coffeeStoresFromContext.map(
                                        ({id, name, imageUrl}) => (
                                            <Card key={id} name={name} href={`/coffee-store/${id}`}
                                                  imageUrl={imageUrl}/>
                                        )
                                    )
                                }


                            </div>
                        </div>
                    )
                }
                <h2 className="heading-secondary">Colombo 7 Coffee Shops</h2>
                <div className="card-layout m-t-4 ">
                    {
                        coffeeStores.map(
                            ({id, name, imageUrl}) => (
                                <Card key={id} name={name} href={`/coffee-store/${id}`}
                                      imageUrl={imageUrl}/>
                            )
                        )
                    }


                </div>


            </main>
        </div>
    );
}
