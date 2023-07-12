import PokemonSpawn from "./models/PokemonSpawn";

function parseSpawnJson(json = []) {
    let pokemons = [];
    let spawns = [];
    for (let i = 0; i < json.length; i++) {
        let newSpawn = {
            "map": json[i].Map,
            "times": json[i].Daytime,
            "minLevel": json[i].MinLVL,
            "maxLevel": json[i].MaxLVL,
            "tier": json[i].Tier,
            "item": json[i].Item,
            "memberOnly": json[i].MemberOnly,
            "land":true,
        };
        if (json[i].Fishing === 0 || json[i].Fishing === 1) {
            newSpawn['land'] = false;
            newSpawn['fishing'] = json[i].Fishing;
            newSpawn['fishingOnly'] = json[i].FishingOnly;
            newSpawn['requiredRod'] = json[i].RequiredRod;
        }
        if (pokemons.indexOf(json[i].Pokemon) === -1) {
            pokemons.push(json[i].Pokemon);
            spawns.push({pokemon: json[i].Pokemon, pokedexID: json[i].MonsterID ,spawns: [newSpawn]});
        } else {
            spawns[pokemons.indexOf(json[i].Pokemon)].spawns.push(newSpawn);
        }
    }
    return spawns.map((spawn) => new PokemonSpawn(spawn.pokemon, spawn.pokedexID, spawn.spawns));
}





export default parseSpawnJson;