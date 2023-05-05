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
          element.innerText = `${currTemp} C`;
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
