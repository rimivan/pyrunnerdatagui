jQuery(document).ready(function(){
	$(".graphicbtn").on("click",function(){ // comandi completed
		var clicked_id = $(this).attr("id");
		var benchmarkId;
		var bench_id_arr;
		var cmd_id;
		var cmd_id_array;
		var cmdObjArr;
		var tmpDataString;
		var tmpDataArrayString;
		var tmpDataArray;


		if(sessionStorage["bench_array"]){ // in session storage deve esserci bench_array(array degli id dei benchmark)
			benchmarkId = sessionStorage.getItem("bench_array");
			bench_id_arr = benchmarkId.split(",");

			cmd_id = sessionStorage.getItem("cmd_array");
			cmd_id_array = cmd_id.split(",");

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
					tmpDataArrayString.forEach(function(elem,index){
						tmpDataArray.push(parseInt(elem));
					});
					console.log(tmpDataArray);
					obj.data = tmpDataArray;
				}else{
					console.log("elemento non trovato nella sessionStorage");
				}
				cmdObjArr.push(obj);
			});
			
			//grafici con test completed
			if(clicked_id ==="line"){
				lineChart(cmdObjArr,"container_comp",bench_id_arr,"completed"); // creazione grafico per test completed
			}else if(clicked_id==="stacked"){
				stackedChart(cmdObjArr,"container_comp",bench_id_arr,"completed");	
			}else if(clicked_id==="scatter"){
				scatterChart(cmdObjArr,"container_comp",bench_id_arr,"completed");
			}else{
				alert("Nessun grafico disponibile!");
			}

		}else{
			alert("Qualcosa è andato storto nella lettura dal sessionStorage.");
		}

		//creazione dati e grafici per i test non completi
		if(sessionStorage["notcompleted"]){ // in session storage deve esserci l'elemento notcompleted
			var notCompObj = {
                			id:"",
                			val:[]
                		};
            var notCompleted_all = JSON.parse (sessionStorage.getItem("notcompleted")) ;
            //var notCompObj = notCompleted_all.split(",");
           

            if(sessionStorage["bench_array"]){ // in session storage deve esserci bench_array
            	var benchmarkId = sessionStorage.getItem("bench_array");
            	var bench_id_arr = benchmarkId.split(",");
            }

            if(clicked_id === "line"){
            	lineChart(notCompleted_all,"container_notcomp",bench_id_arr,"notcompleted");//creazione grafico per test not completed
            }else if(clicked_id === "stacked"){
            	stackedChart(notCompleted_all,"container_notcomp",bench_id_arr,"notcompleted");
            }else if(clicked_id === "scatter"){
				scatterChart(notCompleted_all,"container_notcomp",bench_id_arr,"notcompleted");
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