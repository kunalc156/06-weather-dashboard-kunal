var cityFormEl = document.querySelector('#city-form');
var cityNameInputEl = document.querySelector('#cityname');
var listEl = document.querySelector('#sortable');

var currentForecastSection = document.querySelector('.current-forecast');
var extensiveForecastSection = document.querySelector('.extensive-forecast');

/**
 *  Form submit handler 
 * @param {*} event 
 */
var formSubmitHandler = function (event) {
    event.preventDefault();
  
    var cityname = cityNameInputEl.value.trim();
  
    if (cityname) {
      resetSections();  
      getCityCurrentWeatherReport(cityname);
      getExtensiveWeatherReport(cityname);
      cityNameInputEl.value = '';
    } else {
      alert('Please enter a city name');
    }
  };

/**
 * Reset all sections content
 */
function resetSections() {
    currentForecastSection.textContent = "";
}

var getExtensiveWeatherReport =  function (cityname) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityname + '&appid=beeb191248afe1f8385287e2e919c907&cnt=40&units=imperial';
  
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            displayExtensiveWeather(data, cityname);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to fetch the weather details.');
      });
};


/**
 * display current weather elements
 * @param {*} data 
 * @param {*} cityname 
 * @returns 
 */
 var displayExtensiveWeather = function (data, cityname) {
    if (data.length === 0) {
        extensiveForecastSection.textContent = 'No data to be reported.';
      return;
    }
    
    data.list.forEach (function(data, index) { 
        // heading
        if( index % 8 == 0) {
            var headingEl = document.createElement('div');
            headingEl.id = "city-name-extensive-section-" + index;
            headingEl.setAttribute("class", "forecast-div");
            var headingElDivOne = document.createElement('div');
            headingElDivOne.textContent = moment(data.dt_txt).format("MM/DD/Y");
            headingElDivOne.setAttribute("class", "forecast-title");
            headingEl.appendChild(headingElDivOne);
            extensiveForecastSection.appendChild(headingEl);
            if(data.weather[0])  {
                var headingElDivTwo = document.createElement("div");
                var weatherIcon = document.createElement("img");
                weatherIcon.setAttribute("alt", "Weather Icon");
                weatherIcon.setAttribute("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"); 
                headingElDivTwo.appendChild(weatherIcon);
                headingEl.appendChild(headingElDivTwo);
            }

            //temperature
            if(data.main) {
                var tempEl = document.createElement('div');
                tempEl.id = "temp-currrent-section-" + index;
                tempEl.textContent = "Temperature: " + data.main.temp + String.fromCharCode(176) + "F";
                headingEl.appendChild(tempEl);
                tempEl.setAttribute("class", "forecast-temp");
                //humidity
                var humidityEl = document.createElement('div');
                humidityEl.id = "humidity-currrent-section-" + index;
                humidityEl.textContent = "Humidity: " + data.main.humidity + "%"
                headingEl.appendChild(humidityEl);
                humidityEl.setAttribute("class", "forecast-humidity");

            }
        }
    });
};

/**
 * Get city current Weather
 */
var getCityCurrentWeatherReport = function (cityname) {

    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityname + '&appid=beeb191248afe1f8385287e2e919c907';
  
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            displayCurrentWeather(data, cityname);
            storeCityInLocalStorage(data, cityname);
            createHistoryList();
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to fetch the weather details');
      });
  };
  
/**
 * display current weather elements
 * @param {*} data 
 * @param {*} cityname 
 * @returns 
 */
var displayCurrentWeather = function (data, cityname) {
    if (data.length === 0) {
        currentForecastSection.textContent = 'No data to be reported.';
      return;
    }
    
    // heading
    var headingEl = document.createElement('div');
    headingEl.id = "city-name-currrent-section";
    var headingElDivOne = document.createElement('div');
    headingElDivOne.textContent = cityname + " (" +  moment().format("MM/DD/Y") + ")";
    headingEl.appendChild(headingElDivOne);
    currentForecastSection.appendChild(headingEl);
    if(data.weather[0])  {
        var headingElDivTwo = document.createElement("div");
        var weatherIcon = document.createElement("img");
        weatherIcon.setAttribute("alt", "Weather Icon");
        weatherIcon.setAttribute("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"); 
        headingElDivTwo.appendChild(weatherIcon);
        headingEl.appendChild(headingElDivTwo);
    }

    //temperature
    if(data.main) {
        var tempEl = document.createElement('div');
        tempEl.id = "temp-currrent-section";
        tempEl.textContent = "Temperature: " + Math.round((1.8 * (data.main.temp - 273) + 32),2) + String.fromCharCode(176) + "F";
        currentForecastSection.appendChild(tempEl);
    
        //humidity
        var humidityEl = document.createElement('div');
        humidityEl.id = "humidity-currrent-section";
        humidityEl.textContent = "Humidity: " + data.main.humidity + "%"
        currentForecastSection.appendChild(humidityEl);
    }

    if( data.wind ){
        //windspeed
        var windEl = document.createElement('div');
        windEl.id = "wind-currrent-section";
        windEl.textContent = "Wind Speed: " + data.wind.speed +"MPH";
        currentForecastSection.appendChild(windEl);
    }
    
    // UV index
   /* var headingEl = document.createElement('div');
    headingEl.id = "city-name-currrent-section";
    headingEl.textContent = cityname + " " +  moment().format("MM/DD/Y");
    currentForecastSection.appendChild(headingEl); */

};

  /**
   * store data in local storage
   * @param {*} data 
   * @param {*} cityname 
   */
  var storeCityInLocalStorage =  function (data, cityname) {
    localStorage.setItem(cityname, JSON.stringify(data));
  };

  /**
   * create list of states already searched
   */
  var createHistoryList = function(){
    var keys = Object.keys(localStorage),
    i = keys.length;
    listEl.innerHTML = '';

    while ( i-- ) {
        var liel = document.createElement('li');
        liel.setAttribute("class", "ui-state-default" );
        liel.textContent =  keys[i] ;

        listEl.appendChild(liel);
    }

  };
  
// adding event listeners to various form elements  
cityFormEl.addEventListener('submit', formSubmitHandler);
