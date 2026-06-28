package repository

import (
	"context"
	"backend/internal/domain"
	"gorm.io/gorm"
)

type certificateRepository struct {
	db *gorm.DB
}

// NewCertificateRepository menginisialisasi implementasi GORM dari CertificateRepository
func NewCertificateRepository(db *gorm.DB) domain.CertificateRepository {
	return &certificateRepository{db: db}
}

func (r *certificateRepository) Create(ctx context.Context, cert *domain.Certificate) error {
	return r.db.WithContext(ctx).Create(cert).Error
}

func (r *certificateRepository) GetByID(ctx context.Context, id string) (*domain.Certificate, error) {
	var cert domain.Certificate
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&cert).Error
	if err != nil {
		return nil, err
	}
	return &cert, nil
}

func (r *certificateRepository) GetAll(ctx context.Context) ([]domain.Certificate, error) {
	var certs []domain.Certificate
	err := r.db.WithContext(ctx).Order("issue_date desc").Find(&certs).Error
	if err != nil {
		return nil, err
	}
	return certs, nil
}

func (r *certificateRepository) GetAllByUserID(ctx context.Context, userID string) ([]domain.Certificate, error) {
	var certs []domain.Certificate
	err := r.db.WithContext(ctx).Where("user_id = ?", userID).Order("issue_date desc").Find(&certs).Error
	if err != nil {
		return nil, err
	}
	return certs, nil
}

func (r *certificateRepository) Update(ctx context.Context, cert *domain.Certificate) error {
	return r.db.WithContext(ctx).Save(cert).Error
}

func (r *certificateRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&domain.Certificate{}).Error
}
