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

                // per ogni command una tabella
                cmd_id_array.forEach(function(command_element,index) {
                	var currId = command_element.replace(' ','');
                	$("#all_tables").append("<div>"+command_element+"</div>");
	                $("#all_tables").append("<button class='close_table_cmd' id='btn_"+currId+"'>Close</button><table class='ui definition table' id='tab_"+currId+"'>"+ 
	                	"<thead>"+
							"<tr><th></th>"+
							"<th>SOLUTION</th>"+
							"<th>AVG TIME</th>"+
							"<th>SUM TIME</th>"+
							"<th>AVG MEM</th>"+
							"</tr>"+
						"</thead>"+
						"<tbody id='body_"+index+"'>"+
						"</tbody>"+
						"</table>");

             	});
	            
	            var numBench = 0;	
                cmd_id_array.forEach(function(command_element,index) {
	                benchmark_id_array.forEach(function(benchmarkId_elem,benchIndex){
	                	numBench = benchIndex + 1;
	                	$("#body_"+index).append("<tr id='bench_"+benchIndex+"'><td><a href='benchmark_page.html'>"+benchmarkId_elem+"</a></td>"+
	                		"<td id='sol_"+index+"'></td>"+
	                		"<td id='avgtime_"+index+"'></td>"+
	                		"<td id='sumtime_"+index+"'></td>"+
	                		"<td id='avgmem_"+index+"'></td>"+
	                		"</tr>");
	               
	               });  

                	$("#body_"+index).append("<tr><td id='total_"+index+"'>TOTAL</td></tr>"); // append a tutti i tbody, che sono lo stesso numero di qnt sono i command
	            });

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
                		$("#avgmem_"+index).replaceWith("<td>"+avgMem+"</td>"); // potrebbe servire la riaggiunta dell'id
                		$("#sol_"+index).replaceWith("<td>"+solution+"</td>");
                		$("#avgtime_"+index).replaceWith("<td>"+avgTime+"</td>");
                		$("#sumtime_"+index).replaceWith("<td>"+sumTime+"</td>");
                		
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

	                	launchNumForCmd = 0;
	                
	                	$("#total_"+index).after("<td><b>"+totalAvgMem+"</b></td>");
		                $("#total_"+index).after("<td><b>"+totalSumTime+"</b></td>");
                		$("#total_"+index).after("<td><b>"+totalAvgTime+"</b></td>");
                		$("#total_"+index).after("<td><b>"+totalSolution+"</b></td>");
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

                sessionStorage.setItem("notcompleted", JSON.stringify(notCompletedObj_array));
                
            /*sessionStorage.clear(); decommenta, altrimenti poi rimane memorizzato sempro lo stesso file*/ 
            $(".check_cmnd").on('click',function(){
				var idBtn = $(this).attr("id");
	        	var splitted = idBtn.split("_");
	        	var onlyIdCommand = splitted[1];

	        	if( ! $("#check_"+onlyIdCommand).is(":checked")  ){
	        		$("#check_"+onlyIdCommand).attr("checked",false);
	        		$("#tab_"+onlyIdCommand).fadeOut();
	        		$("#btn_"+onlyIdCommand).html("Show");
	        	}else if( $("#check_"+onlyIdCommand).is(":checked") ){
	        		$("#check_"+onlyIdCommand).attr("checked",true);
	        		$("#tab_"+onlyIdCommand).fadeIn();
	        		$("#btn_"+onlyIdCommand).html("Close");
	        	}

            });

	        $(".close_table_cmd").on('click',function(){
	        	var idBtn = $(this).attr("id");
	        	var splitted = idBtn.split("_");
	        	var onlyIdCommand = splitted[1];
	        	//console.info($("#tab_"+onlyIdCommand));

	        	if( $("#tab_"+onlyIdCommand).is(":visible")){
	        		$("#tab_"+onlyIdCommand).fadeOut();
	        		$("#btn_"+onlyIdCommand).html("Show");
	        		$("#check_"+onlyIdCommand).prop("checked",false);


	        	}else if(( $("#tab_"+onlyIdCommand).is(":hidden"))){
	        		$("#tab_"+onlyIdCommand).fadeIn();
	        		$("#btn_"+onlyIdCommand).html("Close");
	        		$("#check_"+onlyIdCommand).prop("checked",true);
	        	}

/*	        	if( $("#tab_"+onlyIdCommand).hasClass("hide") ){
	        		$("#tab_"+onlyIdCommand).removeClass("hide");
	        	}else if( ! ( $("#tab_"+onlyIdCommand).hasClass("hide") ) ){
	        		$("#tab_"+onlyIdCommand).addClass("hide");
	        	}
*/
	        });

        },//end success
        error:function(){
        	alert("Il file selezionato non è stato processato correttamente!");
        }
    });//end ajax call

	
});//jquery end