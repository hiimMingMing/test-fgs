import { ccenum } from 'cc';

export enum CharacterType {
    PLAYER,
    ENEMY,
}

ccenum(CharacterType);

export enum CharacterState {
    ALIVE,
    DEAD,
}
