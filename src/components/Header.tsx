'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { PlusCircle, List, Home } from "lucide-react"
import TweetSearch from '@/components/TweetSearch'

export default function Header() {
	return (
		<header className="bg-white dark:bg-gray-800 shadow">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						<Link href="/" className="flex-shrink-0">
							<Home className="h-8 w-8 text-blue-500" aria-hidden="true" />
							<span className="sr-only">Home</span>
						</Link>
						<h1 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">Catch the liars</h1>
					</div>
					<div className="flex items-center space-x-4">
						<div className="hidden md:block w-64">
							<TweetSearch />
						</div>
						<nav className="flex space-x-2">
							<Link href="/submit">
								<Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
									<PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
									Add a liar
								</Button>
							</Link>
							<Link href="/lies">
								<Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
									<List className="mr-2 h-4 w-4" aria-hidden="true" />
									All Lies
								</Button>
							</Link>
						</nav>
					</div>
				</div>
			</div>
		</header>
	)
} 