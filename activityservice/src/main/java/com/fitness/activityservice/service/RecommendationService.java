package com.fitness.activityservice.service;

import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.model.ActivityType;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationService {

    public String generateRecommendation(Activity activity, List<Activity> userHistory) {
        StringBuilder sb = new StringBuilder();
        sb.append("Activity: ").append(activity.getActivityType()).append("\n");
        sb.append("Duration: ").append(activity.getDuration()).append(" min\n");
        if (activity.getDistance() != null) {
            sb.append("Distance: ").append(activity.getDistance()).append(" km\n");
        }
        if (activity.getPace() != null) {
            sb.append("Pace: ").append(activity.getPace()).append("\n");
        }
        if (activity.getAverageHeartRate() != null) {
            sb.append("Avg HR: ").append(activity.getAverageHeartRate()).append(" bpm\n");
        }
        if (activity.getMaxHeartRate() != null) {
            sb.append("Max HR: ").append(activity.getMaxHeartRate()).append(" bpm\n");
        }
        sb.append("Calories: ").append(activity.getCaloriesBurnt()).append("\n");
        sb.append("\n");
        // Personalized advice
        sb.append("Advice: ");
        sb.append(getAdvice(activity, userHistory));
        sb.append("\n");
        // Pacing tips
        sb.append("Pacing Tips: ");
        sb.append(getPacingTips(activity));
        sb.append("\n");
        // Recovery
        sb.append("Recovery: ");
        sb.append(getRecoverySuggestions(activity));
        sb.append("\n");
        // Nutrition
        sb.append("Nutrition: ");
        sb.append(getNutritionGuidance(activity));
        sb.append("\n");
        // Goals
        sb.append("Goal Suggestion: ");
        sb.append(getGoalSuggestion(activity, userHistory));
        sb.append("\n");
        // Improvements
        sb.append("Improvement: ");
        sb.append(getImprovementSuggestion(activity, userHistory));
        return sb.toString();
    }

    private String getAdvice(Activity activity, List<Activity> userHistory) {
        // Example: analyze frequency, progress, etc.
        if (userHistory == null || userHistory.isEmpty()) {
            return "Great start! Keep logging your activities for better insights.";
        }
    long similar = userHistory.stream().filter(a -> a.getActivityType() == activity.getActivityType()).count();
        if (similar < 3) {
            return "Try to be consistent with this activity for best results.";
        }
        return "You're building a strong habit! Consider increasing intensity or duration.";
    }

    private String getPacingTips(Activity activity) {
        if (activity.getPace() != null) {
            return "Maintain a steady pace. Listen to your body and avoid overexertion.";
        }
        return "Track your pace for more personalized tips.";
    }

    private String getRecoverySuggestions(Activity activity) {
        if (activity.getDuration() != null && activity.getDuration() > 60) {
            return "Ensure proper hydration and consider a rest day.";
        }
        return "Light stretching and hydration recommended.";
    }

    private String getNutritionGuidance(Activity activity) {
        switch (activity.getActivityType()) {
            case RUNNING:
            case CYCLING:
            case SWIMMING:
                return "Carbohydrates and protein post-workout will aid recovery.";
            case YOGA:
            case DANCING:
                return "Stay hydrated and eat a balanced meal.";
            default:
                return "Maintain a balanced diet to support your activity.";
        }
    }

    private String getGoalSuggestion(Activity activity, List<Activity> userHistory) {
        // Example: suggest a weekly goal
        if (userHistory == null) return "Set a weekly goal for duration or calories.";
    int totalDuration = userHistory.stream().mapToInt(a -> a.getDuration() != null ? a.getDuration() : 0).sum();
    return "Aim to increase your weekly duration by 10%. Current: " + totalDuration + " min.";
    }

    private String getImprovementSuggestion(Activity activity, List<Activity> userHistory) {
        // Example: highlight area for improvement
        if (activity.getAverageHeartRate() != null && activity.getAverageHeartRate() > 170) {
            return "Try to keep your heart rate in a moderate zone for endurance.";
        }
        return "Focus on consistency and gradual progress.";
    }
}
