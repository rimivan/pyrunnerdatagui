var selectedBenchmarkObject = JSON.parse( sessionStorage.getItem("selectedBenchmark") );

jQuery(document).ready(function(){
  var originalCmdId = JSON.parse( sessionStorage.getItem("originalCmdId"));
  console.log(originalCmdId);
	console.log(selectedBenchmarkObject);
	var idSelBenchmark = selectedBenchmarkObject.id;
	$("#selBenchTitle").html(idSelBenchmark);

	cmdIdArray = sessionStorage.getItem("cmd_array");
	cmdIdArray = cmdIdArray.split(",");

  cmdIdArray.forEach(function(cmd,index){//crea tabella testcase
    $("#cmd_row_1").append("<th class='th_cmd "+cmd+"' colspan='3' id='"+cmd+"'>"+originalCmdId[cmd]+"</th>");
      $("#type_row_1").append(
        "<th class='solution "+cmd+" first_col' id='th_"+cmd+"_solution'>STATUS </th>"+
        "<th class='avgtime "+cmd+"' id='th_"+cmd+"_avgtime'>TIME </th>"+
        "<th class='avgmem "+cmd+" last_col' id='th_"+cmd+"_avgmem'>MEMORY </th>"
      );
   });//end 

    var arrayOfTestcases = selectedBenchmarkObject.testcaseList;
    var solutionPerTestcase = 0;
    var numberOfTestcaseExecution = 0;
    var avgMemOfTestcase = 0;
    var avgTimeOfTestcase = 0;
    arrayOfTestcases.forEach(function(testcaseElem,index_i){
      $("#tbody_testcase").append("<tr class='row_tcase_"+index_i+"' id='tcase_"+index_i+"'><td>"+testcaseElem.id+"</td>"+
                       "</tr>");

      cmdIdArray.forEach(function(cmd,index_cmd){
        $("#tcase_"+index_i).append("<td first_col' id='status_cmd"+index_cmd+"_tcase"+index_i+"'></td>"+ 
                       "<td id='time_cmd"+index_cmd+"_tcase"+index_i+"'></td>"+
                       "<td id='memory_cmd"+index_cmd+"_tcase"+index_i+"'></td>");
      });

        var commandList = testcaseElem.commandList;
        commandList.forEach(function(cmdElem,index_j){
          numberOfTestcaseExecution++;
          var cmdStatus = cmdElem.cmdstatus;
          var cmdTime = cmdElem.cmdtime;
          var cmdMem = cmdElem.cmdmemory;
          
          avgMemOfTestcase += cmdMem;
          avgTimeOfTestcase += cmdTime;

          cmdTime = cmdTime.toFixed(2);
          cmdMem = cmdMem.toFixed(2);
        

          if(cmdStatus == "complete"){
              solutionPerTestcase++;
          }
          
          $("#status_cmd"+index_j+"_tcase"+index_i).html(cmdStatus);
          $("#time_cmd"+index_j+"_tcase"+index_i).html(cmdTime);
          $("#memory_cmd"+index_j+"_tcase"+index_i).html(cmdMem);
        });
    });// end foreach testcase
        
        avgTimeOfTestcase /= numberOfTestcaseExecution;
        avgMemOfTestcase /= numberOfTestcaseExecution;
        avgMemOfTestcase = avgMemOfTestcase.toFixed(2);
        avgTimeOfTestcase = avgTimeOfTestcase.toFixed(2);

    selectedBenchmarkObject["avgmem"] = parseFloat(avgMemOfTestcase);
    selectedBenchmarkObject["avgtime"] = parseFloat(avgTimeOfTestcase);
    console.log(selectedBenchmarkObject);

	

  //evento per gauge
  $("#summary").on('click',function(){
    var totalSol = selectedBenchmarkObject.totalsolution;
    var totalSumTime = selectedBenchmarkObject.totalsumtime ;
    var avgTime = selectedBenchmarkObject.avgtime;
    var avgMem = selectedBenchmarkObject.avgmem;


    drawChart_gauge(totalSol,"solution");
    drawChart_gauge(totalSumTime,"sumtime");
    drawChart_gauge(avgTime,"avgtime");
    drawChart_gauge(avgMem,"avgmemory");
  });

	function drawChart_gauge(value,type) {

    var label = "";
    if(type == "solution"){
      label = "Solution";
    }else if(type == "sumtime"){
      label = "Total Time";  
    }else if(type == "avgtime"){
      label = "Average Time";
    }else if(type =="avgmemory"){
      label = "Average Memory";
    }

    var data = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      [label, value],
    ]);

    var settedMax = Math.round ( value + (value / 3) );

    var options = {
      width: 600, height: 220,
          yellowFrom :(value/2), yellowTo:value,
          redFrom : value , redTo: settedMax,
          minorTicks: 10,
          max:settedMax
    };

        var chart = new google.visualization.Gauge(document.getElementById('summary_gauge_'+type));
        chart.draw(data, options);
  }


});