//JS INTEGRATED GEOLOCATION
const successCallback = (position) => {
  // console.log(position);
  let currPos = position;
  let {
    coords: { latitude, longitude },
  } = currPos;
  console.log(latitude, longitude);
};
const errorCallback = (error) => {
  console.log(error);
};
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

//GEOLOCATION & WEATHER API (JSON Format)

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
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth&current_weather=true`
        );
        console.log(res1.data);
        let currWeather = res1.data;
        const {
          current_weather: { temperature: currTemp, windspeed: windspeed },
        } = currWeather;

        document.querySelector(
          ".location-temp"
        ).innerText = `${cityName}, ${countryName} ${currTemp} C`;
        if (long < 0) {
          document.querySelector(".coordinates").innerText = ` ${lat.toFixed(
            2
          )}N /  ${long.toFixed(2)}W`;
        } else if (long > 0) {
          document.querySelector(".coordinates").innerText = ` ${lat.toFixed(
            2
          )} N /  ${long.toFixed(2)} E`;
        }
        getCity.value = "";
      } catch (e) {
        console.log("ERROR", e);
      }
    };
    getLocation(getCity.value);
  }
});
