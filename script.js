// //JS INTEGRATED GEOLOCATION
const successCallback = (position) => {
  let currPos = position;
  console.log(currPos);
  let {
    coords: { latitude, longitude },
  } = currPos;
  console.log(latitude, longitude);
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
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,apparent_temperature,rain,snowfall,surface_pressure,cloudcover,windspeed_10m,winddirection_10m,windgusts_10m,uv_index,is_day&current_weather=true`
        );
        console.log(res1.data);
        let currWeather = res1.data;
        const {
          current_weather: { temperature: currTemp, windspeed: windspeed },
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
        getCity.value = "";

        //TIMEZONE API
        const res2 = await axios.get(
          `https://api.ipgeolocation.io/timezone?apiKey=dda0da9b52624e0c80f4972ad83865e2&lat=${lat}&long=${long}`
        );
        console.log(res2.data);
        let rawTime = res2.data.date_time;
        let currTime = rawTime.split("").splice(11, 5).join("");
        console.log(currTime);

        let [hours, minutes] = currTime
          .split(":")
          .map((component) => parseInt(component));
        if (hours >= 12) {
          document.querySelector(".time").innerText = `${currTime} PM`;
        } else {
          document.querySelector(".time").innerText = `${currTime} AM`;
        }
      } catch (e) {
        console.log("ERROR", e);
      }
    };
    getLocation(getCity.value);
  }
});

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

//NEWS FEED API
const getNews = async () => {
  try {
    const res = await axios.get(
      "https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=69b56f99050f4f98a6241abd7d29c8e7"
    );
    console.log(res.data.articles);
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
