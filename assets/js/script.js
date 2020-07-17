const now  = moment().format("dddd, MMMM Do, YYYY, h:mm a");
var modalEl = document.querySelector("modal")
var dropdown = document.querySelector('.dropdown');

//display current day and time at top of page
$("#currentDay").text(now)

//trigger drop down when button clicked
dropdown.addEventListener('click', function(event) {
  event.stopPropagation();
  dropdown.classList.toggle('is-active');
});


var citySearch = function () {
    event.preventDefault();
    var city = cityName.value.trim();

    // check if the name is good
    if (city) {
        //send to the getData() function
        getData(city);
        cityName.value = "";
    } else {
        alert("Please enter and ACTUAL city name.");
        //modalEl.classList.add("is-active")
    }
};

var getData = function (city) {

    // format the url
    var apiUrl = "https://gnews.io/api/v3/search?q=" + city + "&token=4ccdaf26cc2857fd5d937371daceb613&image=required";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            // send the parsed JSON data to displayNewsData() function
            response.json().then(function (data) {
                displayNewsData(data, city);
            });
        } else {
           
            forecastContainer.classList.remove("hide")
            alert("Error: " + response.statusText);
        };
    });
};

// function to display information to page
var displayNewsData = function (data, city) {
    // console logs the first articles json data
    console.log(data.articles);
    // console log information
    // console.log(city);
    // console.log(data.articles[0].title);
    // console.log(data.articles[0].description);
    // console.log(data.articles[0].url);
    // console.log(data.articles[0].image);

    const nameOfCity = city;
    const dataArticle = data.articles[0].title;
    const dataUrl = data.articles[0].url;
    const dataImage = data.articles[0].image;

    var nameOfCityHtml = document.querySelector("#newsCityTitle");
    var dataArticleHtml = document.querySelector("#title");
    var dataUrlHtml = document.querySelector("#url");
    var dataImageHtml = document.querySelector("#image");

    nameOfCityHtml.innerHTML = "News From: " + nameOfCity;
    dataArticleHtml.innerHTML = dataArticle;
    dataUrlHtml.setAttribute("href", dataUrl);
    dataUrlHtml.innerHTML = dataUrl;
    dataImageHtml.setAttribute('src', dataImage)
};


// function map set
function initMap() {
    var map = new google.maps.Map(document.getElementById("map"), {
      center: {  lat: 36.1627, lng: -86.7816 },
      zoom: 13
    });
  
    var input = document.getElementById("pac-input");
  
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);
  
    // Specify just the place data fields that you need.
    autocomplete.setFields(["place_id", "geometry", "name"]);
  
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById("infowindow-content");
    infowindow.setContent(infowindowContent);
  
    var marker = new google.maps.Marker({ map: map });
  
    autocomplete.addListener("place_changed", function() {
      infowindow.close();
  
      var place = autocomplete.getPlace();
  
      if (!place.geometry) {
        return;
      }
  
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
  
      // Set the position of the marker using the place ID and location.
      marker.setPlace({
        placeId: place.place_id,
        location: place.geometry.location
      });
  
      marker.setVisible(true);

    getData(place.name);
    });
}
