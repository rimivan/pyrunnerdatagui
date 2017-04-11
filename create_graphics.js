jQuery(document).ready(function(){

	$(".graphicbtn").on("click",function(){ // comandi completed
		var clicked_id = $(this).attr("id");
		var benchmarkId;
		var bench_id_arr;
		var cmd_id;
		var cmd_id_array = [];
		var cmdObjArr;
		var cmdObjWithAvg_array;
		var tmpAvgData;
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

			cmd_id_array.forEach(function(elem,index){

				var tmpBenchWithAvgTime ={
				};

				var obj = {
					name:"",
					data: []
				};


				var cmdObjAvg = {
					name:"",
					data:[]
				};

				if(sessionStorage[elem]){ // dall' id del command costruisco il json che servira per il grafico
					obj.name = elem;
					cmdObjAvg.name = elem;

					tmpDataString = sessionStorage.getItem(elem);
					tmpDataArrayString = tmpDataString.split(",");

					tmpDataArray = [];
					
					all_cmdObjectWithAvgTime.forEach(function(cmdAvg,indexAvg){
						if(elem == cmdAvg.name){ // significa che il command cmdAvg.name è attivo
							tmpAvgData = [];
							cmdAvg.data.forEach(function(benchAvg,indexBench){
								//console.log("cmdAvg : "+cmdAvg.name+" "+benchAvg);
								if(bench_id_arr[indexBench].active=="true"){ 
									tmpAvgData.push(benchAvg);
										tmpBenchWithAvgTime[bench_id_arr[indexBench].id] = benchAvg;
								}
							});
						}
					});
					tmpDataArrayString.forEach(function(val,index){
						if(bench_id_arr[index].active=="true" ){ 
							//console.log(bench_id_arr[index].id+" , "+val);
							tmpDataArray.push(parseInt(val));
						}
						
					});
					
					cmdObjAvg.data = tmpAvgData;
					obj.data = tmpDataArray;
				}else{
					console.log("elemento command non trovato nella sessionStorage");
				}
				cmdObjWithAvg_array.push(cmdObjAvg);
				cmdObjArr.push(obj);
				cmd_Bench_AvgTime_array.push(tmpBenchWithAvgTime);
			});
				

			var keys;
			cmd_Bench_AvgTime_array.forEach(function(elemnt,indexElem){
				keys = Object.keys(elemnt).sort(function(a,b){return elemnt[a]-elemnt[b]});
				console.log(keys);
			});
			bench_only_id_arr = [];
			//console.log(bench_id_arr);
			bench_id_arr.forEach(function(val,index){
				if(val.active == "true")
					bench_only_id_arr.push(val.id);
			});

			console.log(cmd_Bench_AvgTime_array);

			//grafico line su avg time ordinati
			if(clicked_id ==="line"){
				//console.log(cmdObjWithAvg_array);
				all_cmdObjectWithAvgTime.forEach(function(cmd,ind){
					cmd.data.sort( function(a, b){return a-b} );
				});
				//console.log(bench_only_id_arr);
				lineChart(cmdObjWithAvg_array,"container_1",keys); // creazione grafico per test completed
				$("#graphic_2").hide();
			}

			//grafico riassuntivo sui test completi e non completi
			if(clicked_id==="stacked"){
				//console.log(cmdObjArr);
				stackedChart(cmdObjArr,"container_1",bench_only_id_arr,"completed");
				$("#graphic_2").show();	
			}

			//grafico scatter su avg time a due istanze
			if(clicked_id==="scatter"){
				scatterChart(cmdObjArr,"container_1",bench_only_id_arr,"completed");
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



	function lineChart(param,appendTo,categories){
		var title;
			title = "Line chart of Average Time!";
		
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