var arrayTimeTestCase = [];
var arrayOfObjectTimeTestCase = [];

var allBenchmarks;
var allCommands;
var allTestcases;
var cmd_id_array = []; //array con gli id da usare nel codice
var regex = /[\_ | \W]/gi;
jQuery(document).ready(function(){

    var filenameSelected = sessionStorage.getItem("filename");
    $.ajax({ 
        type : "GET",
        url : filenameSelected,
        datatype:"xml",
        success:function(xml){
                allBenchmarks = $(xml).find("benchmark");
                allTestcases = $(xml).find("testcase");
                allCommands = $(xml).find("command");

                // ++++ Creazione lista di command a centro pagina iniziale ++++
               	allCommands.each(function(j){
                     var currentIdCmd = allCommands[j].id.replace(regex,'');
               		if( !(cmd_id_array.includes(currentIdCmd)) ){
               			cmd_id_array.push(currentIdCmd);
               		}
               	});
               	sessionStorage.setItem("cmd_array",cmd_id_array);

                cmd_id_array.forEach(function(command_element,index) {
                    var currId = command_element;
                    $("#div_cmnd").append("<div class='ui toggle checkbox cmnd'><input type='checkbox' class='check_cmnd' name='public' id='check_"+currId+"' checked ><label>"+command_element+"</label></div>");
                    $("#compareCmdGraph").append("<input name='compare' class='compareCheckbox' type='checkbox' id='compareCheck_"+currId+"'/><label for='compareCheck_"+currId+"' class='inline'>"+command_element+"</label>");
                });
                //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                


                // ++++ lista degli id benchmark ++++
                var benchmark_id_array = []
                allBenchmarks.each(function(bench_i){
                	var currentBenchmark = $(this).prop('id');
                	benchmark_id_array.push(currentBenchmark);
                });
                sessionStorage.setItem("bench_array",benchmark_id_array);
		        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                //++++ Creazione tabella con tutti i dati ++++
                cmd_id_array.forEach(function(cmd,index){
                	createTable(cmd,index); // chiamata alla funzione create table in utility
                });
                //+++++++++++++++++++++++++++++++++++++++++++++


                //Creazione base per appendere i dati alla tabella.
                benchmark_id_array.forEach(function(benchmarkId_elem,benchIndex){
                    sessionStorage.setItem(benchmarkId_elem,"true");
                	$("#tbody").append("<tr class='row_"+benchmarkId_elem+"' id='bench_"+benchIndex+"'><td> <a id='"+benchmarkId_elem+"' href='pages/benchmark_page.html'>"+benchmarkId_elem+"</a></td>"+
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
                //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                

                

                
 

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
                
                var cmdTestcaseTime;
                                                                        //Elaborazione di tutti i dati
                cmd_id_array.forEach(function(command_element,index) { // scandisco per gli id dei command che ho.
                	cmdTestcaseTime = {
                        name:"",
                         data:[],
                    };

                    arrayTimeTestCase = []; // array con i tempi dei testcase di un command, per il grafico scatter
                    
                    var currentCmd = command_element/*cmd_id_array[index].replace(regex, '')*/; // i command hanno uno spazio nel nome: bb 8 diventa bb8
                    cmdTestcaseTime.name = currentCmd;
                    var arrayOfLaunchNumForBench = [];
                    allBenchmarks.each(function(benchmark_i){
                        var idCurrentBenchmark =$(this).attr("id");
                        var bench = {
                            idBench:idCurrentBenchmark,
                            //arrayOfAvgTime:[]
                        };

                		testcasesData( $(this), command_element, index );

                		solution_array.push(solution);
                		notCompleted_array.push(notCompleted);
	                	
	                	avgMem = avgMem / launchNumForBench;
	                	avgTime = avgTime / launchNumForBench;

	                	avgMem = avgMem.toFixed(2);
	                	avgTime = avgTime.toFixed(2);
	                	sumTime = sumTime.toFixed(2);
	                	sumTime = parseFloat(sumTime);
	                	
                		$("#avgmem_cmd_"+index+"_bench_"+benchmark_i).replaceWith("<td class='"+currentCmd+" last_col avgmem cmd_"+index+"' id='avgmem_cmd_"+index+"_bench_"+benchmark_i+"'>"+avgMem+"</td>"); // potrebbe servire la riaggiunta dell'id
                		$("#sol_cmd_"+index+"_bench_"+benchmark_i).replaceWith("<td class='"+currentCmd+" first_col solution cmd_"+index+"' id='sol_cmd_"+index+"_bench_"+benchmark_i+"'>"+solution+"</td>");
                		$("#avgtime_cmd_"+index+"_bench_"+benchmark_i).replaceWith("<td class='"+currentCmd+" avgtime cmd_"+index+"' id='avgtime_cmd_"+index+"_bench_"+benchmark_i+"'>"+avgTime+"</td>");
                		$("#sumtime_cmd_"+index+"_bench_"+benchmark_i).replaceWith("<td class='"+currentCmd+" sumtime cmd_"+index+"' id='sumtime_cmd_"+index+"_bench_"+benchmark_i+"'>"+sumTime+"</td>");

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
                        bench[currentCmd]=avgTime;

                        launchNumForBench = 0;
                        solution = 0;
                        notCompleted = 0;
                        avgMem = 0;
                        avgTime = 0;
                        sumTime = 0;
                        
                    });//end foreach benchmark
                        //console.log(cmdWithAvgTime.data);
                        cmdTestcaseTime.data = arrayTimeTestCase;
                        arrayOfObjectTimeTestCase.push(cmdTestcaseTime);
                        
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
                        totalObj.totalOf = currentCmd;
                        totalObj.totals = tmpTotals;
                        arrayOfTotalObj.push(totalObj);

                        sessionStorage.setItem("LaunchForCmd_"+index, launchNumForCmd);
                        sessionStorage.setItem("arrayOfTotalObj",JSON.stringify(arrayOfTotalObj));

	                	launchNumForCmd = 0;

                        //Inserisce nella tabella grafica i totali
                        updateTotalInTable(currentCmd,index,totalSolution,totalAvgTime,totalSumTime,totalAvgMem);
	                	
                        //azzera variabili per i totali
                        totalSolution = 0;
	                	totalAvgMem = 0;
	                	totalAvgTime = 0;
	                	totalSumTime = 0;
                        command_element = command_element.replace(regex,'');
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
    var arrayOfBenchAndAvg = [];
    console.log(arrayOfObjectTimeTestCase);
    

    
    function testcasesData(thisBenchmark,command_element,index){
        var testcases=thisBenchmark.find("testcase");
        testcases.each(function(testcase_j){
            var tcaseTime=0;
            var this_commands = $(this).find("command");
            this_commands.each(function(command_k){
                var idToCompare = this_commands[command_k].id.replace(regex, '');
                if( cmd_id_array[index] === idToCompare ){
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
                                tcaseTime = time; // tempo del testcase
                                arrayTimeTestCase.push(tcaseTime);
                            }else{
                                notCompleted++;
                            }

                        }); 
                    });
                }
            });
        });
    }//end testcases data

            // Events
        	$(".check_type").on('click',function(){ // check dei tipi di dati da selezionare/deselezionare (solution,avgmem,avgtime,sumtime)
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
        				var currId = cmd.replace(regex,'');
        				if( $("."+currId).hasClass("cmdHide") ){
        					$("."+currId).hide();
        				} 
        			});


        			colspan = parseInt ( $("#cmd_row").children("th").attr("colspan") ) ;
        			colspan++;
        			$("#cmd_row").children("th").attr("colspan",colspan);
        		}
        	});//end on click check type


        	$(".check_cmnd").on('click',function(){ // check dei command da selezionare/deselezionare
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
        	});//end on click check_cmnd


            //Evento sui check dei benchmark
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
                    
                    var sign ="";
                    if( ! ($(this).is(":checked"))  ){
                        sign = "minus";
                        ($(this)).attr("checked",false);
                        sessionStorage.setItem(clickedBenchId,"false");
                        $("#"+classOfTrToRemove).fadeOut();
                        //devo sottrarre i valori che nascondo ai totali
                        updateTable(valuesOfTr,clickedClass,sign); //update table in utility
                        
                    }else if( $(this).is(":checked") ){
                        sign="plus";
                        ($(this)).attr("checked",true);
                        sessionStorage.setItem(clickedBenchId,"true");
                        $("#"+classOfTrToRemove).fadeIn();
                        //devo sommare i valori che ripristino ai totali
                        updateTable(valuesOfTr,clickedClass,sign); // update table in utility
                    }

                    $("#stacked").click();
                }); //end on click rem_bench


                // DA Ricontrollare ; Checkbox dei command per il grafico scatter.
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
                // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                //end events

            $("#stacked").click(); //quando si avvia la pagina la tabella visualizzata sarà la stacked bar.

        },//end success
        error:function(){
        	alert("Il file selezionato non è stato processato correttamente!");
        }
    });//end ajax call

});//jquery end