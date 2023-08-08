import PokemonImage from "@/components/PokemonImage"
import firstLetterUpperCase from "@/util/firstLetterUpperCase"
import { GetServerSidePropsContext } from "next"

const Pokemon = ({
    data
}: {
    data: any
}) => {
    // The amount of types the Pokémon has
    const types = Object.entries(data.types).length

    return <div className="flex flex-col flex-wrap items-center justify-center w-full my-20">
        <PokemonImage id={data.id} name={data.name} />
        {firstLetterUpperCase(data.name)}
        <div className="flex flex-row rounded-md border w-3/6 p-8">
            <p>
                Height: {data.height / 10}m
                <br />
                Weight: {data.weight / 10}kg
                <br />
                Types: {Object.entries(data.types).map((entry: any, index: number) => {
                    return firstLetterUpperCase(entry[1].type.name) + (index + 1 === types ? "" : ", ")
                })}
            </p>
        </div>
    </div>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    // We get the id from the parameter query
    const { id } = context.query

    // We try to fetch the data from pokeapi
    // if it fails, we return null
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
        .catch((_) => null)

    // We make sure to not display the page if it's null
    // since that would mean the Pokémon doesn't exist
    if (!data) {
        return {
            notFound: true
        }
    }

    // If all is well, we return the page with the data we fetched
    return {
        props: {
            data
        }
    }
}

export default Pokemon