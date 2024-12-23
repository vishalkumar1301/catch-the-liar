'use client';

import { useState } from "react";
import { validateTweet } from "@/lib/validation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PersonNameSearch from '@/components/PersonNameSearch';

interface TweetFormData {
  tweetUrl: string;
  personName: string;
  twitterHandle?: string;
  datePosted?: Date;
  context?: string;
}

const initialFormData: TweetFormData = {
  tweetUrl: '',
  personName: '',
  twitterHandle: '',
  datePosted: undefined,
  context: ''
};

export default function TweetForm() {
  const [formData, setFormData] = useState<TweetFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'twitterHandle') {
      // Allow empty value or single @
      if (value === '' || value === '@') {
        setFormData(prev => ({
          ...prev,
          [name]: ''
        }));
        return;
      }

      // Handle Twitter handle with content
      let formattedValue = value;
      if (!value.startsWith('@')) {
        formattedValue = `@${value}`;
      }
      // Remove any additional @ symbols after the first one
      formattedValue = '@' + formattedValue.replace(/@/g, '');
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      // Handle other fields normally
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, datePosted: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      await validateTweet(formData);

      const response = await fetch('/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save tweet');
      }

      setFormData(initialFormData);
      alert('Tweet saved successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save tweet';
      setError(errorMessage);
      console.error('Error saving tweet:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Tweet Information</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tweetUrl">Tweet URL that exposes the liar *</Label>
            <Input
              id="tweetUrl"
              name="tweetUrl"
              value={formData.tweetUrl}
              onChange={handleChange}
              placeholder="https://twitter.com/... or https://x.com/..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personName">Who&apos;s Lying? (Person Name) *</Label>
            <PersonNameSearch
              value={formData.personName}
              onChange={(value) => setFormData(prev => ({ ...prev, personName: value }))}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitterHandle">Twitter Handler of the Lier (optional)</Label>
            <Input
              id="twitterHandle"
              name="twitterHandle"
              value={formData.twitterHandle}
              onChange={handleChange}
              placeholder="@johndoe"
            />
          </div>

          <div className="space-y-2">
            <Label>Date when they lied (optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.datePosted && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.datePosted ? format(formData.datePosted, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.datePosted}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Can you explain the lie here?</Label>
            <Textarea
              id="context"
              name="context"
              value={formData.context}
              onChange={handleChange}
              placeholder="Add any additional context..."
              className="min-h-[100px]"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Submit'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 