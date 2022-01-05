import Link from 'next/link';
import Image from 'next/image';

const Card = ({href, imageUrl, name}) => (

    <Link href={href}>
        <a className={"card-link "}>
            <div className={"card glass"}>
                <h2 className={"heading-tertiary m-t-2 "}>{name} </h2>
                <div className="card__image--wrapper m-t-2">
                    <Image className={"card__image"} src={imageUrl} height={160} width={260} alt={"card image"}/>
                </div>
            </div>
        </a>
    </Link>
)

export default Card;