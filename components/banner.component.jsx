const Banner = ({buttonText, handleOnClick}) => (
    <div className="banner__container">
        <h1 className="heading-primary">
            <div className="heading-primary--main">Coffee</div>
            <div className="heading-primary--sub">connoisseur</div>
        </h1>
        <h2 className="heading-secondary">Discover your Local Coffee Shops</h2>

            <button onClick={handleOnClick} className="button m-t-2 m-b-2">
                {buttonText}
            </button>

    </div>
);

export default Banner;
