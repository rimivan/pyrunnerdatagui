
//prendo i benchmark e i command attivi e elaboro i dati time per ogni testcase.
	function elaborateDataForScatterChart( checkedCmdForScatter ){
		dataForScatterChart = [];
		var benchmarkObj;
		
			allBenchmarks.each(function(bench_i,benchObj){
				var benchmarkId = $(this).prop("id");
				if( sessionStorage.getItem(benchmarkId) == "true"){

				var arrayOfDataTimeTemp = [];
					benchmarkObj = {
						name:benchmarkId,//nome del testcase
						data:[] // conterrà i due valori time dei due command selezionati
					}
				var testcases = $(this).find("testcase");
				testcases.each(function(testcase_j,testcaseObj){
					var currentTestcaseId = $(this).prop("id");
					var arrayForTestCase = [];

					var commands = $(this).find("command");
					checkedCmdForScatter.forEach(function(cmdId,cmdIdIndex){
						commands.each(function(cmd_k,cmdObj){
							var currentCmdId = $(this).prop("id"); 
							currentCmdId = currentCmdId.replace(regex,'-');
							if(cmdId == currentCmdId){
								var currentPyrunlim = $(this).find("pyrunlim");
								currentPyrunlim.each(function(py_l){
									var currentStats = $(this).find("stats");
									currentStats.each(function(stats_h){
										var status = $(this).attr("status");
										if(status === "complete"){
											var time = parseFloat( $(this).attr("time") ) ;
											arrayForTestCase.push(time);
									
										}
									});
								});
							}
						});
					});
					arrayOfDataTimeTemp.push(arrayForTestCase);
				});
				//console.log(arrayOfDataTimeTemp);
				benchmarkObj.data=arrayOfDataTimeTemp;
				dataForScatterChart.push(benchmarkObj);
			}
		});
		console.log(dataForScatterChart);
	};//end elaborate data for scatter.


	function createMainTable(cmd,index,cmdRow,typeRow) {
		var currentCmd = cmd;
		$("#"+cmdRow).append(
			"<th class='th_cmd "+currentCmd+"' colspan='4' id='"+cmd+"'>"+cmdID[cmd]+"</th>"
			);

		$("#"+typeRow).append(
			"<th class='solution "+currentCmd+" first_col' id='th_"+cmd+"_solution'>SOLUTION </th>"+
			"<th class='avgtime "+currentCmd+"' id='th_"+cmd+"_avgtime'>AVG TIME </th>"+
			"<th class='sumtime "+currentCmd+"' id='th_"+cmd+"_sumtime'>SUM TIME </th>"+
			"<th class='avgmem "+currentCmd+" last_col' id='th_"+cmd+"_avgmem'>AVG MEM </th>"
		);
	};


	 //++++ funzione per arrotondare i decimali ++++
	 function roundTo(value, decimalpositions) {
	 	var i = value * Math.pow(10,decimalpositions);
	 	i = Math.round(i);
	 	var rounded = i / Math.pow(10,decimalpositions);
	 	return rounded;
	 }
     //+++++++++++++++++++++++++++++++++++++++++++++++++++


    function updateTable(valuesOfTr,clickedClass,sign){ // update alla rimozione di righe(benchmark)
    	var splittedClass = clickedClass.split(" ");
        var indexOfBenchClicked = splittedClass[0].split("_"); // solo indice del benchmark cliccato che servirà a farci avere il numero di volte che quel benchmark è stato lanciato
        indexOfBenchClicked = indexOfBenchClicked[1];

        var totalObj;
        totalObj =  JSON.parse (sessionStorage.getItem("arrayOfTotalObj")) ; // nella sessione ho gli oggetti che contengono nomecommand e totali.
        var currentNumLaunchForCmd;
        var launchForBenchObj;
        totalObj.forEach(function(obj,index){
	        var totals = obj.totals; // totali, ci restituisce l'array dei totali per quel command
	        launchForBenchObj = JSON.parse (sessionStorage.getItem("launchForBenchObj_"+index));

	        currentNumLaunchForCmd = parseInt(sessionStorage.getItem("LaunchForCmd_"+index));
	        var newValueOfLaunchCmd;
	        var currentLaunchForBench = parseInt( launchForBenchObj.launchForBenchValues[indexOfBenchClicked] );
	        if(sign=="minus"){
	        	newValueOfLaunchCmd = currentNumLaunchForCmd - currentLaunchForBench;
	        }else if(sign=="plus"){
	        	newValueOfLaunchCmd = currentNumLaunchForCmd + currentLaunchForBench;
	        }
	        sessionStorage.setItem("LaunchForCmd_"+index, newValueOfLaunchCmd );
	    });
        recalcTotalData();
    }


    // function ricalcola medie
    function recalcTotalData(){ // medie totali
        $("#total_row").replaceWith("<tr id='total_row' class='new'><td>TOTAL</td></tr>");
        cmd_id_array.forEach(function(command_element,index) {
        	var currentCmd = cmd_id_array[index];
        	var totalAvgMemRecalc = 0;
        	var totalAvgTimeRecalc = 0;
        	var totalSolutionRecalc = 0;
        	var totalSumTimeRecalc = 0;
            allBenchmarks.each(function(bench_i){
            	var currentBenchmark = $(this).prop('id');
            	var checked = sessionStorage.getItem(currentBenchmark);
                    if( checked == "true" ){ //se l'id corrente del benchmark è checked prosegui nel ricalcolo
                        var testcases=$(this).find("testcase");
	                    testcases.each(function(testcase_j){
	                    	var this_commands = $(this).find("command");
	                    	this_commands.each(function(command_k){
	                    		var idToCompare = this_commands[command_k].id.replace(regex,'-');
	                    		if( cmd_id_array[index] === idToCompare ){
	                    			var currentPyrunlim = $(this).find("pyrunlim");
	                    			currentPyrunlim.each(function(py_l){
	                    				var currentStats = $(this).find("stats");
	                    				currentStats.each(function(stats_h){
	                    					var mem = parseFloat( $(this).attr("memory") ) ;
	                    					var time = parseFloat( $(this).attr("time") ) ;

                                            totalAvgMemRecalc += mem;//somma di tutte le medie
                                            totalAvgTimeRecalc += time; // somma di tutte le medie
                                            totalSumTimeRecalc += time;

                                            var statusRecalc = $(this).attr("status");
                                            if(statusRecalc === "complete"){
                                                totalSolutionRecalc++;
                                            }
                                        }); 
                    				});  
                    			}
                    		});
                    	});
                    }
            });
            var newDivider = sessionStorage.getItem("LaunchForCmd_"+index);
            totalAvgMemRecalc /= newDivider;
            totalAvgTimeRecalc /= newDivider;

            totalAvgTimeRecalc = roundTo(totalAvgTimeRecalc,2);
            totalAvgMemRecalc = roundTo(totalAvgMemRecalc,2);
            totalSumTimeRecalc = roundTo(totalSumTimeRecalc,2);

            updateTotalInTable(currentCmd,index,totalSolutionRecalc,totalAvgTimeRecalc,totalSumTimeRecalc,totalAvgMemRecalc);
        });
    }//End recalc data total


    function updateTotalInTable( nospaceCmd,index,totalSolution,totalAvgTime,totalSumTime,totalAvgMem ){
        $("#total_row").append("<td class='"+nospaceCmd+" solution cmd_"+index+"'><b>"+totalSolution+"</b></td>");
        $("#total_row").append("<td class='"+nospaceCmd+" avgtime cmd_"+index+"'><b>"+totalAvgTime+"</b></td>");
        $("#total_row").append("<td class='"+nospaceCmd+" sumtime cmd_"+index+"'><b>"+totalSumTime+"</b></td>");
        $("#total_row").append("<td class='"+nospaceCmd+" last_col avgmem cmd_"+index+"'><b>"+totalAvgMem+"</b></td>");
    
        cmd_id_array.forEach(function(cmd,index){ // serve a nascondere i command non visibili, per evitare problemi grafici alla tabella
				var currId = cmd;
				if( $("."+currId).hasClass("cmdHide") ){
					$("."+currId).hide();
				} 
		});

        if($(".solution").hasClass("hideElem")){
            $(".solution").hide();
        }

        if($(".avgmem").hasClass("hideElem")){
            $(".avgmem").hide();
        }
         
        if($(".avgtime").hasClass("hideElem")){
            $(".avgtime").hide();
        }

        if($(".sumtime").hasClass("hideElem")){
            $(".sumtime").hide();
        }
    }// end update table


    function commandChecker(){ //riempie l'array allCmdCheck con i command attivi e non attivi.
	    var checkCmd = $(".check_cmnd").each(function(check,index){
	    	var command = {
	    		id:"",
	    		active :""
	    	};
	    	var commandID = $(this).attr("id").split("_");
	    	command.id = commandID[1];

	    	if($(this).is(":checked") ){
	    		command.active = "true";
	    	}else{
	    		command.active = "false";
	    	}

			allCmdCheck.push(command);	//allCmdCheck mi dice i command attivi e non attivi
		});
	}
jQuery(document).ready(function(){
});