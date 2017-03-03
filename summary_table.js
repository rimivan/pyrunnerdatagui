jQuery(document).ready(function(){
	$("#completed_summary_btn").on("click",function(){
		if(sessionStorage["bench_array"]){ // in session storage deve esserci bench_array
		var benchmarkId = sessionStorage.getItem("bench_array");
		var bench_id_arr = benchmarkId.split(",");
		//console.log(benchmarkId);

		var cmd_id = sessionStorage.getItem("cmd_array");
		var cmd_id_array = cmd_id.split(",");
		//console.info(cmd_id_array);

		var cmdObjArr = [];
		
		
		var tmpDataString;
		var tmpDataArrayString = [];
		var tmpDataArray = [];
		cmd_id_array.forEach(function(elem,index){

			var obj = {
				name:"",
				data: []
			};
			
			if(sessionStorage[elem]){
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
		//console.log(cmdObjArr[0].data);


		$(function () {
			Highcharts.chart('container_comp', {
				chart: {
					type: 'bar'
				},
				title: {
					text: 'Test Completed'
				},
				xAxis: {
					categories: bench_id_arr
				},
				yAxis: {
					min: 0,
					title: {
						text: 'Total completed test'
					}
				},
				legend: {
					reversed: true
				},
				plotOptions: {
					series: {
						stacking: 'normal'
					}
				},
				series: 
					cmdObjArr
				
				
			});
		});
		}else{
			alert("Qualcosa è andato storto nella lettura dal sessionStorage.");
		}

	}); // end on click completed cmd table

	$("#notcompleted_summary_btn").on("click",function(){
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

            $(function () {
			Highcharts.chart('container_notcomp', {
				chart: {
					type: 'bar'
				},
				title: {
					text: 'Test NOT completed'
				},
				xAxis: {
					categories: bench_id_arr
				},
				yAxis: {
					min: 0,
					title: {
						text: 'Total NOT completed test'
					}
				},
				legend: {
					reversed: true
				},
				plotOptions: {
					series: {
						stacking: 'normal'
					}
				},
				series: 
					notCompleted_all
				
				
			});
		});


		}else{
			alert("nn ci sn not completed");
		}

	});
	
});