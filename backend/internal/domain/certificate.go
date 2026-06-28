package domain

import (
	"context"
	"time"
)

// Certificate merepresentasikan entitas sertifikat di database
type Certificate struct {
	ID           string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID       string    `gorm:"type:uuid;not null" json:"userId"`
	Name         string    `gorm:"type:varchar(255);not null" json:"name"`
	Organization string    `gorm:"type:varchar(255);not null" json:"organization"`
	IssueDate    time.Time `gorm:"type:date;not null" json:"issueDate"`
	ImageURL     string    `gorm:"type:varchar(512)" json:"imageUrl"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}

// CreateCertificateRequest DTO untuk penambahan sertifikat baru
type CreateCertificateRequest struct {
	Name         string `json:"name"`
	Organization string `json:"organization"`
	IssueDate    string `json:"issueDate"` // Format: YYYY-MM-DD
}

// UpdateCertificateRequest DTO untuk memperbarui data sertifikat
type UpdateCertificateRequest struct {
	Name         string `json:"name"`
	Organization string `json:"organization"`
	IssueDate    string `json:"issueDate"` // Format: YYYY-MM-DD
}

// CertificateRepository mengabstraksikan akses data ke tabel certificates
type CertificateRepository interface {
	Create(ctx context.Context, certificate *Certificate) error
	GetByID(ctx context.Context, id string) (*Certificate, error)
	GetAll(ctx context.Context) ([]Certificate, error)
	GetAllByUserID(ctx context.Context, userID string) ([]Certificate, error)
	Update(ctx context.Context, certificate *Certificate) error
	Delete(ctx context.Context, id string) error
}

// CertificateUsecase mengelola bisnis logika operasi CRUD sertifikat
type CertificateUsecase interface {
	CreateCertificate(ctx context.Context, userID string, req *CreateCertificateRequest) (*Certificate, error)
	GetCertificateByID(ctx context.Context, id string) (*Certificate, error)
	GetCertificatesByUserID(ctx context.Context, userID string) ([]Certificate, error)
	GetPublicCertificates(ctx context.Context) ([]Certificate, error)
	UpdateCertificate(ctx context.Context, id string, userID string, req *UpdateCertificateRequest) (*Certificate, error)
	UpdateCertificateImage(ctx context.Context, id string, userID string, imageURL string) (*Certificate, error)
	DeleteCertificate(ctx context.Context, id string, userID string) error
}
