package repository

import (
	"context"
	"backend/internal/domain"
	"gorm.io/gorm"
)

type skillRepository struct {
	db *gorm.DB
}

// NewSkillRepository menginisialisasi implementasi GORM dari SkillRepository
func NewSkillRepository(db *gorm.DB) domain.SkillRepository {
	return &skillRepository{db: db}
}

func (r *skillRepository) Create(ctx context.Context, skill *domain.Skill) error {
	return r.db.WithContext(ctx).Create(skill).Error
}

func (r *skillRepository) GetByID(ctx context.Context, id string) (*domain.Skill, error) {
	var skill domain.Skill
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&skill).Error
	if err != nil {
		return nil, err
	}
	return &skill, nil
}

func (r *skillRepository) GetAll(ctx context.Context) ([]domain.Skill, error) {
	var skills []domain.Skill
	err := r.db.WithContext(ctx).Order("percentage desc").Find(&skills).Error
	if err != nil {
		return nil, err
	}
	return skills, nil
}

func (r *skillRepository) GetAllByUserID(ctx context.Context, userID string) ([]domain.Skill, error) {
	var skills []domain.Skill
	err := r.db.WithContext(ctx).Where("user_id = ?", userID).Order("percentage desc").Find(&skills).Error
	if err != nil {
		return nil, err
	}
	return skills, nil
}

func (r *skillRepository) Update(ctx context.Context, skill *domain.Skill) error {
	return r.db.WithContext(ctx).Save(skill).Error
}

func (r *skillRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&domain.Skill{}).Error
}
