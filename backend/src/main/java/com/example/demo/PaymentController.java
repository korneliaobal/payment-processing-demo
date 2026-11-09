package com.example.demo;
import static com.example.demo.PaymentModels.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
@RestController
public class PaymentController {
    private final PaymentService service;
    private final ObjectMapper mapper;
    public PaymentController(PaymentService service, ObjectMapper mapper) { this.service = service; this.mapper = mapper; }
    @PostMapping(value="/api/payments/upload", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Result upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new IllegalArgumentException("Select a non-empty JSON file");
        return service.process(mapper.readValue(file.getBytes(), Payment.class));
    }
    @GetMapping("/api/payments/history") public List<Result> history() { return service.history(); }
    @GetMapping("/api/payments/{id}") public Result details(@PathVariable UUID id) { return service.get(id); }
    @GetMapping("/api/payment-status/{id}") public Map<String, Object> status(@PathVariable UUID id) {
        Result result = service.get(id);
        return Map.of("paymentId", id, "status", result.status());
    }
    @GetMapping("/api/health") public Map<String, String> health() { return Map.of("status", "UP"); }
}
