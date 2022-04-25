export interface Skill {
  id: string;
  name: string;
  damage: number;
  cooldown: number;
  rangeAttack: number;
  attackImageUrl: string;
  transform: {
    left: string;
    right: string;
  };
}
