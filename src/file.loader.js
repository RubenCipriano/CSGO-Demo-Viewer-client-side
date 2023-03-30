const file = document.getElementById("file");
const arrayOfticks = [];
var intervalPlay  = null;
var demoFile = new demofile.DemoFile();
var threeScript = null;
const roundTicks = [];
file.addEventListener("change", function () {

    progress.value = 0;

    var file = this.files[0];

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = function () {
        var buf = new Buffer(reader.result);

        demoFile.on("progress", function (perc) {
            progress.value = perc * 100;
        });

        var isFirstTime = true;

        demoFile.on("svc_GameEvent", (gameEvent) => {
            if(gameEvent.eventid == 37) {
                roundTicks.push(demoFile.currentTick);
            }

            if(gameEvent.eventid == 37 && isFirstTime) {
                demoFile.on("net_Tick", function () {
                    if(!isFirstTime) {
                        var tickInfo = {currentTick: demoFile.currentTick};
        
                        if(demoFile.players.length > 0) {
                            tickInfo.players = []
                            for(var i = 1; i < demoFile.players.length; i++) {            
                                let player = {
                                    userId: demoFile.players[i].steamId,
                                    armor: demoFile.players[i].armor,
                                    eyeAngles: demoFile.players[i].eyeAngles,
                                    isAlive: demoFile.players[i].isAlive,
                                    name: demoFile.players[i].name,
                                    position: demoFile.players[i].position,
                                    teamNumber: demoFile.players[i].teamNumber,
                                }
                                tickInfo.players.push(player)
                            }
                        }
            
                        arrayOfticks.push(tickInfo);
                        
                        if(!threeScript) {
                            threeScript = document.createElement('script');
                            threeScript.type = 'module';
                            threeScript.src = "/src/csgo.three.js";
                            document.body.append(threeScript);
                        }
                    } else {
                        isFirstTime = false;
                    }
        
                });
            } 
        })

        demoFile.parse(buf);
    };

    // Read in the image file as a data URL.
    reader.readAsArrayBuffer(file);
});