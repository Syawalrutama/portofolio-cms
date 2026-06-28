package repository

import (
	"context"
	"backend/internal/domain"
	"gorm.io/gorm"
)

type contactRepository struct {
	db *gorm.DB
}

// NewContactRepository menginisialisasi implementasi GORM dari ContactRepository
func NewContactRepository(db *gorm.DB) domain.ContactRepository {
	return &contactRepository{db: db}
}

func (r *contactRepository) Create(ctx context.Context, contact *domain.Contact) error {
	return r.db.WithContext(ctx).Create(contact).Error
}

func (r *contactRepository) GetByID(ctx context.Context, id string) (*domain.Contact, error) {
	var contact domain.Contact
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&contact).Error
	if err != nil {
		return nil, err
	}
	return &contact, nil
}

func (r *contactRepository) GetAll(ctx context.Context) ([]domain.Contact, error) {
	var contacts []domain.Contact
	err := r.db.WithContext(ctx).Order("created_at desc").Find(&contacts).Error
	if err != nil {
		return nil, err
	}
	return contacts, nil
}

func (r *contactRepository) GetAllByUserID(ctx context.Context, userID string) ([]domain.Contact, error) {
	var contacts []domain.Contact
	err := r.db.WithContext(ctx).Where("user_id = ?", userID).Order("created_at desc").Find(&contacts).Error
	if err != nil {
		return nil, err
	}
	return contacts, nil
}

func (r *contactRepository) Update(ctx context.Context, contact *domain.Contact) error {
	return r.db.WithContext(ctx).Save(contact).Error
}

func (r *contactRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&domain.Contact{}).Error
}
