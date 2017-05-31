var allCmdCheck = [];
var dataForLineChart = [];
var dataForScatterChart = [];
var DIM_SCATTER = 700;

jQuery(document).ready(function(){
	var bench_id_arr;
	$(".scatterZoom").on('click',function(){
		var id = $(this).prop("id");
		if( id == "bigger"){
			DIM_SCATTER += 100;
		}

		if( id == "smaller"){
			DIM_SCATTER -= 100;
		}
		var l = location.href;
		var currentLocation = l.substr(l.lastIndexOf("/")+1).split(/[?#]/)[0];
		if(currentLocation == "home.html"){
			$("#scatter").click();
		}else if(currentLocation == "benchmark_page.html"){
			$("#scatter_tcase").click();
		}
	});

	$(".graphicbtn").on("click",function(){ // grafici homepage
		var clicked_id = $(this).attr("id");
		var benchmarkId;
		var cmd_id;
		var cmd_id_array = []; // conterrà solo i command attivi
		var cmdObjArr;
		var tmpAvgData;
		var tmpDataString;
		var tmpDataArrayString;
		var tmpDataArray;

		if(sessionStorage["bench_array"]){ // in session storage deve esserci bench_array(array degli id dei benchmark)
			allCmdCheck = [];
			commandChecker(); //function in utility

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
					cmd_id_array.push(cmdCheck.id); // solo i command attivi
				}
			});

			cmdObjArr = []; // array con i dati dei command per i grafici
			cmdObjWithAvg_array = [];
			

			tmpDataString;
			tmpDataArrayString = [];
			tmpDataArray = [];

			cmd_id_array.forEach(function(elem,index){ // in cmd_id_array ho già i cmd attivi così da prendere solo quelli necessari
				var obj = {
					name:"",
					data: []
				};

				if(sessionStorage[elem]){ // dall' id(elem) del command costruisco gli oggetti che serviranno per il grafico stacked con i completed test
					obj.name = elem;	

					tmpDataString = sessionStorage.getItem(elem);
					tmpDataArrayString = tmpDataString.split(",");

					tmpDataArray = [];
							tmpDataArrayString.forEach(function(val,index){ // risistemo obj per cmdObjArr, in modo che ogni volta che il grafico deve essere aggiornato
								if(bench_id_arr[index].active=="true" ){ 	//verifico che il benchmark sia attivo e prendo i dati corrispondenti all'indice del benchmark
									tmpDataArray.push(parseInt(val));
								}
							});
							
						obj.data = tmpDataArray;
				}else{
					console.log("elemento command non trovato nella sessionStorage:"+elem);
				}
				cmdObjArr.push(obj); // cmdObjArr è l'array di oggetti che passo al grafico stacked
				
			});
			bench_only_id_arr = [];
			
			bench_id_arr.forEach(function(val,index){
				if(val.active == "true")
					bench_only_id_arr.push(val.id);
			});

			
			//grafico line su avg time ordinati
			if(clicked_id ==="line"){
				elaborateDataForLineChart();
				$("#graphic_1").empty();
				$("#graphic_2").empty();
				$("#graphic_scatter").empty();
				$("#graphic_1").append("<div class='col_1'></div><div class='col_10'><div id='container_1' style='width:100%; height:100%;'></div></div><div class='col_1'></div>");
				lineChart(dataForLineChart,"container_1"); // creazione grafico per test completed
			}


			//grafico scatter su avg time a due istanze
			var checkedCmdForScatter = [];
			if(clicked_id==="scatter"){
				controlCheckedCmd(checkedCmdForScatter); // crea l'array con gli id dei command checked
				if(checkedCmdForScatter.length > 1){ // bisogna controllare che i checked siano due
					$("#graphic_1").empty();
            		$("#graphic_2").empty();
            		$("#graphic_scatter").empty();
            		$("#graphic_scatter").append("<div class='col_3'></div><div class='col_6'><div id='container_scatter' style='width:100%; height:400px;''></div></div><div class='col_3></div>");
					elaborateDataForScatterChart( checkedCmdForScatter ); // function in utility_script
					scatterChart(dataForScatterChart,"container_scatter");
					
				}else{
					alert("seleziona due cmd");
				}
			}

		}else{
			alert("Qualcosa è andato storto nella lettura dal sessionStorage.");
		}

	

		//creazione dati e grafici per i test non completi
		if(sessionStorage["notcompleted"]){ // in session storage deve esserci l'elemento notcompleted per creare il grafico stacked con i test not completed
			var notCompleted_all = JSON.parse (sessionStorage.getItem("notcompleted")) ;

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
					tmpObj.active = "true";
				}else{
					tmpObj.active = "false";
				}
				newNotCompletedArray.push(tmpObj);
			});

            var cmdObjToGraphicsArray=[]; // array degli oggetti not completed da visualizzare sul grafico in base ai dati aggiornati dalla aggiunta o rimozione di benchmark

            allCmdCheck.forEach(function(cmdId,cmdIndex){
            	var cmdObjToGraphics = {
            		name: "",
            		data : []
            	};
            	cmdObjToGraphics.name = cmdId.id;

            	if(cmdId.active == "true"){
            		bench_id_arr.forEach(function(benchElem,benchIndex){
            			if(benchElem.active == "true"){
			            		cmdObjToGraphics.data.push( notCompleted_all[cmdIndex].data[benchIndex] ); // solo per benchmark
			            	}
			            });
            		cmdObjToGraphicsArray.push(cmdObjToGraphics);
            	}
            });

            

            if(clicked_id === "stacked"){
            	$("#graphic_1").empty();
            	$("#graphic_2").empty();
            	$("#graphic_scatter").empty();
            	$("#graphic_1").append("<div class='col_1'></div><div class='col_10'><div id='container_1' style='width:100%; height:400px;'></div></div><div class='col_1'></div>");
            	$("#graphic_2").append("<div class='col_1'></div><div class='col_10'><div id='container_2' style='width:100%; height:400px;'></div></div><div class='col_1'></div>");
            	stackedChart(cmdObjArr,"container_1",bench_only_id_arr,"completed");
            	stackedChart(cmdObjToGraphicsArray,"container_2",bench_only_id_arr,"notcompleted");
            }


        }else{
        	alert("Non è possibile caricare i test Non Completati!");
        }

	}); // end on click grafic button

										//line chart of home.html
	function elaborateDataForLineChart(){ // riempe dataLineForChart per poi essere passato alla funzione che Line
		dataForLineChart = [];
		var cmdObjForLine;
		arrayDeiValoriDiAvgPerSingoloTestcase.forEach(function(arrCmd,index_k){	
			if(allCmdCheck[index_k].active == "true"){
				console.log(allCmdCheck[index_k].id+ ":true");
				var oggetto = {
					name:allCmdCheck[index_k].id,
				}
				var arrayLineData = [];

				arrCmd.forEach(function(valTcase,index_l){
					if( sessionStorage.getItem(valTcase.name) =="true" ){
						arrayLineData.push(valTcase.data);
					}
				});
				arrayLineData.sort( function(a,b) { return a-b } );
				oggetto.data = arrayLineData;
				dataForLineChart.push(oggetto);
			}
		});
		console.log(dataForLineChart);
	}


}); // end jquery

//function per i grafici
function lineChart(param,appendTo){
	var biggerScatterBtn = document.getElementById("bigger");
	var smallerScatterBtn = document.getElementById("smaller");
	biggerScatterBtn.classList.add("hide");
	smallerScatterBtn.classList.add("hide");
	
	console.log(param);
	var title;
	title = "Line chart of Testcases Time!";
	$(function () {
		Highcharts.chart(appendTo, {
			title: {
				text: title
			},
			xAxis: {
				categories: "",
				title:{
					text:"Testcase number:"
				}
			},

			yAxis: {
				title: {
					text: "Testcase time: "
				}
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
			},
			series: 
					param // oggetti dei comand completed
			
		});
	});
};


function stackedChart(param,appendTo,categories,compOrNotComp){
	var biggerScatterBtn = document.getElementById("bigger");
	var smallerScatterBtn = document.getElementById("smaller");
	biggerScatterBtn.classList.add("hide");
	smallerScatterBtn.classList.add("hide");

	console.log(param); // prima per i completed e poi per i not completed
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

function scatterChart(param,appendTo){
	console.log(param);
	var biggerScatterBtn = document.getElementById("bigger");
	var smallerScatterBtn = document.getElementById("smaller");
	biggerScatterBtn.classList.remove("hide");
	smallerScatterBtn.classList.remove("hide");
	

	var title = "Scatter chart of selected command Time";
	$(function () {
		Highcharts.chart(appendTo, {
			chart: {
				events: {
					load: function() {
						var extremeY = this.yAxis[0].getExtremes();
						var extremeX = this.xAxis[0].getExtremes();

						var lineSeries = {
							name:"diagonal line",
							type: 'line',
							data: [
							[extremeX.min, extremeY.min],
							[extremeX.max, extremeY.max]
							],
							lineWidth: 1,
							lineColor: 'rgb(0,0,0)',
							marker: {
								enabled: false
							}
						};

						this.addSeries(lineSeries);
					}
				},
				type: 'scatter',
				zoomType: 'xy',
				width: DIM_SCATTER,
				height: DIM_SCATTER
			},
			legend:{
				enabled:true
			},
			title: {
				text: title
			},
			xAxis: {
				min:0,
					//categories: categories
			},
			yAxis: {
					min:0,
					tickInterval: 10,
					title: {
						text: 'Time'
					}
			},
				
				plotOptions: {
					scatter: {
						marker: {
							radius: 6,
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