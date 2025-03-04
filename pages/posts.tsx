'use client'
import Image from 'next/image'
import React, { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOutsideClick } from '@/hooks/use-outside-click'
import Section from '@/components/section'
import useSWR from 'swr'
import { Post } from '@/types/Post'
import { useInView } from 'react-intersection-observer'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Posts() {
	const [active, setActive] = useState<Post | null>(null)

	const [offset, setOffset] = useState(1)

	const [posts, setPosts] = useState<Post[]>([])

	const { data, error, isLoading } = useSWR<Post[]>(
		`https://hanamyanmar.com/wp-json/wp/v2/posts?per_page=10&page=${offset}&orderby=date&order=desc`,
		fetcher,
	)
	const id = useId()
	const ref = useRef<HTMLDivElement>(null)
	const { ref: inViewRef, inView } = useInView()

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setActive(null)
			}
		}

		if (active && typeof active === 'object') {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'auto'
		}

		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [active])

	useEffect(() => {
		if (data && data.length > 0) {
			if (!posts) setPosts(data)
			else if (posts.filter((p) => p.id == data[0].id).length == 0)
				setPosts([...posts, ...data])
		}
	}, [data])

	useEffect(() => {
		if (inView) {
			setOffset((offset) => offset + 1)
		}
	}, [inView])

	useOutsideClick(ref, () => setActive(null))

	if (error) return <p>Error: {error.message}</p>

	return (
		<Section>
			<AnimatePresence>
				{active && typeof active === 'object' && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 bg-black/20 h-full w-full z-10'
					/>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{active && typeof active === 'object' ? (
					<div className='fixed inset-0  grid place-items-center z-[100]'>
						<motion.button
							key={`button-${active.yoast_head_json.og_title}-${id}`}
							layout
							initial={{
								opacity: 0,
							}}
							animate={{
								opacity: 1,
							}}
							exit={{
								opacity: 0,
								transition: {
									duration: 0.05,
								},
							}}
							className='flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6'
							onClick={() => setActive(null)}
						>
							<CloseIcon />
						</motion.button>
						<motion.div
							layoutId={`card-${active.yoast_head_json.og_title}-${id}`}
							ref={ref}
							className='w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden'
						>
							<motion.div
								layoutId={`image-${active.yoast_head_json.og_title}-${id}`}
							>
								<Image
									priority
									width={active.yoast_head_json.og_image[0].width}
									height={active.yoast_head_json.og_image[0].height}
									src={active.yoast_head_json.og_image[0].url}
									alt={active.yoast_head_json.og_title}
									className='w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top'
								/>
							</motion.div>

							<div>
								<div className='flex justify-between items-start p-4'>
									<div className=''>
										<motion.h3
											layoutId={`title-${active.yoast_head_json.og_title}-${id}`}
											className='font-medium text-neutral-700 dark:text-neutral-200 text-base'
										>
											{active.yoast_head_json.og_title}
										</motion.h3>
										<motion.p
											layoutId={`description-${active.yoast_head_json.og_description}-${id}`}
											className='text-neutral-600 dark:text-neutral-400 text-base'
										>
											{active.yoast_head_json.og_description}
										</motion.p>
									</div>

									{/* <motion.a
										layout
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										href={active.yoast_head_json.og_title}
										target='_blank'
										className='px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white'
									>
										Active
									</motion.a> */}
								</div>
								{/* <div className='pt-4 relative px-4'>
									<motion.div
										layout
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className='text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]'
									>
										{active.yoast_head_json.og_description}
									</motion.div>
								</div> */}
							</div>
						</motion.div>
					</div>
				) : null}
			</AnimatePresence>
			<ul className='max-w-2xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-start gap-4'>
				{posts &&
					posts.map((post) => (
						<motion.div
							layoutId={`card-${post.yoast_head_json.og_title}-${id}`}
							key={post.id}
							onClick={() => setActive(post)}
							className='p-4 flex flex-col  hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer'
						>
							<div className='flex gap-4 flex-col  w-full'>
								<motion.div
									layoutId={`image-${post.yoast_head_json.og_title}-${id}`}
								>
									<Image
										width={post.yoast_head_json.og_image[0].width}
										height={post.yoast_head_json.og_image[0].height}
										src={post.yoast_head_json.og_image[0].url}
										alt={post.yoast_head_json.og_title}
										className='h-60 w-full  rounded-lg object-cover object-top'
									/>
								</motion.div>
								<div className='flex justify-center items-center flex-col'>
									<motion.h3
										layoutId={`title-${post.yoast_head_json.og_title}-${id}`}
										className='font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base'
									>
										{post.yoast_head_json.og_title}
									</motion.h3>
									<motion.p
										layoutId={`description-${post.yoast_head_json.og_description}-${id}`}
										className='text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base line-clamp-4'
									>
										{post.yoast_head_json.og_description}
									</motion.p>
								</div>
							</div>
						</motion.div>
					))}
			</ul>

			<div className='w-full text-center mt-8' ref={inViewRef}>
				Loading...
			</div>
		</Section>
	)
}

export const CloseIcon = () => {
	return (
		<motion.svg
			initial={{
				opacity: 0,
			}}
			animate={{
				opacity: 1,
			}}
			exit={{
				opacity: 0,
				transition: {
					duration: 0.05,
				},
			}}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className='h-4 w-4 text-black'
		>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M18 6l-12 12' />
			<path d='M6 6l12 12' />
		</motion.svg>
	)
}
