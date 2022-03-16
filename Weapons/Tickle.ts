import AbstractWeapon from "../Abstracts/AbstractWeapon";

class TickleWeapon extends AbstractWeapon
{
    name = 'Kitzel-Attacken';

    attacks = [
        '###ORIGIN### macht sich daran ###TARGET### richtig durchzukitzeln'
    ]

    retorts = [
        ', aber ###TARGET### macht einen gekonnten Jedi-Mind-Trick und ###ORIGIN### fängt an sich selbst zu kitzeln!'
    ]

    hits = [
        ' und ###TARGET### lacht sich hilflos halb zu Tode!'
    ]
}

let tickleWeapon = new TickleWeapon();
export default tickleWeapon;