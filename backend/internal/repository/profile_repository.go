package repository

import (
	"context"
	"backend/internal/domain"
	"gorm.io/gorm"
)

type profileRepository struct {
	db *gorm.DB
}

// NewProfileRepository menginisialisasi implementasi GORM dari ProfileRepository
func NewProfileRepository(db *gorm.DB) domain.ProfileRepository {
	return &profileRepository{db: db}
}

func (r *profileRepository) GetByUserID(ctx context.Context, userID string) (*domain.Profile, error) {
	var profile domain.Profile
	err := r.db.WithContext(ctx).Where("user_id = ?", userID).First(&profile).Error
	if err != nil {
		return nil, err
	}
	return &profile, nil
}

func (r *profileRepository) GetFirst(ctx context.Context) (*domain.Profile, error) {
	var profile domain.Profile
	err := r.db.WithContext(ctx).First(&profile).Error
	if err != nil {
		return nil, err
	}
	return &profile, nil
}

func (r *profileRepository) Update(ctx context.Context, profile *domain.Profile) error {
	return r.db.WithContext(ctx).Save(profile).Error
}

func (r *profileRepository) Create(ctx context.Context, profile *domain.Profile) error {
	return r.db.WithContext(ctx).Create(profile).Error
}
