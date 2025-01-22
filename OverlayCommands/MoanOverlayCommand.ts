import AbstractOverlayCommand from "../Abstracts/AbstractOverlayCommand";

class MoanOverlayCommand extends AbstractOverlayCommand
{
    isActive       = false;
    isModOnly      = false;
    isOwnerOnly    = false;
    command        = "moan";
    aliases        = ["!stöhn", "!stöhnen"];
    description    = ";)";
    mediaFile      = "";//"moan.mp3";
    mediaType      = "audio";
    volume         = 0.25;
    customHandler  = null;
}

let moanOverlayCommand = new MoanOverlayCommand();

export default moanOverlayCommand;
