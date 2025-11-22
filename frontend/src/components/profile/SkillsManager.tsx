import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Code, MessageSquare, Languages, Wrench } from 'lucide-react';
import type { Skill, SkillLevel, SkillCategory } from '@/types/profile.types';

interface SkillsManagerProps {
    skills: Skill[];
    onAdd: (skill: Omit<Skill, 'id'>) => void;
    onRemove: (id: string) => void;
    isLoading?: boolean;
}

const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
];

const SKILL_CATEGORIES: { value: SkillCategory; label: string; icon: any }[] = [
    { value: 'technical', label: 'Technical', icon: Code },
    { value: 'soft', label: 'Soft Skills', icon: MessageSquare },
    { value: 'language', label: 'Languages', icon: Languages },
    { value: 'tool', label: 'Tools', icon: Wrench },
];

// Common skills suggestions
const SKILL_SUGGESTIONS: Record<SkillCategory, string[]> = {
    technical: ['React', 'TypeScript', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'MongoDB', 'AWS', 'Docker'],
    soft: ['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Time Management', 'Critical Thinking'],
    language: ['English', 'Vietnamese', 'Chinese', 'Japanese', 'Korean', 'French', 'German'],
    tool: ['Git', 'VS Code', 'Figma', 'Jira', 'Slack', 'Photoshop', 'Excel', 'Postman'],
};

export function SkillsManager({ skills, onAdd, onRemove, isLoading = false }: SkillsManagerProps) {
    const [skillName, setSkillName] = useState('');
    const [skillLevel, setSkillLevel] = useState<SkillLevel>('intermediate');
    const [skillCategory, setSkillCategory] = useState<SkillCategory>('technical');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredSuggestions = SKILL_SUGGESTIONS[skillCategory].filter(
        (suggestion) =>
            suggestion.toLowerCase().includes(skillName.toLowerCase()) &&
            !skills.some((s) => s.name.toLowerCase() === suggestion.toLowerCase())
    );

    const handleAddSkill = () => {
        if (!skillName.trim()) return;

        // Check if skill already exists
        if (skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
            alert('Kỹ năng này đã tồn tại');
            return;
        }

        onAdd({
            name: skillName.trim(),
            level: skillLevel,
            category: skillCategory,
        });

        setSkillName('');
        setShowSuggestions(false);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSkillName(suggestion);
        setShowSuggestions(false);
    };

    const getSkillsByCategory = (category: SkillCategory) => {
        return skills.filter((s) => s.category === category);
    };

    const getLevelColor = (level: SkillLevel): 'default' | 'secondary' | 'success' | 'warning' => {
        switch (level) {
            case 'beginner':
                return 'secondary';
            case 'intermediate':
                return 'default';
            case 'advanced':
                return 'success';
            case 'expert':
                return 'warning';
            default:
                return 'default';
        }
    };

    return (
        <div className="space-y-8">
            {/* Add Skill Form */}
            <div className="p-6 border rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
                <h3 className="font-semibold text-lg mb-4">Thêm kỹ năng mới</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Skill Name */}
                    <div className="md:col-span-2 space-y-2 relative">
                        <Label htmlFor="skillName">Tên kỹ năng</Label>
                        <Input
                            id="skillName"
                            value={skillName}
                            onChange={(e) => {
                                setSkillName(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Nhập tên kỹ năng..."
                            disabled={isLoading}
                        />
                        {/* Suggestions Dropdown */}
                        {showSuggestions && filteredSuggestions.length > 0 && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowSuggestions(false)}
                                />
                                <div className="absolute z-20 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {filteredSuggestions.map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            type="button"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="w-full px-4 py-2 text-left hover:bg-accent transition-colors text-sm"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Skill Level */}
                    <div className="space-y-2">
                        <Label htmlFor="skillLevel">Trình độ</Label>
                        <Select value={skillLevel} onValueChange={(value) => setSkillLevel(value as SkillLevel)}>
                            <SelectTrigger disabled={isLoading}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SKILL_LEVELS.map((level) => (
                                    <SelectItem key={level.value} value={level.value}>
                                        {level.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Skill Category */}
                    <div className="space-y-2">
                        <Label htmlFor="skillCategory">Danh mục</Label>
                        <Select value={skillCategory} onValueChange={(value) => setSkillCategory(value as SkillCategory)}>
                            <SelectTrigger disabled={isLoading}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SKILL_CATEGORIES.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={handleAddSkill}
                    disabled={!skillName.trim() || isLoading}
                    className="mt-4"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm kỹ năng
                </Button>
            </div>

            {/* Skills by Category */}
            <div className="space-y-6">
                {SKILL_CATEGORIES.map((category) => {
                    const categorySkills = getSkillsByCategory(category.value);
                    const Icon = category.icon;

                    if (categorySkills.length === 0) return null;

                    return (
                        <div key={category.value} className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Icon className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold text-lg">{category.label}</h3>
                                <span className="text-sm text-muted-foreground">({categorySkills.length})</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {categorySkills.map((skill) => (
                                    <Badge
                                        key={skill.id}
                                        variant={getLevelColor(skill.level)}
                                        size="lg"
                                        removable
                                        onRemove={() => onRemove(skill.id)}
                                        className="cursor-default"
                                    >
                                        <span className="font-medium">{skill.name}</span>
                                        <span className="text-xs opacity-75 ml-1">
                                            ({SKILL_LEVELS.find((l) => l.value === skill.level)?.label})
                                        </span>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {skills.length === 0 && (
                    <div className="text-center py-12 border rounded-lg bg-muted/30">
                        <Code className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Chưa có kỹ năng nào</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Thêm kỹ năng của bạn để tăng cơ hội tìm việc
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
