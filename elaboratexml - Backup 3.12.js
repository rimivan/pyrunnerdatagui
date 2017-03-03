jQuery(document).ready(function(){
    var filenameSelected = sessionStorage.getItem("filename");
    $.ajax({ //deve fare questo al click della selezione del file
        type:"GET",
        url:/*"file.xml"*/ filenameSelected,
        datatype:"xml",
        success:function(xml){
            $(xml).find('benchmark').each(function(bench_i){ // ciclo su tutti i benchmark
                var avgTime_Benchmanrk;
                var avgMem_Benchmark;
                var solution; // ?? 

                var cmdNumber_forBenchmark = 0;
                var totalTime_forBenchmark = 0;
                var totalMem_forBenchmark = 0;

                var currentBenchmark = $(this).prop('id'); // id del benchmark corrent
                $("#benchmark_list").append("<li><button id='benchBtn_"+bench_i+"' class='benchBtn'>"+currentBenchmark+"</button></li>"); // this mi dà il benchmark
                //crea lista comandi

                $("#div_testcases").append("<ol id='testcase_list_"+bench_i+"' hidden>Testcases:</ol>");
                var testcases=$(this).find("testcase");
                testcases.each(function(i){//ciclo su tutti i testcase del benchmark
                    //variabili per i dati per ogni benchmark
                    $("#testcase_list_"+bench_i).append("<li><button class ='testcaseBtn' id='testcase_btn_"+i+"'>"+testcases[i].id+"</button></li>");
                    
                    $("#div_commands").append("<ol id='command_list_"+i+"_"+bench_i+"' class='hide'>Commands List:"+i+"</ol>");
                    var commands = $(this).find("command");
                    commands.each(function(j){
                        $("#command_list_"+i+"_"+bench_i).append("<li><button id='cmd_button_"+j+"' class='cmd_class'>"+commands[j].id+"</button></li>");
                        var currentPyrunlim = $(this).find("pyrunlim");
                            currentPyrunlim.each(function(k){ // serve a prendere i dati
                                //console.log(currentPyrunlim[k]); //dà tutto il tag pyrunlim ma nn mi prende i singoli prop 
                            var version = $(this).attr("version");
                            console.log(version);
                                var currentStats = $(this).find("stats");
                                    currentStats.each(function(h){
                                        var end= currentStats.attr("user"); //TODO
                                        //console.log(end);
                                    });
                            });

                    });

                });

                avgTime_Benchmanrk = totalTime_forBenchmark / cmdNumber_forBenchmark; 
                avgMem_Benchmark = totalMem_forBenchmark / cmdNumber_forBenchmark;
            });

            $(".cmd_class").on("click",function(){ // come prendere il singolo command
                console.info($(this));
            });

            $(".testcaseBtn").on("click",function(){ // evento sui testcase Button
                var idClickedBtn = $(this).prop("id");
                var splitted = idClickedBtn.split("_");
                var clicked_index = splitted[2];

                if($("#command_list_"+clicked_index+"_"+lastbenchclicked).hasClass("hide")){
                    $("#command_list_"+clicked_index+"_"+lastbenchclicked).removeClass("hide");
                }else if( $("#command_list_"+clicked_index+"_"+lastbenchclicked).hasClass("hide")==false ){
                    //console.log("Is hidden");
                    $("#command_list_"+clicked_index+"_"+lastbenchclicked).addClass("hide");
                }
            });//end event testcase Button

            var lastbenchclicked=0;
            $(".benchBtn").on('click',function(){ // event benchmark Button
                var idClickedBtn = $(this).prop("id");
                console.log(idClickedBtn);
                var splitted = idClickedBtn.split("_");
                var clicked_index = splitted[1];
                lastbenchclicked=clicked_index;

                if( $("#testcase_list_"+clicked_index).is(":hidden") ){
                    $("#testcase_list_"+clicked_index).fadeIn();
                }

                else if( $("#testcase_list_"+clicked_index).is(":visible") ){
                    //console.log("Is hidden");
                    $("#testcase_list_"+clicked_index).fadeOut();
                }
            });// end event benchmar button

            /*sessionStorage.clear(); decommenta, altrimenti poi rimane memorizzato sempro lo stesso file*/ 

        }
    });



});//jquery end