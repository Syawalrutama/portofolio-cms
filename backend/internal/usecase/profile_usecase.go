package usecase

import (
	"context"
	"backend/internal/domain"
	"gorm.io/gorm"
)

type profileUsecase struct {
	profileRepo domain.ProfileRepository
}

// NewProfileUsecase menginisialisasi usecase bisnis profil
func NewProfileUsecase(profileRepo domain.ProfileRepository) domain.ProfileUsecase {
	return &profileUsecase{profileRepo: profileRepo}
}

func (u *profileUsecase) GetProfileByUserID(ctx context.Context, userID string) (*domain.Profile, error) {
	profile, err := u.profileRepo.GetByUserID(ctx, userID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// Buat profil kosong baru jika belum ada record sama sekali
			newProfile := &domain.Profile{
				UserID:   userID,
				FullName: "Administrator",
				Title:    "Developer",
				Bio:      "Tentang saya...",
			}
			errCreate := u.profileRepo.Create(ctx, newProfile)
			if errCreate != nil {
				return nil, errCreate
			}
			return newProfile, nil
		}
		return nil, err
	}
	return profile, nil
}

func (u *profileUsecase) GetPublicProfile(ctx context.Context) (*domain.Profile, error) {
	// Mengambil profil pertama (karena portofolio personal hanya punya 1 profil)
	profile, err := u.profileRepo.GetFirst(ctx)
	if err != nil {
		return nil, err
	}
	return profile, nil
}

func (u *profileUsecase) UpdateProfile(ctx context.Context, userID string, req *domain.UpdateProfileRequest) (*domain.Profile, error) {
	profile, err := u.GetProfileByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	profile.FullName = req.FullName
	profile.Title = req.Title
	profile.Bio = req.Bio
	profile.SocialLinks = req.SocialLinks
	profile.TechStack = req.TechStack

	err = u.profileRepo.Update(ctx, profile)
	if err != nil {
		return nil, err
	}

	return profile, nil
}

func (u *profileUsecase) UpdateAvatar(ctx context.Context, userID string, avatarURL string) (*domain.Profile, error) {
	profile, err := u.GetProfileByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	profile.AvatarURL = avatarURL

	err = u.profileRepo.Update(ctx, profile)
	if err != nil {
		return nil, err
	}

	return profile, nil
}
