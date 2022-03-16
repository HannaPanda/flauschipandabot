import AbstractWeapon from "../Abstracts/AbstractWeapon";

class StaticElectricityWeapon extends AbstractWeapon
{
    name = 'Statische Elektrizität';

    attacks = [
        '###ORIGIN### und ###TARGET### rubbeln beide ihre Füße schnell über den Teppich'
    ]

    retorts = [
        '. ###TARGET### tippt ###ORIGIN### an die Schulter under verpasst ###ORIGIN### damit einen kleinen Schock!'
    ]

    hits = [
        '. ###ORIGIN### piekt ###TARGET### blitzschnell in die Seite und ###TARGET### zuckt erschrocken zusammen!'
    ]
}

let staticElectricityWeapon = new StaticElectricityWeapon();
export default staticElectricityWeapon;