
package com.fitness.activityservice.controller;

import com.fitness.activityservice.dto.GoalRequest;
import com.fitness.activityservice.dto.WearableDataRequest;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.service.ActivityService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@AllArgsConstructor
public class ActivityController {

    private ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(@RequestBody ActivityRequest request, @RequestHeader("X-User-ID") String userId){
        // Always set userId from header for security
        request.setUserId(userId);
        return ResponseEntity.ok(activityService.trackActivity(request));
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getUserActivities(@RequestHeader("X-User-ID") String userId){
        return ResponseEntity.ok(activityService.getUserActivities(userId));
    }

    // --- Aggregated summaries (e.g., total calories, distance, etc.) ---
    @GetMapping("/summary")
    public ResponseEntity<?> getUserActivitySummary(@RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(activityService.getUserActivitySummary(userId));
    }

    // --- Goal tracking endpoints ---
    @PostMapping("/goals")
    public ResponseEntity<?> setUserGoal(@RequestHeader("X-User-ID") String userId, @RequestBody GoalRequest goalRequest) {
        return ResponseEntity.ok(activityService.setUserGoal(userId, goalRequest));
    }

    @GetMapping("/goals")
    public ResponseEntity<?> getUserGoals(@RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(activityService.getUserGoals(userId));
    }

    // --- Wearable integration endpoint (ingest data from devices) ---
    @PostMapping("/wearable")
    public ResponseEntity<?> ingestWearableData(@RequestHeader("X-User-ID") String userId, @RequestBody WearableDataRequest wearableDataRequest) {
        return ResponseEntity.ok(activityService.ingestWearableData(userId, wearableDataRequest));
    }


    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivity(@PathVariable String activityId){
        return ResponseEntity.ok(activityService.getActivityById(activityId));
    }
}
