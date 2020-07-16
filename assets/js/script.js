var cityName = document.querySelector("#city");
var searchBtn = document.querySelector("#searchBtn");

var citySearch = function() {
    event.preventDefault();
    var city = cityName.value.trim();

    // check if the name is good
    if (city) {
        //send to the getData() function
        getData(city);
        cityName.value = "";
    } else {
        alert("Please enter and ACTUAL city name.");
    }
};

var getData = function(city) {

    // format the url
    var apiUrl = "https://gnews.io/api/v3/search?q=" + city + "&token=4ccdaf26cc2857fd5d937371daceb613";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            // send the parsed JSON data to displayNewsData() function
            response.json().then(function(data) {
                displayNewsData(data, city);
            });
        } else {
            alert("Error: " + response.statusText);
        };
    });
};

// function to display information to page
var displayNewsData = function(data, city) {
    // console logs the first articles json data
    console.log(data.articles[0]);
    // console log information
    console.log(city);
    console.log(data.articles[0].title);
    console.log(data.articles[0].description);
    console.log(data.articles[0].url);
    console.log(data.articles[0].image);
};

searchBtn.addEventListener("click", citySearch);

