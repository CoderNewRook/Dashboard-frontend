import { useEffect, useState } from "react";
import {INewsData} from "./App";

const News = (props : {back: () => void}) => {
    const [news, setNews] = useState<INewsData>({title: "Title", description: "Description"});

    useEffect(() => {
        getLatestNews();
    }, [])

    const getLatestNews = () => {
        fetch("http://localhost:3000/latestNews")
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
        <div className="newsModule"> 
            <h1 className="topLeftTitle">News</h1>
            <h2>{news.title}</h2>
            <p>{news.description}</p>
        </div>
        <div className="back" onClick={props.back}>Back</div>
    </div>
    );
};

export default News;
