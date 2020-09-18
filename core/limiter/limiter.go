package limiter

import (
	"Solutions/pvpSimulator/core/geoip"
	"fmt"
	"sync"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"golang.org/x/time/rate"
)

var visitorLimiter limiter

func init() {
	visitorLimiter.visitors = make(map[string]*visitor)
	go visitorLimiter.cleanupVisitors()
}

type limiter struct {
	sync.RWMutex
	visitors map[string]*visitor
}

type visitor struct {
	limiterPvp         *rate.Limiter
	limiterPve         *rate.Limiter
	limiterUserProfile *rate.Limiter
	limiterBase        *rate.Limiter
	limiterPage        *rate.Limiter
	lastSeen           time.Time
}

func (l *limiter) cleanupVisitors() {
	for {
		time.Sleep(20 * time.Minute)
		l.Lock()
		for ip, v := range l.visitors {
			if time.Since(v.lastSeen) > 120*time.Minute {
				delete(l.visitors, ip)
			}
		}
		l.Unlock()
	}
}

//CheckVisitorLimit check visitors limits
func CheckVisitorLimit(ip, limiterType string) bool {
	visitorLimiter.Lock()
	defer visitorLimiter.Unlock()
	v, exists := visitorLimiter.visitors[ip]
	if !exists {
		visitor := newVesitor()
		return visitorLimiter.checkLimits(ip, limiterType, visitor)
	}
	// Update the last seen time for the visitor.
	return visitorLimiter.checkLimits(ip, limiterType, v)
}

func newVesitor() *visitor {
	return &visitor{
		limiterPvp:         rate.NewLimiter(10, 10),
		limiterPve:         rate.NewLimiter(10, 10),
		limiterUserProfile: rate.NewLimiter(10, 10),
		limiterBase:        rate.NewLimiter(10, 10),
		limiterPage:        rate.NewLimiter(10, 10),
	}
}

func (l *limiter) checkLimits(ip, limiterType string, vis *visitor) bool {
	var isAllowed bool
	switch limiterType {
	case "limiterPvp":
		isAllowed = vis.limiterPvp.Allow()
	case "limiterPve":
		isAllowed = vis.limiterPve.Allow()
	case "limiterUserProfile":
		isAllowed = vis.limiterUserProfile.Allow()
	case "limiterBase":
		isAllowed = vis.limiterBase.Allow()
	default:
		isAllowed = vis.limiterPage.Allow()
	}
	vis.lastSeen = time.Now()
	l.visitors[ip] = vis
	return isAllowed
}

func recordGeo(ip string, ipLocations *prometheus.CounterVec) {
	code, err := geoip.GetCode(ip)
	if err != nil {
		fmt.Printf("An error accured during getting country code: %v", err)
		return
	}
	ipLocations.With(prometheus.Labels{"country": code}).Inc()
	return
}
