import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema, type PersonalInfoFormData } from '@/lib/validations/profileSchemas';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, MapPin, Calendar, Link as LinkIcon, Github, Linkedin, Camera, AlertCircle } from 'lucide-react';
import type { PersonalInfo } from '@/types/profile.types';

interface PersonalInfoFormProps {
    initialData?: PersonalInfo;
    onSave: (data: PersonalInfoFormData & { avatarFile?: File }) => Promise<void>;
    isLoading?: boolean;
}

export function PersonalInfoForm({ initialData, onSave, isLoading = false }: PersonalInfoFormProps) {
    const [avatarPreview, setAvatarPreview] = useState<string | undefined>(initialData?.avatarUrl);
    const [avatarFile, setAvatarFile] = useState<File | undefined>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        setValue,
        watch,
        reset,
    } = useForm<PersonalInfoFormData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            firstName: initialData?.firstName || '',
            lastName: initialData?.lastName || '',
            email: initialData?.email || '',
            phone: initialData?.phone || '',
            address: initialData?.address || '',
            dateOfBirth: initialData?.dateOfBirth || '',
            gender: initialData?.gender || 'male',
            bio: initialData?.bio || '',
            linkedIn: initialData?.linkedIn || '',
            github: initialData?.github || '',
            portfolio: initialData?.portfolio || '',
        },
    });

    const gender = watch('gender');

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type and size
            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn file ảnh');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Kích thước ảnh tối đa 5MB');
                return;
            }

            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: PersonalInfoFormData) => {
        await onSave({ ...data, avatarFile });
    };

    const handleCancel = () => {
        reset();
        setAvatarPreview(initialData?.avatarUrl);
        setAvatarFile(undefined);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                <User className="w-16 h-16 text-white" />
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all transform hover:scale-110"
                    >
                        <Camera className="w-5 h-5" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium">Ảnh đại diện</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG tối đa 5MB</p>
                </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                    <Label htmlFor="firstName">
                        Họ <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="firstName"
                        {...register('firstName')}
                        leftIcon={<User className="w-4 h-4" />}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                        disabled={isLoading}
                    />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                    <Label htmlFor="lastName">
                        Tên <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="lastName"
                        {...register('lastName')}
                        leftIcon={<User className="w-4 h-4" />}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                        disabled={isLoading}
                    />
                </div>

                {/* Email (readonly) */}
                <div className="space-y-2">
                    <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        leftIcon={<Mail className="w-4 h-4" />}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        disabled
                        className="bg-muted cursor-not-allowed"
                    />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <Label htmlFor="phone">
                        Số điện thoại <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="phone"
                        {...register('phone')}
                        leftIcon={<Phone className="w-4 h-4" />}
                        placeholder="0912345678"
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        disabled={isLoading}
                    />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">
                        Ngày sinh <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="dateOfBirth"
                        type="date"
                        {...register('dateOfBirth')}
                        leftIcon={<Calendar className="w-4 h-4" />}
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth?.message}
                        disabled={isLoading}
                    />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                    <Label htmlFor="gender">
                        Giới tính <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={gender}
                        onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'other', { shouldDirty: true })}
                    >
                        <SelectTrigger className={errors.gender ? 'border-destructive' : ''} disabled={isLoading}>
                            <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Nam</SelectItem>
                            <SelectItem value="female">Nữ</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.gender && (
                        <p className="text-destructive text-xs flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.gender.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
                <Label htmlFor="address">
                    Địa chỉ <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="address"
                    {...register('address')}
                    leftIcon={<MapPin className="w-4 h-4" />}
                    placeholder="123 Đường ABC, Quận 1, TP.HCM"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    disabled={isLoading}
                />
            </div>

            {/* Bio */}
            <div className="space-y-2">
                <Label htmlFor="bio">Giới thiệu bản thân</Label>
                <Textarea
                    id="bio"
                    {...register('bio')}
                    placeholder="Giới thiệu ngắn gọn về bản thân, kinh nghiệm và mục tiêu nghề nghiệp..."
                    maxLength={500}
                    showCharCount
                    error={!!errors.bio}
                    helperText={errors.bio?.message}
                    disabled={isLoading}
                    rows={4}
                />
            </div>

            {/* Social Links */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Liên kết mạng xã hội</h3>
                <div className="grid grid-cols-1 gap-4">
                    {/* LinkedIn */}
                    <div className="space-y-2">
                        <Label htmlFor="linkedIn">LinkedIn</Label>
                        <Input
                            id="linkedIn"
                            {...register('linkedIn')}
                            leftIcon={<Linkedin className="w-4 h-4" />}
                            placeholder="https://linkedin.com/in/yourprofile"
                            error={!!errors.linkedIn}
                            helperText={errors.linkedIn?.message}
                            disabled={isLoading}
                        />
                    </div>

                    {/* GitHub */}
                    <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <Input
                            id="github"
                            {...register('github')}
                            leftIcon={<Github className="w-4 h-4" />}
                            placeholder="https://github.com/yourusername"
                            error={!!errors.github}
                            helperText={errors.github?.message}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Portfolio */}
                    <div className="space-y-2">
                        <Label htmlFor="portfolio">Portfolio</Label>
                        <Input
                            id="portfolio"
                            {...register('portfolio')}
                            leftIcon={<LinkIcon className="w-4 h-4" />}
                            placeholder="https://yourportfolio.com"
                            error={!!errors.portfolio}
                            helperText={errors.portfolio?.message}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t">
                <Button
                    type="submit"
                    disabled={isLoading || !isDirty}
                    className="min-w-32"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Đang lưu...</span>
                        </div>
                    ) : (
                        'Lưu thay đổi'
                    )}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading || !isDirty}
                >
                    Hủy
                </Button>
            </div>
        </form>
    );
}
