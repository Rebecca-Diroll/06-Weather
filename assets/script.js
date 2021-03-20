// Variables for current weather
var dateToday = document.querySelector("#dateToday");
var inputCityName = document.querySelector("#inputCityName");
var saveBtn = document.querySelector("#saveBtn");
var outputCityName = document.querySelector("#outputCityName");
var descriptionToday = document.querySelector("#descriptionToday");
var tempTodayFahrenheit = document.querySelector("#tempTodayFahrenheit");
var humidityToday = document.querySelector("#humidityToday");
var windSpeedToday = document.querySelector("#windSpeedToday");
var savedCities = document.querySelector("#savedCities");
var lat = document.querySelector("#lat");
var lon = document.querySelector("#lon");
var button1;
var cityArray = JSON.parse(localStorage.getItem("cities")) || [];

// Today's date
var dateToday = moment();
$("#dateToday").text(dateToday.format("ddd, MMM Do, YYYY"));

// ["Columbus", "Dayton", "Akron"]
if (cityArray) {
    cityArray.forEach(cityName => {
        cityList(cityName)
    })
}


// City Search
function cityList (cityName) {
    var cityListName = document.createElement("li");

    var button1 = document.createElement("button");
    button1.textContent = cityName;
    button1.setAttribute("class", "list-number");

    cityListName.append(button1);
    savedCities.append(cityListName);


    var delButton = document.createElement("button");
    delButton.textContent = "❌";
    delButton.setAttribute("id", "delete");

   cityListName.appendChild(delButton);
}

// Function for list button click event
$(document).on("click", ".list-number", function(event) {
    event.preventDefault();

    var recallCity = event.target.textContent; 

    console.log(recallCity);
    clickableButtons(recallCity);
});

// Function for list button delete
$(document).on("click", "#delete", function(event) {
    event.preventDefault();
    $(this).parent().remove();
    const cityToDelete = $(this).parent().find(".list-number").text(); // <--- Here is the city we want to delete

    // Citytodelete = Dayton
    // We have an array of cities: cityArray = ["Columbus", "Dayton", "Austin"]
    const cityIndex = cityArray.findIndex(city => city === cityToDelete); // 1
    cityArray.splice(cityIndex, 1);
    localStorage.setItem("cities", JSON.stringify(cityArray));


})

// function storeCities();
// localStorage.setItem("")

// Function for save button event
$(document).on("click", "#saveBtn", function(event) {
    event.preventDefault();
    console.log($("#inputCityName").val());

    var saveCityName = $("#inputCityName").val();
    document.querySelector("#inputCityName").value = '';

    cityArray.push(saveCityName);
    localStorage.setItem("cities", JSON.stringify(cityArray));

    clickableButtons(saveCityName);
    cityList(saveCityName);
});

// Current weather function
function clickableButtons(inputCityName) {
    console.log(this);
    weatherTodayContainer.classList.remove("hide");
    bottomContainer.classList.remove("hide");

//    cityList(inputCityName);
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + inputCityName + "&units=imperial" +
    "&appid=4d1228d2ed522b3f07e3a4edabc0402c")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            
            var cityNameValue = data["name"];
            var descriptionValue = data["weather"][0]["description"];
            var iconValue = data["weather"][0]["icon"]
            var tempValueFahrenheit = data["main"]["temp"];
            var humidityValue = data["main"]["humidity"]
            var windSpeedValue = data["wind"]["speed"]

            var latValue = data["coord"]["lat"];
            var lonValue = data["coord"]["lon"];

            outputCityName.innerHTML = cityNameValue;
            descriptionToday.innerHTML = descriptionValue;
            tempTodayFahrenheit.innerHTML = tempValueFahrenheit + " deg F";
            humidityToday.innerHTML = humidityValue + "% humidity";
            windSpeedToday.innerHTML = windSpeedValue + " mph wind";
            lat.innerHTML = latValue;
            lon.innerHTML = lonValue;

            var dateString = data["dt"];
            var dayDate = new Date(parseInt(dateString)*1000);
            console.log(dayDate);

            // Weather Icons
            var iconurl = "https://openweathermap.org/img/w/" + iconValue + ".png";
            $('#wicon').attr('src', iconurl);

            // 5-Day Forcast
            fiveDayForcast();
        });
}

// Variable for day 0 (current) UVI
var uviToday = document.querySelector("#uviToday");
var uviLevel = document.querySelector("#uviLevel");

// Variables for day 1 weather
var day1Date = document.querySelector("#day1Date");
var day1DateFormat = document.querySelector("#day1DateFormat");
var day1Icon = document.querySelector("#day1Icon");
var day1TempLow = document.querySelector("#day1TempLow");
var day1TempHigh = document.querySelector("#day1TempHigh");
var day1Humidity = document.querySelector("#day1Humidity");

// Variables for day 2 weather
var day2Date = document.querySelector("#day2Date");
var day2Icon = document.querySelector("#day2Icon");
var day2TempLow = document.querySelector("#day2TempLow");
var day2TempHigh = document.querySelector("#day2TempHigh");
var day2Humidity = document.querySelector("#day2Humidity");

// Variables for day 3 weather
var day3Date = document.querySelector("#day3Date");
var day3Icon = document.querySelector("#day3Icon");
var day3TempLow = document.querySelector("#day3TempLow");
var day3TempHigh = document.querySelector("#day3TempHigh");
var day3Humidity = document.querySelector("#day3Humidity");

// Variables for day 4 weather
var day4Date = document.querySelector("#day4Date");
var day4Icon = document.querySelector("#day4Icon");
var day4TempLow = document.querySelector("#day4TempLow");
var day4TempHigh = document.querySelector("#day4TempHigh");
var day4Humidity = document.querySelector("#day4Humidity");

// Variables for day 5 weather
var day5Date = document.querySelector("#day5Date");
var day5Icon = document.querySelector("#day5Icon");
var day5TempLow = document.querySelector("#day5TempLow");
var day5TempHigh = document.querySelector("#day5TempHigh");
var day5Humidity = document.querySelector("#day5Humidity");

// Retrieve 5-day forcast using lattitude and longitude from current weather data
function fiveDayForcast() {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat.innerHTML + "&lon=" + lon.innerHTML 
    + "&exclude=current,minutely,hourly,alerts" + "&units=imperial" 
    + "&appid=4d1228d2ed522b3f07e3a4edabc0402c")
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Day 0 (current) UVI
            var uviString = data["daily"][0]["uvi"];
            uviToday.innerHTML = uviString + " UVI";
            var uviNumber = JSON.parse(uviString); 
            uviLevel();

            // Assign UVI level colors
            function uviLevel() {
                if (uviNumber <= 3) {
                    uviToday.classList.add("favorable");
                    uviToday.classList.remove("moderate");
                    uviToday.classList.remove("high");
                    uviToday.classList.remove("extreme");
                }
                else if ((uviNumber > 3) && (uviNumber <= 6)) {
                    uviToday.classList.add("moderate");
                    uviToday.classList.remove("favorable");
                    uviToday.classList.remove("high");
                    uviToday.classList.remove("extreme");
                }
                else if (uviNumber <= 8) {
                    uviToday.classList.add("high");
                    uviToday.classList.remove("favorable");
                    uviToday.classList.remove("moderate");
                    uviToday.classList.remove("extreme");
                }
                else {
                    uviToday.classList.add("extreme");
                    uviToday.classList.remove("favorable");
                    uviToday.classList.remove("moderate");
                    uviToday.classList.remove("high");
                }
            }

            // Day 1 Local Variables
            var date1string = data["daily"][1]["dt"];
            var icon1Value = data["daily"][1]["weather"][0]["icon"];
            var tempLow1Value = data["daily"][1]["temp"]["min"];
            var tempHigh1Value = data["daily"][1]["temp"]["max"];
            var humidity1Value = data["daily"][1]["humidity"];

            // Day 1 Date
            day1Date.innerHTML = new Date(parseInt(date1string)*1000);
            var day1DateString = JSON.stringify(day1Date.innerHTML);
            var day1DateFormat = day1DateString.slice(1, 16);
            document.querySelector("#day1DateFormat").innerHTML = day1DateFormat;

            // Day 1 Weather
            var icon1url = "https://openweathermap.org/img/w/" + icon1Value + ".png";
            $('#wicon1').attr('src', icon1url);
            day1Icon.innerHTML = icon1Value;

            // Day 1 Temperature & Humidity
            day1TempLow.innerHTML = tempLow1Value + " deg F";
            day1TempHigh.innerHTML = tempHigh1Value + " deg F";
            day1Humidity.innerHTML = humidity1Value + "% humidity";


            // Day 2 Local Variables
            var date2string = data["daily"][2]["dt"];
            var icon2Value = data["daily"][2]["weather"][0]["icon"];
            var tempLow2Value = data["daily"][2]["temp"]["min"];
            var tempHigh2Value = data["daily"][2]["temp"]["max"];
            var humidity2Value = data["daily"][2]["humidity"];

            // Day 2 Date
            day2Date.innerHTML = new Date(parseInt(date2string)*1000);
            var day2DateString = JSON.stringify(day2Date.innerHTML);
            var day2DateFormat = day2DateString.slice(1, 16);
            document.querySelector("#day2DateFormat").innerHTML = day2DateFormat;

            // Day 2 Weather
            var icon2url = "https://openweathermap.org/img/w/" + icon2Value + ".png";
            $('#wicon2').attr('src', icon2url);
            day2Icon.innerHTML = icon2Value;

            // Day 2 Temperature & Humidity
            day2TempLow.innerHTML = tempLow2Value + " deg F";
            day2TempHigh.innerHTML = tempHigh2Value + " deg F";
            day2Humidity.innerHTML = humidity2Value + "% humidity";


            // Day 3 Local Variables
            var date3string = data["daily"][3]["dt"];
            var icon3Value = data["daily"][3]["weather"][0]["icon"];
            var tempLow3Value = data["daily"][3]["temp"]["min"];
            var tempHigh3Value = data["daily"][3]["temp"]["max"];
            var humidity3Value = data["daily"][3]["humidity"];

            // Day 3 Date
            day3Date.innerHTML = new Date(parseInt(date3string)*1000);
            var day3DateString = JSON.stringify(day3Date.innerHTML);
            var day3DateFormat = day3DateString.slice(1, 16);
            document.querySelector("#day3DateFormat").innerHTML = day3DateFormat;            

            // Day 3 Weather
            var icon3url = "https://openweathermap.org/img/w/" + icon3Value + ".png";
            $('#wicon3').attr('src', icon3url);
            day3Icon.innerHTML = icon3Value;

            // Day 3 Temperature & Humidity
            day3TempLow.innerHTML = tempLow3Value + " deg F";
            day3TempHigh.innerHTML = tempHigh3Value + " deg F";
            day3Humidity.innerHTML = humidity3Value + "% humidity";


            // Day 4 Local Variables
            var date4string = data["daily"][4]["dt"];
            var icon4Value = data["daily"][4]["weather"][0]["icon"];
            var tempLow4Value = data["daily"][4]["temp"]["min"];
            var tempHigh4Value = data["daily"][4]["temp"]["max"];
            var humidity4Value = data["daily"][4]["humidity"];

            // Day 4 Date
            day4Date.innerHTML = new Date(parseInt(date4string)*1000);
            var day4DateString = JSON.stringify(day4Date.innerHTML);
            var day4DateFormat = day4DateString.slice(1, 16);
            document.querySelector("#day4DateFormat").innerHTML = day4DateFormat;    

            // Day 4 Weather
            var icon4url = "https://openweathermap.org/img/w/" + icon4Value + ".png";
            $('#wicon4').attr('src', icon4url);
            day4Icon.innerHTML = icon4Value;

            // Day 4 Temperature & Humidity
            day4TempLow.innerHTML = tempLow4Value + " deg F";
            day4TempHigh.innerHTML = tempHigh4Value + " deg F";
            day4Humidity.innerHTML = humidity4Value + "% humidity";


            // Day 5 Local Variables
            var date5string = data["daily"][5]["dt"];
            var icon5Value = data["daily"][5]["weather"][0]["icon"];
            var tempLow5Value = data["daily"][5]["temp"]["min"];
            var tempHigh5Value = data["daily"][5]["temp"]["max"];
            var humidity5Value = data["daily"][5]["humidity"];

            // Day 5 Date
            day5Date.innerHTML = new Date(parseInt(date5string)*1000);
            var day5DateString = JSON.stringify(day5Date.innerHTML);
            var day5DateFormat = day5DateString.slice(1, 16);
            document.querySelector("#day5DateFormat").innerHTML = day5DateFormat;    

            // Day 5 Weather
            var icon5url = "https://openweathermap.org/img/w/" + icon5Value + ".png";
            $('#wicon5').attr('src', icon5url);
            day5Icon.innerHTML = icon4Value;

            // Day 5 Temperature & Humidity
            day5Icon.innerHTML = icon5Value;
            day5TempLow.innerHTML = tempLow5Value + " deg F";
            day5TempHigh.innerHTML = tempHigh5Value + " deg F";
            day5Humidity.innerHTML = humidity5Value + "% humidity";

        });
    };
