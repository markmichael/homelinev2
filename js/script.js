$(document).ready(function(){

//alphabetize superneighborhoods

var ABCneighborhoods = superneighborhoodData.features.sort(alphabetizeByName);
var ABCNeighborhoodsArray=[];
var ABCNeighborhoodsClasses=[];
var hoodids1=[];
var hoodids2=[];
var ABCZipCodes=[];						

//populate superneighborhood list

ABCneighborhoods.forEach(populateList);

//Build maps

var mymap1 = L.map('map1').setView([29.7604, -95.3698], 11);
var mymap2 = L.map('map2').setView([29.7604, -95.3698], 11);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    StyleURL: 'mapbox://styles/mapbox/light-v9',
    id: 'markmichael.06ie3aam',
    accessToken: 'pk.eyJ1IjoibWFya21pY2hhZWwiLCJhIjoiY2lvZnRmZjJzMDE1ZHk1bTJ2N3R5c2R2dSJ9.RzjkEoIrFyW5azBrss-XOA'
}).addTo(mymap1);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    StyleURL: 'mapbox://styles/mapbox/light-v9',
    id: 'markmichael.06ie3aam',
    accessToken: 'pk.eyJ1IjoibWFya21pY2hhZWwiLCJhIjoiY2lvZnRmZjJzMDE1ZHk1bTJ2N3R5c2R2dSJ9.RzjkEoIrFyW5azBrss-XOA'
}).addTo(mymap2);

//add and style geoJSON data
var map1Property="Evictions";
var map2Property="Total Population ";
var map2PropertyZip="Total Population ";


$(".Censusfeature").html(map2Property+": <span class='censusvalue'></span>");
var maxProp1=maxMapProperty(map1Property);
var maxProp2=maxMapProperty(map2Property);
var maxProp2Zip=maxMapPropertyZip(map2PropertyZip)
var layer1= L.geoJson(superneighborhoodData, {style: style1, onEachFeature: onEachFeature});
layer1.addTo(mymap1);
var layer2= L.geoJson(superneighborhoodData, {style: style2, onEachFeature: onEachFeature});
layer2.addTo(mymap2);

//zipcode layers
layer3= L.geoJson(zipcodes, {style: style1, onEachFeature: onEachFeature2});
layer4= L.geoJson(zipcodes, {style: style2Zip, onEachFeature: onEachFeature2});


//zipcodes.features.map(function(a){a.properties.ACS=zipACS.find(function(b){return a.properties.Name===b.GEO_id2.toString();})});
//console.dir(JSON.stringify(zipcodes));


//toggle between zip codes and superneighborhoods on map
$(".toggleZipsLink").click(function(){
	if(mymap1.hasLayer(layer3)){
		mymap1.removeLayer(layer3);
		mymap2.removeLayer(layer4);
		layer1.setStyle(style1);

		$(".zipProp").addClass("hidden");
		$(".SNProp").removeClass("hidden");

		$('.mappropertyselector').html(map2Property+'<span class="glyphicon glyphicon-menu-down"></span>');
		maxProp2=maxMapProperty(map2Property);
		layer2.setStyle(style2);

		$(".Censusfeature").html(map2Property+": <span class='censusvalue'></span>");

		$('.toggleZips').text("Switch to Zip Codes");

	}
	else {
		layer1.setStyle(styleHidden);
		layer2.setStyle(styleHidden);
		layer3.addTo(mymap1);
		layer4.addTo(mymap2);

		$(".SNProp").addClass("hidden");
		$(".zipProp").removeClass("hidden");

		$('.mappropertyselector').html(map2PropertyZip+'<span class="glyphicon glyphicon-menu-down"></span>');
		maxProp2Zip=maxMapPropertyZip(map2PropertyZip);
		layer4.setStyle(style2Zip);

		$(".Censusfeature").html(map2PropertyZip+": <span class='censusvalue'></span>");

		$('.toggleZips').text("Switch to Super Neighborhoods");
	}

});

//change map property

$(".mappropertygroups > ul > li > a.SNProp").on("click",function(){
	map2Property= $(this).text();
	$('.mappropertyselector').html(map2Property+'<span class="glyphicon glyphicon-menu-down"></span>');
	maxProp2=maxMapProperty(map2Property);
	layer2.setStyle(style2);
	$(".Censusfeature").html(map2Property+": <span class='censusvalue'></span>");
});
$(".mappropertygroups > ul > li > a.zipProp").on("click",function(){
	map2PropertyZip=$(this).text();
	$('.mappropertyselector').html(map2PropertyZip+'<span class="glyphicon glyphicon-menu-down"></span>');
	maxProp2Zip=maxMapPropertyZip(map2PropertyZip);
	layer4.setStyle(style2Zip);
	$(".Censusfeature").html(map2PropertyZip+": <span class='censusvalue'></span>");
});
//search neighborhoods
console.dir(mymap1._layers);

$("#search").keyup(function(e){
        var q = $("#search").val().toUpperCase().replace(/(\W|\s)/g,"");
        //zoom to zip code when enter is pressed
        if (e.keyCode == 13) {
	        if(q>10000){
	        	if(!mymap1.hasLayer(layer3)){
	        		$(".toggleZipsLink").click();
	        	}

	        	var qString=q.toString();
	        	var zipFilter=ABCZipCodes.map(function(a){return a.includes(qString);});
	        	var temp=ABCNeighborhoodsClasses.filter(function(a,index){return !zipFilter[index];});

	        	index1=_.findKey(mymap1._layers, function(a){
	        		if(Boolean(a.feature)){
	        			return a.feature.properties.Name===qString;
	        		}
	        		else return false
	        	});
	        	index2=_.findKey(mymap2._layers, function(a){
	        		if(Boolean(a.feature)){
	        			return a.feature.properties.Name===qString;
	        		}
	        		else return false;
	        	});

	        	mymap1.fitBounds(mymap1._layers[index1].getBounds(), {padding: [100, 100]});
				mymap2.fitBounds(mymap2._layers[index2].getBounds(), {padding: [100, 100]});
	        }
	    }
        if(q>0){
        	var qString=q.toString();
        	var zipFilter=ABCZipCodes.map(function(a){return a.includes(qString);});
        	var temp=ABCNeighborhoodsClasses.filter(function(a,index){return !zipFilter[index];});

        }
        else{
        var temp=ABCNeighborhoodsClasses.filter(function(a){return !a.includes(q);});  
    }
     $(".hood").show();
    temp.forEach(function(a){$("."+a + ":not(.active)").hide()}); 
    });

  

//select neighborhood

$(document).on("click", ".hood", function(){
	$(this).addClass("active");
	$(this).siblings().removeClass("active");
	var selectedneighborhood=$(this).text();
	var hoodindex=ABCNeighborhoodsArray.findIndex(function(a){return a === selectedneighborhood});

	mymap1.fitBounds(mymap1._layers[hoodids1[hoodindex]].getBounds(), {padding: [80, 80]});
	mymap2.fitBounds(mymap2._layers[hoodids2[hoodindex]].getBounds(), {padding: [80, 80]});
});


$(".mapbox").mouseleave(function(){
	if($(".hood").hasClass("active")){
	$(".neighborhoodtitle").text($(".hood.active").text());
	var selectedneighborhood=$(".hood.active").text();
	var hoodindex=ABCNeighborhoodsArray.findIndex(function(a){return a === selectedneighborhood});
	$(".Evictions").text(mymap1._layers[hoodids1[hoodindex]].feature.properties.Evictions);
	$(".censusvalue").text(mymap1._layers[hoodids1[hoodindex]].feature.properties[map2Property]);
}

});

//map highlighting
		function highlightFeature(e) {
			if(e.target._map._leaflet_id===29){
				var hoodid=e.target._leaflet_id;
			}
			else{
				var hoodid=e.target._leaflet_id-91;
			}

				mymap1._layers[hoodid].setStyle({
					weight: 1,
					color: '#777'
				});

				mymap2._layers[hoodid+91].setStyle({
					weight: 1,
					color: '#777'
				});

				if (!L.Browser.ie && !L.Browser.opera) {
					mymap1._layers[hoodid].bringToFront();
					mymap2._layers[hoodid+91].bringToFront();
				}

			$(".neighborhoodtitle").text(e.target.feature.properties.Name);
			$(".Evictions").text(e.target.feature.properties.Evictions);
			if (map2Property==="Vacant Housing Units "){
				$(".censusvalue").text(e.target.feature.properties[map2Property]+" ("+Math.floor(100*e.target.feature.properties[map2Property]/e.target.feature.properties["Total Housing Units "])+"%)");
			}
			else if(map2Property!=="Total Housing Units "&&map2Property!=="Total Population "){
				$(".censusvalue").text(e.target.feature.properties[map2Property]+" ("+Math.floor(100*e.target.feature.properties[map2Property]/e.target.feature.properties["Total Population "])+"%)");
			}
			else{
				$(".censusvalue").text(e.target.feature.properties[map2Property]);
			}
		}


		function resetHighlight(e) {
			if(e.target._map._leaflet_id===29){

				var hoodid=e.target._leaflet_id;
		}
			else{
				var hoodid=e.target._leaflet_id-91;
			}
			layer1.resetStyle(mymap1._layers[hoodid]);
			layer2.resetStyle(mymap2._layers[hoodid+91]);
		}

		function highlightFeature2(e) {
			if(e.target._map._leaflet_id===29){
				var hoodid=e.target._leaflet_id;
			}
			else{
				var hoodid=e.target._leaflet_id-227;
			}

				mymap1._layers[hoodid].setStyle({
					weight: 1,
					color: '#777'
				});

				mymap2._layers[hoodid+227].setStyle({
					weight: 1,
					color: '#777'
				});

				if (!L.Browser.ie && !L.Browser.opera) {
					mymap1._layers[hoodid].bringToFront();
					mymap2._layers[hoodid+227].bringToFront();
				}

			$(".neighborhoodtitle").text(e.target.feature.properties.Name);
			$(".Evictions").text(e.target.feature.properties.Evictions);
			if(!Boolean(e.target.feature.properties["ACS"])){
				$(".censusvalue").text("");
			}
			else if(map2PropertyZip!=="Median Income "&&map2PropertyZip!=="Median Gross Rent "&& map2PropertyZip!=="Total Population "){
				$(".censusvalue").text(e.target.feature.properties["ACS"][map2PropertyZip]+" ("+Math.floor(100*e.target.feature.properties["ACS"][map2PropertyZip]/e.target.feature.properties["ACS"]["Total Population "])+"%)");
			}
			else{
				$(".censusvalue").text(e.target.feature.properties["ACS"][map2PropertyZip]);
			}
		}


		function resetHighlight2(e) {
			if(e.target._map._leaflet_id===29){

				var hoodid=e.target._leaflet_id;
		}
			else{
				var hoodid=e.target._leaflet_id-227;
			}
			layer3.resetStyle(mymap1._layers[hoodid]);
			layer4.resetStyle(mymap2._layers[hoodid+227]);
		}

		function zoomToFeature(e) {
			mymap1.fitBounds(e.target.getBounds(), {padding: [80, 80]});
			mymap2.fitBounds(e.target.getBounds(),{padding: [80, 80]});
			var neighborhoodclass= e.target.feature.properties.Name.replace(/(\W|\s)/g,"");
			$(".hood").removeClass('active');
			$("."+neighborhoodclass).addClass('active');
			$(".hood").show();
			var q = $("#search").val().toUpperCase().replace(/(\W|\s)/g,"");
        	var temp=ABCNeighborhoodsClasses.filter(function(a){return !a.includes(q);});
        	temp.forEach(function(a){$("."+a + ":not(.active)").hide()});
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}

		function onEachFeature2(feature, layer) {
			layer.on({
				mouseover: highlightFeature2,
				mouseout: resetHighlight2,
				click: zoomToFeature
			});
		}


function populateList(item){
	ABCNeighborhoodsArray.push(item.properties.Name);
	ABCNeighborhoodsClasses.push(item.properties.Name.replace(/(\W|\s)/g,""));
	ABCZipCodes.push(item.properties["Zip Code"]);
	$(".hoodlist").append('<li class="hood list-group-item text-center '+item.properties.Name.replace(/(\W|\s)/g,"") +'">'+item.properties.Name+'</li>');
	hoodids1.push(ABCNeighborhoodsArray.length+32);
	hoodids2.push(ABCNeighborhoodsArray.length+123);

}

function alphabetizeByName(a,b) {
  if (a.properties.Name < b.properties.Name)
    return -1;
  else if (a.properties.Name > b.properties.Name)
    return 1;
  else 
    return 0;
}

function style1(feature) {
	var fOpac=feature.properties[map1Property]/maxProp1
	if(!Boolean(fOpac)){
		fOpac=0;
	}
    return {
        fillColor: '#CF000F',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: fOpac
    };
}

function style2(feature) {
	var fOpac=feature.properties[map2Property]/maxProp2;
    return {
        fillColor: '#19b5fe',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: fOpac
    };    
}

function style2Zip(feature) {
	if(!Boolean(feature.properties["ACS"])){
		fOpac=0;
	}
	else{
		var fOpac=feature.properties["ACS"][map2PropertyZip]/maxProp2Zip;
	}
    return {
        fillColor: '#19b5fe',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: fOpac
    };    
}

function styleHidden(feature) {
    return {
        fillColor: '#CF000F',
        weight: 1,
        opacity: 0,
        color: 'white',
        fillOpacity: 0
    };
}

function maxMapProperty(mapProperty){
	var props=superneighborhoodData.features.map(function(a){return a.properties[mapProperty];});
	return Math.max(...props)*1.25;
}
function maxMapPropertyZip(mapProperty){
	var props=zipcodes.features.map(function(a){
		if(!Boolean(a.properties["ACS"])){
			return 0;
		}
		else{
			return a.properties["ACS"][mapProperty];
		}
	});
	return Math.max(...props)*1.25;
}

});