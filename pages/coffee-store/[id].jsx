import {useRouter} from "next/router";
import Link from "next/link";
import Image from 'next/image';
import {fetchCoffeeStores} from "../../lib/coffee-store";

export async function getStaticProps(staticProps) {
    const params = staticProps.params;
    const coffeeStoresData = await fetchCoffeeStores();
    const findCoffeeStoreById = coffeeStoresData.find(coffeeStore => {
        return coffeeStore.id.toString() === params.id
    })
    console.log("findCoffeeStoreById",findCoffeeStoreById)
    return {
        props: {
            coffeeStore: findCoffeeStoreById?findCoffeeStoreById:{}
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

const Id = (props) => {
    const router = useRouter();
    if (router.isFallback) {
        return <div>Loading...</div>
    }
    const handleVote = () => {
        console.log("handle Vote")
    }
    const {name, locality, cross_street, imageUrl} = props.coffeeStore;
    return (
        <div className={"coffee-store-page"}>
            <div className={"coffee-store-page__link-wrapper"}>
                <Link href="/">
                    <a>&larr;{" "}back to home</a>
                </Link>
            </div>
            <h2 className={"heading-secondary m-t-1 m-b-2"}>{name}</h2>
            <div className={"coffee-store-page__layout m-t-1"}>

                <Image className={"coffee-store-page__image"} layout={"responsive"} alt={name} src={imageUrl}
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


export default Id;