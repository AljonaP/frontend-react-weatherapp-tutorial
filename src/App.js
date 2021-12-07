import React, {useState, useEffect} from 'react';
import axios from 'axios';
import SearchBar from './components/searchBar/SearchBar';
import TabBarMenu from './components/tabBarMenu/TabBarMenu';
import MetricSlider from './components/metricSlider/MetricSlider';
import './App.css';
import ForecastTab from "./pages/forecastTab/ForecastTab";


const apiKey = '8cc8426113414b7a7508942f1d1fd56f';

function App() {
  const [weatherData, setWeatherData] = useState({});
  const [location, setLocation] = useState('');
  const [error, toggleError] = useState(false);


  useEffect(() => {
    // 1. we definieren de functie useEffect
    async function fetchData() {
      toggleError(false);

      try {
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location},nl&appid=${apiKey}&lang=nl`);
        setWeatherData(result.data);
      } catch (e) {
        //de error wordt weergegeven in de console
        console.error(e);
        toggleError(true)
      }
    };

    // 2. we roepen de functie aan als location is veranderd, maar niet als het een null/undefined/lege string is
    if (location) {
      fetchData();
    }
    // de code wordt alleen afgevuurd als location veranderd
  }, [location]);

  return (
      <>
        <div className="weather-container">

          {/*HEADER -------------------- */}
          <div className="weather-header">
            <SearchBar setLocationHandler={setLocation}/>
            {error &&
            <span className="wrong-location-error">
                  Oeps! Deze locatie bestaat niet
                </span>
            }

            <span className="location-details">
            {Object.keys(weatherData).length > 0 &&
            <>
              <h2>{weatherData.weather[0].description}</h2>
              <h3>{weatherData.name}</h3>
              <h1>{weatherData.main.temp}</h1>
            </>
            }

              {/*<button type="button" onClick={fetchData}>*/}
              {/*  Haal data op!*/}
              {/*</button>*/}
          </span>
          </div>

          {/*CONTENT ------------------ */}
          <div className="weather-content">
            <TabBarMenu/>

            <div className="tab-wrapper">
              <ForecastTab coordinates={weatherData.coord}/>
            </div>
          </div>

          <MetricSlider/>
        </div>
      </>
  );
}

export default App;
