package com.fitness.activityservice.dto;

import com.fitness.activityservice.model.ActivityType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;

public class ActivityRequest {
    @NotNull
    private ActivityType activityType;

    @NotNull
    @Min(1)
    private Integer duration; // minutes

    private Double distance; // optional, km or miles

    private String pace; // optional, min/km or min/mile

    private Integer averageHeartRate; // optional

    private Integer maxHeartRate; // optional

    private Double caloriesBurnt; // optional

    @NotNull
    private LocalDateTime timestamp;

    // Added for user context
    private String userId;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public ActivityType getActivityType() { return activityType; }
    public void setActivityType(ActivityType activityType) { this.activityType = activityType; }
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }
    public String getPace() { return pace; }
    public void setPace(String pace) { this.pace = pace; }
    public Integer getAverageHeartRate() { return averageHeartRate; }
    public void setAverageHeartRate(Integer averageHeartRate) { this.averageHeartRate = averageHeartRate; }
    public Integer getMaxHeartRate() { return maxHeartRate; }
    public void setMaxHeartRate(Integer maxHeartRate) { this.maxHeartRate = maxHeartRate; }
    public Double getCaloriesBurnt() { return caloriesBurnt; }
    public void setCaloriesBurnt(Double caloriesBurnt) { this.caloriesBurnt = caloriesBurnt; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
