package com.ProyectoFinal.ProyectoFinalProductos.Controlador;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainControlador {

    @GetMapping({"", "/"})
    public String Inicio() {
        return "inicio";
    }

    @GetMapping("/nosotros")
    public String nosotros() {
        return "nosotros";
    }

    @GetMapping("/catalogo")
    public String catalogo() {
        return "catalogo";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/intranet")
    public String intranet() {
        return "intranet";
    }

    @GetMapping("/inicioPaciente")
    public String inicioPaciente() {
        return "inicioPaciente";
    }

    @GetMapping("/solicitud")
    public String solicitud() {
        return "solicitud";
    }

}
