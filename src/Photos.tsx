import React, { useEffect, useState } from "react";
import photoBackground from "./Assets/Add_picture.png";
import plus from "./Assets/Plus_button.png";

const Photos = (props: {username: string, photos: File[], setPhotos: React.Dispatch<React.SetStateAction<File[]>>, back: () => void}) => {
    // const [photos, setPhotos] = useState<File[]>([]);

    useEffect(() => {
        props.setPhotos(props.photos);
    }, [])

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.item(0);
        if(file) props.setPhotos([...props.photos, file]);
        const formData = new FormData();
        formData.append("picture", file ?? "");
        fetch(`http://localhost:3000/photo/${props.username}`, {
            method: "POST",
            body: formData
        })
        .then(res => {
            console.log(res);
        })
        .catch(error => console.log("there was an error " + error))
    }

    const photosDisplay = Array(6).fill(0).map((photo, i) => 
    <div className="photoContainer" style={{backgroundImage: `url(${photoBackground})`}} key={`photo${i}`}>
        {/* <img className="photoBackground" src={photoBackground} alt="" /> */}
        {i < props.photos.length ? <div><img className="photo" src={URL.createObjectURL(props.photos[i])} alt="Photo" /></div> 
        // : i === photos.length ? <div className="addPhotoContainer"><input className="addPhoto" type="file" onChange={handlePictureChange} accept="image/*"/><img className="plus" src={plus} alt="Add photo" /></div>
        : i === props.photos.length ? <div className="addPhotoContainer"><input className="addPhoto" type="file" onChange={handlePictureChange} accept="image/*"/><img className="plus" src={plus} alt="Add photo" /></div>
        : ""}
    </div>
    )

    return (
    <div className="module">
        <div className="photosModule">
            <h1 className="middleTitle">Photos</h1>
            <div className="photos">{photosDisplay}</div>
        </div>
        <div className="back" onClick={props.back}>Back</div>
    </div>
    );
};

export default Photos;
