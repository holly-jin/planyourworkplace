/*******************************************************

* Copyright (C) 2021 Holly Jin <hj.hongyi@gmail.com>

*

* This file is part of Plan Your Workplace.

*

* Plan Your Workplace can not be copied and/or distributed without the express

* permission of Holly Jin.

*******************************************************/

//remember to change the parseInt to parseFloat for the weights in the currently disabled functions!!!!

const teamlist=[];
let weights=[20,20,20,20,20];
let numSimulation=500;
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

//create a listener when there is a change in the weights sliders in the overall settings
//var ele_weightSlider = document.getElementsByClassName("weightSlider");
//Array.prototype.forEach.call(ele_weightSlider, item => item.addEventListener("input",updateWeightsInput));

//create a listener when there is a change in the weights in the overall settings
//var ele_weightNumber = document.getElementsByClassName("weightNumber");
//Array.prototype.forEach.call(ele_weightNumber, item => item.addEventListener("change",updateWeightsRange));

//currently disabled because the inputs are removed
//create a listener when there is a change in the weights sliders for the five days IN THE ADD TEAM
//var ele_weightSliderTeam = document.getElementsByClassName("weightSliderTeam");
//Array.prototype.forEach.call(ele_weightSliderTeam, item => item.addEventListener("input",updateWeightsInputTeam));

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
        document.getElementById("inputName").value = team.teamname;
        document.getElementById("inputSize").value = team.teamsize;
        document.getElementById("inputNumDays").value = team.numdays;
        document.getElementById("inputFrequency").value = team.frequency;
        document.getElementById("inputNumDays").value = team.numdays;
        //add weight preferences
               
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

// click the update button in the settings. currently disabled
// function updateSettings(){
//     const sliders = document.getElementsByClassName("weightSlider");
//     const num = document.getElementById("inputNumSimulation");
//     numSimulation = num.value;
//     console.log(numSimulation);
//     for (let i=0; i<sliders.length; i++){
//         weights[i]= parseInt(sliders[i].value);
//     }
//     console.log(weights);
// }

//update all the settings to default - equal weights and 100 simulation. currently disabled. 
// function defaultSettings(){
//     numSimulation = 100;
//     weights=[20,20,20,20,10];
//     const sliders = document.getElementsByClassName("weightSlider");
//     for (let i=0; i<sliders.length; i++){
//         sliders[i].value = 20;
//     }
//     const inputnumbers = document.getElementsByClassName("weightNumber");
//     for (let i=0; i<inputnumbers.length; i++){
//         inputnumbers[i].value = 20;
//     }
//     document.getElementById("inputNumSimulation").value = 100;
// }


// currently disabled because the weights have been updated to team-specific
// function updateWeightsInput(){
//     const sliders = document.getElementsByClassName("weightSlider");
//     const inputnumbers = document.getElementsByClassName("weightNumber");
//     let sumPercentage = 0;
//     var ele_message = document.getElementById("warning");
//     //console.log(sliders);
//     for (let i=0; i<sliders.length; i++){
//         inputnumbers[i].value = sliders[i].value;
//         //console.log(typeof sliders[i].value);
//         sumPercentage+= parseInt(sliders[i].value);
//         console.log(sumPercentage);
//     }
//     if (sumPercentage > 100 || sumPercentage < 100 ) {
//         ele_message.style.visibility = 'visible';
//     } 
//     if (sumPercentage == 100) {
//         ele_message.style.visibility = 'hidden';
//     }
// }

// currently disabled because the weights have been updated to team-specific
//update team information
// function updateWeightsRange(){
//     //console.log("input updated");
//     const sliders = document.getElementsByClassName("weightSlider");
//     const inputnumbers = document.getElementsByClassName("weightNumber");
//     for (let i=0; i<inputnumbers.length; i++){
//         sliders[i].value = inputnumbers[i].value
//     }
// }


//update the numbers in input if the sliders are changed when adding/modifying a team
// function updateWeightsInputTeam() {
//     const sliders = document.getElementsByClassName("weightSliderTeam");
//     const inputnumbers = document.getElementsByClassName("weightNumberTeam");
//     let sumPercentage = 0;
//     let ele_message = document.getElementById("warningTeam");

//     for (let i=0; i<sliders.length; i++){
//         inputnumbers[i].value = sliders[i].value;
//         //console.log(typeof sliders[i].value);
//         sumPercentage+= parseInt(sliders[i].value);
  
//     }
//     if (sumPercentage > 100 || sumPercentage < 100 ) {
//         ele_message.style.visibility = 'visible';
//     } 
//     if (sumPercentage == 100) {
//         ele_message.style.visibility = 'hidden';
//     }
// }

//update the numbers in input if the input fields are changed when adding/modifying a team
//currently disabled because the input fields are removed and only sliders are available
// function updateWeightsRangeTeam(){
//     const sliders = document.getElementsByClassName("weightSliderTeam");
//     const inputnumbers = document.getElementsByClassName("weightNumberTeam");
//     for (let i=0; i<inputnumbers.length; i++){
//         sliders[i].value = inputnumbers[i].value;
//     }
// }

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


//master function for running the simulation
function runAllSim(){

    //run the python runsim function
    //return simresult and simresult detailed, result by team,


    //fetch
    //https://humxojjida.execute-api.us-east-2.amazonaws.com/prd/sim

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

    }

    //take the average of the simulation results
    simResult.Monday=Math.floor(simResult.Monday/numSimulation);
    simResult.Tuesday=Math.floor(simResult.Tuesday/numSimulation);
    simResult.Wednesday=Math.floor(simResult.Wednesday/numSimulation);
    simResult.Thursday=Math.floor(simResult.Thursday/numSimulation);
    simResult.Friday=Math.floor(simResult.Friday/numSimulation);

   
    console.log("detailed result is: ", simResultDetailed);
    //call draw the graph function
    
    document.getElementById("sectionLanding").style.display="none";
    document.getElementById("sectionResultPreview").style.display="none";
    document.getElementById("sectionResult").style.display="flex";

    renderResults(simResult,simResultDetailed) //call all the plotting functions

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

function renderResults(simResult,simResultDetailed){
    renderSummary(simResult); //write in the summary stats in the first result section
    plotDailySummary(simResultDetailed); //plot the statistical summary line chart of daily attendance 
    plotBarChart(simResult); //plot the bar charts of daily attendance by department
    //plot the histogram of simulations per day
    for (let i=0;i<days.length; i++ ) {
        plotHistogram(days[i],simResultDetailed);
    }
}

function renderSummary(simResult) {

}



function plotBarChart(simResult) {
    const chartData = {
        type: 'bar',
        data: {
            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            datasets: [{ label: "Average Daily Attendance",  
                        data: [simResult.Monday, simResult.Tuesday, simResult.Wednesday, simResult.Thursday, simResult.Friday], 
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

  
function plotDailySummary(simResultDetailed) {
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
                { label: "Mininum",  data: [minMonday, minTuesday, minWednesday, minThursday, minFriday], backgroundColor: "rgba(255, 159, 64, 0.2)", fill:false,borderWidth:1.25},
                { label: "25th Percentile",  data: [p25Monday, p25Tuesday, p25Wednesday, p25Thursday, p25Friday], backgroundColor: "rgba(255, 159, 64, 0.2)", borderColor: 'orange', fill: '+1',borderWidth:1.25}, 
                { label: "Median",  data: [mediumMonday, mediumTuesday, mediumWednesday, mediumThursday, mediumFriday], backgroundColor: "rgba(255, 159, 64, 0.2)", borderColor: '#0ba2e3', fill: "+1",borderWidth:1.5},
                { label: "75th Percentile",  data: [p75Monday, p75Tuesday, p75Wednesday, p75Thursday, p75Friday], backgroundColor: "rgba(255, 159, 64, 0.2)", borderColor: 'orange', fill: false,borderWidth:1.25},
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
        title: "Simulation Result - "+day, 
        font:{
            family:'Roboto, Arial',
            size:8,
        },
        xaxis: {title: "Attendance"}, 
        yaxis: {title: "Count of Frequency"},
        height:300,
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
    /*Plotly.newPlot(canvas,data1,layout1,{displaylogo: false, responsive: False});*/
    Plotly.newPlot(canvas,data1,layout1,{displaylogo: false});
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
    } //attendance on each day of the whole population per simulation
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
    let chosenday;
    let indChosen;
    let weightsum;
    const weights=eachteam.weights.slice();
    let choicearr=["Monday","Tuesday","Wednesday","Thursday","Friday"];
    const chosenarr=[];
    

    //choose (number of days) times randomly to generate the chosen days for this employee
    for (let i=0; i<eachteam.numdays ; i++){   
        weightsum = weights.reduce((a,b)=>a+b,0); // consider looping
        let cumweights=[];  
        
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