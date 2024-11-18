class AbstractWeapon
{
    name = '';
    attacks = [];
    retorts = [];
    hits    = [];

    getRandomAttack = () => {
        return this.attacks[this.randomInt(0, this.attacks.length - 1)];
    }

    getRandomRetort = () => {
        return this.retorts[this.randomInt(0, this.retorts.length - 1)];
    }

    getRandomHit = () => {
        return this.hits[this.randomInt(0, this.hits.length - 1)];
    }

    protected randomInt = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}

export default AbstractWeapon;
