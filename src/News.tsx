import { useEffect, useState } from "react";
import {INewsData} from "./App";
import newsImageBackground from "./Assets/Add_picture.png";

const News = (props : {back: JSX.Element}) => {
    const [news, setNews] = useState<INewsData>({title: "Title", description: "Description"});

    useEffect(() => {
        getLatestNews();
    }, [])

    const getLatestNews = () => {
        fetch("https://dashboard-challenge-project.herokuapp.com/latestNews")
        .then(res => {
            if(res.ok){
                return res.json() as Promise<INewsData>;
            }
            else{
                console.log("Latest news response not ok");
                return null;
            }
        })
        .then(data => {
            console.log(data);
            if(data) setNews(data);
        })
        .catch(error => console.log("there was an error " + error));
    }

    return (
    <div className="module">
        <h1 className="topLeftTitle">News</h1>
        <div className="newsModule"> 
            <img className="newsImage" src={newsImageBackground} alt="" />
            <h2>{news.title}</h2>
            <p>{news.description}</p>
        </div>
        {/* <div className="back" onClick={props.back}>Back</div> */}
        {props.back}
    </div>
    );
};

export default News;
