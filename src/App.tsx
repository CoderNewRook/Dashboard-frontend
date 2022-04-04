import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import "chart.js/auto"
import './App.css';
import Login from './Login';
import News from './News';
import Clothes from './Clothes';
import Sport from './Sport';
import Photos from './Photos';
import Tasks from './Tasks';

import sunnyIcon from "./Assets/Sun_icon.png";
import cloudyIcon from "./Assets/Clouds_icon.png";
import rainyIcon from "./Assets/Rain_icon.png";
// import previewPhotoBackground from "./Assets/Photo_preview_background.png";
import previewProfile from "./Assets/Add_picture.png";
import backgroundImage from "./Assets/Background.png";
// import container from "./Assets/Background.png";
import tick from "./Assets/Checked.png";

export interface INewsData {
  title: string;
  description: string;
}

interface IWeatherData {
  weather: string;
  temperature: string;
  location: string
}

export interface ISportsData {
  [key: string]: string[];
}

export interface ITaskData {
  task: string;
  completed: boolean;
}

interface IUserData {
  username: string;
  picture: File | null;
}

interface IClothesData {
  [key:string]: number;
}

const weatherIcons : {[key:string]:string} = {
  sunny: sunnyIcon,
  cloudy: cloudyIcon,
  rainy: rainyIcon
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState<IUserData>({username: "Swapnil", picture: null});
  const [weather, setWeather] = useState<IWeatherData>({weather: "cloudy", temperature: "4", location: "London"});
  const [firstNews, setFirstNews] = useState<INewsData>({title: "News title", description: "News description"});
  const [teamsBeaten, setTeamsBeaten] = useState<ISportsData>({});
  const [team, setTeam] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [tasks, setTasks] = useState<ITaskData[]>([]);
  const [clothes, setClothes] = useState<IClothesData>({});
  const [moduleIndex, setModuleIndex] = useState<number | null>(null);
  // const [saveTasksIntervalId, setSaveTasksIntervalId] = useState<number | null>(null);

  const fetchData = () => {
    fetch("http://localhost:3000/mytest")
    .then(res => res.ok ? res.json() : "not ok")
    .then(data => console.log(data))
    .catch(error => console.log("there was an error " + error))
  }

  const backToHome = () => {
    setModuleIndex(null);
  }

  const titleCase = (str: string) => {
    if(str === "") return "";
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

//   const saveTasks = () => {
//     // const task = {task: "", completed: false};
//     // setTasks([...tasks, task])
//     fetch(`http://localhost:3000/tasks/${userData.username}`, {
//         method: "PUT",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify({tasks : tasks})
//     })
//     .then(res => {
//         console.log(res);
//     })
//     .catch(error => console.log("there was an error " + error))
// }


  // useEffect(() => {
  //   window.addEventListener("beforeunload", saveTeam)
  //   return () => {
  //     // console.log("Saving last input team");
  //     window.removeEventListener("beforeunload", saveTeam)
  //   }
  // }, [])

  // const saveTeam = () => {
  //   // const task = {task: "", completed: false};
  //   // setTasks([...tasks, task])
  //   console.log("Saving last input team");
  //   fetch(`http://localhost:3000/sport/team/${userData.username}`, {
  //       method: "PUT",
  //       headers: {"Content-Type": "application/json"},
  //       body: JSON.stringify({team})
  //   })
  //   .then(res => {
  //       console.log(res);
  //   })
  //   .catch(error => console.log("there was an error " + error))
  // }

  const login = async (username: string, password: string) => {
    let success = false;
    console.log(username, password);
    await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    })
    .then(async res => {
        if(res.ok) {
            success = true;
            setUserData(prevData => ({username, picture: null}));
            getDashboardData(username);
          }
          else{
            success = false;
          }
          setLoggedIn(success);
    })
    .catch(error => console.log("there was an error " + error))
    return success;
  }

  const register = async (username: string, email: string, password: string, picture: File | null) => {
    let success = false;
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("picture", picture ?? "");
    await fetch("http://localhost:3000/register", {
        method: "POST",
        body: formData
    })
    .then(res => {
        if(res.ok) {
            success = true;
        }
        else{
            success = false;
        }
    })
    .catch(error => console.log("there was an error " + error))
    return success;
  }

  const getDashboardData = (username: string) => {
    getUserData(username);
    getWeatherData();
    getNewsData();
    getSportData();
    // getTeam();
    getPhotos(username);
    getTasks(username);
    getClothesData();
  }
  
  const responseToFile = async (res: Response) => {
    const file = await res.blob();
    return file as File;
  }

  const getUserData = (username: string) => {
    fetch(`http://localhost:3000/picture/${username}`)
    .then(async res => {
        if(res.ok) {
            const picture = await responseToFile(res);
            setUserData(prevData => ({...prevData, picture}))
          }
          else{
            console.log("User data response not ok");
          }
    })
    .catch(error => console.log("there was an error " + error))
  }

  const getWeatherData = async () => {
    const weatherToBasicWeather = (weather: any) => {
      switch(weather){
          case "Clear":
              return "sunny";
          case "Clouds":
              return "cloudy";
          case "Rain":
          case "Thunderstorm":
          case "Drizzle":
          case "Snow":
              return "rainy";
          default:
              return "cloudy";
      }
    }
  
    // const getWeather = async () => {
    let coords = {lat: 35, lon: 139};
    navigator.geolocation.getCurrentPosition(async pos => {
        console.log(pos);
        coords.lat = pos.coords.latitude;
        coords.lon = pos.coords.longitude;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=d0a10211ea3d36b0a6423a104782130e&units=metric`);
        const data = await response.json();
        console.log(data);
        const temperature = Math.round(Number.parseFloat(data.main.temp)).toString();
        const location = data.name;
        const weather = weatherToBasicWeather(data.weather.main);
        console.log({weather, temperature, location});
        setWeather({weather, temperature, location});
    },
    err => console.log(err),
    { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 });
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=d0a10211ea3d36b0a6423a104782130e&units=metric`);
        // const data = await response.json();
        // console.log(data);
        // const temperature = data.main.temp;
        // const location = data.name;
        // const weather = weatherToBasicWeather(data.weather.main);
        // console.log({weather, temperature, location});
        // setWeather({weather, temperature, location});
    // }
  }

  const getNewsData = () => {
    fetch(`http://localhost:3000/firstNews`)
    .then(async res => {
        if(res.ok) {
            console.log(res);
            const news = await res.json();
            setFirstNews(news);
          }
        else{
          console.log("News response not ok");
        }
    })
    .catch(error => console.log("there was an error " + error))
  }

  const getSportData = () => {
    fetch(`http://localhost:3000/sport`)
    .then(async res => {
        if(res.ok) {
            console.log(res);
            const data = await res.json();
            setTeamsBeaten(data);
          }
        else{
          console.log("Sport response not ok");
        }
    })
    .catch(error => console.log("there was an error " + error))
  }

  // const getTeam = () => {
  //   fetch(`http://localhost:3000/sport/team/${userData.username}`)
  //   .then(async res => {
  //       if(res.ok) {
  //           console.log(res);
  //           const data = await res.json();
  //           setTeam(data.team);
  //         }
  //       else{
  //         console.log("Team response not ok");
  //       }
  //   })
  //   .catch(error => console.log("there was an error " + error))
  // }
  
  const getPhotos = (username: string) => {
    fetch(`http://localhost:3000/photos/${username}`)
    .then(async res => {
        if(res.ok) {
            console.log(res);
            const numOfPhotos = await res.json() as Promise<{numOfPhotos: number}>;
            // Get each photo one by one
            for(let i = 0; i < (await numOfPhotos).numOfPhotos; i++){
              fetch(`http://localhost:3000/photo/${username}?id=${i}`)
              .then(async innerRes => {
                  if(innerRes.ok) {
                      const photo = await responseToFile(innerRes); 
                      setPhotos(prevPhotos => [...prevPhotos, photo])
                      console.log(res)
                    }
                  else{
                    console.log("Photo response not ok");
                  }
              })
              .catch(error => console.log("there was an error inside loop" + error))
            }
          }
        else{
          console.log("Photos response not ok");
        }
    })
    .catch(error => console.log("there was an error " + error))
  }

  const getTasks = (username: string) => {
    fetch(`http://localhost:3000/tasks/${username}`)
    .then(async res => {
        if(res.ok) {
            console.log(res);
            const tasks = await res.json();
            setTasks(tasks);
            // if(saveTasksIntervalId) window.clearInterval(saveTasksIntervalId);
            // setSaveTasksIntervalId(window.setInterval(saveTasks, 2500));
          }
        else{
          console.log("Tasks response not ok");
        }
    })
    .catch(error => console.log("there was an error " + error))
  }

  const getClothesData = () => {
    fetch(`http://localhost:3000/clothes`)
    .then(async res => {
        if(res.ok) {
            console.log(res);
            const clothesData = await res.json();
            setClothes(clothesData);
          }
        else{
          console.log("Clothes response not ok");
        }
    })
    .catch(error => console.log("there was an error " + error))
  }
  
  const weatherPreview = <div className="columnPreview weatherPreview">
    <div className="weatherRow">
      <img src={weatherIcons[weather.weather]} alt="Weather icon" />
      <div className="temperature">{weather.temperature}</div>
    </div>
    <div className="location">{weather.location}</div>
  </div>;

  const newsPreview = <div className="columnPreview newsPreview">
    <div className="newsTitlePreview">{firstNews.title}</div>
    <div>{firstNews.description}</div>
  </div>;

  const sportPreview = <div className="columnPreview">
    <div className="sportTeamName">{team === "" ? "Choose team" : team}</div>
    {team === "" ? "" : <div className="sportTeamsBeaten">Teams beaten: {teamsBeaten[team].length}</div>}
  </div>;

  // let objURL = "";

  const photosPreview = <div className="photosPreviewContainer">
    <div className="photosPreview">
    {Array(4).fill(0).map((dummyElement, i) => {
    let objURL = "";
    // <div className="photoPreview" style={{backgroundImage: `url(${previewProfile})`}} key={`photo${i}`}>
    return <div className="photoPreview" key={`photo${i}`}>
      {/* <img className="previewPhotoBackground" src={previewPhotoBackground} alt="" /> */}
      {i < photos.length ? <img className="previewPhoto" src={objURL = URL.createObjectURL(photos[i])} onLoad={() => URL.revokeObjectURL(objURL)} alt="Uploaded photo" key={`photo${i}`}/> : ""}
    </div>
    })}
    </div>
  </div>;

  // const photosPreview = <div className="photosPreviewContainer">
  //   <div className="photosPreview">
  //   {Array(4).fill(0).map((dummyElement, i) => 
  //     i < photos.length ? <img className="previewPhoto" src={objURL = URL.createObjectURL(photos[i])} onLoad={() => URL.revokeObjectURL(objURL)} alt="Uploaded photo" key={`photo${i}`}/>
  //     : <div className="photoPreview" style={{backgroundImage: `url(${previewProfile})`}} key={`photo${i}`}></div>)}
  //   </div>
  // </div>;

  const tasksPreview = <div className="columnPreview tasksPreview" >
    {tasks.slice(0, 3).map((task, i) => <div className="taskPreview" key={`task${i}`}>
        <div className="taskPreviewText">{task.task}</div>
        <div className="taskPreviewCheckbox">
          {task.completed ? <img className="previewTick" src={tick} alt="Tick" /> : ""}
          <input type="checkbox" className="previewCheckbox" checked={task.completed} disabled/>
        </div>
    </div>)}
  </div>;
  
  const clothesColors = ["red", "blue", "yellow", "green", "purple", "orange", "turquoise", "cyan"];
  const clothesData = {
    labels: Object.keys(clothes).map(clothe => titleCase(clothe)),
    datasets: [{
      label: "Favourite Warmer",
      data: Object.values(clothes),
      backgroundColor: clothesColors.slice(0, Object.keys(clothes).length)
    }],
  };
  const clothesPreview = <div className="clothesPreview"><div className="pieChartPreview"><Pie data={{datasets: clothesData.datasets}}/></div></div>;

  const back = <button className="back" onClick={backToHome}>Back</button>;

  const dashboardModulesData = [
    {title: "Weather", preview: weatherPreview, hasInnerNavigation: false, innerNavigation: <></>},
    {title: "News", preview: newsPreview, hasInnerNavigation: true, innerNavigation: <News back={back}/>},
    {title: "Sport", preview: sportPreview, hasInnerNavigation: true, innerNavigation: <Sport teamsBeaten={teamsBeaten} team={team} setTeam={setTeam} back={back} titleCase={titleCase}/>},
    {title: "Photos", preview: photosPreview, hasInnerNavigation: true, innerNavigation: <Photos username={userData.username} photos={photos} setPhotos={setPhotos} back={back}/>},
    {title: "Tasks", preview: tasksPreview, hasInnerNavigation: true, innerNavigation: <Tasks username={userData.username} tasks={tasks} setTasks={setTasks} back={back}/>},
    {title: "Clothes", preview: clothesPreview, hasInnerNavigation: true, innerNavigation: <Clothes data={clothesData} back={back}/>},
  ]

  let objURL = "";

  const modulesPerRow = 3;
  const dashboard = 
  <div>
    <div className="profilePictureContainer">{userData.picture ? <img className="profilePicture" src={objURL = URL.createObjectURL(userData.picture)} onLoad={() => URL.revokeObjectURL(objURL)} alt="" /> : <img src={previewProfile} className="profilePicture" alt="" />}</div>
    
    <div className="dashboard">
      <div className="goodDay">{`Good day ${userData.username}`}</div>
      <div className="modulePreviews">
        <div className="dashboardRow">
          {dashboardModulesData.slice(0, modulesPerRow).map((data, i) => 
          <div className="modulePreview" style={data.hasInnerNavigation ? {cursor: "pointer"} : {}} onClick={data.hasInnerNavigation ? () => setModuleIndex(i) : () => {}} key={`module${i}`}>
            <div className="modulePreviewTitle">{data.title}</div>
            <div className="modulePreviewContent">{data.preview}</div>
          </div>
          )}
        </div>
        <div className="dashboardRow">
        {dashboardModulesData.slice(modulesPerRow, 2*modulesPerRow).map((data, i) => 
          <div className="modulePreview" style={data.hasInnerNavigation ? {cursor: "pointer"} : {}} onClick={data.hasInnerNavigation ? () => setModuleIndex(i + modulesPerRow) : () => {}} key={`module${i + modulesPerRow}`}>
            <div className="modulePreviewTitle">{data.title}</div>
            <div className="modulePreviewContent">{data.preview}</div>
          </div>
          )}
        </div>
      </div>
    </div>
  </div>;
  
  const currentModule = moduleIndex ? dashboardModulesData[moduleIndex].innerNavigation : dashboard;
  const display = loggedIn ? currentModule : <Login login={login} register={register}/>

  return (
    <div className="dashboardApp" style={{backgroundImage: `url(${backgroundImage})`}}>
      {/* <img id="backgroundImage" src={backgroundImage} alt="" /> */}
      {/* <button onClick={fetchData}>test</button> */}
      {display}
    </div>
  );
}

export default App;
