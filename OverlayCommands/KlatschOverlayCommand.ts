import AbstractOverlayCommand from "../Abstracts/AbstractOverlayCommand";

class KlatschOverlayCommand extends AbstractOverlayCommand
{
    isActive       = false;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "klatsch";
    aliases        = ["!klatschen"];
    description    = "( ͡° ͜ʖ ͡°)";
    mediaFile      = "";//"fap.mp3";
    mediaType      = "audio";
    volume         = 0.25;
    customHandler  = null;
}

let klatschOverlayCommand = new KlatschOverlayCommand();

export default klatschOverlayCommand;
