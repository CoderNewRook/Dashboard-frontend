import { Pie } from 'react-chartjs-2';

// interface IClothesData {
//     data: IClothesPieChartData;
// }

interface IClothesPieChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[]
    }[]
}


const Clothes = (props: {data: IClothesPieChartData, back: () => void}) => {
    
    return (
    <div className="module">
        <div className="clothesModule">
            <h1 className="middleTitle">Favourite Warmer</h1>
            <div className="clothes"><Pie data={props.data}/></div>;
        </div>
        <div className="back" onClick={props.back}>Back</div>
    </div>
    );
};

export default Clothes;
