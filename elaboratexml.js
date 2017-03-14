jQuery(document).ready(function(){
	var filenameSelected = sessionStorage.getItem("filename");
	$.ajax({ 
		type:"GET",
		url:/*"file.xml"*/ filenameSelected,
		datatype:"xml",
		success:function(xml){

               	// ++++ Per la lista di command a centro pagina iniziale ++++
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


                // ++++ per la lista dei benchmark ++++
                var benchmark_id_array = []
                $(xml).find('benchmark').each(function(bench_i){
                	var currentBenchmark = $(this).prop('id');
                	benchmark_id_array.push(currentBenchmark);
                });
                sessionStorage.setItem("bench_array",benchmark_id_array);
		        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                //Creazione tabelle
                function createTable(cmd,index) {
                	//var currId = command_element.replace(' ','');
                	//$("#all_tables").append("<div>"+command_element+"</div>");

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

                // funzione per arrotondare i decimali
                function roundTo(value, decimalpositions) {
                	var i = value * Math.pow(10,decimalpositions);
                	i = Math.round(i);
                	var rounded = i / Math.pow(10,decimalpositions);
                	return rounded;
                }

                $(".closecolbtn").on('click',function(){
                	var columnToDelete = $(this).attr("id");
                	var splitted = columnToDelete.split("_");
                	var type = splitted[0];
                	var cmdNumber = splitted[2];

                	$("td."+type+".cmd_"+cmdNumber).addClass("hide");
                	$("th."+type+".cmd_"+cmdNumber).addClass("hide");

                	console.log("type: "+type+", cmd numb: "+cmdNumber);             		
                	console.log("col: "+columnToDelete);
                });



                var numBench = 0;	
                benchmark_id_array.forEach(function(benchmarkId_elem,benchIndex){
                	numBench = benchIndex + 1;
                	$("#tbody").append("<tr id='bench_"+benchIndex+"'><td><a href='benchmark_page.html'>"+benchmarkId_elem+"</a></td>"+
	                		"</tr>");

	                cmd_id_array.forEach(function(cmd,ind){
	                	$("#bench_"+benchIndex).append("<td first_col' id='sol_cmd_"+ind+"_bench_"+benchIndex+"'></td>"+ 
	                		"<td id='avgtime_cmd_"+ind+"_bench_"+benchIndex+"'></td>"+
	                		"<td id='sumtime_cmd_"+ind+"_bench_"+benchIndex+"'></td>"+
	                		"<td class='last_col' id='avgmem_cmd_"+ind+"_bench_"+benchIndex+"'></td>");	
	                });  
                });

                $("#tbody").append("<tr id='total_row'><td >TOTAL</td>");
               

                var notCompletedObj_array = [];

                //Riprendere tutti i dati come nello script precedente, e appenderli alle giuste righe e colonne
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
                	var nospaceCmd = cmd_id_array[index].replace(" ",""); // i command hanno uno spazio nel nome: bb 8 diventa bb8
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

	                	avgMem = roundTo(avgMem,2);
	                	avgTime = roundTo(avgTime,2);
	                	sumTime = roundTo(sumTime,2);

	                	
                		$("#avgmem_cmd_"+index+"_bench_"+benchmark_i).replaceWith("<td class='"+nospaceCmd+" last_col avgmem cmd_"+index+"' id='avgmem_cmd_"+index+"_bench_"+benchmark_i+"'>"+avgMem+"</td>"); // potrebbe servire la riaggiunta dell'id
                		$("#sol_cmd_"+index+"_bench_"+benchmark_i).replaceWith("<td class='"+nospaceCmd+" first_col solution cmd_"+index+"' id='sol_cmd_"+index+"_bench_"+benchmark_i+"'>"+solution+"</td>");
                		$("#avgtime_cmd_"+index+"_bench_"+benchmark_i).replaceWith("<td class='"+nospaceCmd+" avgtime cmd_"+index+"' id='avgtime_cmd_"+index+"_bench_"+benchmark_i+"'>"+avgTime+"</td>");
                		$("#sumtime_cmd_"+index+"_bench_"+benchmark_i).replaceWith("<td class='"+nospaceCmd+" sumtime cmd_"+index+"' id='sumtime_cmd_"+index+"_bench_"+benchmark_i+"'>"+sumTime+"</td>");

             		
                        totalSolution += solution;
                        totalSumTime += sumTime;

                        launchNumForBench = 0;
                        solution = 0;
                        notCompleted = 0;
                        avgMem = 0;
                        avgTime = 0;
                        sumTime = 0;
	                });//end foreach benchmark
	                	//console.log("launch for comdn: "+command_element+" - "+launchNumForCmd);
	                	totalAvgMem /= launchNumForCmd;
	                	totalAvgTime /= launchNumForCmd;

	                	totalAvgTime = roundTo(totalAvgTime,2);
	                	totalSumTime = roundTo(totalSumTime,2);
	                	totalAvgMem = roundTo(totalAvgMem,2);
	                	launchNumForCmd = 0;

	                	$("#total_row").append("<td class='"+nospaceCmd+" solution cmd_"+index+"'><b>"+totalSolution+"</b></td>");
	                	$("#total_row").append("<td class='"+nospaceCmd+" avgtime cmd_"+index+"'><b>"+totalAvgTime+"</b></td>");
	                	$("#total_row").append("<td class='"+nospaceCmd+" sumtime cmd_"+index+"'><b>"+totalSumTime+"</b></td>");
	                	$("#total_row").append("<td class='"+nospaceCmd+" last_col avgmem cmd_"+index+"'><b>"+totalAvgMem+"</b></td>");
	                	totalSolution = 0;
	                	totalAvgMem = 0;
	                	totalAvgTime = 0;
	                	totalSumTime = 0;
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

	$(".check_type").on('click',function(){ // tipi di dati da visualizzare
		var idBtn = $(this).attr("id");
		var splitted = idBtn.split("_");
		var onlyIdCommand = splitted[1];

		var colspan;
		if( ! $("#check_"+onlyIdCommand).is(":checked")  ){
			$("#check_"+onlyIdCommand).attr("checked",false);
			$("."+onlyIdCommand).hide();
			colspan = parseInt ( $("#cmd_row").children("th").attr("colspan") ) ;
			colspan--;
			$("#cmd_row").children("th").attr("colspan",colspan);
		}else if( $("#check_"+onlyIdCommand).is(":checked") ){
			$("#check_"+onlyIdCommand).attr("checked",true);
			$("."+onlyIdCommand).show();
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
		}else if( $("#check_"+onlyIdCommand).is(":checked") ){
			$("#check_"+onlyIdCommand).attr("checked",true);
			$("."+onlyIdCommand).show();
		}
	});



        },//end success
        error:function(){
        	alert("Il file selezionato non è stato processato correttamente!");
        }
    });//end ajax call

});//jquery end