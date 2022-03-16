import AbstractWeapon from "../Abstracts/AbstractWeapon";

class BunnyWeapon extends AbstractWeapon
{
    name = 'Flauschige Plüsch-Hasen';

    attacks = [
        '###ORIGIN### stürmt nach vorne und haut mit einem weit ausgeholten Schlag nach ###TARGET###'
    ]

    retorts = [
        ', aber ###TARGET### weicht mit einem Matrix-ähnlichen Move aus und nutzt die Verwirrung um ###ORIGIN###\'s Gesicht mit einer Ladung Plüsch zu füllen!'
    ]

    hits = [
        ' und trifft ###TARGET### mit einem Haufen superweichem Plüsch genau im Gesicht!'
    ]
}

let bunnyWeapon = new BunnyWeapon();
export default bunnyWeapon;