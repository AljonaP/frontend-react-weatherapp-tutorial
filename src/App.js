import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import SearchBar from './components/searchBar/SearchBar';
import TabBarMenu from './components/tabBarMenu/TabBarMenu';
import MetricSlider from './components/metricSlider/MetricSlider';
import ForecastTab from './pages/forecastTab/ForecastTab';
import { TempContext } from "./context/TempContextProvider";
import './App.css';
import TodayTab from './pages/todayTab/TodayTab';

import {
  BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';



function App() {
  const [weatherData, setWeatherData] = useState({});
  const [location, setLocation] = useState('');
  const [error, setError] = useState(false);
  const [loading, toggleLoading] = useState(false);

  const { kelvinToMetric } = useContext(TempContext);


  useEffect(() => {
    // 1. we definieren de functie useEffect
    async function fetchData() {
      setError(false);
      toggleLoading(true);

      try {
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location},nl&appid=${process.env.REACT_APP_API_KEY}&lang=nl`);
        setWeatherData(result.data);
      } catch (e) {
        //de error wordt weergegeven in de console
        console.error(e);
        setError(true);
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
              {loading && (<span>Loading...</span>)}

            {Object.keys(weatherData).length > 0 &&
            <>
              <h2>{weatherData.weather[0].description}</h2>
              <h3>{weatherData.name}</h3>
              <h1>{kelvinToMetric(weatherData.main.temp)}</h1>
            </>
            }

              {/*<button type="button" onClick={fetchData}>*/}
              {/*  Haal data op!*/}
              {/*</button>*/}
            </span>
          </div>

          {/*CONTENT ------------------ */}
          <Router>
            <div className="weather-content">
              <TabBarMenu/>

              <div className="tab-wrapper">
                <Switch>
                  <Route exact path="/">
                    <TodayTab coordinates={weatherData && weatherData.coord} />
                  </Route>
                  <Route path="/komende-week">
                    <ForecastTab coordinates={weatherData && weatherData.coord} />
                  </Route>
                </Switch>
              </div>
            </div>
          </Router>

          <MetricSlider/>

        </div>
      </>
  );
}

export default App;
