package domain

import (
	"context"
	"time"
)

// Contact merepresentasikan entitas pesan masuk dari visitor di database
type Contact struct {
	ID        string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID    string    `gorm:"type:uuid;not null" json:"userId"`
	Name      string    `gorm:"type:varchar(100);not null" json:"name"`
	Email     string    `gorm:"type:varchar(255);not null" json:"email"`
	Subject   string    `gorm:"type:varchar(150);not null" json:"subject"`
	Message   string    `gorm:"type:text;not null" json:"message"`
	IsRead    bool      `gorm:"type:boolean;not null;default:false" json:"isRead"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
}

// CreateContactRequest DTO untuk mengirim pesan masuk dari visitor
type CreateContactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

// ContactRepository mengabstraksikan akses data ke tabel contacts
type ContactRepository interface {
	Create(ctx context.Context, contact *Contact) error
	GetByID(ctx context.Context, id string) (*Contact, error)
	GetAll(ctx context.Context) ([]Contact, error)
	GetAllByUserID(ctx context.Context, userID string) ([]Contact, error)
	Update(ctx context.Context, contact *Contact) error
	Delete(ctx context.Context, id string) error
}

// ContactUsecase mengelola bisnis logika operasi pesan masuk contact
type ContactUsecase interface {
	SubmitContact(ctx context.Context, req *CreateContactRequest) (*Contact, error)
	GetContactByID(ctx context.Context, id string, userID string) (*Contact, error)
	GetContactsByUserID(ctx context.Context, userID string) ([]Contact, error)
	MarkAsRead(ctx context.Context, id string, userID string) (*Contact, error)
	DeleteContact(ctx context.Context, id string, userID string) error
}
