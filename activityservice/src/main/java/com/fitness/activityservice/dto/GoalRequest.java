package com.fitness.activityservice.dto;

import jakarta.validation.constraints.NotNull;

public class GoalRequest {
    @NotNull
    private String goalType; // e.g., "calories", "distance", "duration"
    @NotNull
    private Double targetValue;
    private String period; // e.g., "daily", "weekly", "monthly"

    public String getGoalType() { return goalType; }
    public void setGoalType(String goalType) { this.goalType = goalType; }
    public Double getTargetValue() { return targetValue; }
    public void setTargetValue(Double targetValue) { this.targetValue = targetValue; }
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
}
