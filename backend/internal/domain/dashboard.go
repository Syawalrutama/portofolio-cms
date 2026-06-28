package domain

import (
	"context"
	"time"
)

// Activity represents an entry in the dashboard activity log
type Activity struct {
	ID          string    `json:"id"`
	Type        string    `json:"type"`        // "project", "skill", "certificate", "contact"
	Title       string    `json:"title"`       // name, title, or sender
	Description string    `json:"description"` // brief text explanation
	CreatedAt   time.Time `json:"createdAt"`
}

// DashboardStats consolidates metrics for the admin landing page
type DashboardStats struct {
	TotalProjects     int        `json:"totalProjects"`
	TotalSkills       int        `json:"totalSkills"`
	TotalCertificates int        `json:"totalCertificates"`
	TotalMessages     int        `json:"totalMessages"`
	UnreadMessages    int        `json:"unreadMessages"`
	RecentActivities  []Activity `json:"recentActivities"`
}

// DashboardUsecase outlines dashboard aggregation methods
type DashboardUsecase interface {
	GetDashboardStats(ctx context.Context, userID string) (*DashboardStats, error)
}
