# Test FGS - Bullet Hell Game

## Project Structure

All my works in this test are in the folders below. All other codes is my template from a long long long time ago :D

```
assets/
├── particles/            # Plist files
├── resources/
│   └── config/           # JSON configuration files
│       ├── Character1.json
│       ├── Boss1.json
│       ├── PlayerGun.json
│       ├── PlayerBullet.json
│       └── ...
├── scripts/
│   ├── Game/
│   │   ├── Character/    # Player & character logic
│   │   ├── Boss/         # Boss behavior
│   │   ├── Weapon/       # Gun & bullet systems
│   │   ├── Config/       # Code defines (keybind,...)
│   │   └── FX/          # Visual effects
│   └── core/            # Core utilities
├── prefabs/             # Game prefabs
│   └── Game/            # All Prefabs
```

## Configuration System

The game uses a modular JSON configuration system. You can balance the game by editing JSON files directly without opening Cocos Creator.
It takes me a lot of time to setup (T_T) please have mercy
