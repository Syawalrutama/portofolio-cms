package usecase

import (
	"context"
	"errors"
	"backend/internal/domain"
)

type skillUsecase struct {
	skillRepo domain.SkillRepository
}

// NewSkillUsecase menginisialisasi usecase bisnis CRUD skill
func NewSkillUsecase(skillRepo domain.SkillRepository) domain.SkillUsecase {
	return &skillUsecase{skillRepo: skillRepo}
}

func (u *skillUsecase) CreateSkill(ctx context.Context, userID string, req *domain.CreateSkillRequest) (*domain.Skill, error) {
	if req.Name == "" {
		return nil, errors.New("nama skill tidak boleh kosong")
	}
	if req.Percentage < 0 || req.Percentage > 100 {
		return nil, errors.New("persentase skill harus di antara 0 s/d 100")
	}

	skill := &domain.Skill{
		UserID:     userID,
		Name:       req.Name,
		Percentage: req.Percentage,
		Category:   req.Category,
	}

	err := u.skillRepo.Create(ctx, skill)
	if err != nil {
		return nil, err
	}
	return skill, nil
}

func (u *skillUsecase) GetSkillByID(ctx context.Context, id string) (*domain.Skill, error) {
	return u.skillRepo.GetByID(ctx, id)
}

func (u *skillUsecase) GetSkillsByUserID(ctx context.Context, userID string) ([]domain.Skill, error) {
	return u.skillRepo.GetAllByUserID(ctx, userID)
}

func (u *skillUsecase) GetPublicSkills(ctx context.Context) ([]domain.Skill, error) {
	return u.skillRepo.GetAll(ctx)
}

func (u *skillUsecase) UpdateSkill(ctx context.Context, id string, userID string, req *domain.UpdateSkillRequest) (*domain.Skill, error) {
	skill, err := u.skillRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if skill.UserID != userID {
		return nil, errors.New("tidak memiliki hak akses untuk mengubah skill ini")
	}

	if req.Name == "" {
		return nil, errors.New("nama skill tidak boleh kosong")
	}
	if req.Percentage < 0 || req.Percentage > 100 {
		return nil, errors.New("persentase skill harus di antara 0 s/d 100")
	}

	skill.Name = req.Name
	skill.Percentage = req.Percentage
	skill.Category = req.Category

	err = u.skillRepo.Update(ctx, skill)
	if err != nil {
		return nil, err
	}

	return skill, nil
}

func (u *skillUsecase) DeleteSkill(ctx context.Context, id string, userID string) error {
	skill, err := u.skillRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	if skill.UserID != userID {
		return errors.New("tidak memiliki hak akses untuk menghapus skill ini")
	}

	return u.skillRepo.Delete(ctx, id)
}
