import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { TempContext } from '../../context/TempContextProvider';
import './ForecastTab.css';
import createDateString from "../../helpers/createDateString";
import iconMapper from "../../helpers/iconMapper";



function ForecastTab({coordinates}) {
    const [forecasts, setForecasts] = useState([]);
    const [error, setError] = useState(false);
    const [loading, toggleLoading] = useState(false);

    const { kelvinToMetric } = useContext(TempContext);


    useEffect(() => {
        async function fetchData() {
            setError(false);
            toggleLoading(true);

            try {
                const result = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates?.lon}&exclude=minutely,current,hourly&appid=${process.env.REACT_APP_API_KEY}&lang=nl`);
                setForecasts(result.data.daily.slice(0, 5));
                toggleLoading(false)
;            } catch (e) {
                console.error(e);
                setError(true);
                toggleLoading(false);
            }
        }

        if (coordinates) {
            fetchData();
        }
    }, [coordinates]);

    return (
        <div className="tab-wrapper">
            {forecasts && forecasts.map((forecast) => {
                return (
                    <article className="forecast-day" key={forecast.dt}>
                        <p className="day-description">
                            {createDateString(forecast.dt)}
                        </p>
                        <section className="forecast-weather">
                            <span>
                                {iconMapper(forecast.weather[0].main)}
                            </span>
                            <span>
                                {kelvinToMetric(forecast.temp.day)}
                            </span>

                            <span className="weather-description">
                                {forecast.weather[0].description}
                            </span>
                        </section>
                    </article>
                );
            })}

            {!forecasts && !error && (
                <span className="no-forecast">
                Zoek eerst een locatie om het weer voor deze week te bekijken
                </span>
            )}

            {error && <span>Er is iets misgegaan met het ophalen van de data</span>}

            {loading && <span>Loading...</span>}
        </div>
    );
};

export default ForecastTab;
