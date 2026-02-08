package com.assessment.dto;

import com.assessment.model.Question;
import java.time.LocalDateTime;

public class QuestionDTO {

    private Long id;
    private String title;
    private String description;
    private String solution;
    private String explanation;
    private String starterCode;
    private LocalDateTime releaseTime;
    private boolean unlocked;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public QuestionDTO() {
    }

    // Factory method for locked question (hides solution/explanation)
    public static QuestionDTO locked(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setTitle(question.getTitle());
        dto.setDescription(question.getDescription());
        dto.setSolution(null); // Hidden
        dto.setExplanation(null); // Hidden
        dto.setStarterCode(question.getStarterCode()); // Visible even if locked? Yes, to peek at code? Actually usually
                                                       // yes.
        dto.setReleaseTime(question.getReleaseTime());
        dto.setUnlocked(false);
        dto.setCreatedAt(question.getCreatedAt());
        dto.setUpdatedAt(question.getUpdatedAt());
        return dto;
    }

    // Factory method for unlocked question (shows everything)
    public static QuestionDTO unlocked(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setTitle(question.getTitle());
        dto.setDescription(question.getDescription());
        dto.setSolution(question.getSolution());
        dto.setExplanation(question.getExplanation());
        dto.setStarterCode(question.getStarterCode());
        dto.setReleaseTime(question.getReleaseTime());
        dto.setUnlocked(true);
        dto.setCreatedAt(question.getCreatedAt());
        dto.setUpdatedAt(question.getUpdatedAt());
        return dto;
    }

    // Convert based on current time
    public static QuestionDTO fromQuestion(Question question) {
        if (LocalDateTime.now().isBefore(question.getReleaseTime())) {
            return locked(question);
        } else {
            return unlocked(question);
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSolution() {
        return solution;
    }

    public void setSolution(String solution) {
        this.solution = solution;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getStarterCode() {
        return starterCode;
    }

    public void setStarterCode(String starterCode) {
        this.starterCode = starterCode;
    }

    public LocalDateTime getReleaseTime() {
        return releaseTime;
    }

    public void setReleaseTime(LocalDateTime releaseTime) {
        this.releaseTime = releaseTime;
    }

    public boolean isUnlocked() {
        return unlocked;
    }

    public void setUnlocked(boolean unlocked) {
        this.unlocked = unlocked;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
