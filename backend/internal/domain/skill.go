package domain

import (
	"context"
	"time"
)

// Skill merepresentasikan entitas kemampuan teknis di database
type Skill struct {
	ID         string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID     string    `gorm:"type:uuid;not null" json:"userId"`
	Name       string    `gorm:"type:varchar(100);not null" json:"name"`
	Percentage int       `gorm:"type:integer;not null" json:"percentage"`
	Category   string    `gorm:"type:varchar(50);not null;default:'Frontend'" json:"category"`
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"createdAt"`
}

// CreateSkillRequest DTO untuk menambahkan skill baru
type CreateSkillRequest struct {
	Name       string `json:"name"`
	Percentage int    `json:"percentage"`
	Category   string `json:"category"`
}

// UpdateSkillRequest DTO untuk mengubah data skill
type UpdateSkillRequest struct {
	Name       string `json:"name"`
	Percentage int    `json:"percentage"`
	Category   string `json:"category"`
}

// SkillRepository mengabstraksikan akses data ke tabel skills
type SkillRepository interface {
	Create(ctx context.Context, skill *Skill) error
	GetByID(ctx context.Context, id string) (*Skill, error)
	GetAll(ctx context.Context) ([]Skill, error)
	GetAllByUserID(ctx context.Context, userID string) ([]Skill, error)
	Update(ctx context.Context, skill *Skill) error
	Delete(ctx context.Context, id string) error
}

// SkillUsecase mengelola bisnis logika operasi CRUD skill
type SkillUsecase interface {
	CreateSkill(ctx context.Context, userID string, req *CreateSkillRequest) (*Skill, error)
	GetSkillByID(ctx context.Context, id string) (*Skill, error)
	GetSkillsByUserID(ctx context.Context, userID string) ([]Skill, error)
	GetPublicSkills(ctx context.Context) ([]Skill, error)
	UpdateSkill(ctx context.Context, id string, userID string, req *UpdateSkillRequest) (*Skill, error)
	DeleteSkill(ctx context.Context, id string, userID string) error
}
