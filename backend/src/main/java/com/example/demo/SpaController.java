package com.example.demo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
@Controller
public class SpaController {
    @GetMapping({"/", "/payments/history", "/payments/{id}"})
    public String index() { return "forward:/index.html"; }
}
