//prendo i benchmark e i command attivi e elaboro i dati time per ogni testcase.
	function elaborateDataForScatterChart( checkedCmdForScatter ){
		dataForScatterChart = [];
		
		//leggi tutti i dati dagli array all
		var testCaseObj;
		
			allBenchmark.each(function(bench_i,benchObj){
				var benchmarkId = $(this).prop("id");
				var testcases = $(this).find("testcase");
				testcases.each(function(testcase_j,testcaseObj){
					var currentTestcaseId = $(this).prop("id");

					testCaseObj = {
						name:"",//nome del testcase
						data:[] // conterrà i due valori time dei due command selezionati
					}

					var commands = $(this).find("command");
					var arrayOfDataTimeTemp = [];
					checkedCmdForScatter.forEach(function(cmdId,cmdIdIndex){
					commands.each(function(cmd_k,cmdObj){
						var currentCmdId = $(this).prop("id"); 
						currentCmdId = currentCmdId.replace(" ","");
						if(cmdId == currentCmdId){
							var currentPyrunlim = $(this).find("pyrunlim");
							currentPyrunlim.each(function(py_l){
								var currentStats = $(this).find("stats");
								currentStats.each(function(stats_h){
									var status = $(this).attr("status");
									if(status === "complete"){
										testCaseObj.name = currentTestcaseId;
										var time = parseFloat( $(this).attr("time") ) ;
										arrayOfDataTimeTemp.push(time);
									}
								});
							});
						}
					});
				});
					testCaseObj.data.push(arrayOfDataTimeTemp);
				dataForScatterChart.push(testCaseObj);
			});
		});
		console.log(dataForScatterChart);
	};

jQuery(document).ready(function(){
});