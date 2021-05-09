function calculateTemps(station, month, year, day, tempType) {
	let results = calculate(station, month, tempType);
	var finalYearIncrease = (year - results[2].split("-")[0]) * results[0];
	var finalMonthlyIncrease = (day - results[2].split("-")[2]) * results[1];
	return Math.round((results[3]  - finalYearIncrease - finalMonthlyIncrease));
}

function calculate(station, month, tempType) {
	var onlyThisMonth = [];
	var initialDate = "";
	for (var i = 1; i < station.length; i++) {
		if (station[i]["DATE"].split("-")[1] == month) {
			if (initialDate == "") {
				initialDate = station[i]["DATE"];
			}
			onlyThisMonth.push(station[i]);
		}
	}

	let years = [];
	let yearsWithContents = [];
	for (var i = 0; i < onlyThisMonth.length; i++) {
		if (!years.includes(onlyThisMonth[i]["DATE"].split("-")[0])) {
			years.push(onlyThisMonth[i]["DATE"].split("-")[0]);
		}

	}

	for (var i = 0; i < years.length; i++) {
		yearsWithContents.push(onlyThisMonth.filter(observation => observation["DATE"].split("-")[0] == years[i]));
	}


	var monthAverages = [];
	
	for (var i = 0; i < yearsWithContents.length; i++) {
		var total = 0;
		var j = 0;
		for (j = 0; j < yearsWithContents[i].length; j++) {
			total += yearsWithContents[i][j][tempType];
		}
		monthAverages.push(total/j);
	}

	var monthDiffAverages = [];

	for (var i = 0; i < yearsWithContents.length; i++) {
		var j = 0;
		var total = 0;
		for (j = 0; j < yearsWithContents[i].length - 1; j++) {
			total += yearsWithContents[i][j][tempType] - yearsWithContents[i][j + 1][tempType]
		}
		monthDiffAverages.push(total/j);
	}

	var pointEstimate = 0;
	for (var i = 0; i < monthAverages.length - 1; i++) {
		pointEstimate += monthAverages[i];
	}

	var yearDiffTotal = 0;
	for (var i = 0; i < monthAverages.length - 1; i++) {
		yearDiffTotal += monthAverages[i] - monthAverages[i + 1];
	}

	var monthDiffTotal = 0;
	for (var i = 0; i < monthDiffAverages.length; i++) {
		monthDiffTotal += monthDiffAverages[i];
	}

	return [(yearDiffTotal/monthAverages.length), (monthDiffTotal/monthDiffAverages.length), initialDate, (pointEstimate/monthAverages.length)];
}

function parseInputDate(date) {
	return date.split("-");
}

function main() {
	var dateGetter = new Date();
	var dd = String(dateGetter.getDate()).padStart(2, '0');
	var mm = String(dateGetter.getMonth() + 1).padStart(2, '0');
	var yyyy = dateGetter.getFullYear();

	document.getElementById("weather-input").value = yyyy + '-' + mm + '-' + dd;
	document.getElementById("weather-button").onclick = function() {
		var inputDate = parseInputDate(document.getElementById("weather-input").value);
		document.getElementById("weather-high-display").innerText = "\t High: " + calculateTemps(USW00014764, inputDate[1], inputDate[0], inputDate[2], "TMAX");
		document.getElementById("weather-low-display").innerText = "\t Low: " + calculateTemps(USW00014764, inputDate[1], inputDate[0], inputDate[2], "TMIN");
		document.getElementById("weather-avg-display").innerText = "\t Avg: " + calculateTemps(USW00014764, inputDate[1], inputDate[0], inputDate[2], "TAVG");
	};
}


main();
