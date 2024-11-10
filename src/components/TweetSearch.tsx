import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";

export default function TweetSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(`/api/tweets/search?term=${encodeURIComponent(term)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error: any) {
      setError(error.message);
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setSearchTerm(name);
    setShowSuggestions(false);
    router.push(`/person/${encodeURIComponent(name)}`);
  };

  return (
    <div className="w-full max-w-xl relative" ref={wrapperRef}>
      <Input
        type="search"
        placeholder="Search by person name..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full"
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
          <ul className="py-1">
            {suggestions.map((name) => (
              <li
                key={name}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(name)}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {isSearching && <p className="text-sm text-gray-500 mt-2">Searching...</p>}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
} 