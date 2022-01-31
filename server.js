const http = require('http');
const url = require('url');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
    console.log(req.method)
    if (req.method == "OPTIONS") {
	handleOptions(res);
	return;
    }
    
    let data = '';
    req.on('data', chunk => {
	data += chunk;
    });
    req.on('end', () => {
	try {
	    handleRequest(JSON.parse(data), res);
	} catch(e) {
	    console.warn(e);
	    res.end();
	}
    });
});

function handleOptions(res) {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.end();
}

// example call
// curl -v -d '{"teamlist": [{"teamname": "test", "teamsize": 200, "numdays": 3, "frequency": "every week", "id": 1, "weights":[1,1,1,1,1]}], "numofsimulation": 400}' localhost:3000/
function handleRequest(requestData, res) {
    // args = {};
    // args.teamlist = [{teamname: 'test', teamsize: 200, numdays: 3, frequency: 'every week', id: 1,weights:[1,1,1,1,1]}];
    // args.numofsimulation = 400;
    let results = runSimAlgorithm(requestData);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.end(JSON.stringify(results));
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


//server functions
///////////////////////////////////////////////////////////////////////////////////
//run the simulation algorithm and return the results "response"
function runSimAlgorithm(args) {
    let teamlist = args.teamlist;
    let numSimulation = args.numofsimulation;

    simNum = 0;
    const simResult = {Monday:[], Tuesday:[], Wednesday:[], Thursday:[], Friday:[]};
    //each day contains the list of results from all simulation

    for (let i=0; i < numSimulation; i++) {
        simNum+=1;
        //accumulate the result for SimResult (overall count by day)
        const output = runOneSim(teamlist);
        const oneSim = output.oneSimResult;
        //accumulate the detailed result entry for SimResult (detailed count by day)     
        simResult.Monday.push(oneSim.Monday);
        simResult.Tuesday.push(oneSim.Tuesday);
        simResult.Wednesday.push(oneSim.Wednesday);
        simResult.Thursday.push(oneSim.Thursday);
        simResult.Friday.push(oneSim.Friday);
    }

    let results = {};
    results.simResult = simResult;
    //results.simResultByTeam = [];

    return results;
}

//runs one simluation of the whole population
function runOneSim(teamlist){
    const oneSimResult = {
        Monday:0, Tuesday:0, Wednesday:0, Thursday:0, Friday:0
    } //attendance on each day of the whole population per simulation
    
    let resultbyteam = [];
    
    let daylist = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    for (let eachteam in teamlist) {

        eachteam = teamlist[eachteam];
       
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

        //???
        for (let i=0; i<daylist.length; i++){
            let resultEntry = {};
            //ResultEntry(teamid, teamname, day, attendence, simnum)
            resultEntry.teamid = eachteam.id;
            resultEntry.teamname = eachteam.teamname;
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
        let cumweights=[];  

        weightsum = weights.reduce((a,b)=>a+b,0); // consider looping

        //create the accumulated weights array
        for (let i=0;i<weights.length; i++) {     
            let arr = weights.slice(0,i+1);
            let cumsum = arr.reduce((a,b)=>a+b,0); 
            cumweights[i] = cumsum;
        }
        //console.log("UNnormalized accumulated weight list is: ", cumweights);
        
        cumweights = cumweights.map(x => x / weightsum) //normalize the weighted choice to the sum of 1
        //console.log("normalized accumulated weight list is: ", cumweights);

        //generate a random number
        const rdn = Math.random();

        //choose the day to come in
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

//////////////////////////////////////////////////////////////////////////////////////
