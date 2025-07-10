package com.ProyectoFinal.ProyectoFinalProductos.Controlador;

import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Medicamento;
import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Medicamento.FormaAdministracion;
import com.ProyectoFinal.ProyectoFinalProductos.Respositorios.MedicamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicamentos")
@CrossOrigin(origins = "*")
public class MedicamentoController {
    
    @Autowired
    private MedicamentoRepository medicamentoRepository;
    
    @GetMapping
    public List<Medicamento> obtenerTodosMedicamentos() {
        return medicamentoRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Medicamento> obtenerMedicamentoPorId(@PathVariable int id) {
        Optional<Medicamento> medicamento = medicamentoRepository.findById(id);
        return medicamento.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<Medicamento> obtenerMedicamentoPorNombre(@PathVariable String nombre) {
        Optional<Medicamento> medicamento = medicamentoRepository.findByNombreComercial(nombre);
        return medicamento.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/dolor/{dolor}")
    public List<Medicamento> buscarPorDolor(@PathVariable String dolor) {
        return medicamentoRepository.buscarPorDolor(dolor);
    }
    
    @GetMapping("/forma/{forma}")
    public List<Medicamento> obtenerMedicamentosPorForma(@PathVariable FormaAdministracion forma) {
        return medicamentoRepository.findByFormaAdministracion(forma);
    }
    
    @GetMapping("/buscar")
    public List<Medicamento> buscarPorDolorYForma(
            @RequestParam String dolor,
            @RequestParam FormaAdministracion forma) {
        return medicamentoRepository.buscarPorDolorYForma(dolor, forma);
    }
    
    @PostMapping
    public Medicamento crearMedicamento(@RequestBody Medicamento medicamento) {
        return medicamentoRepository.save(medicamento);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Medicamento> actualizarMedicamento(@PathVariable int id, @RequestBody Medicamento medicamentoActualizado) {
        Optional<Medicamento> medicamentoExistente = medicamentoRepository.findById(id);
        if (medicamentoExistente.isPresent()) {
            Medicamento medicamento = medicamentoExistente.get();
            medicamento.setDolores(medicamentoActualizado.getDolores());
            medicamento.setFormaAdministracion(medicamentoActualizado.getFormaAdministracion());
            medicamento.setNombreComercial(medicamentoActualizado.getNombreComercial());
            medicamento.setDescripcionUso(medicamentoActualizado.getDescripcionUso());
            medicamento.setPeso(medicamentoActualizado.getPeso());
            return ResponseEntity.ok(medicamentoRepository.save(medicamento));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMedicamento(@PathVariable int id) {
        if (medicamentoRepository.existsById(id)) {
            medicamentoRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
