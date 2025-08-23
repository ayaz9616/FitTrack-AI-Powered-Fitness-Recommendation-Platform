// ...existing code...
// ...existing code...
package com.fitness.activityservice.service;


import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityService {
    // --- Aggregated summary stub ---
    public Object getUserActivitySummary(String userId) {
    List<Activity> activities = activityRepository.findByUserId(userId);
    double totalCalories = activities.stream().mapToDouble(a -> java.util.Objects.requireNonNullElse(a.getCaloriesBurnt(), 0.0)).sum();
    double totalDistance = activities.stream().mapToDouble(a -> java.util.Objects.requireNonNullElse(a.getDistance(), 0.0)).sum();
    int totalActivities = activities.size();
    java.util.Map<String, Object> summary = new java.util.HashMap<>();
    summary.put("totalCalories", totalCalories);
    summary.put("totalDistance", totalDistance);
    summary.put("totalActivities", totalActivities);
    return summary;
    }

    // --- Goal tracking stubs ---
    public Object setUserGoal(String userId, com.fitness.activityservice.dto.GoalRequest goalRequest) {
        // TODO: Implement goal persistence logic
        return java.util.Collections.singletonMap("status", "Goal set");
    }

    public Object getUserGoals(String userId) {
        // TODO: Implement goal retrieval logic
        return new java.util.ArrayList<>();
    }

    // --- Wearable integration stub ---
    public Object ingestWearableData(String userId, com.fitness.activityservice.dto.WearableDataRequest wearableDataRequest) {
        // TODO: Implement wearable data ingestion logic
        return java.util.Collections.singletonMap("status", "Wearable data ingested");
    }

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final RabbitTemplate rabbitTemplate;
    private final CaloriesEstimatorService caloriesEstimatorService;
    private final RecommendationService recommendationService;

    public ActivityService(ActivityRepository activityRepository,
                          UserValidationService userValidationService,
                          RabbitTemplate rabbitTemplate,
                          CaloriesEstimatorService caloriesEstimatorService,
                          RecommendationService recommendationService) {
        this.activityRepository = activityRepository;
        this.userValidationService = userValidationService;
        this.rabbitTemplate = rabbitTemplate;
        this.caloriesEstimatorService = caloriesEstimatorService;
        this.recommendationService = recommendationService;
    }

    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    public ActivityResponse trackActivity(ActivityRequest request) {
        boolean isValidUser = userValidationService.validateUser(request.getUserId());
        if (!isValidUser) {
            throw new RuntimeException("Invalid User: " + request.getUserId());
        }

        Double calories = request.getCaloriesBurnt();
        // Only estimate if calories is null (not provided by user)
        if (calories == null) {
            // TODO: Fetch user profile (weight, age) from user service or additionalMetrics
            double weight = 70; // default or fetch from user profile
            int age = 30; // default or fetch from user profile
            calories = caloriesEstimatorService.estimateCalories(
                request.getActivityType(),
                request.getDuration(),
                request.getDistance(),
                weight,
                age
            );
        }

        Activity activity = new Activity();
        activity.setUserId(request.getUserId());
        activity.setActivityType(request.getActivityType());
        activity.setDuration(request.getDuration());
        activity.setDistance(request.getDistance());
        activity.setPace(request.getPace());
        activity.setAverageHeartRate(request.getAverageHeartRate());
        activity.setMaxHeartRate(request.getMaxHeartRate());
        activity.setCaloriesBurnt(calories);

        // Always set timestamp: use request timestamp if present, else now
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        if (request.getTimestamp() != null) {
            activity.setTimestamp(request.getTimestamp());
        } else {
            activity.setTimestamp(now);
        }

        Activity savedActivity = activityRepository.save(activity);

        // Generate recommendation and log (could be saved or returned as needed)
        String recommendation = recommendationService.generateRecommendation(savedActivity, activityRepository.findByUserId(savedActivity.getUserId()));
        // Optionally handle recommendation (e.g., save or return)

        // Publish to RabbitMQ for AI Processing
        try {
            rabbitTemplate.convertAndSend(exchange, routingKey, savedActivity);
        } catch(Exception e) {
            // Optionally handle error
        }

        return mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity activity){
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setActivityType(activity.getActivityType());
        response.setDuration(activity.getDuration());
        response.setDistance(activity.getDistance());
        response.setPace(activity.getPace());
        response.setAverageHeartRate(activity.getAverageHeartRate());
        response.setMaxHeartRate(activity.getMaxHeartRate());
        response.setCaloriesBurnt(activity.getCaloriesBurnt());
        response.setTimestamp(activity.getTimestamp());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
        return response;
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        return activities.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ActivityResponse getActivityById(String activityId) {
        return activityRepository.findById(activityId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));
    }
}
