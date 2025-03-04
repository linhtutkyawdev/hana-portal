//actions/getUsers.ts

'use server'

export const getPosts = async (offset: number, limit: number) => {
	try {
		const url = `https://hanamyanmar.com/wp-json/wp/v2/posts?categories=21&per_page=${limit}&page=${offset}&orderby=date&order=desc`
		const response = await fetch(url)
		const { data } = (await response.json()) as { data: Object[] }
		return data
	} catch (error: unknown) {
		console.log(error)
		throw new Error(`An error happened: ${error}`)
	}
}
