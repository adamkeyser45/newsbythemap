// global variables
const now  = moment().format("dddd, MMMM Do, YYYY, h:mm a");
var modalEl = document.querySelector(".modal")
var dropdown = document.querySelector('.dropdown');
var dropDwnOptGrp = document.querySelector("#dropDwnOptGrp");
var hideEl = document.querySelector(".hide")
var boxEl0 = document.querySelector(".news0")
var boxEl1 = document.querySelector(".news1")
var boxEl2 =document.querySelector(".news2")
var newsEl = document.querySelector(".noNews")
var newsTitle = document.querySelector(".newsTitle")
var dropdownItem = document.querySelectorAll(".dropdown-item");
var historyList = document.querySelector("#history-list");
var topicEl = document.querySelector("#topic")
var choiceSelection = "";
var keySelection = "";
var input = document.getElementById("pac-input");
var keywordEl = document.querySelector(".keyword-input")
var keywordSearch = document.querySelector(".keyword-search")

//display current day and time at top of page
$("#currentDay").text(now)

// updateTime
function updateTime() {
  const now = moment();
  const humanReadable = now.local().format("dddd, MMMM Do YYYY, h:mm A");
  currentDay.textContent = humanReadable;
}
setInterval(updateTime, 60000);
updateTime();

//trigger drop down when button clicked
dropdown.addEventListener('click', function(event) {
  event.stopPropagation();
  dropdown.classList.toggle('is-active');
});

dropdownItem.forEach(element => {
    element.addEventListener("click", function(event) {
        dropdownItem.forEach(dropEl =>  dropEl.classList.remove("is-active"))
        element.classList.add('is-active');
        topicEl.innerHTML = element.innerHTML 
    })  
})

// function to configure topic choice
var topicChoice = function(event) {
  var topic = event.target;
  var choice = topic.getAttribute("value");
  choiceSelection = choice;
};

// function to configure keyword
var keywordChoice = function(event) {
  event.preventDefault();
  var keywordInput = document.querySelector("input[name='keyword']").value;
  keySelection = keywordInput
  var exactLoc1 = input.value.split(",")[0];
  var exactLoc2 = input.value.split(",")[1];
  if (!exactLoc1 || !exactLoc2) {
    modalEl.classList.add("is-active")
    document.querySelector(".modal-text").innerHTML = "please enter a location in the map before your search"
  } else {
    getData(exactLoc1, exactLoc2)
  }
  console.log(keywordInput)
};

//hide modal
var hideModal = function(event) {
  modalEl.classList.remove("is-active")
}


// function to fetch news from GNews API
var getData = function (city, state) {
    // format the url
    var keywordInput = document.querySelector("input[name='keyword']").value;
    var searchQuery = choiceSelection + keywordInput + "%20" + city + "%20" + state.trim();
    var apiUrl = "https://gnews.io/api/v3/search?q=" + searchQuery + "&image=required&token=727a88ffb0ce56716bbcef44b445925c";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            // send the parsed JSON data to displayNewsData() function
            response.json().then(function (data) {
                displayNewsData(data, city);
                document.querySelector("input[name='keyword']").value='';
                keySelection = ""
            });
        } else {
            // hideEl.classList.remove("hide")
            alert("Error: " + response.statusText);
        };
    });
};

// function to display information to page
var displayNewsData = function (data, city) {

    var totalArticles = data.articles?.length || 0
    console.log(totalArticles)
    console.log(totalArticles === 0)
    if (totalArticles === 0) {
      newsEl.classList.remove("hide")
    } else {
      newsEl.classList.add("hide")
    }
   
    boxEl0.classList.add("hide")
    boxEl1.classList.add("hide")
    boxEl2.classList.add("hide")
    newsTitle.classList.add("hide")
    
    var articleNumber = totalArticles < 3 ? totalArticles : 3
    console.log(articleNumber)

    for (var i = 0; i < articleNumber; i++) {
     //set news array and for loop to retrieve data
    
    const nameOfCity = city;
    const dataArticle = data.articles[i].title;
    const dataUrl = data.articles[i].url;
    const dataImage = data.articles[i].image;

    var nameOfCityHtml = document.querySelector("#newsCityTitle");
    var dataArticleHtml = document.getElementById("title" + i);
    var dataUrlHtml = document.getElementById("url" + i);
    var dataImageHtml = document.getElementById("image" + i);
    document.querySelector(".newsTitle").classList.remove("hide")
    document.querySelector(".news" + i).classList.remove("hide")
      
    nameOfCityHtml.innerHTML = "News from " + nameOfCity;
    dataArticleHtml.innerHTML = dataArticle;
    dataUrlHtml.setAttribute("href", dataUrl);
    dataUrlHtml.innerHTML = "Click Here to Read More";
    dataImageHtml.setAttribute('src', dataImage);
    dataImageHtml.setAttribute('onerror',"this.src='https://cdn2.iconfinder.com/data/icons/picol-vector/32/news-512.png'")
    // $(".box").removeClass("hide")
    }
};

// array to hold the previous searches and lat/long data
var prevSearches = [];
var latLongArray = [];

// function to save previous searches
var savePrevSearches = function() {
  localStorage.setItem("prevSearches", JSON.stringify(prevSearches));
  localStorage.setItem("latLongArray", JSON.stringify(latLongArray));
};

// function to load previous searches to the page
var loadPrevSearches = function() {
  
  // retrieve previous searches and lat/long data from localstorage
  prevSearches = localStorage.getItem("prevSearches");
  if (prevSearches === null) {
    prevSearches = [];
    return false;
  }
  prevSearches = JSON.parse(prevSearches);

  latLongArray = localStorage.getItem("latLongArray");
  if (latLongArray === null) {
    latLongArray = [];
    return false;
  }
  latLongArray = JSON.parse(latLongArray);

  // loop through array and create buttons for previous searches
  for (var i = 0; i < prevSearches.length; i++) {
    // creates a button with the city's name
    var cityBtn = document.createElement("button");
    cityBtn.setAttribute("type", "button");
    cityBtn.setAttribute("id", prevSearches[i]);
    cityBtn.setAttribute("class", "buttons");

    var lat = latLongArray[i].split(",")[0];
    var long = latLongArray[i].split(",")[1];

    cityBtn.setAttribute("lat", lat);
    cityBtn.setAttribute("long", long);
    cityBtn.textContent = prevSearches[i];
    historyList.appendChild(cityBtn);
  };

};

// function to create a button for previous searches
var previousSearchBtn = function(city, state, lat, long) {
  // creates a button with the city's name
  var cityBtn = document.createElement("button");
  cityBtn.setAttribute("type", "button");
  cityBtn.setAttribute("id", city + "-" + state);
  cityBtn.setAttribute("class", "buttons");
  cityBtn.setAttribute("lat", lat);
  cityBtn.setAttribute("long", long);
  cityBtn.textContent = city + " " + state;
  historyList.appendChild(cityBtn);
};

// function to handle previousSeachBtn clicks
var previousSeachBtnHandler = function(event) {
  // get button's id and sends that to getData()
  var citySearch = event.target.getAttribute("id");
  
  var exactLoc1 = citySearch.split("-")[0];
  var exactLoc2 = citySearch.split("-")[1];

  getData(exactLoc1, exactLoc2);
};
  

// function map set
function initMap() {
    var map = new google.maps.Map(document.getElementById("map"), {
      center: {  lat: 36.1627, lng: -86.7816 },
      zoom: 13
    });
  

  
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);
  
    // Specify just the place data fields that you need.
    autocomplete.setFields(["place_id", "geometry", "name"]);
  
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById("infowindow-content");
    infowindow.setContent(infowindowContent);
  
    var marker = new google.maps.Marker({ map: map });
    
    // Event Listener for city searchbar
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
      

      // format search input and send to the correct functions
      var exactLoc1 = input.value.split(",")[0];
      var exactLoc2 = input.value.split(",")[1];
      var latitude = place.geometry.location.lat();
      var longitude = place.geometry.location.lng();  

      getData(exactLoc1, exactLoc2);

      // check to see if the location and coordinates are already in the array
      if (prevSearches.includes(exactLoc1 + "-" + exactLoc2) === false) {
        prevSearches.push(exactLoc1 + "-" + exactLoc2);
        latLongArray.push(latitude + "," + longitude);
        previousSearchBtn(exactLoc1, exactLoc2, latitude, longitude);
      };
      
      savePrevSearches();
    });

    // event listener to change map to center when prevSearchBtn's are clicked
    historyList.addEventListener("click", function(event) {
      // input.value=event.target.
      input.value=event.target.innerHTML
      var button = event.target;
      var x = button.getAttribute("lat");
      var y = button.getAttribute("long");
      console.log(x, y);

      map.setCenter({  lat: parseInt(x), lng: parseInt(y) });
      map.setZoom(8);
    });
};

historyList.addEventListener("click", previousSeachBtnHandler);
dropDwnOptGrp.addEventListener("click", topicChoice);
keywordSearch.addEventListener("click", keywordChoice);
loadPrevSearches();