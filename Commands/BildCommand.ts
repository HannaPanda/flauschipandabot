import AbstractCommand from "../Abstracts/AbstractCommand";
import sayService from "../Services/SayService";
import openAiClient from "../Clients/openAiClient";
import axios from 'axios';
const Discord = require('discord.js');

class BildCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = false;
    command        = 'bild';
    description    = 'Lass FlauschiPandaBot ein AI Bild generieren';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const prompt = await openAiClient.createSDKeywordsFromText(parts.slice(1).join(' '));
        console.log(prompt);

        const payload = {
            "prompt": prompt,
            "negative_prompt": "BadDream, UnrealisticDream, FastNegativeV2, civit_nsfw, (((nude))), (((NSFW))), (((naked))), lowres, (bad anatomy, bad hands:1.1), text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, blurry, b&w, weird colors, (bad art, poorly drawn, close up, blurry:1.5), (disfigured, deformed, extra limbs:1.5) , dessaturated, faded tones, blurry face, undetailed face, (((ugly face))), (((deformed face))), (((bad face))), bad portrait, faded face, undetailed face, flat face, nudity, nsfw",
            "steps": 50,
            "sampler_index": "DPM++ 2M SDE Karras",
            "sampler_name": "DPM++ 2M SDE Karras",
            'filter_nsfw': true,
            "override_settings": {
                "sd_model_checkpoint": "dreamshaper_8"
            },
            "sd_model_checkpoint": "dreamshaper_8"
        };
        /*const payload = {
            "prompt": parts.slice(1).join(' '),
            "negative_prompt": "BadDream, UnrealisticDream, FastNegativeV2, lowres, (bad anatomy, bad hands:1.1), text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, blurry, b&w, weird colors, (bad art, poorly drawn, close up, blurry:1.5), (disfigured, deformed, extra limbs:1.5) , dessaturated, faded tones, blurry face, undetailed face, (((ugly face))), (((deformed face))), (((bad face))), bad portrait, faded face, undetailed face, flat face",
            "steps": 10,
            "cfg_scale": 7,
            "sampler_index": "DPM++ SDE Karras",
            "sampler_name": "DPM++ SDE Karras",
            'filter_nsfw': true,
            "override_settings": {
                "sd_model_checkpoint": "DreamShaperXL_Turbo_v2_1"
            },
            "sd_model_checkpoint": "DreamShaperXL_Turbo_v2_1"
        };*/

        try {
            const { data, status } = await axios.post<any>(
                'http://ddns.hannapanda.de:7860/sdapi/v1/txt2img',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: 'Basic aGFubmFwYW5kYTp0ZXN0MTIzJA==',
                    },
                },
            );

            const sfbuff = Buffer.from(data.images[0], "base64");
            const sfattach = new Discord.MessageAttachment(sfbuff, "output.png");
            channel.send({ files: [sfattach]});


        } catch(err) {
            sayService.say(origin, context.displayName, '', channel, "Ich konnte kein Bild generieren: "+err.message);
        }

        return Promise.resolve(true);
    }
}

let bildCommand = new BildCommand();

export default bildCommand;
