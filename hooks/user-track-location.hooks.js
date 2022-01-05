import {useState} from 'react'

const userTrackLocation = () => {

    const [locationErrorMessage, setlocationErrorMessage] = useState("");
    const [latLong, setLatLong] = useState("");
    const [isFindingLocation,setIsFindingLocation] = useState(false);

    const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLatLong(`${latitude},${longitude}`);
        setlocationErrorMessage("");
        setIsFindingLocation(false);
    };
    const error = () => {
        setIsFindingLocation(false);
        setlocationErrorMessage("Unable To retrieve your location");
    };

    const handleTrackLocation = () => {
        setIsFindingLocation(true);
        if (!navigator.geolocation) {
            setIsFindingLocation(false);
            setlocationErrorMessage("GeoLocation is not supported by your browser");
        } else {
            navigator.geolocation.getCurrentPosition(success, error)
        }

    }
    return {
        latLong,
        handleTrackLocation,
        locationErrorMessage,
        isFindingLocation
    }
}

export  default userTrackLocation;