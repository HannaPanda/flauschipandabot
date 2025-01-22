import AbstractCommand from "../Abstracts/AbstractCommand";
import twitchClient from "../Clients/twitchClient";
import sayService from "../Services/SayService";
import server from "../server";

class PlayclipCommand extends AbstractCommand
{
    isActive       = true;
    isVipOnly      = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'playclip';
    description    = 'Einen Clip abspielen';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    private clips = {
        'brain': 'ToughYawningWatermelonBabyRage-anZ2kAwvZqEMW_U-'
    };

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        if(parts.length <= 1) {
            return false;
        }

        let clipId = parts[1];
        if(this.clips.hasOwnProperty(clipId)) {
            return this.playClipByid(this.clips[clipId]);
        }

        let match = clipId.match(/\.tv\/(.+?)(?:\?|$)/);
        if(match) {
            return this.playClipByid(match[1].replace('hannapanda84/clip/', ''));
        }
    };

    private playClipByid = async (clipId) => {
        try {
            const clipInfo = await twitchClient.apiClient.clips.getClipById(clipId);
            if(clipInfo) {
                const videoUrl = clipInfo.thumbnailUrl.replace('-preview-480x272.jpg', '.mp4');
                server.getIO().emit('playVideo', {file: videoUrl, mediaType: 'video', volume: 1});
            } else {
                sayService.say('tmi', '', '', null, 'Clip nicht gefunden');
            }
            return true;
        } catch(err) {
            console.warn(err);
            sayService.say('tmi', '', '', null, 'Fehler beim Abspielen des Clips');
        }

        return false;
    }
}

let playclipCommand = new PlayclipCommand();

export default playclipCommand;
