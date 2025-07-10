package com.ProyectoFinal.ProyectoFinalProductos.Controlador;

import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Dron;
import com.ProyectoFinal.ProyectoFinalProductos.Respositorios.DronRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/drones")
@CrossOrigin(origins = "*")
public class DronController {
    
    @Autowired
    private DronRepository dronRepository;
    
    @GetMapping
    public List<Dron> obtenerTodosDrones() {
        return dronRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Dron> obtenerDronPorId(@PathVariable int id) {
        Optional<Dron> dron = dronRepository.findById(id);
        return dron.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/identificador/{identificador}")
    public ResponseEntity<Dron> obtenerDronPorIdentificador(@PathVariable String identificador) {
        Optional<Dron> dron = dronRepository.findByIdentificador(identificador);
        return dron.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/modelo/{modelo}")
    public List<Dron> obtenerDronesPorModelo(@PathVariable String modelo) {
        return dronRepository.findByModelo(modelo);
    }
    
    @GetMapping("/disponibles")
    public List<Dron> obtenerDronesDisponibles(
            @RequestParam(defaultValue = "20") Integer bateria,
            @RequestParam(defaultValue = "0.5") BigDecimal capacidad) {
        return dronRepository.findDronesDisponibles(bateria, capacidad);
    }
    
    @GetMapping("/libres")
    public List<Dron> obtenerDronesLibres() {
        return dronRepository.findDronesLibres();
    }
    
    @PostMapping
    public Dron crearDron(@RequestBody Dron dron) {
        return dronRepository.save(dron);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Dron> actualizarDron(@PathVariable int id, @RequestBody Dron dronActualizado) {
        Optional<Dron> dronExistente = dronRepository.findById(id);
        if (dronExistente.isPresent()) {
            Dron dron = dronExistente.get();
            dron.setIdentificador(dronActualizado.getIdentificador());
            dron.setModelo(dronActualizado.getModelo());
            dron.setCapacidadKg(dronActualizado.getCapacidadKg());
            dron.setNivelBateria(dronActualizado.getNivelBateria());
            return ResponseEntity.ok(dronRepository.save(dron));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDron(@PathVariable int id) {
        if (dronRepository.existsById(id)) {
            dronRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}