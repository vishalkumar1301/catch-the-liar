import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Link, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ITweet } from '@/models/Tweet';

interface LierTweetProps {
	tweet: ITweet;
}

export default function LierTweet({ tweet }: LierTweetProps) {
	const normalizeTweetUrl = (url: string) => {
		return url.replace('x.com', 'twitter.com');
	};

	return (
		<Card className="w-full max-w-xl transform transition-all duration-300 hover:shadow-lg">
			<CardHeader className="border-b bg-gray-50/50">
				<div className="flex justify-between items-start">
					<div className="space-y-1">
						<CardTitle className="text-xl font-bold">
							{tweet.personName}
						</CardTitle>
						{tweet.twitterHandle && (
							<div className="flex items-center gap-2">
								<Badge variant="secondary" className="text-blue-600">
									@{tweet.twitterHandle}
								</Badge>
							</div>
						)}
					</div>
					{tweet.datePosted && (
						<div className="flex items-center gap-2 text-gray-500">
							<Calendar className="h-4 w-4" />
							<span className="text-sm">
								{format(new Date(tweet.datePosted), 'PPP')}
							</span>
						</div>
					)}
				</div>
			</CardHeader>

			<CardContent className="space-y-6 pt-6">
				<div
					dangerouslySetInnerHTML={{
						__html: `
							<blockquote class="twitter-tweet" data-dnt="true">
								<a href="${normalizeTweetUrl(tweet.tweetUrl)}"></a>
							</blockquote>
						`
					}}
				/>

				{tweet.context && (
					<div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
						<h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
							<MessageCircle className="h-4 w-4" />
							Context
						</h3>
						<p className="text-sm text-blue-900">{tweet.context}</p>
					</div>
				)}

				<div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
					<div className="flex items-center gap-2">
						<Link className="h-3 w-3" />
						<a
							href={tweet.tweetUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-blue-600 transition-colors"
						>
							View original tweet
						</a>
					</div>
					<span>
						Added: {format(new Date(tweet.createdAt), 'PPP')}
					</span>
				</div>
			</CardContent>
		</Card>
	);
} 