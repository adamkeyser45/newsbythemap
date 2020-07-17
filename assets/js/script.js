var cityName = document.querySelector("#city");
var searchBtn = document.querySelector("#searchBtn");

var citySearch = function () {
    event.preventDefault();
    var city = cityName.value.trim();

    // check if the name is good
    if (city) {
        //send to the getData() function
        getData(city);
        cityName.value = "";
    } else {
        alert("Please enter an ACTUAL city name.");
    }
};

var getData = function (city) {

    // format the url
    var apiUrl = "https://gnews.io/api/v3/search?q=" + city + "&token=4ccdaf26cc2857fd5d937371daceb613";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            // send the parsed JSON data to displayNewsData() function
            response.json().then(function (data) {
                displayNewsData(data, city);
            });
        } else {
            alert("Error: " + response.statusText);
        };
    });
};

// function to display information to page
var displayNewsData = function (data, city) {
    // console logs the first articles json data
    console.log(data.articles[0]);
    // console log information
    console.log(city);
    console.log(data.articles[0].title);
    console.log(data.articles[0].description);
    console.log(data.articles[0].url);
    console.log(data.articles[0].image);

    const nameOfCity = city;
    const dataArticle = data.articles[0].title;
    const dataDescription = data.articles[0].description;
    const dataUrl = data.articles[0].url;
    const dataImage = data.articles[0].image;

    var nameOfCityHtml = document.querySelector("#name");
    var dataArticleHtml = document.querySelector("#title");
    var dataDescriptionHtml = document.querySelector("#description");
    var dataUrlHtml = document.querySelector("#url");
    var dataImageHtml = document.querySelector("#image");

    nameOfCityHtml.innerHTML = nameOfCity;
    dataArticleHtml.innerHTML = dataArticle;
    dataDescriptionHtml.innerHTML = dataDescription;
    dataUrlHtml.innerHTML = dataUrl;
    dataImageHtml.setAttribute('src', dataImage)
};



// function map set
function initMap() {
    var options = {
        zoom: 10,
        center: { lat: 36.1627, lng: -86.7816 },
    }


    var map = new
        google.maps.Map(document.getElementById("map"), options);


}

searchBtn.addEventListener("click", citySearch);

