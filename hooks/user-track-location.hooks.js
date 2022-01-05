import {useContext, useState} from 'react'
import {ACTION_TYPES, StoreContext} from "../store/store-context";

const useTrackLocation = () => {
    const {dispatch} = useContext(StoreContext)
    const [locationErrorMessage, setLocationErrorMessage] = useState("");
    const [isFindingLocation,setIsFindingLocation] = useState(false);

    const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        dispatch({
            type:ACTION_TYPES.SET_LATLONG,
            payload:`${latitude},${longitude}`
        })
        setLocationErrorMessage("");
        setIsFindingLocation(false);
    };
    const error = () => {
        setIsFindingLocation(false);
        setLocationErrorMessage("Unable To retrieve your location");
    };

    const handleTrackLocation = () => {
        setIsFindingLocation(true);
        if (!navigator.geolocation) {
            setIsFindingLocation(false);
            setLocationErrorMessage("GeoLocation is not supported by your browser");
        } else {
            navigator.geolocation.getCurrentPosition(success, error)
        }

    }
    return {
        handleTrackLocation,
        locationErrorMessage,
        isFindingLocation
    }
}

export  default useTrackLocation;