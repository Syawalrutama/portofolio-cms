package domain

import (
	"context"
	"time"
)

// SocialLinks mendefinisikan tautan media sosial dan kontak pemilik
type SocialLinks struct {
	Email    string `json:"email"`
	WhatsApp string `json:"whatsapp"`
	LinkedIn string `json:"linkedin"`
	GitHub   string `json:"github"`
}

// Profile merepresentasikan entitas biodata lengkap di database
type Profile struct {
	ID          string      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID      string      `gorm:"type:uuid;unique;not null" json:"userId"`
	FullName    string      `gorm:"type:varchar(150);not null" json:"fullName"`
	Title       string      `gorm:"type:varchar(150);not null" json:"title"`
	Bio         string      `gorm:"type:text;not null" json:"bio"`
	AvatarURL   string      `gorm:"type:varchar(512)" json:"avatarUrl"`
	ResumeURL   string      `gorm:"type:varchar(512)" json:"resumeUrl"`
	SocialLinks SocialLinks `gorm:"serializer:json" json:"socialLinks"`
	TechStack   string      `gorm:"type:text;not null;default:'React.js, Go / Golang, Tailwind CSS, PostgreSQL, Vite, Docker'" json:"techStack"`
	UpdatedAt   time.Time   `gorm:"autoUpdateTime" json:"updatedAt"`
}

// UpdateProfileRequest DTO untuk memperbarui rincian profil
type UpdateProfileRequest struct {
	FullName    string      `json:"full_name"`
	Title       string      `json:"title"`
	Bio         string      `json:"bio"`
	SocialLinks SocialLinks `json:"social_links"`
	TechStack   string      `json:"tech_stack"`
}

// ProfileRepository mengabstraksikan akses data ke tabel profiles
type ProfileRepository interface {
	GetByUserID(ctx context.Context, userID string) (*Profile, error)
	GetFirst(ctx context.Context) (*Profile, error)
	Update(ctx context.Context, profile *Profile) error
	Create(ctx context.Context, profile *Profile) error
}

// ProfileUsecase mengelola manipulasi data bisnis profil
type ProfileUsecase interface {
	GetProfileByUserID(ctx context.Context, userID string) (*Profile, error)
	GetPublicProfile(ctx context.Context) (*Profile, error)
	UpdateProfile(ctx context.Context, userID string, req *UpdateProfileRequest) (*Profile, error)
	UpdateAvatar(ctx context.Context, userID string, avatarURL string) (*Profile, error)
}
