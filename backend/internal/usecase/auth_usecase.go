package usecase

import (
	"context"
	"errors"
	"time"

	"backend/internal/domain"
	"backend/pkg/jwtutil"
	"golang.org/x/crypto/bcrypt"
)

type authUsecase struct {
	userRepo  domain.UserRepository
	jwtSecret string
}

// NewAuthUsecase menginisialisasi usecase bisnis otentikasi
func NewAuthUsecase(userRepo domain.UserRepository, jwtSecret string) domain.AuthUsecase {
	return &authUsecase{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
	}
}

func (u *authUsecase) Login(ctx context.Context, req *domain.LoginRequest) (*domain.LoginResponse, error) {
	// 1. Dapatkan user berdasarkan email
	user, err := u.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, errors.New("email atau password salah")
	}

	// 2. Bandingkan password bcrypt
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
	if err != nil {
		return nil, errors.New("email atau password salah")
	}

	// 3. Generate token JWT dengan masa kedaluwarsa 24 jam
	token, err := jwtutil.GenerateToken(user.ID, user.Email, user.Role, u.jwtSecret, 24*time.Hour)
	if err != nil {
		return nil, errors.New("gagal membuat token otentikasi")
	}

	return &domain.LoginResponse{Token: token}, nil
}
