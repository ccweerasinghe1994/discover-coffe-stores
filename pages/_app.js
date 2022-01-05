import "../styles/globals.scss";
import StoreProvider from "../store/store-context";

function MyApp({Component, pageProps}) {
    return (
        <StoreProvider>
            <Component {...pageProps} />

        </StoreProvider>
    );
}

export default MyApp;
