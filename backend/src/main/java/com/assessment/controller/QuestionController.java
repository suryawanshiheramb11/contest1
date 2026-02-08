package com.assessment.controller;

import com.assessment.dto.QuestionDTO;
import com.assessment.dto.QuestionRequest;
import com.assessment.model.Question;
import com.assessment.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    // GET all questions (with time-release logic applied)
    @GetMapping
    public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
        List<Question> questions = questionRepository.findAllByOrderByReleaseTimeAsc();
        List<QuestionDTO> dtos = new ArrayList<>();

        // Using i as loop variable per coding standards
        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            // Apply time-release logic
            if (LocalDateTime.now().isBefore(question.getReleaseTime())) {
                dtos.add(QuestionDTO.locked(question));
            } else {
                dtos.add(QuestionDTO.unlocked(question));
            }
        }

        return ResponseEntity.ok(dtos);
    }

    // GET single question by ID (with time-release logic)
    @GetMapping("/{id}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long id) {
        Optional<Question> optionalQuestion = questionRepository.findById(id);

        if (optionalQuestion.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Question question = optionalQuestion.get();

        // Apply time-release logic
        if (LocalDateTime.now().isBefore(question.getReleaseTime())) {
            // Question is LOCKED - return only title and description
            return ResponseEntity.ok(QuestionDTO.locked(question));
        } else {
            // Question is UNLOCKED - return full object with solution
            return ResponseEntity.ok(QuestionDTO.unlocked(question));
        }
    }

    // GET all questions for admin (no time-release restriction)
    @GetMapping("/admin/all")
    public ResponseEntity<List<QuestionDTO>> getAllQuestionsAdmin() {
        List<Question> questions = questionRepository.findAllByOrderByReleaseTimeAsc();
        List<QuestionDTO> dtos = new ArrayList<>();

        for (int i = 0; i < questions.size(); i++) {
            dtos.add(QuestionDTO.unlocked(questions.get(i)));
        }

        return ResponseEntity.ok(dtos);
    }

    // POST - Create new question (Admin only)
    @PostMapping
    public ResponseEntity<QuestionDTO> createQuestion(@RequestBody QuestionRequest request) {
        Question question = new Question();
        question.setTitle(request.getTitle());
        question.setDescription(request.getDescription());
        question.setSolution(request.getSolution());
        question.setExplanation(request.getExplanation());
        question.setReleaseTime(request.getReleaseTime());

        Question saved = questionRepository.save(question);
        return ResponseEntity.status(HttpStatus.CREATED).body(QuestionDTO.unlocked(saved));
    }

    // PUT - Update question (Admin only)
    @PutMapping("/{id}")
    public ResponseEntity<QuestionDTO> updateQuestion(
            @PathVariable Long id,
            @RequestBody QuestionRequest request) {

        Optional<Question> optionalQuestion = questionRepository.findById(id);

        if (optionalQuestion.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Question question = optionalQuestion.get();
        question.setTitle(request.getTitle());
        question.setDescription(request.getDescription());
        question.setSolution(request.getSolution());
        question.setExplanation(request.getExplanation());
        question.setReleaseTime(request.getReleaseTime());

        Question saved = questionRepository.save(question);
        return ResponseEntity.ok(QuestionDTO.unlocked(saved));
    }

    // DELETE - Delete question (Admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        if (!questionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        questionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
