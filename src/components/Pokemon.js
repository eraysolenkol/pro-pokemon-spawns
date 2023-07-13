import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import landJson from "../jsons/land_spawns.json";
import surfJson from "../jsons/surf_spawns.json";
import pokedexJson from "../jsons/pokedex.json";
import parseSpawnJson from "../parseSpawnJson";
import '../styles/Pokemon.css'

function Pokemon(props) {
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

    function getPokemonNameByID(id) {
        return pokedexJson.find((pokemon) => pokemon.id === id).name.english;
    }

    function getIDByPokemonName(name) {
        return pokedexJson.find((pokemon) => pokemon.name.english.toLowerCase() === name.toLowerCase()).id;
    }

    function isNameInPokedex(name) {
        return pokedexJson.find((pokemon) => pokemon.name.english.toLowerCase() === name.toLowerCase());
    }

    function isIDInPokedex(id) {
        return pokedexJson.find((pokemon) => pokemon.id === id);
    }

    const params = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState({});
    const [isID, setIsID] = useState(false);
    const [sortedSpawns, setSortedSpawns] = useState({});
    
    useEffect(() => {
        let combinedJson = landJson.concat(surfJson);
        let pokemons = parseSpawnJson(combinedJson);
        pokemons.sort((a, b) => a.pokedexID - b.pokedexID);
        if (!isNaN(params.pokemonName)) {
            setIsID(true);
        }
        setPokemon(pokemons.find((pokemon) => pokemon.name.toLowerCase() === params.pokemonName.toLowerCase() || parseInt(pokemon.pokedexID) === parseInt(params.pokemonName)));
    }, []);

    useEffect(() => {
        pokemon?.spawns?.sort((a, b) => rarities[a.tier] - rarities[b.tier]);
        setSortedSpawns(pokemon);
    }, [pokemon, rarities]);


    const renderPokemon = () => {
        if (pokemon) {
            return (
                <>
                    <input className='goBack' type='button' value='GO BACK' onClick={() => { navigate(-1) }} />
                    <div className='container'>
                        <p>{sortedSpawns?.name?.toUpperCase()}</p>
                        <img alt='img' height={'275px'} width={'275px'} srcSet={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.pokedexID}.png`} />
                        <p style={{ fontSize: "22px" }}>ID: {sortedSpawns.pokedexID}</p>
                        <div className='spawnsContainer'>
                            {sortedSpawns?.spawns?.map((spawn) => {
                                return (
                                    <div className={`spawn ${spawn.land ? "green" : "blue"}`}>
                                        <div className='row'>
                                            <p>{spawn.map}</p>
                                            <p>Spawn Times: {translateSpawnTimes(spawn.times)}</p>
                                            <p>Rarity: {spawn.tier} ({rarities[spawn.tier]})</p>
                                            {spawn.item ? <p>Item: {spawn.item}</p> : <></>}
                                            {spawn.memberOnly ? <p style={{color:"#472c4c", fontWeight:"bold"}}>Membership Only</p> : <></>}
                                        </div>
                                        <div className='row'>
                                            <p>Levels: {spawn.minLevel}-{spawn.maxLevel}</p>
                                            {!spawn.land ? spawn.fishing ? <p>Fishing: Yes</p> : <p>Fishing: No</p> : <></>}
                                            {!spawn.land ? spawn.fishingOnly ? <p>Surfing: No</p> : <p>Surfing: Yes</p> : <></>}
                                            {spawn.fishing ? <p>Required Rod: {spawn.requiredRod}</p> : <></>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>
            );
        } else if (isNameInPokedex(params.pokemonName) || isIDInPokedex(parseInt(params.pokemonName))) {
            return (
                <>
                    <input className='goBack' type='button' value='GO BACK' onClick={() => { navigate(-1) }} />
                    <div className='container'>
                        <p>{isID ? getPokemonNameByID(parseInt(params.pokemonName)).toUpperCase() : params.pokemonName.toUpperCase()}</p>
                        <img alt='img' height={'275px'} width={'275px'} srcSet={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${isID ? params.pokemonName : getIDByPokemonName(params.pokemonName)}.png`} />
                        <p style={{ fontSize: "22px" }}>ID: {isID ? params.pokemonName : getIDByPokemonName(params.pokemonName)}</p>
                        <h1>NO SPAWNS FOUND</h1>
                    </div>
                </>
            )
        } else {
            return (
                <div>
                    <input className='goBack' type='button' value='GO BACK' onClick={() => { navigate(-1) }} />
                    <h1 style={{ textAlign: "center" }}>404: Pokemon Not Found</h1>
                </div>
            );
        }
    };

    return (
        <>
            {renderPokemon()}
        </>
    )
}

export default Pokemon