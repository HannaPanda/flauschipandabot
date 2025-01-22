import AbstractCommand from "../Abstracts/AbstractCommand";
import Fighter from "../Models/Fighter";
import bunnyWeapon from "../Weapons/Bunny";
import staticElectricityWeapon from "../Weapons/StaticElectricity";
import tongueWeapon from "../Weapons/Tongue";
import tickleWeapon from "../Weapons/Tickle";
import sayService from "../Services/SayService";

class DuellCommand extends AbstractCommand
{
    isActive       = true;
    isModOnly      = false;
    isOwnerOnly    = false;
    isAggressive   = true;
    command        = 'duell';
    description    = 'Duelliere dich mit jemandem';
    answerNoTarget = '';
    answerTarget   = '';
    globalCooldown = 0;

    weapons = [
        bunnyWeapon, staticElectricityWeapon, tongueWeapon, tickleWeapon
    ]

    customHandler = async (message, parts, context, origin = 'tmi', channel = null, messageObject = null) => {
        const target = this.getTarget(origin, parts, messageObject);
        const targetName = parts.slice(1).join(' ');
        const username = context.userName;
        const displayName = context.displayName;

        const chosenWeapon = this.weapons[this.randomInt(0, this.weapons.length - 1)];

        if(target === '') {
            sayService.say(origin, displayName, targetName, channel, '###ORIGIN### möchte sich duellieren! ');

            return Promise.resolve(true);
        }

        const originUser = new Fighter();
        await originUser.init(username);

        const targetUser = new Fighter();
        await targetUser.init(target);

        const levelDifference = originUser.get('level') - targetUser.get('level');
        const hitChance = 50 + (levelDifference * 2);
        const hasHit = hitChance > this.randomInt(1, 100);

        const hitMessage = (hasHit) ? chosenWeapon.getRandomHit() : chosenWeapon.getRandomRetort();
        const damage = Math.max(1, this.randomInt(1, 1 + levelDifference));

        let text = '###ORIGIN### fordert ###TARGET### zu einem Duell heraus! ' +
            'Die Waffen? '+chosenWeapon.name+'! '+chosenWeapon.getRandomAttack()+hitMessage;

        sayService.say(origin, displayName, targetName, channel, text);

        return Promise.resolve(true);
    }
}

const duellCommand = new DuellCommand();

export default duellCommand;
