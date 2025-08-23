package com.fitness.activityservice.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class WearableDataRequest {
    @NotNull
    private String deviceId;
    @NotNull
    private String dataType; // e.g., "steps", "heartRate", "sleep"
    @NotNull
    private Double value;
    @NotNull
    private LocalDateTime timestamp;
    private String unit; // e.g., "bpm", "steps", "hours"

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    public String getDataType() { return dataType; }
    public void setDataType(String dataType) { this.dataType = dataType; }
    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}
