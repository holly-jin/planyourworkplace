const teamlist=[];
let weights=[20,20,20,20,20];
let numSimulation=50;
let chartAverageDailyAttendance;
let chartSummaryDailyAttendance;
let teamid = 0;
let simNum = 0;
let days=["Monday","Tuesday","Wednesday","Thursday","Friday"];

document.querySelector(".addteam").addEventListener("click",createTeam);
document.getElementById("runSimulation").addEventListener("click",runAllSim);
document.getElementById("btn_update").addEventListener("click",updateSettings);
document.getElementById("btn_setToDefault").addEventListener("click",defaultSettings);

//create a listener when there is a change in the weights sliders for the five days
var ele_weightSlider = document.getElementsByClassName("weightSlider");
Array.prototype.forEach.call(ele_weightSlider, item => item.addEventListener("input",updateWeightsInput));
//create a listener when there is a change in the weights for the five days
var ele_weightNumber = document.getElementsByClassName("weightNumber");
Array.prototype.forEach.call(ele_weightNumber, item => item.addEventListener("change",updateWeightsRange));

//create a listener when there is a change in the weights sliders for the five days IN THE ADD TEAM
var ele_weightSliderTeam = document.getElementsByClassName("weightSliderTeam");
Array.prototype.forEach.call(ele_weightSliderTeam, item => item.addEventListener("input",updateWeightsInputTeam));
//create a listener when there is a change in the weights for the five days IN THE ADD TEAM
var ele_weightNumberTeam = document.getElementsByClassName("weightNumberTeam");
Array.prototype.forEach.call(ele_weightNumberTeam, item => item.addEventListener("change",updateWeightsRangeTeam));


// click the update button in the settings
function updateSettings(){
    const sliders = document.getElementsByClassName("weightSlider");
    const num = document.getElementById("inputNumSimulation");
    numSimulation = num.value;
    console.log(numSimulation);
    for (let i=0; i<sliders.length; i++){
        weights[i]= parseInt(sliders[i].value);
    }
    console.log(weights);
}

//update all the settings to default - equal weights and 100 simulation
function defaultSettings(){
    numSimulation = 100;
    weights=[20,20,20,20,10];
    const sliders = document.getElementsByClassName("weightSlider");
    for (let i=0; i<sliders.length; i++){
        sliders[i].value = 20;
    }
    const inputnumbers = document.getElementsByClassName("weightNumber");
    for (let i=0; i<inputnumbers.length; i++){
        inputnumbers[i].value = 20;
    }
    document.getElementById("inputNumSimulation").value = 100;
}

// currently disabled because the weights have been updated to team-specific
function updateWeightsInput(){
    const sliders = document.getElementsByClassName("weightSlider");
    const inputnumbers = document.getElementsByClassName("weightNumber");
    let sumPercentage = 0;
    var ele_message = document.getElementById("warning");
    //console.log(sliders);
    for (let i=0; i<sliders.length; i++){
        inputnumbers[i].value = sliders[i].value;
        //console.log(typeof sliders[i].value);
        sumPercentage+= parseInt(sliders[i].value);
        console.log(sumPercentage);
    }
    if (sumPercentage > 100 || sumPercentage < 100 ) {
        ele_message.style.visibility = 'visible';
    } 
    if (sumPercentage == 100) {
        ele_message.style.visibility = 'hidden';
    }
}

function updateWeightsRange(){
    //console.log("input updated");
    const sliders = document.getElementsByClassName("weightSlider");
    const inputnumbers = document.getElementsByClassName("weightNumber");
    for (let i=0; i<inputnumbers.length; i++){
        sliders[i].value = inputnumbers[i].value
    }
}

//update the numbers in input if the sliders are changed
function updateWeightsInputTeam() {
    const sliders = document.getElementsByClassName("weightSliderTeam");
    const inputnumbers = document.getElementsByClassName("weightNumberTeam");
    let sumPercentage = 0;
    let ele_message = document.getElementById("warningTeam");

    for (let i=0; i<sliders.length; i++){
        inputnumbers[i].value = sliders[i].value;
        //console.log(typeof sliders[i].value);
        sumPercentage+= parseInt(sliders[i].value);
  
    }
    if (sumPercentage > 100 || sumPercentage < 100 ) {
        ele_message.style.visibility = 'visible';
    } 
    if (sumPercentage == 100) {
        ele_message.style.visibility = 'hidden';
    }
}



//function to add and delete a team under the team info section
function createTeam(evt){
    if (document.getElementById('addOneTeam').checkValidity() === false) {
        return;
    }

    teamid+=1 ; 
    const team={};
    team.teamname = document.getElementById("inputName").value;
    team.teamsize = parseInt(document.getElementById("inputSize").value);
    team.numdays = parseInt(document.getElementById("inputNumDays").value);
    team.frequency = document.getElementById("inputFrequency").value;
    team.id = teamid;
    team.weights=[];
    
    const sliders = document.getElementsByClassName("weightSliderTeam");
    for (let i=0; i<sliders.length; i++){
        team.weights[i] = parseInt(sliders[i].value);
    }

    teamlist.push(team); //add the team object to the teamlist array
    //set input values to empty
    document.getElementById("inputName").value = "";
    document.getElementById("inputSize").value = "";

    //add this team on the page under the team info section
    str=team.teamname + ' has ' + team.teamsize + ' employees. They come into the office '
     + team.numdays + ' days ' + team.frequency + '.';
    const newele = document.createElement("div");
    const node = document.createTextNode(str);
    newele.appendChild(node);
    newele.classList.add("teamInfo");
    const targetele=document.getElementById("teamInfoSection");
    targetele.appendChild(newele);

    //add the delete button after each new item
    const del = document.createElement("button");
    del.classList.add("delete");
    const delIcon = document.createElement("i")
    delIcon.classList.add("fas", "fa-trash-alt");
    del.appendChild(delIcon);
    newele.appendChild(del);

    //delete the team when clicking the delete button
    del.onclick = function(){
        this.parentNode.remove();
        for (let i=0; i<teamlist.length; i++){
            if (teamlist[i].id == team.id){
                teamlist.splice(i,1);
                console.log("deleted team list is: ", teamlist);
                break;
            } 
        }
    };

    document.getElementById('addOneTeam').classList.remove("was-validated");
    evt.preventDefault();
    evt.stopPropagation();
    console.log("current team list is: ", teamlist);

}

//function to add form validation
(function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();


//master function for running the simulation
function runAllSim(){

    simNum = 0;
    const simResultDetailed = {
        Monday:[], Tuesday:[], Wednesday:[], Thursday:[], Friday:[]};
    const simResult ={
        Monday:0, Tuesday:0, Wednesday:0, Thursday:0, Friday:0
    }

    for (let i=0; i < numSimulation; i++) {
        simNum+=1;
        //accumulate the result for SimResult (overall count by day)
        const output = runOneSim();
        const oneSim = output.oneSimResult;
        simResult.Monday+=oneSim.Monday;
        simResult.Tuesday+=oneSim.Tuesday;
        simResult.Wednesday+=oneSim.Wednesday;
        simResult.Thursday+=oneSim.Thursday;
        simResult.Friday+=oneSim.Friday;

        //accumulate the detailed result entry for SimResultDetailed (detailed count by day)
        
        simResultDetailed.Monday.push(oneSim.Monday);
        simResultDetailed.Tuesday.push(oneSim.Tuesday);
        simResultDetailed.Wednesday.push(oneSim.Wednesday);
        simResultDetailed.Thursday.push(oneSim.Thursday);
        simResultDetailed.Friday.push(oneSim.Friday);

        //simResultDetailed.Monday.push(oneSim.Monday);
        //simResultDetailed.Tuesday.push.apply(simResultDetailed.Tuesday,oneSim.Tuesday);
        //simResultDetailed.Wednesday.push.apply(simResultDetailed.Wednesday,oneSim.Wednesday);
        //simResultDetailed.Thursday.push.apply(simResultDetailed.Thursday,oneSim.Thursday);
        //simResultDetailed.Friday.push.apply(simResultDetailed.Friday,oneSim.Friday);
    }

    //take the average of the simulation results
    simResult.Monday=Math.floor(simResult.Monday/numSimulation);
    simResult.Tuesday=Math.floor(simResult.Tuesday/numSimulation);
    simResult.Wednesday=Math.floor(simResult.Wednesday/numSimulation);
    simResult.Thursday=Math.floor(simResult.Thursday/numSimulation);
    simResult.Friday=Math.floor(simResult.Friday/numSimulation);

   
    console.log("detailed result is: ", simResultDetailed);
    //call draw the graph function

    //plot the bar chart of average daily attendence
    const chartData = {
        type: 'bar',
        data: {
            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            datasets: [{ label: "Average Daily Attendance",  
            data: [simResult.Monday, simResult.Tuesday, simResult.Wednesday, simResult.Thursday, simResult.Friday], backgroundColor: "#EDAD40"}]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Monte Carlo Simulation of Daily Attendence in the office - Average'
            }
          }
        },
      };
    const ctx = document.getElementById("simChart").getContext('2d');
    if (chartAverageDailyAttendance) {
        chartAverageDailyAttendance.destroy();
    }
    chartAverageDailyAttendance = new Chart(ctx, chartData);


    
    //calculate the medium, standard deviation, percentiles of the *Monday simulations*
    let entriesMondaySort = [];
    for (let i = 0; i< simResultDetailed.Monday.length; i++){
        entriesMondaySort[i] = simResultDetailed.Monday[i];
        entriesMondaySort.sort((a,b) => a-b);
    }
    let statsOutput = getMeanAndStd(entriesMondaySort);
    const meanMonday = statsOutput.mean;
    const stdMonday = statsOutput.std;
    const mediumMonday = getPercentile(50, entriesMondaySort);
    const p25Monday = getPercentile(25, entriesMondaySort);
    const p75Monday = getPercentile(75, entriesMondaySort);
    const minMonday = entriesMondaySort[0];
    const maxMonday = entriesMondaySort[entriesMondaySort.length - 1];
    //console.log("Monday histogram array SORTED is:", entriesMondaySort);
    //console.log(meanMonday,stdMonday,mediumMonday,minMonday, p25Monday,p75Monday, maxMonday);

    //calculate the medium, standard deviation, percentiles of the *Tuesday simulations*
    let entriesTuesdaySort = [];
    for (let i = 0; i< simResultDetailed.Tuesday.length; i++){
        entriesTuesdaySort[i] = simResultDetailed.Tuesday[i];
        entriesTuesdaySort.sort((a,b) => a-b);
    }
    statsOutput = getMeanAndStd(entriesTuesdaySort);
    const meanTuesday = statsOutput.mean;
    const stdTuesday = statsOutput.std;
    const mediumTuesday = getPercentile(50, entriesTuesdaySort);
    const p25Tuesday = getPercentile(25, entriesTuesdaySort);
    const p75Tuesday = getPercentile(75, entriesTuesdaySort);
    const minTuesday = entriesTuesdaySort[0];
    const maxTuesday = entriesTuesdaySort[entriesTuesdaySort.length - 1];
    //console.log("Tuesday histogram array SORTED is:", entriesTuesdaySort);
    //console.log(meanTuesday,stdTuesday,mediumTuesday,minTuesday, p25Tuesday,p75Tuesday, maxTuesday);

    //calculate the medium, standard deviation, percentiles of the *Wednesday simulations*
    let entriesWednesdaySort = [];
    for (let i = 0; i< simResultDetailed.Wednesday.length; i++){
        entriesWednesdaySort[i] = simResultDetailed.Wednesday[i];
        entriesWednesdaySort.sort((a,b) => a-b);
    }
    statsOutput = getMeanAndStd(entriesWednesdaySort);
    const meanWednesday = statsOutput.mean;
    const stdWednesday = statsOutput.std;
    const mediumWednesday = getPercentile(50, entriesWednesdaySort);
    const p25Wednesday = getPercentile(25, entriesWednesdaySort);
    const p75Wednesday = getPercentile(75, entriesWednesdaySort);
    const minWednesday = entriesWednesdaySort[0];
    const maxWednesday = entriesWednesdaySort[entriesWednesdaySort.length - 1];
    //console.log("Wednesday histogram array SORTED is:", entriesWednesdaySort);
    //console.log(meanWednesday,stdWednesday,mediumWednesday,minWednesday, p25Wednesday,p75Wednesday, maxWednesday);

    //calculate the medium, standard deviation, percentiles of the *Thursday simulations*
    let entriesThursdaySort = [];
    for (let i = 0; i< simResultDetailed.Thursday.length; i++){
        entriesThursdaySort[i] = simResultDetailed.Thursday[i];
        entriesThursdaySort.sort((a,b) => a-b);
    }
    statsOutput = getMeanAndStd(entriesThursdaySort);
    const meanThursday = statsOutput.mean;
    const stdThursday = statsOutput.std;
    const mediumThursday = getPercentile(50, entriesThursdaySort);
    const p25Thursday = getPercentile(25, entriesThursdaySort);
    const p75Thursday = getPercentile(75, entriesThursdaySort);
    const minThursday = entriesThursdaySort[0];
    const maxThursday = entriesThursdaySort[entriesThursdaySort.length - 1];
    //console.log("Thursday histogram array SORTED is:", entriesThursdaySort);
    //console.log(meanThursday,stdThursday,mediumThursday,minThursday, p25Thursday,p75Thursday, maxThursday);

    //calculate the medium, standard deviation, percentiles of the *Friday simulations*
    let entriesFridaySort = [];
    for (let i = 0; i< simResultDetailed.Friday.length; i++){
        entriesFridaySort[i] = simResultDetailed.Friday[i];
        entriesFridaySort.sort((a,b) => a-b);
    }
    statsOutput = getMeanAndStd(entriesFridaySort);
    const meanFriday = statsOutput.mean;
    const stdFriday = statsOutput.std;
    const mediumFriday = getPercentile(50, entriesFridaySort);
    const p25Friday = getPercentile(25, entriesFridaySort);
    const p75Friday = getPercentile(75, entriesFridaySort);
    const minFriday = entriesFridaySort[0];
    const maxFriday = entriesFridaySort[entriesFridaySort.length - 1];
    //console.log("Friday histogram array SORTED is:", entriesFridaySort);
    //console.log(meanFriday,stdFriday,mediumFriday,minFriday, p25Friday,p75Friday, maxFriday);

    //plot the bar chart of average daily attendence
    const chartData2 = {
        type: 'line',
        data: {
            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            datasets: [
                { label: "Mininum",  data: [minMonday, minTuesday, minWednesday, minThursday, minFriday], backgroundColor: "#EDAD40", fill:false},
                { label: "25th Percentile",  data: [p25Monday, p25Tuesday, p25Wednesday, p25Thursday, p25Friday], backgroundColor: "#EDAD40", borderColor: 'orange', fill: false}, //fill: 3
                { label: "Medium",  data: [mediumMonday, mediumTuesday, mediumWednesday, mediumThursday, mediumFriday], backgroundColor: "#EDAD40", borderColor: '#0ba2e3', fill: false},
                { label: "75th Percentile",  data: [p75Monday, p75Tuesday, p75Wednesday, p75Thursday, p75Friday], backgroundColor: "#EDAD40", borderColor: 'orange', fill: false},
                { label: "Maximum",  data: [maxMonday, maxTuesday, maxWednesday, maxThursday, maxFriday], backgroundColor: "#EDAD40", fill: false}
            ]
        },
        options: {
            responsive: true,
            plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Statistical Summary of Daily Attendance Simulation'
            }
            }
        },
        };
    const ctx2 = document.getElementById("statChart").getContext('2d');
    if (chartSummaryDailyAttendance) {
        chartSummaryDailyAttendance.destroy();
    }
    chartSummaryDailyAttendance = new Chart(ctx2, chartData2);

    //plot the histogram of simulations per day
    for (let i=0;i<days.length; i++ ) {
        plotHistogram(days[i],simResultDetailed);
    }

    // var layoutall = {
    //     grid: {rows: 2, columns: 3, pattern: 'independent'},
    // }

    // dataAll = [trace1,trace2];
    // Plotly.newPlot('allChart', dataAll,layoutall);

}

    
function plotHistogram(day, simResultDetailed) {
    let trace1 = {
        x: simResultDetailed[day],
        type: 'histogram',
        marker: {
            color: "rgba(255, 100, 102, 0.7)", 
            line: {
              color:  "rgba(255, 100, 102, 1)", 
              width: 1
            }
          },  
        opacity: 0.5, 
      };
    let layout1 = {
        title: "Simulation Result Histogram - "+day+" Attendance", 
        font:{
            family:'Roboto, Arial',
            size:8,
        },
        xaxis: {title: "Attendance"}, 
        yaxis: {title: "Count of Frequency"},
        margin: {
            l: 10,
            r: 10,
            b: 50,
            t: 50,
            pad: 2,
          },
      };

    let data1 = [trace1];
    let canvas=day+"Chart";
    Plotly.newPlot(canvas,data1,layout1,{displaylogo: false, responsive: true});
}


function getMeanAndStd(arr){
    const arrSum = arr.reduce((a,b) => a+b,0);
    const mean = arrSum / arr.length;
    let tot = 0;
    let std;
    for (i in arr) {
        tot += (arr[i] - mean)**2
        std = (tot/arr.length)**0.5
    }
    const mean_std = {};
    mean_std.mean = mean;
    mean_std.std = std;
    return mean_std;
}

function getPercentile(percentile, arr) {
    //console.log("arr length is:", arr.length);
    let n = 0;
    if (percentile == 50) {
        if (arr.length % 2 == 0) {
            n = arr.length / 2;
            return (arr[n-1] + arr[n]) / 2;
        } else {
            n = Math.round(arr.length / 2);
            return arr[n-1];
        }
    } 
    if (percentile != 50) {
        n = Math.round(arr.length * percentile / 100);
        return arr[n-1];
    }

}


//runs one simluation of the whole population
function runOneSim(){
    //console.log("runOneSim function is running");
    const oneSimResult = {
        Monday:0, Tuesday:0, Wednesday:0, Thursday:0, Friday:0
    }
    let resultbyteam = [];
    let daylist = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    for (let eachteam in teamlist) {
        //console.log("each team is:");
        eachteam = teamlist[eachteam];
        //console.log(eachteam);
        const numpeople = eachteam.teamsize;
        let daysChosen;
    
        if (eachteam.frequency == "every week"){
            for (let i=0; i<numpeople; i++){
                daysChosen = runOnePerson_week(eachteam); //array of days chosen by this person
                //console.log("chosen day for this person is: " + daysChosen);
                for (day in daysChosen) {
                    oneSimResult[daysChosen[day]]+=1; //result of attendence by day
                }
            }
        }

        for (let i=0; i<daylist.length; i++){
            let resultEntry = {};
            //ResultEntry(teamid, teamname, day, attendence, simnum)
            resultEntry.teamid = eachteam.id;
            resultEntry.teamname = eachteam.teamname;
            resultEntry.simnum = simNum;
            resultEntry.day = daylist[i];
            resultEntry.attendence = oneSimResult[daylist[i]];

            resultbyteam.push(resultEntry);
        }

    }
    //console.log("result from one simultion" + oneSimResult);
   
    let output = {};
    output.oneSimResult = oneSimResult;
    output.resultbyteam = resultbyteam;

    return output;
    
}

//runs one simluation of an individual based on the factors: 1.how many days a week 2. weights
function runOnePerson_week(eachteam){
    //console.log("runOnePerson_Week function is running");
    const weights=eachteam.weights.slice().map(x=>x/100);
    let choicearr=["Monday","Tuesday","Wednesday","Thursday","Friday"];
    const chosenarr=[];
    let chosenday;
    let indChosen;
    let weightsum;

    //choose (number of days) times randomly to generate the chosen days for this employee
    for (let i=0; i<eachteam.numdays ; i++){ 
        let cumweights=[];  
        weightsum = weights.reduce((a,b)=>a+b,0); // consider looping
   
        
        //create the accumulated weights array
        for (let i=0;i<weights.length; i++) {     
            let arr = weights.slice(0,i+1);
            let cumsum = arr.reduce((a,b)=>a+b,0); 
            cumweights[i] = cumsum;
        }
        //console.log("UNnormalized accumulated weight list is: ", cumweights);

        //normalize the weighted choice to the sum of 1
        cumweights = cumweights.map(x => x / weightsum)
        //console.log("normalized accumulated weight list is: ", cumweights);

        //generate a random number
        const rdn = Math.random();

        //return the chosen day from the choicearr list
        for (let i=0; i<cumweights.length;i++) {
            if (i==0 && rdn < cumweights[i]){
                chosenday = choicearr[i];
                indChosen=i;
                break;
            }
            if (rdn>= cumweights[i-1] && rdn < cumweights[i]){
                chosenday = choicearr[i];
                indChosen=i;
                break;
            }
        }
  
        chosenarr.push(chosenday); //add the chosen day to the chosenarr list
        choicearr = choicearr.filter (a => a!==chosenday); //remove the chosen day options from the arr
        weights.splice(indChosen,1); //remove the weights of the chosen day from the weights array
        
        //console.log("update weighted choice list after one choice to :" + choicearr);
        //console.log("update weighted choice list after one choice to :" + weights);
    }
    //console.log("chosen days for this person", chosenarr);
    return chosenarr //return an array of the days chosen
}


function createWeightedChoices(weights){

}

/* update the weights and the simulation number */