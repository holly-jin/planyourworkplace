/*******************************************************

* Copyright (C) 2021 Holly Jin <hj.hongyi@gmail.com>

*

* This file is part of Plan Your Workplace.

*

* Plan Your Workplace can not be copied and/or distributed without the express

* permission of Holly Jin.

*******************************************************/

//remember to change the parseInt to parseFloat for the weights in the currently disabled functions

const teamlist=[];
let weights=[20,20,20,20,20];
let numSimulation=2000;
let chartAverageDailyAttendance;
let chartSummaryDailyAttendance;
let teamid = 0;
let simNum = 0;
let days=["Monday","Tuesday","Wednesday","Thursday","Friday"];

//add listeners
document.querySelector(".addteam").addEventListener("click",createTeam); //when "save" button is clicked
document.getElementById("runSimulation").addEventListener("click",runAllSim); // when "run simulation" button is clicked
//document.getElementById("btn_update").addEventListener("click",updateSettings);
//document.getElementById("btn_setToDefault").addEventListener("click",defaultSettings);

//create a listener when there is a change in the weights for the five days IN THE ADD TEAM
var ele_weightNumberTeam = document.getElementsByClassName("weightNumberTeam");
Array.prototype.forEach.call(ele_weightNumberTeam, item => item.addEventListener("change",updateWeightsRangeTeam));


//create a listener to the modal and run the function (this is based on Bootstrap codes)
var editTeamModal = document.getElementById('addTeamModal');
editTeamModal.addEventListener('show.bs.modal', function (event) {
    console.log("this is running");
    // Button that triggered the modal
    var button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    var teamid = button.getAttribute('data-bs-teamid');
    // Update the modal's content.
    if(teamid===null){
        clearEditForm();
    } else {
        // 1. loop through the team list and find the team that has the matching id
        // 2. populate each input in the modal with the value from the team that we found in step 2    
        document.getElementById("inputTeamId").value = teamid;
        const team = getTeamById (teamid);
        document.getElementById("inputName").value = team.teamname; //name of the team, string
        document.getElementById("inputSize").value = team.teamsize; //number of people in the team
        document.getElementById("inputNumDays").value = team.numdays; //number of days coming in
        document.getElementById("inputFrequency").value = team.frequency; //cadence, "every month", "every week"
        const sliders = document.getElementsByClassName("weightSliderTeam"); //weights on each day, [1,1,1,1,1]
        for (let i=0; i<sliders.length; i++){
            sliders[i].value = team.weights[i];
        }
        
               
    }
    console.log("teamid",teamid);
})

//return the team by the team id
function getTeamById (teamid) {
    for (let i=0;i<teamlist.length;i++){
        if (teamlist[i].id == teamid) {
            return teamlist[i];
        }
    } 
    return null;
}


//clear the input values in the modal form
function clearEditForm() {
    document.getElementById("inputName").value = "";
    document.getElementById("inputSize").value = "";
    document.getElementById("inputTeamId").value = "";
}

//function to add and delete a team under the team info section
//triggers when clicking the "save" button in the modal
function createTeam(evt){
    if (document.getElementById('addOneTeam').checkValidity() === false) {
        return;
    }

    
    if (document.getElementById("inputTeamId").value !== "") {
        console.log("We are about to edit a team");
        
        // put editing code here
        // fetch the team and write in the object values of the team
        let team = getTeamById (parseInt(document.getElementById("inputTeamId").value));
        team.teamname = document.getElementById("inputName").value;
        team.teamsize = parseInt(document.getElementById("inputSize").value);
        team.numdays = parseInt(document.getElementById("inputNumDays").value);
        team.frequency = document.getElementById("inputFrequency").value;
        
        const sliders = document.getElementsByClassName("weightSliderTeam");
        for (let i=0; i<sliders.length; i++){
            team.weights[i] = parseFloat(sliders[i].value);
        }

        let teamDescription=team.teamname + ' has ' + team.teamsize + ' employees. They come into the office '
        + team.numdays + ' days ' + team.frequency + '.';
        team.description.textContent = teamDescription;
        
        console.log("updated team is: ", team);
        console.log("a sentence after the updated team is logged");
        console.log("current updated team list is: ", teamlist);
        return;
    } 


    teamid+=1 ; 
    const team={}; //instantiate a team object with the following attributes
    team.teamname = document.getElementById("inputName").value;
    team.teamsize = parseInt(document.getElementById("inputSize").value);
    team.numdays = parseInt(document.getElementById("inputNumDays").value);
    team.frequency = document.getElementById("inputFrequency").value;
    team.id = teamid;
    team.weights=[];
    //weights input
    const sliders = document.getElementsByClassName("weightSliderTeam");
    for (let i=0; i<sliders.length; i++){
        team.weights[i] = parseFloat(sliders[i].value);
    }

    teamlist.push(team); //add the team object to the teamlist array
    
    clearEditForm(); //set input values to empty after saving the team info

    

    //add this team on the page under the team info section
    let teamDescription=team.teamname + ' has ' + team.teamsize + ' employees. They come into the office '
        + team.numdays + ' days ' + team.frequency + '.';
    const newele = document.createElement("div");
    const node = document.createTextNode(teamDescription);
    newele.appendChild(node);
    newele.classList.add("teamInfo");
    team.description=node;
    const targetele=document.getElementById("teamInfoSection");
    targetele.appendChild(newele);

    //add the edit button for each new item
    const edit = document.createElement("button");
    edit.classList.add("edit");
    const editIcon = document.createElement("i");
    editIcon.classList.add("fas", "fa-edit");
    editIcon.setAttribute("data-bs-toggle","modal");
    editIcon.setAttribute("data-bs-target","#addTeamModal");
    editIcon.setAttribute("data-bs-teamid",team.id); //add the team id to the edit icon attribute every time
    edit.appendChild(editIcon);
    newele.appendChild(edit);

    //add the delete button after each new item
    const del = document.createElement("button");
    del.classList.add("delete");
    const delIcon = document.createElement("i");
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
                if (teamlist.length==0) {
                    let btn_runsimulation=document.getElementById("runSimulation");
                    btn_runsimulation.setAttribute("disabled","disabled");
                    document.getElementById("sectionResult").style.display="none";
                    document.getElementById("sectionResultPreview").style.display="flex";
                }
                break;
            } 
        }
    };

    if (teamlist.length>0) {
        let btn_runsimulation=document.getElementById("runSimulation");
        btn_runsimulation.removeAttribute("disabled");
        //change the preview on the right side
        document.getElementById("sectionResultPreview").style.display="flex";
        document.getElementById("sectionLanding").style.display="none";
        document.getElementById("sectionResult").style.display="none";
    } 
    
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

//set number of simulation based on the population size (to limit the run time)
function setSimNum(teamlist,numSimulation) {
    let total=0;
    for (let i in teamlist) {
        let team = teamlist[i];
        total+=team.teamsize;
        
    }
    //console.log("running setSimNum function, total HC is", total);

    if (total > 2000) {
        numSimulation = 1000;
        //console.log("adjusted the simulation number to 50");
    }
}

//need to edit to add monthly
//calculate the population stats including total HC, people in each hybrid category
function calHeadcount(){
    //calculat the total HC
    let totalHC=0; 
    //calculate HC in each hybrid category (1day/week,2days/week)
    
    //create a dictionary of all frequency preferences: 3 + "every week" -> "3every week"
    let preference;
    let freqConv = {'every week':'Week','every month':'Month'}
    let hcPerCategory = {};
    for (i in teamlist) {
        preference = teamlist[i].numdays + " Days/" + freqConv[teamlist[i].frequency] //5 Days/Month
        hcPerCategory[preference]= 0;  
    }

    console.log("begin to run the calHeadcount function");
    
    for (let i in teamlist) {
        let team = teamlist[i];
        let size = team.teamsize;
        totalHC+=size;

        preference = teamlist[i].numdays + " Days/" + freqConv[teamlist[i].frequency]
        hcPerCategory[preference] +=size;
    }
    console.log("running the calHeadcount function, total HC is",totalHC);

    let output = {};
    output.totalHC = totalHC;
    output.hcPerCategory = hcPerCategory;

    return output;
}

async function getSimResultsFromServer(teamlist, numofsimulation) {
    //const url = 'http://127.0.0.1:3000/'; //use this to test locally
    const url = 'https://j4.is/njs/';
    const response = await fetch(url, {
	method: 'POST',
	mode: 'cors', // no-cors, *cors, same-origin
	body: JSON.stringify({teamlist, numofsimulation})
    });
    return response.json();
}

//old code before migrating to server
//master function for running the simulation. Called when the "Run simulation" button is clicked.
//function runAllSim(){
    //adjust the number of simulation based on observed run time
//    setSimNum(teamlist,numSimulation);
//
//   let args = {};
//    args.teamlist = teamlist;
//    args.numofsimulation= numSimulation;
    //console.log(args);   
//    let results = runSimAlgorithm(args);
//    calResponseResults(results);
//}

//master function for running the simulation. Called when the "Run simulation" button is clicked.
async function runAllSim(){

    //adjust the number of simulation based on observed run time
    setSimNum(teamlist,numSimulation);

    try {
	const simResults = await getSimResultsFromServer(teamlist, numSimulation);
	calResponseResults(simResults);
    } catch (e) {
	console.warn(e);
    }
    // return after getting server response
    return;

    let args = {};
    args.teamlist = teamlist;
    args.numofsimulation= numSimulation;
   
    let results = runSimAlgorithm(args);
    calResponseResults(results);
}


function calResponseResults(allResults) {

    //for reference global variable: days=["Monday","Tuesday","Wednesday","Thursday","Friday"]
    //simResultDetailed

    const simResultDetailed = {Monday:[], Tuesday:[], Wednesday:[], Thursday:[], Friday:[]};
    simResultDetailed['Monday'] = allResults['simResult']['Monday'];
    simResultDetailed['Tuesday'] = allResults['simResult']['Tuesday'];
    simResultDetailed['Wednesday'] = allResults['simResult']['Wednesday'];
    simResultDetailed['Thursday'] = allResults['simResult']['Thursday'];
    simResultDetailed['Friday'] = allResults['simResult']['Friday'];

    //array of all simulations regardless of days
    const simResultAllDays = simResultDetailed['Monday'].concat(simResultDetailed['Tuesday'],simResultDetailed['Wednesday'],simResultDetailed['Thursday'],simResultDetailed['Friday']);  
    console.log("All simulation results of all days are:",simResultAllDays);

    //calcuate the mean and std for each day(overall)
    const simResultStats = {meanDaily:[],stdDaily:[]};
    let mean,std;
    for (let i=0; i<days.length; i++) {
        let day = days[i];
        let output = getMeanAndStd(simResultDetailed[day]);
        mean = Math.round(output.mean); //rounding mean and std
        std = output.std; //not rounding
        simResultStats.meanDaily.push(mean);
        simResultStats.stdDaily.push(std);
    }
    //need to test here

     //simNum = 0;
     //const simResultDetailed = {
     //    Monday:[], Tuesday:[], Wednesday:[], Thursday:[], Friday:[]};
     //const simResult ={
     //    Monday:0, Tuesday:0, Wednesday:0, Thursday:0, Friday:0
     //}


    ////////
    //this is new using the calculated mean and std. Old method is in the plotDailySummary function below.//

    let clStats = {
        cl95min:[],
        cl95max:[],
        cl90min:[],
        cl90max:[]
    };
    //simResultStats = {meanDaily:[],stdDaily:[]};
    for (let i=0; i<5; i++) { //assuming 5 days -> 5 elements in the array, each representing a weekday
        clStats.cl95min.push(Math.round(simResultStats.meanDaily[i]-1.96 * simResultStats.stdDaily[i]));
        clStats.cl95max.push(Math.round(simResultStats.meanDaily[i]+1.96 * simResultStats.stdDaily[i]));
        clStats.cl90min.push(Math.round(simResultStats.meanDaily[i]-1.65 * simResultStats.stdDaily[i]));
        clStats.cl90max.push(Math.round(simResultStats.meanDaily[i]+1.65 * simResultStats.stdDaily[i]));
    }
    console.log("Daily confidence level results are:", clStats);
    ///this is the end of the new calculation section
    ///////////


    
    console.log("detailed result is: ", simResultDetailed);
    
    

    document.getElementById("sectionLanding").style.display="none";
    document.getElementById("sectionResultPreview").style.display="none";
    document.getElementById("sectionResult").style.display="flex";

    renderResults(simResultStats,simResultDetailed,simResultAllDays,clStats) //call all the plotting functions

}

/*
function changeVisibility(ele,option) {
    if (option == "on") {
        document.getElementById(ele).display="block"
    }
    if () {
        document.getElementById(ele).display="None";
    }
}
*/

function renderResults(simResultStats,simResultDetailed,simResultAllDays,clStats){
    renderSummary(simResultStats,clStats); //write in the summary stats in the first result section - average
    plotDailySummary(simResultDetailed,simResultStats,clStats); //plot the statistical summary line chart of daily attendance 
    //plotBarChart(simResultStats.meanDaily); //plot the bar charts of daily attendance by department - average
    //plot the histogram of simulations per day
    for (let i=0;i<days.length; i++ ) {
        plotHistogram(days[i],simResultDetailed,"type1");
    }

    //plot the histogram of ALL simulation regardless of days
    //plotHistogram('Daily Attendance Overall',simResultAllDays,"type2");
}
    
//BOX 1
function renderSummary(simResultStats,clStats) {
    //run numbers on the input: total HC, number of people in each attendance category
    let populationStats = calHeadcount();
    let totalHC = populationStats.totalHC;
    let hcPerCategory = populationStats.hcPerCategory;
    
    console.log(populationStats);

    //clean elements before rendering the new results
    let div = document.getElementById("box1Summary");
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    const maxupper = Math.max(...clStats.cl95max);
    console.log("busiest day's 97.5 upper limit is:",maxupper);
    const index = clStats.cl95max.indexOf(maxupper);
    const maxlower = clStats.cl95min[index];

    let ele2 = document.createElement("div");
    let txt2 = document.createTextNode(
        `The expected attendance on the busiest days ranges from ${maxlower} to ${maxupper} with 95% confidence level, based on ${numSimulation} simulations.
        Therefore, if you plan for a peak attendance of ${maxupper}, you will have enough capacity 97.5% of the time.`);
    ele2.appendChild(txt2);
    div.appendChild(ele2); 



    //add the table of HC breakdown by frequency category
    let div2 = document.getElementById("tableHCPerCategory");
    //clean elements before rendering the new results
    while (div2.firstChild) {
        div2.removeChild(div2.firstChild);
    }

    //render the total headcount 
    let ele = document.createElement("p");
    let txt = document.createTextNode("Total Headcount is: " + totalHC);
    ele.appendChild(txt);
    div2.appendChild(ele); 
    //console.log(totalHC);

    //create the table 
    let headers = [" ","Population"];
    let rowheaders = [];
    for (category in hcPerCategory) {
        rowheaders.push(category);
    }

    let tbl = document.createElement("table");
    tbl.classList.add("table");
    //tbl.classList.add("mx-md-5");
    //create the head part of the table
    let hd = document.createElement("thead");
    let hrow = document.createElement("tr");
    for (let i = 0; i< headers.length; i++) {
        let headcell = document.createElement("th");
        let headtext = document.createTextNode(headers[i]);
        headcell.appendChild(headtext);
        hrow.appendChild(headcell);
    }
    hd.appendChild(hrow);
    tbl.appendChild(hd);

    //create the body part of the table
    let tbd = document.createElement("tbody");
    for (let i=0; i<rowheaders.length; i++) {
        let row = document.createElement("tr");
        for (let j=0; j<2; j++) {
            let bodycell = document.createElement("td");
            let celltext="";
            if (j == 0) {
                celltext = document.createTextNode(rowheaders[i]);
            } 
            if (j == 1 ) {
                celltext = document.createTextNode(hcPerCategory[rowheaders[i]]);
            }
            bodycell.appendChild(celltext);
            row.appendChild(bodycell);
        }
        tbd.appendChild(row);
    }
    tbl.appendChild(tbd);
    div2.appendChild(tbl);


}

//average daily attendance bar chart
//chartjs charts
function plotBarChart(arr) {
    const chartData = {
        type: 'bar',
        data: {
            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            datasets: [{ label: "Average Daily Attendance",  
                        data: arr, //this is the array of data for y values
                        backgroundColor: "#EDAD40"}]
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

}

//stats summary chart w/ chart.js 
function plotDailySummary(simResultDetailed,simResultStats,clStats) {

    //this is the old way of calculating. 
    //A new method using the calculated mean and std is in the calResponseResults function above ^ //

    //calculate the medium, standard deviation, percentiles of the *Monday simulations*
    let entriesMondaySort = getSortedArray(simResultDetailed.Monday);
    let statsOutput = getMeanAndStd(entriesMondaySort);

    //calculate confidence interval
    const meanMonday = statsOutput.mean;
    const stdMonday = statsOutput.std;
    //95% confidence level
    const cl95MondayMin = meanMonday - stdMonday * 1.96; //1.96 ->95% internal, 1.65 -> 90% interval
    const cl95MondayMax = meanMonday + stdMonday * 1.96;


    const mediumMonday = getPercentile(50, entriesMondaySort);
    //const p25Monday = getPercentile(25, entriesMondaySort);
    //const p75Monday = getPercentile(75, entriesMondaySort);
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
    //95% confidence level
    const cl95TuesdayMin = meanTuesday - stdTuesday * 1.96;
    const cl95TuesdayMax = meanTuesday + stdTuesday * 1.96;

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
    //95% confidence level
    const cl95WednesdayMin = meanWednesday - stdWednesday * 1.96;
    const cl95WednesdayMax = meanWednesday + stdWednesday * 1.96;

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
    //95% confidence level
    const cl95ThursdayMin = meanThursday - stdThursday * 1.96;
    const cl95ThursdayMax = meanThursday + stdThursday * 1.96;

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
    //95% confidence level
    const cl95FridayMin = meanFriday - stdFriday * 1.96;
    const cl95FridayMax = meanFriday + stdFriday * 1.96;

    const mediumFriday = getPercentile(50, entriesFridaySort);
    const p25Friday = getPercentile(25, entriesFridaySort);
    const p75Friday = getPercentile(75, entriesFridaySort);
    const minFriday = entriesFridaySort[0];
    const maxFriday = entriesFridaySort[entriesFridaySort.length - 1];
    //console.log("Friday histogram array SORTED is:", entriesFridaySort);
    //console.log(meanFriday,stdFriday,mediumFriday,minFriday, p25Friday,p75Friday, maxFriday);

    //plot the summary line charts
    const chartData2 = {
        type: 'line',
        data: {
            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            datasets: [
                { label: "Mininum",  data: [minMonday, minTuesday, minWednesday, minThursday, minFriday], backgroundColor: "rgba(255, 159, 64, 0.2)", fill:'+4',borderWidth:1.25},
                { label: "95% Confidence Interval",  data: [cl95MondayMin, cl95TuesdayMin, cl95WednesdayMin, cl95ThursdayMin, cl95FridayMin], backgroundColor: "rgba(255, 159, 64, 0.2)", borderColor: 'orange', fill: '+1',borderWidth:1.25}, 
                { label: "Mean",  data: [mediumMonday, mediumTuesday, mediumWednesday, mediumThursday, mediumFriday], backgroundColor: "rgba(255, 159, 64, 0.2)", borderColor: 'orange', fill: "+1",borderWidth:4},
                { label: "95% Confidence Interval",  data: [cl95MondayMax, cl95TuesdayMax, cl95WednesdayMax, cl95ThursdayMax, cl95FridayMax], backgroundColor: "rgba(255, 159, 64, 0.2)", borderColor: 'orange', fill: false,borderWidth:1.25},
                { label: "Maximum",  data: [maxMonday, maxTuesday, maxWednesday, maxThursday, maxFriday], backgroundColor: "rgba(255, 159, 64, 0.2)", fill: false,borderWidth:1.25}
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

    let div = document.getElementById("tableConfidenceLevel");
    //clean elements before rendering the new results
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    //create the table of daily attendance
    let headers = [" ","Peak attendance (97.5% of the time)","Expected attendance (50% of the time)"];
    let rowheaders = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

    let tbl = document.createElement("table");
    tbl.classList.add("table");
    tbl.classList.add("mt-md-3");
    //create the head part of the table
    let hd = document.createElement("thead");
    let hrow = document.createElement("tr");
    for (let i = 0; i< headers.length; i++) {
        let headcell = document.createElement("th");
        let headtext = document.createTextNode(headers[i]);
        headcell.appendChild(headtext);
        hrow.appendChild(headcell);
    }
    hd.appendChild(hrow);
    tbl.appendChild(hd);

    //create the body part of the table
    let tbd = document.createElement("tbody");


    for (let i=0; i<5; i++) {
        let row = document.createElement("tr");
        for (let j=0; j<3; j++) {
            let bodycell = document.createElement("td");
            let celltext="";
            if (j == 0) {
                celltext = document.createTextNode(rowheaders[i]);
            } 
            if (j == 1 ) {
                celltext = document.createTextNode(clStats.cl95max[i]);
            }
            if (j ==2 ) {
                celltext = document.createTextNode(simResultStats.meanDaily[i]);
            }
            bodycell.appendChild(celltext);
            row.appendChild(bodycell);
        }
        tbd.appendChild(row);
    }
    tbl.appendChild(tbd);
    div.appendChild(tbl);

}
    

//plotly charts
function plotHistogram(day, simResultDetailed,plottype) {
    let xvalues;
    if (plottype == "type1") {
        xvalues=simResultDetailed[day]; 
    }
    if (plottype == "type2") {
        xvalues=simResultDetailed;
    }
    let trace1 = {
        x: xvalues,
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
        title: day, 
        font:{
            family:'Roboto, Arial',
            size:8,
        },
        xaxis: {title: "Attendance"}, 
        yaxis: {title: "Frequency"},
        height:300,
        //automargin:true
        margin: {
            l: 30,
            r: 10,
            b: 30,
            t: 50,
            pad: 2,
          },
    };
    let config = {
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'custom_image',
          //height: 500,
          //width: 700,
          //scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        },
        displaylogo: false,
        modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d']
      };

    let data1 = [trace1];
    let canvas;
    if (plottype == "type1") {
        canvas=day+"Chart";
        /*Plotly.newPlot(canvas,data1,layout1,{displaylogo: false, responsive: False});*/    
    }
    if (plottype == "type2") {
        canvas="allDayChart";
    }

    Plotly.newPlot(canvas,data1,layout1,config);
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

function getSortedArray(arr) {
    let sortedArr = [];
    for (let i = 0; i< arr.length; i++){
        sortedArr[i] = arr[i];
        sortedArr.sort((a,b) => a-b);
    }
    return sortedArr
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

/* update the weights and the simulation number */
