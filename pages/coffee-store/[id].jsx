import {useRouter} from "next/router";
import Link from "next/link";
import Image from 'next/image';
import {fetchCoffeeStores} from "../../lib/coffee-store";
import {useContext, useEffect, useState} from "react";
import {StoreContext} from "../../store/store-context";
import {isEmpty} from "../../utils";

export async function getStaticProps(staticProps) {
    const params = staticProps.params;
    console.log("params.id: ", params.id)
    const coffeeStoresData = await fetchCoffeeStores();
    const findCoffeeStoreById = coffeeStoresData.find(coffeeStore => {
        return coffeeStore.id.toString() === params.id
    })

    return {
        props: {
            coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
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
    if (router.isFallback) {
        return <div>Loading...</div>
    }
    const id = router.query.id;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {state} = useContext(StoreContext);
    const {coffeeStoresFromContext} = state;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {

        if (isEmpty(initialProps.coffeeStore)) {

            if (coffeeStoresFromContext.length > 0) {
                console.log("coffeeStoresFromContext.length > 0")
                const findCoffeeStoreById = coffeeStoresFromContext.find(
                    (coffeeStore) => {
                        return coffeeStore.id.toString() === id.toString();
                    }
                )
                    setCoffeeStore(findCoffeeStoreById)
            }
        }
    }, [id]);



    const handleVote = () => {
        console.log("handle Vote")
    }


    const {name, locality, cross_street, imageUrl} = coffeeStore;
    return (
        <div className={"coffee-store-page"}>
            <div className={"coffee-store-page__link-wrapper"}>
                <Link href="/">
                    <a>&larr;{" "}back to home</a>
                </Link>
            </div>
            <h2 className={"heading-secondary m-t-1 m-b-2"}>{name}</h2>
            <div className={"coffee-store-page__layout m-t-1"}>

                <Image className={"coffee-store-page__image"} layout={"responsive"} alt={name} src={"https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"}
                       width={600}
                       height={360}/>

                <div className={"coffee-store-page__card glass"}>
                    <div className={"flex-start m-t-1"}>
                        <div className={"m-l-1"}><Image alt={"icon"} src={"/static/icons/location.png"} height={24}
                                                        width={24}/></div>
                        <div className={"coffee-store-page__card-text m-l-1"}> {locality}</div>
                    </div>
                    <div className={"flex-start m-t-1"}>
                        <div className={"coffee-store-page__card-icon m-l-1"}><Image alt={"icon"}
                                                                                     src={"/static/icons/favorites.png"}
                                                                                     height={24}
                                                                                     width={24}/>
                        </div>
                        <div className={"coffee-store-page__card-text m-l-1"}> {cross_street}</div>
                    </div>
                    <p>1</p>

                    <button onClick={handleVote} className={"button m-t-2 m-l-1"}>Up Vote !</button>
                </div>
            </div>

        </div>
    )

}


export default CoffeeStore;