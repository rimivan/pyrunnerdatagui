var allCmdCheck = [];
var dataForLineChart = [];
jQuery(document).ready(function(){

	$(".graphicbtn").on("click",function(){ // comandi completed
		var clicked_id = $(this).attr("id");
		var benchmarkId;
		var bench_id_arr;
		var cmd_id;
		var cmd_id_array = [];
		var cmdObjArr;
		//var cmdObjWithAvg_array;
		var tmpAvgData;
		var tmpDataString;
		var tmpDataArrayString;
		var tmpDataArray;



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

				allCmdCheck.push(command);	//allCmdCheck mi dice i command attivi e non attivi
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

			allCmdCheck.forEach(function(cmdCheck,index){
				if(cmdCheck.active =="true"){
					cmd_id_array.push(cmdCheck.id);
				}
			});

			cmdObjArr = [];
			cmdObjWithAvg_array = [];
			

			tmpDataString;
			tmpDataArrayString = [];
			tmpDataArray = [];

			var cmd_Bench_AvgTime_array = [];

			cmd_id_array.forEach(function(elem,index){ // in cmd_id_array ho già i cmd attivi così da prendere solo quelli necessari

				var tmpBenchWithAvgTime ={
				};

				var obj = {
					name:"",
					data: []
				};


				/*var cmdObjAvg = {
					name:"",
					data:[]
				};*/

				if(sessionStorage[elem]){ // dall' id del command costruisco il json che servira per il grafico
					obj.name = elem;
					//cmdObjAvg.name = elem;

					tmpDataString = sessionStorage.getItem(elem);
					tmpDataArrayString = tmpDataString.split(",");

					tmpDataArray = [];
					
				
					tmpDataArrayString.forEach(function(val,index){ // risistemo obj per cmdObjArr, in modo che ogni volta che il grafico deve essere aggiornato
						if(bench_id_arr[index].active=="true" ){ 	//verifico che il benchmark sia attivo e prendo i dati corrispondenti all'indice del benchmark
							//console.log(bench_id_arr[index].id+" , "+val);
							tmpDataArray.push(parseInt(val));
						}
						
					});
					
					//cmdObjAvg.data = tmpAvgData;
					obj.data = tmpDataArray;
				}else{
					console.log("elemento command non trovato nella sessionStorage");
				}
				//cmdObjWithAvg_array.push(cmdObjAvg);
				cmdObjArr.push(obj);
				cmd_Bench_AvgTime_array.push(tmpBenchWithAvgTime);
			});
				

			var keys;
			cmd_Bench_AvgTime_array.forEach(function(elemnt,indexElem){
				keys = Object.keys(elemnt).sort(function(a,b){return elemnt[a]-elemnt[b]});
			});
			bench_only_id_arr = [];
			//console.log(bench_id_arr);
			bench_id_arr.forEach(function(val,index){
				if(val.active == "true")
					bench_only_id_arr.push(val.id);
			});

			//activeCmdAndCommandForLineChart(arrayOfObjectTimeTestCase);
			//grafico line su avg time ordinati
			if(clicked_id ==="line"){
				elaborateDataForLineChart();
					
				lineChart(dataForLineChart,"container_1"); // creazione grafico per test completed
				$("#graphic_2").hide();
			}

			//grafico riassuntivo sui test completi e non completi
			if(clicked_id==="stacked"){
				//console.log(cmdObjArr);
				stackedChart(cmdObjArr,"container_1",bench_only_id_arr,"completed");
				$("#graphic_2").show();	
			}

			var test= {
				name:"test1",
				data:[[161.2, 51.6], [167.5, 59.3], [159.5, 49.2]]
			}

			var test2 = {
				name:"test2",
				data:[[170.2, 7.6], [16.5, 57.5], [59.5, 29.2]]
			}

			var arraytest = [];
			arraytest.push(test);
			arraytest.push(test2);

			//grafico scatter su avg time a due istanze
			if(clicked_id==="scatter"){
				dataForScatterChart();
				scatterChart(arraytest,"container_1",bench_only_id_arr,"completed");
				$("#graphic_2").hide();
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
            		//console.log("True");
            		tmpObj.active = "true";
            	}else{
            		//console.log("false");
            		tmpObj.active = "false";
            	}
            	newNotCompletedArray.push(tmpObj);
            });

            //console.log(newNotCompletedArray);
           
            var cmdObjToGraphicsArray=[]; // array degli oggetti not completed da visualizzare sul grafico in base ai dati aggiornati dalla aggiunta o rimozione di benchmark

            allCmdCheck.forEach(function(cmdId,cmdIndex){
			//console.log(cmdId);            	
            	var cmdObjToGraphics = {
            		name: "",
            		data : []
            	};
				cmdObjToGraphics.name = cmdId.id;

				if(cmdId.active == "true"){
					//console.log("true, "+cmdId.id)
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

            

            if(clicked_id === "stacked"){
            	stackedChart(cmdObjToGraphicsArray,"container_2",bench_only_id_arr,"notcompleted");
            }


          }else{
          	alert("Non è possibile caricare i test Non Completati!");
          }

	}); // end on click completed cmd table

	function elaborateDataForLineChart(){
		dataForLineChart = [];
		allCmdCheck.forEach(function( cmdCheck,index)  {
			if(cmdCheck.active =="true"){
				arrayOfObjectTimeTestCase.forEach(function(obj,ind){
					if(obj.name == cmdCheck.id ){
						obj.data.sort( function(a,b) { return a-b } );
						dataForLineChart.push(obj);
					}
				});
			}
		});
	}


	function lineChart(param,appendTo){
		var title;
			title = "Line chart of Average Time!";
		
		$(function () {
			Highcharts.chart(appendTo, {
				title: {
					text: title
				},
				xAxis: {
					categories: ""
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
							pointFormat: '{point.x} s,{point.y} s'
						}
					}
				},
				series:
					param
			});
		});
	}
});