function calculateTemps(station) {
    let maxTotal = 0;
    let minTotal = 0; 
    for (var i = 0; i < station.length; i++) {
        maxTotal += station[i]["TMAX"];
        minTotal += station[i]["TMIN"];
    }
    let maxSlope = maxTotal/station.length;
    let minSlope = minTotal/station.length;
    let daysSinceLastData = daysSince(station[station.length - 1]["DATE"]);
    return [(station[station.length - 1]["TMIN"] + (minSlope * daysSinceLastData)), (station[station.length - 1]["TMAX"] + (maxSlope * daysSinceLastData))];
}

function daysSince(pastDate) {
    let parsedCurrentDate = pastDate.split("-");
    return (Date.now() - new Date(parsedCurrentDate[0], parsedCurrentDate[1], parsedCurrentDate[2]))/(1000 * 60 * 60 * 24);  
}