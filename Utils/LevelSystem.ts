export class LevelSystem {
    // Basis-XP benötigt für das Erreichen des nächsten Levels
    private baseXP: number;
    // Exponentieller Faktor für die Berechnung der benötigten XP
    private exponent: number;

    constructor(baseXP: number = 100, exponent: number = 1.5) {
        this.baseXP = baseXP;
        this.exponent = exponent;
    }

    /**
     * Berechnet die insgesamt benötigten Erfahrungspunkte, um das gegebene Level zu erreichen.
     * @param level Das Ziellevel
     * @returns Die Gesamtanzahl an XP, die benötigt werden, um das angegebene Level zu erreichen.
     */
    public xpForLevel(level: number): number {
        return Math.floor(this.baseXP * (Math.pow(level, this.exponent) - 1));
    }

    /**
     * Bestimmt das Level basierend auf den gegebenen Erfahrungspunkten.
     * @param xp Die vorhandenen Erfahrungspunkte
     * @returns Das aktuelle Level basierend auf den gegebenen XP.
     */
    public levelForXP(xp: number): number {
        return Math.floor(Math.pow((xp / this.baseXP) + 1, 1 / this.exponent));
    }
}