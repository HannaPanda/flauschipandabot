import AbstractWeapon from "../Abstracts/AbstractWeapon";

class TongueWeapon extends AbstractWeapon
{
    name = 'Spitze Zungen';

    attacks = [
        '###ORIGIN### macht einen gehässigen Kommentar über ###TARGET###\'s Flausch-Fähigkeiten'
    ]

    retorts = [
        ', aber ###TARGET### ist vorbereitet und entgegnet dem mit dem Hinweis, dass ###ORIGIN### einfach nicht genug Flauschen im Kopf hat!'
    ]

    hits = [
        ' und ###TARGET### ist jetzt voll traurig!'
    ]
}

let tongueWeapon = new TongueWeapon();
export default tongueWeapon;