import React, { useState } from "react";
import photoBackground from "./Assets/Add_picture.png";

interface MyFile extends File {
    lastModifiedDate: any;
}

interface ILoginProps {
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, email: string, password: string, picture: File | null) => Promise<boolean>;
}

const Login = (props : ILoginProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [picture, setPicture] = useState<File | null>(null);
    const [pictureSrc, setPictureSrc] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const login = async () => {
        // send a post request to server
        const success = await props.login(username, password);
        if(!success) {
            setErrorMessage("Incorrect username and password");
            return;
        }
    };

    const register = async () => {
        // Give error messages when user inputs invalid entries
        // Check if there is only 1 @ in the email
        if((email.match(/@/g)?.length ?? 0) !== 1) {
            setErrorMessage("Please enter a valid email");
            return;
        }
        if(password !== confirmPassword) {
            setErrorMessage("Passwords must match");
            return;
        }
        const success = await props.register(username, email, password, picture);
        if(!success) {
            setErrorMessage("Username already taken");
            return;
        }
        else{
            setErrorMessage("Account created!");
        }
        setIsRegistering(false);
        // const realPicture = picture as MyFile;
        // const pictureData: {[key:string]:any} = {};
        // const propNames = ["lastModified", "lastModifiedDate", "name", "size", "type"];
        // if(realPicture){
            //     for(let prop in Object.keys(realPicture)){
                //         console.log(prop);
                //     }
                // }
        // const pictureData: {[key:string]:any} = {
        //     "lastModified": realPicture.lastModified,
        //     "lastModifiedDate": realPicture.lastModifiedDate,
        //     "name": realPicture.name,
        //     "size": realPicture.size,
        //     "type": realPicture.type,
        // };
    }

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPicture = e.target.files?.item(0);
        if(newPicture) {
            setPicture(newPicture);
            const pictureURL = URL.createObjectURL(newPicture);
            setPictureSrc(pictureURL);
        }
    }

    const cleanUpPictureURL = () => {
        URL.revokeObjectURL(pictureSrc);
    }

    const loginDisplay = <div className="loginModule">
        <div className="loginInputs">
            <input type="text" placeholder="Username" onChange={handleUsernameChange} value={username} required/>
            <input type="password" placeholder="Password" onChange={handlePasswordChange} value={password} required/>
        </div>
        <div className="confirmLogin">
            <div className="errorMessage">{errorMessage}</div>
            <div className="loginButton" onClick={login}>Login</div>
            <div className="changeLoginContainer">New to the challenge? <div className="changeLoginText" onClick={() => setIsRegistering(true)}>Sign up</div></div>
        </div>
    </div>

    const registerDisplay = <div className="loginModule">
    <div className="loginInputs">
        <input type="text" placeholder="Username" onChange={handleUsernameChange} value={username} required/>
        <input type="email" placeholder="Email" onChange={handleEmailChange} value={email} required/>
        <input type="password" placeholder="Password" onChange={handlePasswordChange} value={password} required/>
        <input type="password" placeholder="Confirm password" onChange={handleConfirmPasswordChange} value={confirmPassword} required/>
    </div>
    <div className="addProfilePicture">
        <div><input className="addPicture" type="file" onChange={handlePictureChange} accept="image/*"/></div>
        {picture ? <div><img className="registerPicture" onLoad={cleanUpPictureURL} src={pictureSrc} alt=""/></div>
         : <div><img className="addPictureBackground" src={photoBackground} alt=""/></div>}
    </div>
    <div className="confirmLogin">
        <div className="errorMessage">{errorMessage}</div>
        <div className="loginButton" onClick={register}>Register</div>
        <div className="changeLoginContainer">Already have an account? <div className="changeLoginText" onClick={() => setIsRegistering(false)}>Login</div></div>
    </div>
    </div>

    return (
    <div className="module">
        <div className="middleTitle"><h1>Dev Challenge</h1></div>
        
        {isRegistering ? registerDisplay : loginDisplay}
    </div>
    );
};

export default Login;
