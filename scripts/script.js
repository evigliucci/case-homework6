$(document).ready(function() {
    $("#search-button").on("click", function() {
        var searchValue = $("#search-value").val();

        // clear input box
        $("#search-value").val("");

        searchWeather(searchValue);
    });

    $(".prevSearch").on("click", "li", function() {
        searchWeather($(this).text());
    });

    function makeRow(text) {
        var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
        $(".prevSearch").append(li);
    }

    function searchWeather(searchValue) {

        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=174c73860ce165f2c9e13f31c04e6521&units=imperial",
            dataType: "json",
            success: function(data) {
                // create prevSearch link for this search
                if (prevSearch.indexOf(searchValue) === -1) {
                    prevSearch.push(searchValue);
                    window.localStorage.setItem("prevSearch", JSON.stringify(prevSearch));

                    makeRow(searchValue);
                }

                // clear any old content
                $("#today").empty();

                // create html content for current weather
                var card = $("<div class='card'>");
                var cardBody = $("<div class='card-body'>");

                var title = $("<h3 class='card-title'>").text("Today's Weather in " + data.name + " (" + new Date().toLocaleDateString() + ")");
                var temp = $("<p class='card-text'>").text(Math.round(data.main.temp) + " °F").append("<span>Temperature</span>");
                var humid = $("<p class='card-text'>").text(data.main.humidity + "%").append("<span>Humidity</span>");
                var wind = $("<p class='card-text'>").text(data.wind.speed + " mph").append("<span>Wind Speed</span>");


                var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

                // merge and add to page
                title.append(img);
                cardBody.append(title, temp, humid, wind);
                card.append(cardBody);
                $("#today").append(card);

                // call follow-up api endpoints
                getForecast(searchValue);
            }
        });
    }

    //Get Started 
    function getForecast(searchValue) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=174c73860ce165f2c9e13f31c04e6521&units=imperial",
            dataType: "json",
            success: function(data) {

                $("#forecast").html("<h4>5-Day Forecast:</h4>");

                for (var i = 0; i < data.list.length; i++) {
                    if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        var tile = $("<div class='tile'>")
                        var title = $("<h5>").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                        var imgSrc = data.list[i].weather[0].icon + ".png";
                        var img = $("<img>").attr("src", "https://api.openweathermap.org/img/w/" + imgSrc);
                        var p1 = $("<p>").text("Temp: " + Math.round(data.list[i].main.temp_max) + " °F");
                        var p2 = $("<p>").text("Humidity: " + data.list[i].main.humidity + "%");

                        tile.append(title, img, p1, p2);
                        $("#forecast").append(tile).show();
                    }
                }
            }
        });
    };

    var prevSearch = JSON.parse(window.localStorage.getItem("prevSearch")) || [];

    if (prevSearch.length > 0) {
        searchWeather(prevSearch[prevSearch.length - 1]);
    }
})