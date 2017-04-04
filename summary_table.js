jQuery(document).ready(function(){

	$(".graphicbtn").on("click",function(){ // comandi completed
		var clicked_id = $(this).attr("id");
		var benchmarkId;
		var bench_id_arr;
		var cmd_id;
		var cmd_id_array = [];
		var cmdObjArr;
		var tmpDataString;
		var tmpDataArrayString;
		var tmpDataArray;


		var allCmdCheck = [];
		if(sessionStorage["bench_array"]){ // in session storage deve esserci bench_array(array degli id dei benchmark)
			
			allCmdCheck = [];
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

				allCmdCheck.push(command);
			});


			benchmarkId = sessionStorage.getItem("bench_array");
			var tmpIdBench  = benchmarkId.split(","); // tutti gli presenti in session storage
			bench_id_arr = []; // da passare per la creazione grafico

			tmpIdBench.forEach(function(id,index){
				bench_id_arr.push({
					"id":id,
					"active":sessionStorage.getItem(id)
				});
			});
			//cmd_id = sessionStorage.getItem("cmd_array");

			allCmdCheck.forEach(function(cmdCheck,index){
				//console.log(cmdCheck);
				if(cmdCheck.active =="true"){
					cmd_id_array.push(cmdCheck.id);
				}
			});
			//cmd_id_array = cmd_id.split(",");

			cmdObjArr = [];

			tmpDataString;
			tmpDataArrayString = [];
			tmpDataArray = [];
			cmd_id_array.forEach(function(elem,index){

				var obj = {
					name:"",
					data: []
				};
				if(sessionStorage[elem]){ // dall' id del command costruisco il json che servira per il grafico
					obj.name = elem;
					tmpDataString = sessionStorage.getItem(elem);
					tmpDataArrayString = tmpDataString.split(",");

					tmpDataArray = [];

					tmpDataArrayString.forEach(function(val,index){
						if(bench_id_arr[index].active=="true"){ 
							//console.log(bench_id_arr[index].id+" , "+val);
							tmpDataArray.push(parseInt(val));
						}
						
					});
					obj.data = tmpDataArray;
				}else{
					console.log("elemento command non trovato nella sessionStorage");
				}
				cmdObjArr.push(obj);
			});
			
			bench_only_id_arr = [];
			bench_id_arr.forEach(function(val,index){
				if(val.active == "true")
					bench_only_id_arr.push(val.id);
			});
			//console.log(bench_only_id_arr);


			//grafici con test completed
			if(clicked_id ==="line"){
				lineChart(cmdObjArr,"container_comp",bench_only_id_arr,"completed"); // creazione grafico per test completed
			}else if(clicked_id==="stacked"){
				stackedChart(cmdObjArr,"container_comp",bench_only_id_arr,"completed");	
			}else if(clicked_id==="scatter"){
				scatterChart(cmdObjArr,"container_comp",bench_only_id_arr,"completed");
			}else{
				alert("Nessun grafico disponibile!");
			}

		}else{
			alert("Qualcosa è andato storto nella lettura dal sessionStorage.");
		}

		//creazione dati e grafici per i test non completi
		if(sessionStorage["notcompleted"]){ // in session storage deve esserci l'elemento notcompleted
			
			var notCompleted_all = JSON.parse (sessionStorage.getItem("notcompleted")) ;
            //console.log(notCompleted_all[0].name);

            var newNotCompletedArray =[];
            notCompleted_all.forEach(function(objNotComp,index){
            	var tmpObj = {
            		cmdId:"",
            		active:"",
            		notCompData:[]
            	};

            	tmpObj.cmdId = objNotComp.name;
            	tmpObj.notCompData = objNotComp.data;
            	if(allCmdCheck[index].active == "true"){
            		console.log("True");
            		tmpObj.active = "true";
            	}else{
            		console.log("false");
            		tmpObj.active = "false";
            	}
            	newNotCompletedArray.push(tmpObj);
            });

            //console.log(newNotCompletedArray);
           
            var cmdObjToGraphicsArray=[]; // array degli oggetti not completed da visualizzare sul grafico in base ai dati aggiornati dalla aggiunta o rimozione di benchmark

            allCmdCheck.forEach(function(cmdId,cmdIndex){
			console.log(cmdId);            	
            	var cmdObjToGraphics = {
            		name: "",
            		data : []
            	};
				cmdObjToGraphics.name = cmdId.id;

				if(cmdId.active == "true"){
					console.log("true, "+cmdId.id)
					bench_id_arr.forEach(function(benchElem,benchIndex){
	            	//console.log(notCompleted_all.data[index]);
						//console.log(benchElem);


							if(benchElem.active == "true"){
			            	//	console.log("cmdid : "+cmdId+" id in not comp: "+notCompleted_all[cmdIndex].name);
			            		cmdObjToGraphics.data.push( notCompleted_all[cmdIndex].data[benchIndex] ); // solo per benchmark
			            	}
			            	//console.log(notCompleted_all[cmdIndex].data[benchIndex]);
			        });
	            cmdObjToGraphicsArray.push(cmdObjToGraphics);
	        }
            });
	        console.log(cmdObjToGraphicsArray);

            

            if(clicked_id === "line"){
            	lineChart(cmdObjToGraphicsArray,"container_notcomp",bench_only_id_arr,"notcompleted");//creazione grafico per test not completed
            }else if(clicked_id === "stacked"){
            	stackedChart(cmdObjToGraphicsArray,"container_notcomp",bench_only_id_arr,"notcompleted");
            }else if(clicked_id === "scatter"){
            	scatterChart(cmdObjToGraphicsArray,"container_notcomp",bench_only_id_arr,"notcompleted");
            }else{
            	alert("Nessun grafico disponibile!");
            }

          }else{
          	alert("Non è possibile caricare i test Non Completati!");
          }

	}); // end on click completed cmd table



	function lineChart(param,appendTo,categories,compOrNotComp){
		var title;
		if(compOrNotComp === "completed"){
			title = "Line chart of Completed test!";
		}else{
			title = "Line chart of NOT Completed test!";
		}
		$(function () {
			Highcharts.chart(appendTo, {
				title: {
					text: title
				},
				xAxis: {
					categories: categories
				},

				yAxis: {
					title: {
						text: title
					}
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle',
				},

				plotOptions: {
					series: {
					}
				},
				series: 
					param // oggetti dei comand completed

				});
		});
	};

	function stackedChart(param,appendTo,categories,compOrNotComp){
		var title;
		if(compOrNotComp === "completed"){
			title = "Stacked Bar Chart of Completed Test!"
		}else{
			title = "Stacked Bar Chart of NOT Completed Test!"
		}

		$(function () {
			Highcharts.chart(appendTo, {
				chart: {
					type: 'bar'
				},
				title: {
					text: title
				},
				xAxis: {
					categories: categories
				},
				yAxis: {
					min: 0,
					title: {
						text: title
					}
				},
				legend: {
					reversed: true
				},
				plotOptions: {
					bar: {
						dataLabels: {
							enabled: false
						}
					}
				},
				series: 
				param
				
				
			});
		});
	}

	function scatterChart(param,appendTo,categories,compOrNotComp){
		var title;
		if(compOrNotComp === "completed"){
			title = "Scatter chart Of Completed Test!";
		}else{
			title = "Scatter chart Of NOT Completed Test!";
		}
		$(function () {
			Highcharts.chart(appendTo, {
				chart: {
					type: 'scatter',
					zoomType: 'xy'
				},
				title: {
					text: title
				},
				xAxis: {
					categories: categories
				},
				yAxis: {
					title: {
						text: 'Number of '+compOrNotComp
					}
				},
				legend: {
					layout: 'vertical',
					align: 'left',
					verticalAlign: 'top',
					x: 100,
					y: 70,
					floating: true,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
					borderWidth: 1
				},
				plotOptions: {
					scatter: {
						marker: {
							radius: 3,
							states: {
								hover: {
									enabled: true,
									lineColor: 'rgb(100,100,100)'
								}
							}
						},
						states: {
							hover: {
								marker: {
									enabled: false
								}
							}
						},
						tooltip: {
							headerFormat: '<b>{series.name}</b><br>',
							pointFormat: '{point.y}'
						}
					}
				},
				series:
				param
			});
		});
	}


	
	
});