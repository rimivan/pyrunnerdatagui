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
                              
                              //crea un oggetto e una struttura di supporto per poi inserire i dati per il grafico line
        var cmdObjToLine = {  //creo un oggetto per ogni command; i dati vengono inseriti a riga 90
          name:originalCmdId[cmd],
          data:[],
          active:true
        };

        arrayForLineChart.push(cmdObjToLine);
  });//end crea tabella dei testcase

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

    avgTimeOfTestcase /= numberOfTestcaseExecution; // dati generali di tutto il benchmark per completare l'oggetto selectedBenchmarkObject
    avgMemOfTestcase /= numberOfTestcaseExecution;
    avgMemOfTestcase = avgMemOfTestcase.toFixed(2);
    avgTimeOfTestcase = avgTimeOfTestcase.toFixed(2);
    selectedBenchmarkObject["avgmem"] = parseFloat(avgMemOfTestcase); // Aggiungo le chiavi avgmem e avgtime del benchmark selezionato con i valori
    selectedBenchmarkObject["avgtime"] = parseFloat(avgTimeOfTestcase);

    summary(); // dati riassuntivi del benchmark

    //events
    var numberOfCmd_BenchPage = $(".check_cmnd_benchPage").length;
    $(".check_cmnd_benchPage").on('click',function(){
      var clickedId = $(this).prop("id");
      clickedId = clickedId.split("_");
      clickedId = clickedId[1];
      var commandName = $(this).next().html(); // id del commandche nascondo/mostro. Prendo il nome dal label
      
      if( ! $("#check_"+clickedId).is(":checked")  ){
              numberOfCmd_BenchPage--;
              $("#check_"+clickedId).attr("checked",false);
              $("."+clickedId).hide();
              $("."+clickedId).addClass("cmdHide");
              arrayForLineChart.forEach(function(currElem,i){
                if(currElem.name == commandName){
                  currElem.active = false;
                }
              });
      }else if( $("#check_"+clickedId).is(":checked") ){
              numberOfCmd_BenchPage++;
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

      if(numberOfCmd_BenchPage == 0){
        swal("All commands are deselected!");
        $("#benchPageWrap").hide();
      }

      if(numberOfCmd_BenchPage > 0){
        $("#benchPageWrap").show();
      }

      $("#stacked_tcase").click();
    });//end check command

    var numCheckType_benchPage = $(".check_type_benchPage").length;
    $(".check_type_benchPage").on('click',function(){
      var clickedId = $(this).prop("id");
      clickedId = clickedId.split("_");
      clickedId = clickedId[1]; //status/time/memory
      var colspan;
            if( ! $("#check_"+clickedId).is(":checked")  ){
              numCheckType_benchPage--;
              $("#check_"+clickedId).attr("checked",false);
              $("."+clickedId).addClass("hideElem");
              $("."+clickedId).hide();
              colspan = parseInt ( $("#cmd_row_1").children("th").attr("colspan") ) ;
              colspan--;
              $("#cmd_row_1").children("th").attr("colspan",colspan);
            }else if( $("#check_"+clickedId).is(":checked") ){
              numCheckType_benchPage++;
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

            if(numCheckType_benchPage == 0){
                swal("All data type are deselected!");
                $("#div_testcase_table").hide();
            }

            if(numCheckType_benchPage > 0 && numTestcase_BenchPage > 0){
                $("#div_testcase_table").show();
            }
    });

    var numTestcase_BenchPage = $(".rem_tcase").length;
    $(".rem_tcase").on('click',function(){
      var clickedId = $(this).prop("id");
      clickedId = clickedId.split("_");
      clickedId = clickedId[1];

      if( ! ($(this).is(":checked"))  ){
        numTestcase_BenchPage--;
        ($(this)).attr("checked",false);
        $("#"+clickedId).fadeOut("slow");
      }else if( $(this).is(":checked") ){
        numTestcase_BenchPage++;
        ($(this)).attr("checked",true);
        $("#"+clickedId).fadeIn();
      }

      if(numTestcase_BenchPage == 0){
        swal("Select at least one testcase!");
        $("#div_testcase_table").hide();
      }

      if(numTestcase_BenchPage > 0 && numCheckType_benchPage > 0){
        $("#div_testcase_table").show();
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


   function summary(){ // valori a inizio pagina
    var totalSol = selectedBenchmarkObject.totalsolution;
    var totalSumTime = selectedBenchmarkObject.totalsumtime ;
    var avgTime = selectedBenchmarkObject.avgtime;
    var avgMem = selectedBenchmarkObject.avgmem;
    
    $("#pCompTest").append(totalSol);
    $("#pTotTime").append(totalSumTime);
    $("#pAvgTime").append(avgTime);
    $("#pAvgMem").append(avgMem);
  }


  $(".tcase_graphics").on('click',function(){
    var clickedId = $(this).prop("id");
    if(clickedId == "line_tcase"){
      $("#graphic_line_tcase").empty();
      $("#graphic_stacked_tcase").empty();
      $("#graphic_scatter_tcase").empty();
      $("#graphic_line_tcase").append("<div class='col_1'></div><div class='col_10'><div id='container_line_tcase' style='width:100%; height:100%;'></div></div><div class='col_1'></div>");
      var newArrayForLineChart = [];
      arrayForLineChart.forEach(function(currentElement, index){
        if(currentElement.active == true){
          newArrayForLineChart.push(currentElement);
        }
      }); 
      lineChart(newArrayForLineChart,"container_line_tcase");
    }
    if(clickedId == "stacked_tcase"){
      $("#graphic_line_tcase").empty();
      $("#graphic_scatter_tcase").empty();
      $("#graphic_stacked_tcase").empty();
      $("#graphic_stacked_tcase").append("<div class='col_12'><div class='col_1'></div><div class='col_10'><div id='container_stacked_tcase' style='width:100%; height:100%;'></div></div><div class='col_1'></div></div><div class='col_12'><div class='col_1'></div><div class='col_10'><div id='container_stacked_tcase_notCompleted' style='width:100%; height:100%;'></div></div><div class='col_1'></div></div>")
      arrayForStackedChart = []; // reset dell'array in cui metto i dati (test completed)
      arrayForStackedChartNotCompleted = [];
      var categories = [];
      categories.push(selectedBenchmarkObject.id);
      elaborateDataForTestcaseStackedChart(arrayForStackedChart,arrayForStackedChartNotCompleted,arrayOfTestcases);

      stackedChart(arrayForStackedChart,"container_stacked_tcase",categories,"completed");
      stackedChart(arrayForStackedChartNotCompleted,"container_stacked_tcase_notCompleted",categories,"not completed");
    }
    if(clickedId == "scatter_tcase"){
      arrayForScatterTestcaseChart = [];
      var checkedCmdForScatter = [];
      controlCheckedCmd(checkedCmdForScatter);
      if(checkedCmdForScatter.length > 1){// bisogna controllare che i checked siano due
        $("#graphic_line_tcase").empty();
        $("#graphic_stacked_tcase").empty();
        $("#graphic_scatter_tcase").empty();
        $("#graphic_scatter_tcase").append("<div class='col_3'></div><div class='col_6'><div id='container_scatter_tcase' style='width:100%; height:100%;'></div></div><div class='col_3'></div>");

        elaborateDataForScatterTestcaseChart(arrayForScatterTestcaseChart,arrayOfTestcases,checkedCmdForScatter);
        scatterChart(arrayForScatterTestcaseChart,"container_scatter_tcase");
        }else{
          swal("Select TWO Commands!");
        }
    }
  });//end event graphics button

  function elaborateDataForScatterTestcaseChart(arrayForScatterTestcaseChart,arrayOfTestcases,checkedCmdForScatter){
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
      if(dataArray.length == 2){ // entrambi i valori status dei comandi selezionati devono essere complete
        tcaseObj.data.push(dataArray); //testcase Obj è un oggetto per il grafico scatter; ogni testcase ha un oggetto
        arrayForScatterTestcaseChart.push(tcaseObj);
      }
    });
  }

function elaborateDataForTestcaseStackedChart(arrayForStackedChart,arrayForStackedChartNotCompleted,arrayOfTestcases){
    cmdIdArray.forEach(function(cmdId,index_k){
        if(originalCmdId[cmdId] == arrayForLineChart[index_k].name && arrayForLineChart[index_k].active==true){ // controllo se il cmd è attivo dall'arrayLine
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
        }
    });
  }

  $("#stacked_tcase").click();
});


