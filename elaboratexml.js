var cmdWithAvgTime = {
	name :"",
	data:[]
};
var all_cmdObjectWithAvgTime = [];

jQuery(document).ready(function(){

	var filenameSelected = sessionStorage.getItem("filename");
	$.ajax({ 
		type : "GET",
		url : filenameSelected,
		datatype:"xml",
		success:function(xml){

               	// ++++ Creazione lista di command a centro pagina iniziale ++++
               	var cmd_id_array = [];
               	var commands = $(xml).find("command");

               	commands.each(function(j){
               		if( !(cmd_id_array.includes(commands[j].id)) ){
               			cmd_id_array.push(commands[j].id);
               		}
               	});
               	sessionStorage.setItem("cmd_array",cmd_id_array);

               	cmd_id_array.forEach(function(command_element,index) {
               		var currId = command_element.replace(' ','');
               		$("#div_cmnd").append("<div class='ui toggle checkbox cmnd'><input type='checkbox' class='check_cmnd' name='public' id='check_"+currId+"' checked ><label>"+command_element+"</label></div>");
               	});
                // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


                // ++++ creazione lista dei benchmark ++++
                var benchmark_id_array = []
                $(xml).find('benchmark').each(function(bench_i){
                	var currentBenchmark = $(this).prop('id');
                	benchmark_id_array.push(currentBenchmark);
                });
                sessionStorage.setItem("bench_array",benchmark_id_array);
		        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                //++++ Creazione tabella con tutti i dati ++++
                function createTable(cmd,index) {
                	var nospacecmd = cmd.replace(" ","");
                	$("#cmd_row").append(
                		"<th class='th_cmd "+nospacecmd+"' colspan='4' id='"+cmd+"'>"+cmd+"</th>"
                		);

                	$("#type_row").append(
                		"<th class='solution "+nospacecmd+" first_col' id='th_"+cmd+"_solution'>SOLUTION </th>"+
                		"<th class='avgtime "+nospacecmd+"' id='th_"+cmd+"_avgtime'>AVG TIME </th>"+
                		"<th class='sumtime "+nospacecmd+"' id='th_"+cmd+"_sumtime'>SUM TIME </th>"+
                		"<th class='avgmem "+nospacecmd+" last_col' id='th_"+cmd+"_avgmem'>AVG MEM </th>"
                		);
                };
                cmd_id_array.forEach(function(cmd,index){
                	createTable(cmd,index)
                });
                //+++++++++++++++++++++++++++++++++++++++++++++

                //++++ funzione per arrotondare i decimali ++++
                function roundTo(value, decimalpositions) {
                	var i = value * Math.pow(10,decimalpositions);
                	i = Math.round(i);
                	var rounded = i / Math.pow(10,decimalpositions);
                	return rounded;
                }
                //+++++++++++++++++++++++++++++++++++++++++++++++++++

                //
                /* TODO VERIFICARE SE NN UTILIZZATA $(".closecolbtn").on('click',function(){ // nasconde/visualizza la colonna del comando selezionato
                	var columnToDelete = $(this).attr("id");
                	var splitted = columnToDelete.split("_");
                	var type = splitted[0];
                	var cmdNumber = splitted[2];

                	$("td."+type+".cmd_"+cmdNumber).addClass("hide");
                	$("th."+type+".cmd_"+cmdNumber).addClass("hide");

                });*/


                //var numBench = 0;	dovrebbe nn servire
                benchmark_id_array.forEach(function(benchmarkId_elem,benchIndex){
                    sessionStorage.setItem(benchmarkId_elem,"true");
                	//numBench = benchIndex + 1;
                	$("#tbody").append("<tr class='row_"+benchmarkId_elem+"' id='bench_"+benchIndex+"'><td> <a id='"+benchmarkId_elem+"' href='benchmark_page.html'>"+benchmarkId_elem+"</a></td>"+
                       "</tr>");

                    $("#removedBench2").append("<div class='ui toggle checkbox'><input class='bench_"+benchIndex+" rem_bench' type='checkbox' name='public' checked ><label>"+benchmarkId_elem+"</label></div>");

                    cmd_id_array.forEach(function(cmd,ind){
                      $("#bench_"+benchIndex).append("<td first_col' id='sol_cmd_"+ind+"_bench_"+benchIndex+"'></td>"+ 
                       "<td id='avgtime_cmd_"+ind+"_bench_"+benchIndex+"'></td>"+
                       "<td id='sumtime_cmd_"+ind+"_bench_"+benchIndex+"'></td>"+
                       "<td class='last_col' id='avgmem_cmd_"+ind+"_bench_"+benchIndex+"'></td>");	
                  });  
                });

                $("#tbody").append("<tr id='total_row'><td>TOTAL</td>");

                var clickedBenchId;
                $(".rem_bench").on('click',function(){
                    var clickedClass = $(this).attr("class");
                    clickedBenchId = $(this).next().html();
                    //console.log("Id bench click: "+clickedBenchId);
                    var classOfTrToRemove = clickedClass.split(" ");
                    classOfTrToRemove = classOfTrToRemove[0]; //la classe nel checkbox è uguale all'id della riga da rimuovere o mostrare
                    
                    var valuesOfTr = []; // tutti i valori dei td. per evitare il primo td scandire dalla pos 1.
                    $("#"+classOfTrToRemove).find("td").each(function(){
                            var valueOfTd = $(this).html();
                            valuesOfTr.push(valueOfTd);
                        });
                        valuesOfTr.splice(0,1); // rimuove il primo elemento della tr. (splice(index,howmany))
                        //console.log("Valori della tr cliccata:");
                        //console.log(valuesOfTr);
                    
                    var sign ="";
                    if( ! ($(this).is(":checked"))  ){
                        sign = "minus";
                        ($(this)).attr("checked",false);
                        sessionStorage.setItem(clickedBenchId,"false");
                        $("#"+classOfTrToRemove).fadeOut();
                        //devo sottrarre i valori che nascondo ai totali
                        updateTableMinus(valuesOfTr,clickedClass,sign);
                        
                    }else if( $(this).is(":checked") ){
                        sign="plus";
                        ($(this)).attr("checked",true);
                        sessionStorage.setItem(clickedBenchId,"true");
                        $("#"+classOfTrToRemove).fadeIn();
                        //devo sommare i valori che ripristino ai totali
                        updateTableMinus(valuesOfTr,clickedClass,sign);
                    }

                    $("#stacked").click();
                });

                function updateTableMinus(valuesOfTr,clickedClass,sign){
                    var splittedClass = clickedClass.split(" ");
                    var indexOfBenchClicked = splittedClass[0].split("_"); // solo indice del benchmark cliccato che servirà a farci avere il numero di volte che quel benchmark è stato lanciato
                    indexOfBenchClicked = indexOfBenchClicked[1];
                    //console.log("index: "+indexOfBenchClicked);

                    var totalObj;
                    totalObj =  JSON.parse (sessionStorage.getItem("arrayOfTotalObj")) ; // nella sessione ho gli oggetti che contengono nomecommand e totali.
                    
                    var currentNumLaunchForCmd;

                    var launchForBenchObj;
                    totalObj.forEach(function(obj,index){
                        var totals = obj.totals; // totali, ci restituisce l'array dei totali per quel command
                        //console.log(totals);

                        launchForBenchObj = JSON.parse (sessionStorage.getItem("launchForBenchObj_"+index));
                        //console.log("Command lanciato per benchmark:");
                        //console.log(launchForBenchObj.launchForBenchValues[indexOfBenchClicked]); // abbiamo il numero di volte che il cmd è stato lanciato per quel benchmark
                        
                        currentNumLaunchForCmd = parseInt(sessionStorage.getItem("LaunchForCmd_"+index));
                        var newValueOfLaunchCmd;
                        var currentLaunchForBench = parseInt( launchForBenchObj.launchForBenchValues[indexOfBenchClicked] );
                        if(sign=="minus"){
                            newValueOfLaunchCmd = currentNumLaunchForCmd - currentLaunchForBench;
                        }else if(sign=="plus"){
                            newValueOfLaunchCmd = currentNumLaunchForCmd + currentLaunchForBench;
                        }
                        //console.log("New launch for cmd : "+newValueOfLaunchCmd);
                        sessionStorage.setItem("LaunchForCmd_"+index, newValueOfLaunchCmd );
                    });
                    
                    //arrayNumLaunchForCmd[ind] = arrayNumLaunchForCmd[ind] - launchForBenchObj.launchForBenchValues[indexOfBenchClicked];
                    recalcTotalData();
                    //aggiorna i totali di valuesOfTr e provare ad aggiornare anche i totali salvati nella sessionStorage
                }

                // function ricalcola medie
                function recalcTotalData(){ // medie totali
                    $("#total_row").replaceWith("<tr id='total_row' class='new'><td>TOTAL</td></tr>");
                    cmd_id_array.forEach(function(command_element,index) {
                        var nospaceCmd = cmd_id_array[index].replace(" ","");
                        var totalAvgMemRecalc = 0;
                        var totalAvgTimeRecalc = 0;
                        var totalSolutionRecalc = 0;
                        var totalSumTimeRecalc = 0;
                        $(xml).find('benchmark').each(function(bench_i){
                            var currentBenchmark = $(this).prop('id');
                            var checked = sessionStorage.getItem(currentBenchmark);
                            if( checked == "true" ){ //se gli id sono diversi prosegui nel ricalcolare la media
                                var testcases=$(this).find("testcase");
                                testcases.each(function(testcase_j){
                                    var this_commands = $(this).find("command");
                                    this_commands.each(function(command_k){
                                        if( cmd_id_array[index] === this_commands[command_k].id ){
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
                            //alert("recalc: "+currentBenchmark);
                        });
                        var newDivider = sessionStorage.getItem("LaunchForCmd_"+index);
                        totalAvgMemRecalc /= newDivider;
                        totalAvgTimeRecalc /= newDivider;

                        totalAvgTimeRecalc = roundTo(totalAvgTimeRecalc,2);
                        totalAvgMemRecalc = roundTo(totalAvgMemRecalc,2);
                        totalSumTimeRecalc = roundTo(totalSumTimeRecalc,2);

                       /* console.log("New avgMem : "+totalAvgMemRecalc+" - divider : "+newDivider);
                        console.log("New avgTime : "+totalAvgTimeRecalc+" - divider : "+newDivider);
                        console.log("Total SUMTIME nuovo:"+totalSumTimeRecalc);
                        console.log("Total solution nuovo:"+totalSolutionRecalc);*/

                        
                        updateTotalInTable(nospaceCmd,index,totalSolutionRecalc,totalAvgTimeRecalc,totalSumTimeRecalc,totalAvgMemRecalc);
                    });
                }
 

                var arrayOfTotalObj = [];
                var notCompletedObj_array = [];

                var avgMem = 0;
                var avgTime = 0;
                var sumTime = 0;
                var solution = 0 ;

                var notCompleted = 0;

                // valori totali per command
                var totalAvgMem = 0;
                var totalAvgTime = 0;
                var totalSumTime = 0;
                var totalSolution = 0;

                var launchNumForBench = 0;
                var launchNumForCmd = 0;

                var solution_array = [];
                var notCompleted_array = [];
                cmd_id_array.forEach(function(command_element,index) { // scandisco per gli id dei command che ho.
                	cmdWithAvgTime = {
                		name:"",
                		data:[]
                	};

                    var nospaceCmd = cmd_id_array[index].replace(" ",""); // i command hanno uno spazio nel nome: bb 8 diventa bb8
                    cmdWithAvgTime.name = nospaceCmd;
                    var arrayOfLaunchNumForBench = [];
                    $(xml).find('benchmark').each(function(benchmark_i){
                		var idCurrentBenchmark =$(this).attr("id");
                		var testcases=$(this).find("testcase");
                		testcases.each(function(testcase_j){
                			var this_commands = $(this).find("command");
                			this_commands.each(function(command_k){
                				if( cmd_id_array[index] === this_commands[command_k].id ){
                					launchNumForBench++;
                					launchNumForCmd++;
                					var currentPyrunlim = $(this).find("pyrunlim");
                					currentPyrunlim.each(function(py_l){
                						var currentStats = $(this).find("stats");
                						currentStats.each(function(stats_h){
                							var mem = parseFloat( $(this).attr("memory") ) ;
                							var time = parseFloat( $(this).attr("time") ) ;

                							avgMem += mem;
                							avgTime +=time;
                							sumTime += time;
                                    		totalAvgMem += mem;//somma di tutte le medie
                							totalAvgTime += time; // somma di tutte le medie


                							var status = $(this).attr("status");
                							if(status === "complete"){
                								solution++;
                							}else{
                								notCompleted++;
                							}

                						});	
                					});
                				}
                			});
                		});
                		solution_array.push(solution);
                		notCompleted_array.push(notCompleted);
	                	//console.log("dati avg mem : avg mem : "+avgMem+" / "+launchNumForBench);
	                	avgMem = avgMem / launchNumForBench;
	                	avgTime = avgTime / launchNumForBench;

	                	avgMem = avgMem.toFixed(2);
	                	avgTime = avgTime.toFixed(2);
	                	sumTime = sumTime.toFixed(2);
	                	sumTime = parseFloat(sumTime);
	                	
                		$("#avgmem_cmd_"+index+"_bench_"+benchmark_i).replaceWith("<td class='"+nospaceCmd+" last_col avgmem cmd_"+index+"' id='avgmem_cmd_"+index+"_bench_"+benchmark_i+"'>"+avgMem+"</td>"); // potrebbe servire la riaggiunta dell'id
                		$("#sol_cmd_"+index+"_bench_"+benchmark_i).replaceWith("<td class='"+nospaceCmd+" first_col solution cmd_"+index+"' id='sol_cmd_"+index+"_bench_"+benchmark_i+"'>"+solution+"</td>");
                		$("#avgtime_cmd_"+index+"_bench_"+benchmark_i).replaceWith("<td class='"+nospaceCmd+" avgtime cmd_"+index+"' id='avgtime_cmd_"+index+"_bench_"+benchmark_i+"'>"+avgTime+"</td>");
                		$("#sumtime_cmd_"+index+"_bench_"+benchmark_i).replaceWith("<td class='"+nospaceCmd+" sumtime cmd_"+index+"' id='sumtime_cmd_"+index+"_bench_"+benchmark_i+"'>"+sumTime+"</td>");

                        totalSolution += solution;
                        totalSumTime += sumTime;
                        arrayOfLaunchNumForBench.push(launchNumForBench);

                        var launchForBenchObj = { // oggetto in cui abbiamo il nome del command e l'array del numero dei lanci per ogni benchmark per quel command
                            cmdName : command_element,
                            cmdIndex : index,
                            launchForBenchValues : arrayOfLaunchNumForBench 
                        }
                        sessionStorage.setItem("launchForBenchObj_"+index,JSON.stringify(launchForBenchObj));
                        avgTime = parseFloat(avgTime); // se non lo converto avgTime viene trattato come stringa
                        cmdWithAvgTime.data.push(avgTime);


                        launchNumForBench = 0;
                        solution = 0;
                        notCompleted = 0;
                        avgMem = 0;
                        avgTime = 0;
                        sumTime = 0;
                    });//end foreach benchmark
                        //console.log("launch for comdn: "+command_element+" - "+launchNumForCmd);

						cmdWithAvgTime.data.sort( function(a, b){return a-b} );                        	
                        console.log(cmdWithAvgTime.data);
                        all_cmdObjectWithAvgTime.push(cmdWithAvgTime);
                        totalAvgMem /= launchNumForCmd;
	                	totalAvgTime /= launchNumForCmd;

	                	totalAvgTime = roundTo(totalAvgTime,2);
	                	totalSumTime = roundTo(totalSumTime,2); 
	                	totalAvgMem = roundTo(totalAvgMem,2);

                        var tmpTotals = [];
                        var totalObj = { // ci serve il numero di lanci per il benchmark
                            totalOf : "",
                            index : index,
                            totals : [],
                        };
                       
                        tmpTotals.push(totalSolution);
                        tmpTotals.push(totalAvgTime);
                        tmpTotals.push(totalSumTime);
                        tmpTotals.push(totalAvgMem);
                        totalObj.totalOf = nospaceCmd;
                        totalObj.totals = tmpTotals;
                        arrayOfTotalObj.push(totalObj);

                        sessionStorage.setItem("LaunchForCmd_"+index, launchNumForCmd);
                        sessionStorage.setItem("arrayOfTotalObj",JSON.stringify(arrayOfTotalObj));

	                	launchNumForCmd = 0;

                        //Inserisce nella tabella grafica i totali
                        updateTotalInTable(nospaceCmd,index,totalSolution,totalAvgTime,totalSumTime,totalAvgMem);
	                	
                        //azzera variabili per i totali
                        totalSolution = 0;
	                	totalAvgMem = 0;
	                	totalAvgTime = 0;
	                	totalSumTime = 0;
                        command_element = command_element.replace(" ","");
	                	sessionStorage.setItem(command_element,solution_array);

	                	var notCompObj = {
	                		name:command_element,
	                		data:notCompleted_array
	                	};
	                	notCompletedObj_array.push(notCompObj);

	                	solution_array = [];
	                	notCompleted_array = [];

            	});//end foreach cmd_id
    sessionStorage.setItem("notcompleted", JSON.stringify(notCompletedObj_array)); // serve per la creazione dei grafici nel "sumTable.js"

    function updateTotalInTable( nospaceCmd,index,totalSolution,totalAvgTime,totalSumTime,totalAvgMem ){
        $("#total_row").append("<td class='"+nospaceCmd+" solution cmd_"+index+"'><b>"+totalSolution+"</b></td>");
        $("#total_row").append("<td class='"+nospaceCmd+" avgtime cmd_"+index+"'><b>"+totalAvgTime+"</b></td>");
        $("#total_row").append("<td class='"+nospaceCmd+" sumtime cmd_"+index+"'><b>"+totalSumTime+"</b></td>");
        $("#total_row").append("<td class='"+nospaceCmd+" last_col avgmem cmd_"+index+"'><b>"+totalAvgMem+"</b></td>");
    
        cmd_id_array.forEach(function(cmd,index){ // serve a nascondere i command non visibili, per evitare problemi grafici alla tabella
				var currId = cmd.replace(' ','');
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
    }

	$(".check_type").on('click',function(){ // tipi di dati da visualizzare
		var idBtn = $(this).attr("id");
		var splitted = idBtn.split("_");
		var onlyIdCommand = splitted[1];// solution/avgmem/avgtime/sumtime
        
		var colspan;
		if( ! $("#check_"+onlyIdCommand).is(":checked")  ){
			$("#check_"+onlyIdCommand).attr("checked",false);
			$("."+onlyIdCommand).addClass("hideElem");
			$("."+onlyIdCommand).hide();
			colspan = parseInt ( $("#cmd_row").children("th").attr("colspan") ) ;
			colspan--;
			$("#cmd_row").children("th").attr("colspan",colspan);
		}else if( $("#check_"+onlyIdCommand).is(":checked") ){
			$("#check_"+onlyIdCommand).attr("checked",true);
			$("."+onlyIdCommand).removeClass("hideElem");
		
			$("."+onlyIdCommand).show();
			cmd_id_array.forEach(function(cmd,index){
				var currId = cmd.replace(' ','');
				if( $("."+currId).hasClass("cmdHide") ){
					$("."+currId).hide();
				} 
			});


			colspan = parseInt ( $("#cmd_row").children("th").attr("colspan") ) ;
			colspan++;
			$("#cmd_row").children("th").attr("colspan",colspan);
		}

	});


        	$(".check_cmnd").on('click',function(){
        		var idBtn = $(this).attr("id");
        		var splitted = idBtn.split("_");
        		var onlyIdCommand = splitted[1];

        		if( ! $("#check_"+onlyIdCommand).is(":checked")  ){
        			$("#check_"+onlyIdCommand).attr("checked",false);
        			$("."+onlyIdCommand).hide();

					$("."+onlyIdCommand).addClass("cmdHide");        			

        		}else if( $("#check_"+onlyIdCommand).is(":checked") ){
        			$("#check_"+onlyIdCommand).attr("checked",true);
                    $("."+onlyIdCommand).show();

                    $("."+onlyIdCommand).removeClass("cmdHide"); 

                    if( $(".solution").hasClass("hideElem") ){
                        $(".solution").hide();
                    }

                    if( $(".avgmem").hasClass("hideElem") ){
                        $(".avgmem").hide();
                    }

                    if( $(".avgtime").hasClass("hideElem") ){
                        $(".avgtime").hide();
                    }

                    if( $(".sumtime").hasClass("hideElem") ){
                        $(".sumtime").hide();
                    }
        		}

                $("#stacked").click();
        	});


            $("#stacked").click(); //quando si avvia la pagina la tabella visualizzata sarà la stacked bar.

        },//end success
        error:function(){
        	alert("Il file selezionato non è stato processato correttamente!");
        }
    });//end ajax call

});//jquery end