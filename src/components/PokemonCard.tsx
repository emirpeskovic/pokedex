import Link from 'next/link'
import PokemonImage from './PokemonImage'

const PokemonCard = ({
    id,
    name
}: {
    id: string,
    name: string
}) => {
    return <div className="flex flex-col rounded-md border p-2 text-center">
        <Link href={`/pokemon/${id}`}>
            <PokemonImage id={id} name={name} />
            {name}
        </Link>
    </div>
}

export default PokemonCard