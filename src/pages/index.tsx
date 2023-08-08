import PokemonCard from '@/components/PokemonCard'
import firstLetterUpperCase from '@/util/firstLetterUpperCase'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

const Home = ({
  generations
}: {
  generations: number
}) => {
  // States
  const [loading, setLoading] = useState(true)
  const [currentGeneration, setCurrentGeneration] = useState(1)
  const [pokemons, setPokemons] = useState<any>()
  const [filteredPokemons, setFilteredPokemons] = useState<any>()

  // When the document is ready, we want to immediately load the generation data
  // we also want to update it every time our currentGeneration state changes
  useEffect(() => {
    getGeneration(currentGeneration)
  }, [currentGeneration])

  // Function to load the data of the specified generation
  const getGeneration = async (generation: number) => {
    // First we fetch the data
    const generationData = await fetch(`https://pokeapi.co/api/v2/generation/${generation}`)
      .then(res => res.json())

    // Then, because pokeapi does not return it in an ordered fashion,
    // we manually sort the entries, so we can display it in a nice ordered list
    const sortedPokemons = Object.entries(generationData["pokemon_species"]).map((entry: any) => {
      // Because of what is said above, we extract the actual id of the pokémon
      // from the URL, since that's fastest at this point
      // We also remove trailing slashes
      const id = (entry[1].url as string).replace("https://pokeapi.co/api/v2/pokemon-species/", "").replace("/", "")
      const name = entry[1].name
      return {
        id,
        name
      }
    })
      // Here we sort by id, but because javascript is very annoying to deal with when it comes to adding two unknowns as numbers together,
      // we need to prefix the variables with a '+' to let it know that it's numbers, and not strings
      .sort((prev, next) => +prev.id - +next.id)

    // Then we set the data to our state and loading is now false
    setPokemons(sortedPokemons)
    setLoading(false)
  }

  // Here we handle searching for current Pokémon
  const searchBarOnChange = (e: any) => {
    // We get the value from the search bvar
    const value = e.target.value

    // If it's empty, we set filteredPokemons to null, so it doesn't filter out all our Pokémon
    if (value === "") return setFilteredPokemons(null)

    // We find any Pokémon that includes all the characters in our value from the search bar
    const filtered = pokemons.filter((entry: any) => {
      return entry.name.toLowerCase().includes(value.toLowerCase())
    })

    // We then set our filteredPokemons state to the filter we produced above
    setFilteredPokemons(filtered)
  }

  return <main className={`flex items-center justify-center w-full ${inter.className}`}>
    {/* If it's loading, we want to show text saying that it's loading, otherwise show the content*/}
    {loading ? (
      <p>Loading pokédex...</p>
    ) : (
      <div className="flex flex-col w-5/6 my-16 gap-2">
        <div className="flex flex-row w-full gap-4">
          <input type="text" className="flex-grow border rounded-md p-2" onChange={searchBarOnChange} />
          <button className="border rounded-md p-2">Search</button>
        </div>
        <div className="flex flex-wrap flex-row gap-2">
          {filteredPokemons ? filteredPokemons.map((entry: any, index: number) => {
            const name = entry.name
            return <PokemonCard key={index} id={entry.id} name={firstLetterUpperCase(name)} />
          }) : pokemons.map((entry: any, index: number) => {
            const name = entry.name
            return <PokemonCard key={index} id={entry.id} name={firstLetterUpperCase(name)} />
          })}
        </div>
        <div className="flex">
          {(currentGeneration !== 1) && (
            <button className="rounded-md border bg-blue-400 p-4" onClick={() => setCurrentGeneration(currentGeneration - 1)}>
              Previous Generation
            </button>
          )}
          <div className="flex-grow"></div>
          {currentGeneration !== generations && (
            <button className="rounded-md border bg-blue-400 p-4" onClick={() => setCurrentGeneration(currentGeneration + 1)}>
              Next Generation
            </button>
          )}
        </div>
      </div>
    )}
  </main>
}

// We use getServerSideProps here to fetch the amount of generations that currently exist
// so we can limit how many times the user can press the "Next Generation" button
export async function getServerSideProps() {
  // First we fetch the data and get the json result
  const generationsData = await fetch(`https://pokeapi.co/api/v2/generation`)
    .then((res) => res.json())

  // Then we get the length of the entries in results
  const generations = Object.entries(generationsData.results).length

  // And we now return the data to our page
  return {
    props: {
      generations
    }
  }
}

export default Home