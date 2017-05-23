var selectedBenchmarkObject = JSON.parse( sessionStorage.getItem("selectedBenchmark") );
var cmdIdArray;
var arrayForLineChart = [];
var arrayForStackedChart = [];
var arrayForStackedChartNotCompleted = [];
var arrayForScatterTestcaseChart = [];

var arrayOfTestcases; // all testcase of selected benchmark

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "40%";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
} 



jQuery(document).ready(function(){
  $("#openSidenav").on('click',openNav);

  var originalCmdId = JSON.parse( sessionStorage.getItem("originalCmdId"));
	var idSelBenchmark = selectedBenchmarkObject.id;
	$("#selBenchTitle").html(idSelBenchmark);

	cmdIdArray = sessionStorage.getItem("cmd_array");
	cmdIdArray = cmdIdArray.split(",");


  cmdIdArray.forEach(function(cmd,index){//crea tabella testcase
    $("#cmd_row_1").append("<th class='cmd"+index+" th_cmd "+cmd+"' colspan='3' id='"+cmd+"'>"+originalCmdId[cmd]+"</th>");

    $("#div_cmnd_benchPage").append("<div class='ui toggle checkbox cmnd'><input type='checkbox' class='check_cmnd_benchPage' name='public' id='check_cmd"+index+"' checked ><label>"+originalCmdId[cmd]+"</label></div>");
    $("#compareCmdGraph").append("<input name='compare' class='compareCheckbox' type='checkbox' id='compareCheck_"+cmd+"'/><label for='compareCheck_"+cmd+"' class='inline'>"+originalCmdId[cmd]+"</label>");      

      $("#type_row_1").append(
        "<th class='status "+cmd+" cmd"+index+" first_col' id='th_"+cmd+"_solution'>STATUS </th>"+
        "<th class='time "+cmd+" cmd"+index+"' id='th_"+cmd+"_avgtime'>TIME </th>"+
        "<th class='memory "+cmd+" cmd"+index+" last_col' id='th_"+cmd+"_avgmem'>MEMORY </th>"
      );

        var cmdObjToLine = {
          name:originalCmdId[cmd],
          data:[],
          active:true
        };

        arrayForLineChart.push(cmdObjToLine);
        
   });//end 

    arrayOfTestcases = selectedBenchmarkObject.testcaseList; // tutti i testcase del benchmark selezionato
    var solutionPerTestcase = 0;
    var numberOfTestcaseExecution = 0;
    var avgMemOfTestcase = 0;
    var avgTimeOfTestcase = 0;

    arrayOfTestcases.forEach(function(testcaseElem,index_i){
      $("#tbody_testcase").append("<tr class='row_tcase_"+index_i+"' id='tcase"+index_i+"'><td class='tcase"+index_i+"'>"+testcaseElem.id+"</td>"+
                       "</tr>");

      $("#tcaseList").append("<li><div class='ui toggle checkbox'><input id='check_tcase"+index_i+"' type='checkbox' name='public' class='rem_tcase' checked ><label class='listColour'>"+testcaseElem.id+"</label></div></li>");

      cmdIdArray.forEach(function(cmd,index_cmd){
        $("#tcase"+index_i).append("<td first_col' id='status_cmd"+index_cmd+"_tcase"+index_i+"' class='status cmd"+index_cmd+" tcase"+index_i+"'></td>"+ 
                       "<td id='time_cmd"+index_cmd+"_tcase"+index_i+"' class='time cmd"+index_cmd+" tcase"+index_i+"'></td>"+
                       "<td id='memory_cmd"+index_cmd+"_tcase"+index_i+"' class='memory cmd"+index_cmd+" last_col tcase"+index_i+"'></td>");
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
        
          cmdTime = parseFloat(cmdTime);
          if(cmdStatus == "complete"){
              solutionPerTestcase++;

              arrayForLineChart.forEach(function(elem,index){
                if(cmdElem.cmdid == elem.name){
                  elem.data.push(cmdTime); // inserisco i dati nella struttura per la line chart
                }
                elem.data.sort( function(a,b) { return a-b } );
              });
  
          }
          
          $("#status_cmd"+index_j+"_tcase"+index_i).html(cmdStatus);
          $("#time_cmd"+index_j+"_tcase"+index_i).html(cmdTime);
          $("#memory_cmd"+index_j+"_tcase"+index_i).html(cmdMem);
        });
    });// end foreach testcase
        avgTimeOfTestcase /= numberOfTestcaseExecution; // dati generali di tutto il benchmark
        avgMemOfTestcase /= numberOfTestcaseExecution;
        avgMemOfTestcase = avgMemOfTestcase.toFixed(2);
        avgTimeOfTestcase = avgTimeOfTestcase.toFixed(2);
    selectedBenchmarkObject["avgmem"] = parseFloat(avgMemOfTestcase);
    selectedBenchmarkObject["avgtime"] = parseFloat(avgTimeOfTestcase);



    //events
    $(".check_cmnd_benchPage").on('click',function(){
      var clickedId = $(this).prop("id");
      clickedId = clickedId.split("_");
      clickedId = clickedId[1];
      console.log(clickedId);
      var commandName = $(this).next().html(); // id del commandche nascondo/mostro. Prendo il nome dal label
      
      if( ! $("#check_"+clickedId).is(":checked")  ){
              //numberOfCmd--;
              $("#check_"+clickedId).attr("checked",false);
              $("."+clickedId).hide();
              $("."+clickedId).addClass("cmdHide");
              arrayForLineChart.forEach(function(currElem,i){
                if(currElem.name == commandName){
                  currElem.active = false;
                }
              });
      }else if( $("#check_"+clickedId).is(":checked") ){
              arrayForLineChart.forEach(function(currElem,i){
                  if(currElem.name == commandName){
                      currElem.active = true;
                  }
              });
              $("#check_"+clickedId).attr("checked",true);
                    $("."+clickedId).show();

                    $("."+clickedId).removeClass("cmdHide"); 

                    if( $(".status").hasClass("hideElem") ){
                        $(".status").hide();
                    }

                    if( $(".memory").hasClass("hideElem") ){
                        $(".memory").hide();
                    }

                    if( $(".time").hasClass("hideElem") ){
                        $(".time").hide();
                    }
      }
    });//end check command

    $(".check_type_benchPage").on('click',function(){
      var clickedId = $(this).prop("id");
      clickedId = clickedId.split("_");
      clickedId = clickedId[1]; //status/time/memory
      console.log("clicked id:"+clickedId);
      var colspan;
            if( ! $("#check_"+clickedId).is(":checked")  ){
              $("#check_"+clickedId).attr("checked",false);
              $("."+clickedId).addClass("hideElem");
              $("."+clickedId).hide();
              colspan = parseInt ( $("#cmd_row_1").children("th").attr("colspan") ) ;
              colspan--;
              $("#cmd_row_1").children("th").attr("colspan",colspan);
            }else if( $("#check_"+clickedId).is(":checked") ){
              $("#check_"+clickedId).attr("checked",true);
              $("."+clickedId).removeClass("hideElem");
            
              $("."+clickedId).show();
              cmdIdArray.forEach(function(cmd,index){
                if( $(".cmd"+index).hasClass("cmdHide") ){
                  $(".cmd"+index).hide();
                } 
              });

              colspan = parseInt ( $("#cmd_row_1").children("th").attr("colspan") ) ;
              colspan++;
              $("#cmd_row_1").children("th").attr("colspan",colspan);
            }
    });

    $(".rem_tcase").on('click',function(){
      var clickedId = $(this).prop("id");
      clickedId = clickedId.split("_");
      clickedId = clickedId[1];
 //     alert("click: "+clickedId);

      if( ! ($(this).is(":checked"))  ){
        ($(this)).attr("checked",false);
        $("#"+clickedId).fadeOut("slow");
      }else if( $(this).is(":checked") ){
        ($(this)).attr("checked",true);
        $("#"+clickedId).fadeIn();
      }
    });


    //Checkbox dei command per il grafico scatter.
    $('.compareCheckbox').on('click', function (e) {
      if ($('.compareCheckbox:checked').length < 3) {
        if($(this).attr('checked'))
          $(this).attr('checked', false);
        else
          $(this).attr('checked', true);
      }
      else if($('.compareCheckbox:checked')){
        $(this).removeAttr('checked');
      }

    });
                // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
  }//end drawchart

  $(".tcase_graphics").on('click',function(){
    var clickedId = $(this).prop("id");
    if(clickedId == "line_tcase"){
      $("#graphic_stacked_tcase").hide(); 
      $("#graphic_line_tcase").show();
      //hide anche su scatter
      var newArrayForLineChart = [];
      arrayForLineChart.forEach(function(currentElement, index){
        if(currentElement.active == true){
          newArrayForLineChart.push(currentElement);
        }
      }); 
      lineChart(newArrayForLineChart,"container_line_tcase");
    }else if(clickedId == "stacked_tcase"){
      $("#graphic_line_tcase").hide();
      $("#graphic_stacked_tcase").show();
      //hide anche scatter
      arrayForStackedChart = []; // reset dell'array in cui metto i dati (test completed)
      arrayForStackedChartNotCompleted = [];
      var categories = [];
      categories.push(selectedBenchmarkObject.id);
      elaborateDataForTestcaseStackedChart(arrayForStackedChart,arrayForStackedChartNotCompleted,arrayOfTestcases);

      stackedChart(arrayForStackedChart,"container_stacked_tcase",categories,"completed");
      stackedChart(arrayForStackedChartNotCompleted,"container_stacked_tcase_notCompleted",categories,"not completed");
    }else if(clickedId == "scatter_tcase"){
      arrayForScatterTestcaseChart = [];
      var checkedCmdForScatter = [];
      controlCheckedCmd(checkedCmdForScatter);
      if(checkedCmdForScatter.length > 1){
        console.log(checkedCmdForScatter);
           // bisogna controllare che i checked siano due
          elaborateDataForScatterTestcaseChart(arrayForScatterTestcaseChart,arrayOfTestcases,checkedCmdForScatter);
          scatterChart(arrayForScatterTestcaseChart,"container_stacked_tcase_notCompleted");
          //nascondere gli altri grafici
        }else{
          alert("seleziona due cmd");
        }
    }
  });//end event graphics button

  function elaborateDataForScatterTestcaseChart(arrayForScatterTestcaseChart,arrayOfTestcases,checkedCmdForScatter){
    console.log(arrayOfTestcases);
    arrayOfTestcases.forEach(function(tcaseElem,index_j){
      var tcaseObj = {
        name : tcaseElem.id,
        data:[]
      };
      var dataArray = [];
      var commands = tcaseElem.commandList;
      checkedCmdForScatter.forEach(function(idCmdChecked,index_i){
        commands.forEach(function(cmdElem,index_k){
          if(cmdElem.cmdid == originalCmdId[idCmdChecked] && cmdElem.cmdstatus=="complete"){
            dataArray.push(cmdElem.cmdtime);
          }
        }); 
      });
      if(dataArray.length > 0){
        tcaseObj.data.push(dataArray);
        arrayForScatterTestcaseChart.push(tcaseObj);
      }
    });
    console.log(arrayForScatterTestcaseChart);
  }

  function elaborateDataForTestcaseStackedChart(arrayForStackedChart,arrayForStackedChartNotCompleted,arrayOfTestcases){
    cmdIdArray.forEach(function(cmdId,index_k){
      var solution = 0;
      var notCompleted = 0;
      
      var cmdWithSolution = {
        name : originalCmdId[cmdId],
        data:[]
      };

      var cmdNotCompleted = {
        name : originalCmdId[cmdId],
        data:[]
      };

      arrayOfTestcases.forEach(function(tcaseElem,index_i){
        var cmdOfThisTcase = tcaseElem.commandList;
        cmdOfThisTcase.forEach(function(cmdElem,index_j){
          //console.log("Qui: "+originalCmdId[cmdId]+" ======= "+cmdElem.cmdid);
          if(originalCmdId[cmdId] == cmdElem.cmdid){
            if(cmdElem.cmdstatus == "complete"){
              solution++;
            }else{
              notCompleted++;
            }
          }
        });
      });
      cmdWithSolution.data.push(solution);
      cmdNotCompleted.data.push(notCompleted);
      arrayForStackedChart.push(cmdWithSolution);
      arrayForStackedChartNotCompleted.push(cmdNotCompleted);
    });
  }

});


