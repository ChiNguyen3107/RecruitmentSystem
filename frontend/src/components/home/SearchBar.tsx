import { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (keyword: string, location: string) => void;
  defaultKeyword?: string;
  defaultLocation?: string;
  size?: 'default' | 'lg';
}

export function SearchBar({ 
  onSearch, 
  defaultKeyword = '', 
  defaultLocation = '',
  size = 'lg'
}: SearchBarProps) {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [location, setLocation] = useState(defaultLocation);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    if (!onSearch) return;
    
    const timer = setTimeout(() => {
      if (keyword || location) {
        onSearch(keyword, location);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, location, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    
    navigate(`/jobs?${params.toString()}`);
  };

  const inputClass = size === 'lg' 
    ? 'w-full pl-12 pr-4 py-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background'
    : 'w-full pl-10 pr-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm việc làm, kỹ năng, công ty..."
          className={inputClass}
        />
      </div>
      <div className="flex-1 relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Địa điểm..."
          className={inputClass}
        />
      </div>
      <Button type="submit" size={size === 'lg' ? 'lg' : 'default'} className="md:w-auto w-full">
        <Search className="w-4 h-4 mr-2 md:mr-0 md:hidden" />
        <span className="hidden md:inline">Tìm kiếm</span>
      </Button>
    </form>
  );
}

