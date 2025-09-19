import type {PageLoad} from "./$types"

export const load: PageLoad = ({params}) => {
    return {
        session: params.session
    }
}

