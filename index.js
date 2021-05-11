function calculateTemps(station, month, year, day, tempType) {
	let results = calculate(station, month, tempType);
	let finalYearIncrease = (year - results[2].split("-")[0]) * results[0];
	let finalMonthlyIncrease = (day - results[2].split("-")[2]) * results[1];
	return Math.round((results[3] - finalYearIncrease - finalMonthlyIncrease));
}

function calculate(station, month, tempType) {
	let onlyThisMonth = [];
	let initialDate = "";
	for (let i = 1; i < station.length; i++) {
		if (station[i]["DATE"].split("-")[1] == month) {
			if (initialDate == "") {
				initialDate = station[i]["DATE"];
			}
			onlyThisMonth.push(station[i]);
		}
	}

	let years = [];
	let yearsWithContents = [];
	for (let i = 0; i < onlyThisMonth.length; i++) {
		if (!years.includes(onlyThisMonth[i]["DATE"].split("-")[0])) {
			years.push(onlyThisMonth[i]["DATE"].split("-")[0]);
		}

	}

	for (let i = 0; i < years.length; i++) {
		yearsWithContents.push(onlyThisMonth.filter(observation => observation["DATE"].split("-")[0] == years[i]));
	}


	let monthAverages = [];

	for (let i = 0; i < yearsWithContents.length; i++) {
		let total = 0;
		let j = 0;
		for (j = 0; j < yearsWithContents[i].length; j++) {
			total += yearsWithContents[i][j][tempType];
		}
		monthAverages.push(total / j);
	}

	let monthDiffAverages = [];

	for (let i = 0; i < yearsWithContents.length; i++) {
		let j = 0;
		let total = 0;
		for (j = 0; j < yearsWithContents[i].length - 1; j++) {
			total += yearsWithContents[i][j][tempType] - yearsWithContents[i][j + 1][tempType]
		}
		monthDiffAverages.push(total / j);
	}

	let pointEstimate = 0;
	for (let i = 0; i < monthAverages.length - 1; i++) {
		pointEstimate += monthAverages[i];
	}

	let yearDiffTotal = 0;
	for (let i = 0; i < monthAverages.length - 1; i++) {
		yearDiffTotal += monthAverages[i] - monthAverages[i + 1];
	}

	let monthDiffTotal = 0;
	for (let i = 0; i < monthDiffAverages.length; i++) {
		monthDiffTotal += monthDiffAverages[i];
	}

	return [(yearDiffTotal / monthAverages.length), (monthDiffTotal / monthDiffAverages.length), initialDate, (pointEstimate / monthAverages.length)];
}

let parseInputDate = (date) =>  date.split("-");

function main() {
	let dateGetter = new Date();
	let dd = String(dateGetter.getDate()).padStart(2, '0');
	let mm = String(dateGetter.getMonth() + 1).padStart(2, '0');
	let yyyy = dateGetter.getFullYear();

	document.getElementById("weather-input").value = yyyy + '-' + mm + '-' + dd;
	document.getElementById("weather-button").onclick = passFormData;
}

function passFormData() {
	let inputDate = parseInputDate(document.getElementById("weather-input").value);
	let currentAverage = calculateTemps(USW00014764, inputDate[1], inputDate[0], inputDate[2], "TAVG");

	let averageEmoji = currentAverage < 30 ? "❄️" : (currentAverage >= 70 ? "🔥" : "⛅");
	document.getElementById("weather-title").innerText = "Temperatures for " + document.getElementById("weather-input").value;
	document.getElementById("weather-avg-display").innerText = averageEmoji + " " + currentAverage;
	document.getElementById("weather-high-display").innerText = "☀️ " + calculateTemps(USW00014764, inputDate[1], inputDate[0], inputDate[2], "TMAX");
	document.getElementById("weather-low-display").innerText = "🌙 " + calculateTemps(USW00014764, inputDate[1], inputDate[0], inputDate[2], "TMIN");
}

function about() {
	alert("This app was designed to be a quick and easy way to predict future weather based on past trends. We decided to create this app as a PWA (Progressive Web App) to allow for a native-like user experience on mobile (accessible using the \"add to home screen\" functionality built into mobile web browsers, this will allow the user to launch the app standalone) without compromising on desktop usability. This also allowed us to use the JavaScript programming language, which we are more familiar with. The calculations are made by a prediction algorithm that takes into account temperature changes over the years and throughout the individual months, to create a temperature prediction that is specific to the individual day. The data used is from the NCDC.")
}

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("./service-worker.js");
}

main();
passFormData();