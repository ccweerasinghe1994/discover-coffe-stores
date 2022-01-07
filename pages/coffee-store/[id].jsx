import {useRouter} from "next/router";
import Link from "next/link";
import Image from 'next/image';
import {fetchCoffeeStores} from "../../lib/coffee-store";
import {useContext, useEffect, useState} from "react";
import {StoreContext} from "../../store/store-context";
import {isEmpty} from "../../utils";
import useSWR from 'swr';
const fetcher = (...args) => fetch(...args).then(res => res.json());

export async function getStaticProps(staticProps) {
    const params = staticProps.params;
    const coffeeStoresData = await fetchCoffeeStores();
    const coffeeStoresFromContextNew = coffeeStoresData.find(coffeeStore => {
        return coffeeStore.id.toString() === params.id
    })

    return {
        props: {
            coffeeStore: coffeeStoresFromContextNew ? coffeeStoresFromContextNew : {},
        }
    }
}

export async function getStaticPaths() {
    const coffeeStoresData = await fetchCoffeeStores();
    const paths = coffeeStoresData.map(coffeeStoreData => {
        return {
            params: {
                id: coffeeStoreData.id.toString()
            }
        }
    })
    return {
        paths,
        fallback: true,
    }
}

const CoffeeStore = (initialProps) => {

    const router = useRouter();
    if(router.isFallback ){
      return  <div>Lording</div>
    }
    const id = router.query.id;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
    console.log("initialProps.coffeeStore",initialProps.coffeeStore)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {state} = useContext(StoreContext);
    const {coffeeStoresFromContext} = state;

    const handleCreateCoffeeStore = async (coffeeStoreData) => {
        const {id, name, imageUrl, locality, region, cross_street} = coffeeStoreData;
        try {
            const response = await fetch("/api/createCoffeeStore", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    name,
                    imageUrl,
                    cross_street,
                    voting:0,
                    region,
                    locality

                })
            })


            const dbCoffeeStore = await response.json();

        } catch (error) {
            console.error("error creating a coffee store", error)
        }
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {

        if (isEmpty(initialProps.coffeeStore)) {

            if (coffeeStoresFromContext.length > 0) {
                const coffeeStoresFromContextNew = coffeeStoresFromContext.find(
                    (coffeeStore) => {
                        return coffeeStore.id.toString() === id;
                    }
                )
                if (coffeeStoresFromContextNew) {
                    setCoffeeStore(coffeeStoresFromContextNew);
                    handleCreateCoffeeStore(coffeeStoresFromContextNew);

                }
            }
        } else {
            handleCreateCoffeeStore(initialProps.coffeeStore)
        }
    }, [id, initialProps, initialProps.coffeeStore,coffeeStoresFromContext]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [votingCount, setVotingCount] = useState(0);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {data, error} = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {

        if (data && data.length > 0) {
            setCoffeeStore(data[0]);
            setVotingCount(data[0].voting)
        }
    }, [data]);


    const handleVote = async () => {
        try {
            const response = await fetch("/api/favouriteCoffeeStoreById", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                })
            })


            const dbUpdateCoffeeStore = await response.json();


           if(dbUpdateCoffeeStore && dbUpdateCoffeeStore.length>0){

               setVotingCount(dbUpdateCoffeeStore[0].voting);
           }

        } catch (error) {
            console.error("error Updating coffee store", error)
        }
    }
    if (error) {
        return <div>Something went wrong when retrieving coffee store data</div>
    }

    const { name, imageUrl, locality, region, cross_street} = coffeeStore;
    return (
        <div className={"coffee-store-page"}>
            <div className={"coffee-store-page__link-wrapper"}>
                <Link href="/">
                    <a>&larr;{" "}back to home</a>
                </Link>
            </div>
            <h2 className={"heading-secondary m-t-1 m-b-2"}>{name}</h2>
            <div className={"coffee-store-page__layout m-t-1"}>

                <Image className={"coffee-store-page__image"} layout={"responsive"} alt={name}
                       src={imageUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
                       width={600}
                       height={360}/>

                <div className={"coffee-store-page__card glass"}>
                    <div className={"flex-start m-t-1"}>
                        <div className={"m-l-1"}><Image alt={"icon"} src={"/static/icons/location.png"} height={24}
                                                        width={24}/></div>
                        <div className={"coffee-store-page__card-text m-l-1"}> {region}{" "}{locality}</div>
                    </div>
                    <div className={"flex-start m-t-1"}>
                        <div className={"coffee-store-page__card-icon m-l-1"}><Image alt={"icon"}
                                                                                     src={"/static/icons/favorites.png"}
                                                                                     height={24}
                                                                                     width={24}/>
                        </div>
                        <div className={"coffee-store-page__card-text m-l-1"}> {cross_street ||"Colomobo 7" }</div>
                    </div>
                    <p>{votingCount}</p>

                    <button onClick={handleVote} className={"button m-t-2 m-l-1"}>Up Vote!</button>
                </div>
            </div>

        </div>)


}


export default CoffeeStore;