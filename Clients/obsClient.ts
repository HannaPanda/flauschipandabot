import emitter from "../emitter";
import OBSWebSocket from "obs-websocket-js";
import sayService from "../Services/SayService";
import { Env } from "../Config/Environment";

class Initializer
{
    public obs: OBSWebSocket;

    constructor()
    {
        this.obs = new OBSWebSocket();
        this.connectObs();
    }

    private connectObs = () => {
        this.obs.connect('ws://127.0.0.1:4444', Env.obsWsPass)
            .then(() => {
                console.log('OBS connected');
                this.obs.on('CurrentProgramSceneChanged', data => {
                    console.log(data);
                    if(data['sceneName'] === 'Bitte Warten') {
                        //twitchClient.startCommercial(120);

                        sayService.say('tmi', '', '', null, `Werbepause! ヾ(ﾟдﾟ)ﾉ`);
                        emitter.emit('chat.message', '!klo', ['!klo'], {username: '', 'display-name': '', mod: false, owner: false});
                    }
                });
                this.obs.on('ConnectionClosed', data => {
                    this.obs.removeAllListeners();
                    setTimeout(this.connectObs, 1000);
                });
            })
            .catch((err) => {
                this.obs.removeAllListeners();
                setTimeout(this.connectObs, 1000);
            });
    }
}

let initializer = new Initializer();

export default initializer.obs;
