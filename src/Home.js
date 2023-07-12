import React, { useState } from 'react'
import pokedexJson from "./jsons/pokedex.json";
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    function showPokemonPage() {
        navigate("/" + document.getElementById("search").value);
    }

    function getPokemonNames() {
        let names = [];
        pokedexJson.forEach((pokemon) => {
            names.push(pokemon.name.english);
        });
        return names;
    }

    function searchPokemon() {
        let input = document.getElementById("search").value;
        let matches = [];
        pokemonNames.forEach((name) => {
            if (name.toLowerCase().startsWith(input.toLowerCase())) {
                matches.push(name);
            }
        });
        setSuggestedPokemonNames(matches);
    }

    function showSuggestedPokemons() {
        return suggestedPokemonNames.map((name) => (
            <div
                className='suggestion'
                onClick={() => {
                    document.getElementById("search").value = name;
                    setSuggestedPokemonNames([]);
                    showPokemonPage();
                }}
            >
                {name}
            </div>
        ))
    }

    const [pokemonNames, setPokemonNames] = useState(getPokemonNames());
    const [suggestedPokemonNames, setSuggestedPokemonNames] = useState([]);

    return (
        <div className='container'>
            <div className='container2'>
                <form onSubmit={(e) => {e.preventDefault()}}>
                    <input onKeyUp={searchPokemon} id="search" type="text" placeholder='Enter pokemon name' />
                    {suggestedPokemonNames.length === 0 || suggestedPokemonNames.length === pokemonNames.length ? 
                    <></> : showSuggestedPokemons()}
                </form>
            </div>
            {suggestedPokemonNames.length === 0 || suggestedPokemonNames.length === pokemonNames.length ? 
            <div style={{marginTop:'20px' }}><img alt="pikachu" width={"900px"} height={"600px"} src={process.env.PUBLIC_URL + '/pikachu.png'}/></div> : <></>}
        </div>
    );
}

export default Home