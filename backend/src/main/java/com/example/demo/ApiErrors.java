package com.example.demo;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
@RestControllerAdvice
public class ApiErrors {
    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<ProblemDetail> invalid(IllegalArgumentException e) { return problem(400, e.getMessage()); }
    @ExceptionHandler(JsonProcessingException.class)
    ResponseEntity<ProblemDetail> json(JsonProcessingException e) { return problem(400, "Invalid JSON or payment structure"); }
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    ResponseEntity<ProblemDetail> tooLarge() { return problem(413, "Maximum file size is 1 MB"); }
    private ResponseEntity<ProblemDetail> problem(int status, String message) {
        return ResponseEntity.status(status).body(ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(status), message));
    }
}
