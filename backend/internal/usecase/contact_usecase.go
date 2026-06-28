package usecase

import (
	"context"
	"errors"
	"backend/internal/domain"
)

type contactUsecase struct {
	contactRepo domain.ContactRepository
	userRepo    domain.UserRepository
}

// NewContactUsecase menginisialisasi usecase bisnis kontak inbox
func NewContactUsecase(contactRepo domain.ContactRepository, userRepo domain.UserRepository) domain.ContactUsecase {
	return &contactUsecase{
		contactRepo: contactRepo,
		userRepo:    userRepo,
	}
}

func (u *contactUsecase) SubmitContact(ctx context.Context, req *domain.CreateContactRequest) (*domain.Contact, error) {
	if req.Name == "" || req.Email == "" || req.Subject == "" || req.Message == "" {
		return nil, errors.New("nama, email, subjek, dan isi pesan tidak boleh kosong")
	}

	// Cari default admin email admin@example.com untuk diasosiasikan
	admin, err := u.userRepo.GetByEmail(ctx, "admin@example.com")
	if err != nil {
		return nil, errors.New("administrator utama tidak ditemukan")
	}

	contact := &domain.Contact{
		UserID:  admin.ID,
		Name:    req.Name,
		Email:   req.Email,
		Subject: req.Subject,
		Message: req.Message,
		IsRead:  false,
	}

	err = u.contactRepo.Create(ctx, contact)
	if err != nil {
		return nil, err
	}
	return contact, nil
}

func (u *contactUsecase) GetContactByID(ctx context.Context, id string, userID string) (*domain.Contact, error) {
	contact, err := u.contactRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if contact.UserID != userID {
		return nil, errors.New("tidak memiliki hak akses untuk membaca pesan ini")
	}

	return contact, nil
}

func (u *contactUsecase) GetContactsByUserID(ctx context.Context, userID string) ([]domain.Contact, error) {
	return u.contactRepo.GetAllByUserID(ctx, userID)
}

func (u *contactUsecase) MarkAsRead(ctx context.Context, id string, userID string) (*domain.Contact, error) {
	contact, err := u.GetContactByID(ctx, id, userID)
	if err != nil {
		return nil, err
	}

	contact.IsRead = true
	err = u.contactRepo.Update(ctx, contact)
	if err != nil {
		return nil, err
	}

	return contact, nil
}

func (u *contactUsecase) DeleteContact(ctx context.Context, id string, userID string) error {
	_, err := u.GetContactByID(ctx, id, userID)
	if err != nil {
		return err
	}

	return u.contactRepo.Delete(ctx, id)
}
