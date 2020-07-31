package limiter

import (
	"Solutions/pvpSimulator/core/geoip"
	"fmt"
	"sync"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"golang.org/x/time/rate"
)

func init() {
	go cleanupVisitors()
}

type visitor struct {
	limiterPvp  *rate.Limiter
	limiterBase *rate.Limiter
	limiterPage *rate.Limiter
	lastSeen    time.Time
}

var visitors = make(map[string]*visitor)
var mu sync.RWMutex

//GetVisitor check visitors limits
func GetVisitor(ip, limiterType string, ipLocations *prometheus.CounterVec) *rate.Limiter {
	mu.Lock()
	defer mu.Unlock()

	v, exists := visitors[ip]
	if !exists {
		go recordGeo(ip, ipLocations)

		limiterPage := rate.NewLimiter(10, 10)
		limiterBase := rate.NewLimiter(10, 10)
		limiterPvp := rate.NewLimiter(10, 10)

		// Include the current time when creating a new visitor.
		visitors[ip] = &visitor{limiterPvp, limiterBase, limiterPage, time.Now()}

		switch limiterType {
		case "limiterPvp":
			return limiterPvp
		case "limiterBase":
			return limiterBase
		default:
			return limiterPage
		}
	}

	// Update the last seen time for the visitor.
	v.lastSeen = time.Now()
	switch limiterType {
	case "limiterPvp":
		return v.limiterPvp
	case "limiterBase":
		return v.limiterBase
	default:
		return v.limiterPage
	}
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

func cleanupVisitors() {
	for {
		time.Sleep(20 * time.Minute)
		mu.Lock()
		for ip, v := range visitors {
			if time.Since(v.lastSeen) > 30*time.Minute {
				delete(visitors, ip)
			}
		}
		mu.Unlock()
	}
}
