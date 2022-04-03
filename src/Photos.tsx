import React, { useEffect, useState } from "react";
import photoBackground from "./Assets/Add_picture.png";
import plus from "./Assets/Plus_button.png";
import deleteIcon from "./Assets/Delete_photo_icon.png";

const Photos = (props: {username: string, photos: File[], setPhotos: React.Dispatch<React.SetStateAction<File[]>>, back: JSX.Element}) => {
    // const [photos, setPhotos] = useState<File[]>([]);
    const [hoveringIndex, setHoveringIndex] = useState(-1);

    const addPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.item(0);
        if(!file) return;
        props.setPhotos([...props.photos, file]);
        const formData = new FormData();
        formData.append("photo", file ?? "");
        fetch(`http://localhost:3000/photo/${props.username}`, {
            method: "POST",
            body: formData
        })
        .then(res => {
            console.log(res);
        })
        .catch(error => console.log("there was an error " + error))
    }

    const changePhoto = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.item(0);
        if(!file) return;
        const nextPhotos = [...props.photos];
        nextPhotos[index] = file;
        props.setPhotos([...nextPhotos]);
        const formData = new FormData();
        formData.append("photo", file ?? "");
        fetch(`http://localhost:3000/photo/${props.username}?id=${index}`, {
            method: "PUT",
            body: formData
        })
        .then(res => {
            console.log(res);
        })
        .catch(error => console.log("there was an error " + error))
    }

    const deletePhoto = (index: number) => {
        props.setPhotos([...props.photos.slice(0, index), ...props.photos.slice(index + 1)]);
        // props.setPhotos([...props.photos].splice(index, 1));
        fetch(`http://localhost:3000/photo/${props.username}?id=${index}`, {
            method: "DELETE"
        })
        .then(res => {
            console.log(res);
        })
        .catch(error => console.log("there was an error " + error))
    }

    let objURL = "";

    const photosDisplay = Array(6).fill(0).map((photo, i) => 
    <div className="photoContainer" onMouseEnter={() => setHoveringIndex(i)} onMouseLeave={() => setHoveringIndex(-1)} style={i < props.photos.length ? {} : {backgroundImage: `url(${photoBackground})`, backgroundSize: "280px 280px"}} key={`photo${i}`}>
        {/* <img className="photoBackground" src={photoBackground} alt="" /> */}
        {i < props.photos.length ? <div className="addPhotoContainer"><input className="addPhoto" type="file" onChange={e => changePhoto(e, i)} accept="image/*"/>
        <img className="photo" src={URL.createObjectURL(props.photos[i])} onLoad={() => URL.revokeObjectURL(objURL)} alt="Photo" />
        {hoveringIndex === i ? <button className="deletePhoto" onClick={() => deletePhoto(i)} style={{backgroundImage: `url(${deleteIcon})`}}></button> : ""}</div> 
        // : i === photos.length ? <div className="addPhotoContainer"><input className="addPhoto" type="file" onChange={handlePictureChange} accept="image/*"/><img className="plus" src={plus} alt="Add photo" /></div>
        : i === props.photos.length ? <div className="addPhotoContainer"><input className="addPhoto" type="file" onChange={addPhoto} accept="image/*"/><img className="plus" src={plus} alt="Add photo" /></div>
        : ""}
    </div>
    )

    return (
    <div className="module">
        <div className="photosModule">
            <h1 className="middleTitle">Photos</h1>
            <div className="photos">{photosDisplay}</div>
        </div>
        {/* <div className="back" onClick={props.back}>Back</div> */}
        {props.back}
    </div>
    );
};

export default Photos;
