import React from 'react';
import './WeatherDetail.css';

function WeatherDetail({ description, temp, type}) {
  return (
    <section className="day-part">
      <span className="icon-wrapper">
        *Icoontje van het weer*
      </span>
      <p className="description">{description}</p>
      <p>{kelvinToCelcius(temp)}</p>
    </section>
  );
}

export default WeatherDetail;
