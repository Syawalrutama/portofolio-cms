package domain

import (
	"context"
	"time"
)

// Project merepresentasikan entitas portofolio proyek di database
type Project struct {
	ID          string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID      string    `gorm:"type:uuid;not null" json:"userId"`
	Title       string    `gorm:"type:varchar(255);not null" json:"title"`
	Description string    `gorm:"type:text;not null" json:"description"`
	ImageURL    string    `gorm:"type:varchar(512)" json:"imageUrl"`
	GithubURL   string    `gorm:"type:varchar(512)" json:"githubUrl"`
	DemoURL     string    `gorm:"type:varchar(512)" json:"demoUrl"`
	Category    string    `gorm:"type:varchar(100);not null" json:"category"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}

// CreateProjectRequest DTO untuk menambah proyek baru
type CreateProjectRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	GithubURL   string `json:"githubUrl"`
	DemoURL     string `json:"demoUrl"`
	Category    string `json:"category"`
}

// UpdateProjectRequest DTO untuk memperbarui data proyek
type UpdateProjectRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	GithubURL   string `json:"githubUrl"`
	DemoURL     string `json:"demoUrl"`
	Category    string `json:"category"`
}

// ProjectRepository mengabstraksikan akses data ke tabel projects
type ProjectRepository interface {
	Create(ctx context.Context, project *Project) error
	GetByID(ctx context.Context, id string) (*Project, error)
	GetAll(ctx context.Context) ([]Project, error)
	GetAllByUserID(ctx context.Context, userID string) ([]Project, error)
	Update(ctx context.Context, project *Project) error
	Delete(ctx context.Context, id string) error
}

// ProjectUsecase mengelola bisnis logika operasi CRUD proyek
type ProjectUsecase interface {
	CreateProject(ctx context.Context, userID string, req *CreateProjectRequest) (*Project, error)
	GetProjectByID(ctx context.Context, id string) (*Project, error)
	GetProjectsByUserID(ctx context.Context, userID string) ([]Project, error)
	GetPublicProjects(ctx context.Context) ([]Project, error)
	UpdateProject(ctx context.Context, id string, userID string, req *UpdateProjectRequest) (*Project, error)
	UpdateProjectImage(ctx context.Context, id string, userID string, imageURL string) (*Project, error)
	DeleteProject(ctx context.Context, id string, userID string) error
}
