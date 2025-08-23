package com.fitness.activityservice.service;

import com.fitness.activityservice.model.ActivityType;
import org.springframework.stereotype.Service;

@Service
public class CaloriesEstimatorService {

    /**
     * Estimate calories burnt for an activity.
     * @param activityType The type of activity
     * @param duration Duration in minutes
     * @param distance Distance in kilometers (nullable)
     * @param weight User weight in kg
     * @param age User age in years
     * @return Estimated calories burnt
     */
    public double estimateCalories(ActivityType activityType, int duration, Double distance, double weight, int age) {
        switch (activityType) {
            case WALKING: return metCalories(3.5, weight, duration);
            case RUNNING: return metCalories(7.0, weight, duration);
            case CYCLING: return metCalories(6.8, weight, duration);
            case SWIMMING: return metCalories(8.0, weight, duration);
            case HIKING: return metCalories(6.0, weight, duration);
            case ELLIPTICAL: return metCalories(5.0, weight, duration);
            case ROWING: return metCalories(7.0, weight, duration);
            case DANCING: return metCalories(5.5, weight, duration);
            case YOGA: return metCalories(3.0, weight, duration);
            case PILATES: return metCalories(3.0, weight, duration);
            case CROSSFIT: return metCalories(8.0, weight, duration);
            case BOXING: return metCalories(7.8, weight, duration);
            case MARTIAL_ARTS: return metCalories(10.3, weight, duration);
            case SKATING: return metCalories(7.0, weight, duration);
            case SKIING: return metCalories(7.0, weight, duration);
            case SNOWBOARDING: return metCalories(5.3, weight, duration);
            case SURFING: return metCalories(3.0, weight, duration);
            case CLIMBING: return metCalories(8.0, weight, duration);
            case GYMNASTICS: return metCalories(3.8, weight, duration);
            case AEROBICS: return metCalories(6.5, weight, duration);
            case ZUMBA: return metCalories(5.5, weight, duration);
            case SPINNING: return metCalories(7.5, weight, duration);
            case TREADMILL: return metCalories(6.0, weight, duration);
            case STRENGTH_TRAINING: return metCalories(6.0, weight, duration);
            case HIIT: return metCalories(8.0, weight, duration);
            case JUMP_ROPE: return metCalories(12.3, weight, duration);
            case BADMINTON: return metCalories(4.5, weight, duration);
            case TENNIS: return metCalories(7.3, weight, duration);
            case TABLE_TENNIS: return metCalories(4.0, weight, duration);
            case VOLLEYBALL: return metCalories(3.0, weight, duration);
            case BASKETBALL: return metCalories(6.5, weight, duration);
            case FOOTBALL: return metCalories(7.0, weight, duration);
            case BASEBALL: return metCalories(5.0, weight, duration);
            case GOLF: return metCalories(4.8, weight, duration);
            case SKATEBOARDING: return metCalories(5.0, weight, duration);
            case HORSE_RIDING: return metCalories(5.5, weight, duration);
            case SQUASH: return metCalories(7.3, weight, duration);
            case ROWING_MACHINE: return metCalories(7.0, weight, duration);
            case STAIR_CLIMBING: return metCalories(8.8, weight, duration);
            case OTHER: return metCalories(3.5, weight, duration);
            default: return metCalories(3.5, weight, duration);
        }
    }

    private double metCalories(double met, double weight, int durationMinutes) {
        // Calories = MET * weight(kg) * hours
        return met * weight * (durationMinutes / 60.0);
    }
}
