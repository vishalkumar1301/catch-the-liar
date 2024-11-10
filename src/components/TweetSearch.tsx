import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonNameSearch from '@/components/PersonNameSearch';

export default function TweetSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSelect = (value: string) => {
    setSearchTerm(value);
    router.push(`/person/${encodeURIComponent(value)}`);
  };

  return (
    <PersonNameSearch
      value={searchTerm}
      onChange={handleChange}
      onSelect={handleSelect}
      placeholder="Search by person name..."
      className="w-full"
    />
  );
}