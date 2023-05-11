//JS INTEGRATED GEOLOCATION
const successCallback = (position) => {
  let currPos = position;
  console.log(currPos);
  let {
    coords: { latitude, longitude },
  } = currPos;
  console.log(latitude, longitude);
  ////////////////////////////////////////////////

  ////////////////////////////////////////////////
};

const errorCallback = (error) => {
  console.log(error);
};
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

//GEOLOCATION & WEATHER API (JSON)

const getCity = document.querySelector("#enter-city");

getCity.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const getLocation = async (id) => {
      try {
        //GEOLOCATION API
        const res = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${id}&count=10&language=en&format=json`
        );
        let currLoc = res.data.results[0];
        const {
          name: cityName,
          country: countryName,
          latitude: lat,
          longitude: long,
        } = currLoc;
        //WEATHER API
        const res1 = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,apparent_temperature,rain,snowfall,surface_pressure,cloudcover,relativehumidity_2m,precipitation,precipitation_probability,,windspeed_10m,winddirection_10m,windgusts_10m,uv_index,is_day&current_weather=true`
        );

        console.log(res1.data);
        let currWeather = res1.data;
        let hourlyWeather = res1.data.hourly;

        //CURRENT WEATHER
        const {
          current_weather: {
            temperature: currTemp,
            windspeed: windSpeed,
            winddirection: windDirection,
          },
        } = currWeather;

        document.querySelector(
          ".location"
        ).innerText = `${cityName}, ${countryName}`;

        if (long < 0) {
          document.querySelector(".coordinates").innerText = ` ${lat.toFixed(
            2
          )}N /  ${long.toFixed(2)}W`;
        } else if (long > 0) {
          document.querySelector(".coordinates").innerText = ` ${lat.toFixed(
            2
          )} N /  ${long.toFixed(2)} E`;
        }

        document.querySelectorAll(".temp").forEach((element) => {
          element.innerText = `${currTemp}° C`;
        });

        //HOURLY WEATHER
        const {
          apparent_temperature: realFeel,
          cloudcover: cloudCover,
          is_day: dayNight,
          time: time,
        } = hourlyWeather;

        const timeObj = time.reduce((acc, curr, index) => {
          acc[curr] = `${realFeel[index]}, ${cloudCover[index]}`;
          return acc;
        }, {});
        console.log(timeObj);

        getCity.value = "";

        // <i class="bi bi-brightness-high"></i>
        // <i class="bi bi-moon"></i>;

        //WINDSPEED * DIRECTION

        const windSp = document.querySelector(".wind-speed");
        const windDir = document.querySelector(".wind-direction");

        windSp.innerText = `${windSpeed} km/h`;

        if (windDirection > 0 && windDirection < 45) {
          windDir.innerText = "NNE";
        } else if (windDirection > 45 && windDirection < 90) {
          windDir.innerText = "ENE";
        } else if (windDirection > 90 && windDirection < 135) {
          windDir.innerText = "ESE";
        } else if (windDirection > 135 && windDirection < 180) {
          windDir.innerText = "SSE";
        } else if (windDirection > 180 && windDirection < 225) {
          windDir.innerText = "SSW";
        } else if (windDirection > 225 && windDirection < 270) {
          windDir.innerText = "WSW";
        } else if (windDirection > 270 && windDirection < 315) {
          windDir.innerText = "WNW";
        } else if (windDirection > 315 && windDirection < 360) {
          windDir.innerText = "NNW";
        }

        //TIMEZONE API
        const res2 = await axios.get(
          `https://api.ipgeolocation.io/timezone?apiKey=dda0da9b52624e0c80f4972ad83865e2&lat=${lat}&long=${long}`
        );
        console.log(res2.data);

        let rawTime = res2.data.date_time;
        let currTime = rawTime.split("").splice(11, 5).join("");

        let [hours, minutes] = currTime
          .split(":")
          .map((component) => parseInt(component));
        if (hours >= 12) {
          document.querySelector(".time").innerText = `${currTime} PM`;
        } else {
          document.querySelector(".time").innerText = `${currTime} AM`;
        }

        //LOOPING ARRAY FROM WEATHER API
        let date = rawTime.split("").splice(0, 10).join("");
        let hour = rawTime.split("").splice(11, 2).join("");
        let dateTime = date.concat("T").concat(hour);

        for (let key in timeObj) {
          let splitKey = key.split("").splice(0, 13).join("");
          // console.log(splitKey);
          if (dateTime === splitKey) {
            innerText = `Real Feel ${timeObj[key].split(",")[0]}°`;
            let cloudySunny = document.querySelector(".cloudySunny");
            let cloudCover = timeObj[key].split(",")[1];
            if (cloudCover > 0 && cloudCover <= 20) {
              cloudySunny.innerText = "Sunny";
            } else if (cloudCover > 20 && cloudCover <= 30) {
              cloudySunny.innerText = "Mostly Sunny";
            } else if (cloudCover > 30 && cloudCover <= 60) {
              cloudySunny.innerText = "Partly Cloudy";
            } else if (cloudCover > 60 && cloudCover <= 70) {
              cloudySunny.innerText = "Partly Sunny";
            } else if (cloudCover > 70 && cloudCover <= 90) {
              cloudySunny.innerText = "Mostly Cloudy";
            } else {
              cloudySunny.innerText = "Overcast";
            }
          }
        }
      } catch (e) {
        console.log("ERROR", e);
      }
    };
    getLocation(getCity.value);
  }
});

//NEWS FEED API

const newsOne = document.querySelector(".testNewsOne");
const newsTwo = document.querySelector(".testNewsTwo");
const newsThree = document.querySelector(".testNewsThree");
const newsFour = document.querySelector(".testNewsFour");
const newsFive = document.querySelector(".testNewsFive");

const imgOne = document.querySelector(".imgOne");
const imgTwo = document.querySelector(".imgTwo");
const imgThree = document.querySelector(".imgThree");
const imgFour = document.querySelector(".imgFour");
const imgFive = document.querySelector(".imgFive");

const getNews = async () => {
  try {
    const res = await axios.get(
      "https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=69b56f99050f4f98a6241abd7d29c8e7"
    );
    // console.log(res.data.articles);
    const newsFeed = res.data.articles;
    newsOne.innerText = newsFeed[0].title;
    newsOne.setAttribute("href", res.data.articles[0].url);
    imgOne.setAttribute("src", res.data.articles[0].urlToImage);
    newsTwo.innerText = newsFeed[1].title;
    newsTwo.setAttribute("href", res.data.articles[1].url);
    imgTwo.setAttribute("src", res.data.articles[1].urlToImage);

    newsThree.innerText = newsFeed[2].title;
    newsThree.setAttribute("href", res.data.articles[2].url);
    imgThree.setAttribute("src", res.data.articles[2].urlToImage);

    newsFour.innerText = newsFeed[3].title;
    newsFour.setAttribute("href", res.data.articles[3].url);
    imgFour.setAttribute("src", res.data.articles[3].urlToImage);

    newsFive.innerText = newsFeed[4].title;
    newsFive.setAttribute("href", res.data.articles[4].url);
    imgFive.setAttribute("src", res.data.articles[4].urlToImage);
  } catch (e) {
    console.log("ERROR", e);
  }
};
getNews();
