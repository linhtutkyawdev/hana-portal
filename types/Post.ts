export type Post = {
	id: number
	yoast_head_json: {
		og_title: string
		og_description: string
		og_image: {
			width: number
			height: number
			url: string
			type: string
		}[]
		author: string
	}
}
