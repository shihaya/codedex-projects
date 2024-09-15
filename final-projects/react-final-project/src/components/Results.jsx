import React, {useContext} from "react";
import {UserContext} from "./UserContext.jsx";

export default function Results({ element, artwork: artwork }) {
    const { name } = useContext(UserContext);

    return (
        <>
            <p className="result">
                <strong>{name}</strong>, your theme is: <strong>{element}</strong>.
            </p>
            {artwork ? (
                <div className="artwork">
                    <h2>{artwork.title}</h2>
                    <img src={artwork.primaryImage} alt={artwork.title} />
                    <p>{artwork.artistDisplayName}</p>
                    <p>{artwork.objectDate}</p>
                </div>
            ) : (
                <p>No artwork found.</p>
            )}
        </>
    );
}