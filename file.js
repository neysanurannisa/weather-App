let weatherLabel = {
    0:{
        logo:'icon/clear-sky.jpg',
        desc:'Clear Sky'
    },
    1:{
        logo:'icon/bright.jpg',
        desc:'Bright'
    },
    2:{
        logo:'icon/cloudy.jpg',
        desc:'Cloudy'
    },
    3:{
        logo:'icon/cloudy.jpg',
        desc:'Cloudy'
    },
    61:{
        logo:'icon/slight rain.jpg',
        desc:'Slight Rain'
    },
    63:{
        logo:'icon/rain.jpg',
        desc:'Rain'
    },
    65:{
        logo:'icon/heavy rain.jpg',
        desc:'Heavy Rain'
    },
    80:{
        logo:'icon/slight rain.jpg',
        desc:'Slight Rain'
    },
    81:{
        logo:'icon/rain.jpg',
        desc:'Rain'
    },
    82:{
        logo:'icon/heavy rain.jpg',
        desc:'Super Heavy Rain'
    }
}

let form = document.querySelector('.search');

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    
    cityEl(e.target[0].value);
})

async function cityEl(cityInput){
    try {
        if (cityInput === ''){
            cityInput = 'Jakarta'
        }
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=10&language=en&format=json`);
        const result = await response.json();
        currentWeather(result.results[1]);
        fetchWeather(result.results[1]);
    } catch (error) {
        console.log('error ', error);
    }
}

async function currentWeather(cityData){
    try{
        // Default untuk Jakarta (memenuhi syarat if cityInput di atas)
        let latitude = "-6.1818";
        let longitude = "106.8223";

        if (cityData) {
            latitude = cityData.latitude;
            longitude = cityData.longitude;
        }

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FBangkok`);
        const result = await response.json();
        hourlyWeather(result);

        const dateNow = document.querySelector("#date")
        dateNow.innerHTML = new Date(result.current.time).toLocaleDateString(
            "id-ID", {
            weekday: "long",
            month: "long",
            day:"numeric",
            year: "numeric",
            hour: "numeric",
            minute:"numeric"
        });

        if (cityData){
            const cardCity = document.querySelector(".city")
            cardCity.innerHTML = cityData.name;
            const iconDel = document.querySelector(".logo-today");
            iconDel.remove();
            const humidityDelete = document.querySelector(".humid-today");
            humidityDelete.remove();
            const precipDel = document.querySelector(".precip-today");
            precipDel.remove();
            const todayDelete = document.querySelector(".temp-today");
            todayDelete.remove();
            const deskripsiDelete = document.querySelector(".desc-today");
            deskripsiDelete.remove();
        }

        const cardLogo = document.createElement("image");
        cardLogo.classList.add("logo-today");
        cardLogo.setAttribute('src', weatherLabel[result.current.weather_code].logo);
        cardLogo.setAttribute('height', '100px');
        cardLogo.setAttribute('width', '100px');

        const todayWeather = document.querySelector(".card-today");
        todayWeather.append(cardLogo);

        const tempToday = document.createElement("h5");
        tempToday.classList.add("temp-today");
        tempToday.innerHTML = result.current.temperature_2m + "°C";
        todayWeather.append(tempToday);

        const descLogo = document.createElement("description");
        descLogo.classList.add("desc-today");
        descLogo.innerHTML = weatherLabel[result.current.weather_code].desc;

        const humidityToday = document.createElement("h5");
        humidityToday.classList.add("humid-today");
        humidityToday.innerHTML = result.current.relative_humidity_2m + "%";
        const currentHumid = document.querySelector(".humidity");
        currentHumid.append(humidityToday);

        const precipToday = document.createElement("h5");
        precipToday.classList.add("precip-today");
        precipToday.innerHTML = result.current.precipitation;
        const currentPrecip = document.querySelector(".precip");
        currentPrecip.append(precipToday);
    
    } catch (error) {
        console.log("error ", error);
    }
}

async function hourlyWeather(result){
    try{
        let fullData = 0;
        result.hourly.time.forEach((e,i) =>{
            const hourEl = new Date(e).toLocaleTimeString("en-id", {
                hour: "numeric",
                minute: "numeric"
            })
            const hourElNow = new Date().toLocaleTimeString("en-id",{
                hour: "numeric",
                minute: "numeric" 
            })
            if ((hourEl < hourElNow) || fullData > 6){
                return
            }

            fullData++;
            const card = document.createElement("p");
            card.classList.add("cardHourly");

            const cardDetail = document.createElement("p");
            cardDetail.innerHTML = hourEl;
            card.append(cardDetail);
            const hourlyTime = document.querySelector(".detail-hourly");
            hourlyTime.append(card);
            
            const cardLogo = document.createElement("image");
            cardLogo.setAttribute('src', weatherLabel[result.current.weather_code].logo);
            cardLogo.setAttribute('height', '50px');
            cardLogo.setAttribute('width', '50px');
            card.append(cardLogo);
            
            const hourlyTemp = document.createElement("p");
            hourlyTemp.classList.add("detHourly");
            hourlyTemp.innerHTML = result.hourly.temperature_2m[i]+"°C";
            card.append(hourlyTemp);
        })
    } catch(error){
        console.log("error ", error);
    }
}

async function fetchWeather(city) {
    try{
        let latitude = '-6.1818';
        let longitude = '106.8223';

        if (city) {
            latitude = city.latitude;
            longitude = city.longitude;
        }

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FBangkok`);
        const result = await response.json();
        result.daily.time.forEach((e,i) =>{
            const card = document.createElement("p");
            card.classList.add("cardWeather");

            const cardDetail = document.createElement("p");
                cardDetail.innerHTML = new Date(e).toLocaleDateString("en-id",{
                    weekday: "long",
                    month: "long",
                    day:"numeric",
                    year: "numeric",
                })
                card.append(cardDetail);

                const cardLogo = document.createElement("image");
                cardLogo.setAttribute('src', weatherLabel[result.current.weather_code].logo);

                cardLogo.setAttribute('height', '50px');
                cardLogo.setAttribute('width', '50px');
                card.append(cardLogo);

                const cardTempMax = document.createElement("p");
                cardTempMax.innerHTML = result.daily.temperature_2m_max[i]+"°C";
                card.append(cardTempMax);

                const cardTempMin = document.createElement("p");
                cardTempMin.innerHTML = result.daily.temperature_2m_min[i]+"°C";
                card.append(cardTempMin);

                const cardForecast = document.querySelector(".forecast")
                cardForecast.append(card)
        });  
    } catch (error){
        console.log("error ", error);
    }
}

currentWeather();
fetchWeather();