var selectedBenchmarkObject = JSON.parse( sessionStorage.getItem("selectedBenchmark") );
var cmdIdArray;

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

  $("#modalTcase").on('click',function(){
    $('#testcaseListModal').modal('show');
  });

  var originalCmdId = JSON.parse( sessionStorage.getItem("originalCmdId"));
  console.log(originalCmdId);
	console.log(selectedBenchmarkObject);
	var idSelBenchmark = selectedBenchmarkObject.id;
	$("#selBenchTitle").html(idSelBenchmark);

	cmdIdArray = sessionStorage.getItem("cmd_array");
	cmdIdArray = cmdIdArray.split(",");


  cmdIdArray.forEach(function(cmd,index){//crea tabella testcase
    $("#cmd_row_1").append("<th class='cmd"+index+" th_cmd "+cmd+"' colspan='3' id='"+cmd+"'>"+originalCmdId[cmd]+"</th>");

    $("#div_cmnd_benchPage").append("<div class='ui toggle checkbox cmnd'><input type='checkbox' class='check_cmnd_benchPage' name='public' id='check_cmd"+index+"' checked ><label>"+originalCmdId[cmd]+"</label></div>");
                    

      $("#type_row_1").append(
        "<th class='status "+cmd+" cmd"+index+" first_col' id='th_"+cmd+"_solution'>STATUS </th>"+
        "<th class='time "+cmd+" cmd"+index+"' id='th_"+cmd+"_avgtime'>TIME </th>"+
        "<th class='memory "+cmd+" cmd"+index+" last_col' id='th_"+cmd+"_avgmem'>MEMORY </th>"
      );
   });//end 

    var arrayOfTestcases = selectedBenchmarkObject.testcaseList;
    var solutionPerTestcase = 0;
    var numberOfTestcaseExecution = 0;
    var avgMemOfTestcase = 0;
    var avgTimeOfTestcase = 0;
    arrayOfTestcases.forEach(function(testcaseElem,index_i){
      $("#tbody_testcase").append("<tr class='row_tcase_"+index_i+"' id='tcase_"+index_i+"'><td class='tcase"+index_i+"'>"+testcaseElem.id+"</td>"+
                       "</tr>");

      $("#listTestcase").append("<li><div class='ui toggle checkbox'><input type='checkbox' name='public' checked ><label>"+testcaseElem.id+"</label></div></li>");
      $("#tcaseList").append("<li><div class='ui toggle checkbox'><input id='check_tcase"+index_i+"' type='checkbox' name='public' class='rem_tcase' checked ><label class='listColour'>"+testcaseElem.id+"</label></div></li>");

      cmdIdArray.forEach(function(cmd,index_cmd){
        $("#tcase_"+index_i).append("<td first_col' id='status_cmd"+index_cmd+"_tcase"+index_i+"' class='status cmd"+index_cmd+" tcase"+index_i+"'></td>"+ 
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



    //events
    $(".check_cmnd_benchPage").on('click',function(){
      var clickedId = $(this).prop("id");
      clickedId = clickedId.split("_");
      clickedId = clickedId[1];
      console.log(clickedId);

      if( ! $("#check_"+clickedId).is(":checked")  ){
              //numberOfCmd--;
              $("#check_"+clickedId).attr("checked",false);
              $("."+clickedId).hide();
              $("."+clickedId).addClass("cmdHide");
      }else if( $("#check_"+clickedId).is(":checked") ){
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
                console.log("il cmd:"+cmd+" di index: "+index+" dovrebbe essere hide");
                if( $(".cmd"+index).hasClass("cmdHide") ){
                  alert("aaaa");
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
      alert("click: "+clickedId);

      if( ! ($(this).is(":checked"))  ){
        ($(this)).attr("checked",false);
        $("."+clickedId).fadeOut();
      }else if( $(this).is(":checked") ){
        ($(this)).attr("checked",true);
        $("."+clickedId).fadeIn();
      }
    });

	

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


});