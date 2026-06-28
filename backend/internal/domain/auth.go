package domain

import "context"

// LoginRequest mendefinisikan payload masuk admin
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse mengirim token JWT kembali ke client
type LoginResponse struct {
	Token string `json:"token"`
}

// AuthUsecase mendefinisikan bisnis logika otentikasi
type AuthUsecase interface {
	Login(ctx context.Context, req *LoginRequest) (*LoginResponse, error)
}
