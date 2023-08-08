import Image from 'next/image'

const PokemonImage = ({
    id,
    name = null
}: {
    id: string,
    name?: string | null
}) => {
    return <Image
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
        alt={name ?? id}
        width={96}
        height={96}
    />
}

export default PokemonImage