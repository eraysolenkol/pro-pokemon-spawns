import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import landJson from "../jsons/land_spawns.json";
import surfJson from "../jsons/surf_spawns.json";
import parseSpawnJson from "../parseSpawnJson";

function Item(props) {
    const rarities = {
        "Abudant": 1,
        "Common": 2,
        "Uncommon": 3,
        "Meagre": 4,
        "Occasional": 5,
        "Scarce": 6,
        "Sparse": 7,
        "Rare": 8,
        "Extremely Rare": 9,
        "Limited": 10
    }

    function translateSpawnTimes(times) {
        let str = "";
        if (times[0] === 1) {
            str += "Morning, ";
        } if (times[1] === 1) {
            str += "Day, ";
        }
        if (times[2] === 1) {
            str += "Night";
        }
        if (str.endsWith(", ")) {
            str = str.slice(0, -2);
        }
        return str;
    }

    function getPokemons() {
        let combinedJson = landJson.concat(surfJson);
        let pokemons = parseSpawnJson(combinedJson);
        pokemons.sort((a, b) => a.pokedexID - b.pokedexID);
        return pokemons;
    }

    const params = useParams();
    const navigate = useNavigate();
    const [pokemons, setPokemons] = useState(getPokemons());
    const [sortedSpawns, setSortedSpawns] = useState({});
    const [spawns, setSpawns] = useState([]);
    useEffect(() => {
        let matches = [];
        pokemons.forEach((pokemon) => {
            for (let i = 0; i < pokemon.spawns.length; i++) {
                if (pokemon.spawns[i].item && pokemon.spawns[i].item.toLowerCase() === params.itemName.toLowerCase().replace("-"," ")) {
                    matches.push({ pokemon: pokemon.name, spawn: pokemon.spawns[i] });
                }
            }
        });
        setSpawns(matches);
    }, []);

    useEffect(() => {
        spawns?.sort((a, b) => rarities[a.spawn.tier] - rarities[b.spawn.tier]);
        console.log(spawns);
        setSortedSpawns(spawns);
    }, [spawns, rarities]);

    const renderItem = () => {
        if (spawns.length > 0) {
            return (
                <>
                    <input className='goBack' type='button' value='GO BACK' onClick={() => { navigate(-1) }} />
                    <div className='container'>
                        <p>{params.itemName.replace("-"," ").toUpperCase()}</p>
                        <img alt="item" width="200px" height="200px" srcSet={`https://img.pokemondb.net/sprites/items/${params.itemName.toLowerCase()}.png`} />
                        <div className='spawnsContainer'>
                            {sortedSpawns.map((spawn) => {
                                return (
                                    <div className={`spawn ${spawn.spawn.land ? "green" : "blue"}`}>
                                        <div className='row'>
                                            <p>{spawn.pokemon.toUpperCase()}</p>
                                            <p>Map: {spawn.spawn.map}</p>
                                            <p>Times: {translateSpawnTimes(spawn.spawn.times)}</p>
                                            <p>Rarity: {spawn.spawn.tier} ({rarities[spawn.spawn.tier]})</p>
                                        </div>
                                        <div className='row'>
                                            <p>Levels: {spawn.spawn.minLevel}-{spawn.spawn.maxLevel}</p>
                                            {!spawn.spawn.land ? spawn.spawn.fishing ? <p>Fishing: Yes</p> : <p>Fishing: No</p> : <></>}
                                            {!spawn.spawn.land ? spawn.spawn.fishingOnly ? <p>Surfing: No</p> : <p>Surfing: Yes</p> : <></>}
                                            {spawn.spawn.fishing ? <p>Required Rod: {spawn.spawn.requiredRod}</p> : <></>}
                                            {spawn.spawn.memberOnly ? <p style={{color:"#472c4c", fontWeight:"bold"}}>Membership Only</p> : <></>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <div>
                    <input className='goBack' type='button' value='GO BACK' onClick={() => { navigate(-1) }} />
                    <h1 style={{ textAlign: "center" }}>404: Item Not Found</h1>
                </div>
            );
        }
    };

    return (
        <>
            {renderItem()}
        </>
    )
}

export default Item