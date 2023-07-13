import React, { useState, useEffect } from 'react'
import pokedexJson from "../jsons/pokedex.json";
import { useNavigate } from 'react-router-dom';
import landJson from "../jsons/land_spawns.json";
import surfJson from "../jsons/surf_spawns.json";
import parseSpawnJson from "../parseSpawnJson";

function Home() {
    const navigate = useNavigate();

    function showPokemonPage() {
        navigate("/" + document.getElementById("search").value);
    }

    function showItemPage() {
        navigate("/item/" + document.getElementById("search").value);
    }

    function showMapPage() {
        navigate("/map/" + document.getElementById("search").value.replace(" ", "-"));
    }

    function getPokemonNames() {
        let names = [];
        pokedexJson.forEach((pokemon) => {
            names.push(pokemon.name.english);
        });
        return names;
    }

    function searchMaps() {
        let input = document.getElementById("search").value;
        let matches = new Set();
        pokemons.forEach((pokemon) => {
            for (let i = 0; i < pokemon.spawns.length; i++) {
                if (pokemon.spawns[i].map && pokemon.spawns[i].map.toLowerCase().includes(input.toLowerCase())) {
                    matches.add(pokemon.spawns[i].map);
                }
            }
        });
        setSuggestedMapNames(matches);
        console.log(matches);
    }

    function searchItems() {
        let input = document.getElementById("search").value;
        let matches = new Set();
        pokemons.forEach((pokemon) => {
            for (let i = 0; i < pokemon.spawns.length; i++) {
                if (pokemon.spawns[i].item && pokemon.spawns[i].item.toLowerCase().includes(input.toLowerCase())) {
                    matches.add(pokemon.spawns[i].item);
                }
            }
        });
        setSuggestedItemNames(matches);
        console.log(matches);
    }

    function searchPokemon() {
        let input = document.getElementById("search").value;
        let matches = [];
        pokemonNames.forEach((name) => {
            if (name.toLowerCase().includes(input.toLowerCase())) {
                matches.push(name);
            }
        });
        setSuggestedPokemonNames(matches);
    }

    function showSuggestedItems() {
        return Array.from(suggestedItemNames).map((item) => (
            <div
                className='suggestion'
                onClick={() => {
                    document.getElementById("search").value = item.replace(" ", "-");
                    setSuggestedItemNames([]);
                    showItemPage();
                }}
            >
                {item}
            </div>
        ))
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

    function showSuggestedMaps() {
        return Array.from(suggestedMapNames).map((map) => (
            <div
                className='suggestion'
                onClick={() => {
                    document.getElementById("search").value = map;
                    setSuggestedMapNames([]);
                    showMapPage();
                }}
            >
                {map}
            </div>
        ))
    }


    function selectFunction() {
        if (searchFor === "pokemon") {
            return searchPokemon();
        } else if (searchFor === "item") {
            return searchItems();
        } else if (searchFor === "map") {
            return searchMaps();
        }
    }

    function selectFunction2() {
        if (searchFor === "pokemon") {
            return showSuggestedPokemons();
        }
        else if (searchFor === "item") {
            return showSuggestedItems();
        } else if (searchFor === "map") {
            return showSuggestedMaps();
        }
    }

    function selectReturnItems() {
        if (searchFor === "pokemon") {
            return suggestedPokemonNames;
        }
        else if (searchFor === "item") {
            return suggestedItemNames;
        } else if (searchFor === "map") {
            return suggestedMapNames;
        }
    }

    function returnTotal() {
        if (searchFor === "pokemon") {
            return pokemonNames.length;
        }
        else if (searchFor === "item") {
            let matches = new Set();
            pokemons.forEach((pokemon) => {
                for (let i = 0; i < pokemon.spawns.length; i++) {
                    if (pokemon.spawns[i].item) {
                        matches.add(pokemon.spawns[i].item);
                    }
                }
            });
            return matches.size;
        } else if (searchFor === "map") {
            let matches = new Set();
            pokemons.forEach((pokemon) => {
                for (let i = 0; i < pokemon.spawns.length; i++) {
                    if (pokemon.spawns[i].map) {
                        matches.add(pokemon.spawns[i].map);
                    }
                }
            });
            return matches.size;
        }
    }
 

    function handleSelectChange(event) {
        document.getElementById("search").placeholder = "Enter " + event.target.value + " name";
        setImage(event.target.value + ".png")
        if (event.target.value === "pokemon") {
            setImageStyle({width: "900px", height: "600px"});
        } else if (event.target.value === "item") {
            setImageStyle({width: "600px", height: "600px"});
        } else if (event.target.value === "map") {
            setImageStyle({width: "900px", height: "600px"});
        }
        setSearchFor(event.target.value);
    }

    const [searchFor, setSearchFor] = useState("pokemon");
    const [pokemonNames, setPokemonNames] = useState(getPokemonNames());
    const [suggestedPokemonNames, setSuggestedPokemonNames] = useState([]);
    const [suggestedMapNames, setSuggestedMapNames] = useState([]); 
    const [suggestedItemNames, setSuggestedItemNames] = useState([]);
    const [pokemons, setPokemons] = useState([]);
    const [image, setImage] = useState("pokemon.png");
    const [imageStyle, setImageStyle] = useState({width: "900px", height: "600px"});

    useEffect(() => {
        let combinedJson = landJson.concat(surfJson);
        let pokemons = parseSpawnJson(combinedJson);
        pokemons.sort((a, b) => a.pokedexID - b.pokedexID);
        setPokemons(pokemons);
    }, []);

    return (
        <div className='container'>
            <div className='container2'>
                <form onSubmit={(e) => {e.preventDefault()}}>
                    <div className='column'>
                        <input onKeyUp={selectFunction} id="search" type="text" placeholder='Enter pokemon name' />
                        <select onChange={handleSelectChange}>
                            <option value="pokemon">Pokemon</option>
                            <option value="item">Item</option>
                            <option value="map">Map</option>
                        </select>
                    </div>
                    {console.log(returnTotal())}
                    {selectReturnItems.length !== 0 || returnTotal() === selectReturnItems.length ? 
                    <></> : selectFunction2()}
                </form>
            </div>
            {selectReturnItems.length === 0 || returnTotal() === selectReturnItems.length ? 
            <div style={{marginTop:'20px' }}><img alt="img" style={imageStyle} src={process.env.PUBLIC_URL + '/' + image}/></div> : <></>}
        </div>
    );
}

export default Home