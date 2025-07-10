package com.ProyectoFinal.ProyectoFinalProductos.Controlador;

import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Medicamento;
import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Solicitud;
import com.ProyectoFinal.ProyectoFinalProductos.Modelos.SolicitudMedicamento;
import com.ProyectoFinal.ProyectoFinalProductos.Respositorios.MedicamentoRepository;
import com.ProyectoFinal.ProyectoFinalProductos.Respositorios.SolicitudMedicamentoRepository;
import com.ProyectoFinal.ProyectoFinalProductos.Respositorios.SolicitudRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/solicitud-medicamentos")
@CrossOrigin(origins = "*")
public class SolicitudMedicamentoController {

    @Autowired
    private SolicitudMedicamentoRepository solicitudMedicamentoRepository;

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    @Autowired
    private SolicitudRepository solicitudRepository;

    @GetMapping
    public List<SolicitudMedicamento> obtenerTodosSolicitudMedicamentos() {
        return solicitudMedicamentoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitudMedicamento> obtenerSolicitudMedicamentoPorId(@PathVariable int id) {
        Optional<SolicitudMedicamento> solicitudMedicamento = solicitudMedicamentoRepository.findById(id);
        return solicitudMedicamento.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/solicitud/{solicitudId}")
    public List<SolicitudMedicamento> obtenerMedicamentosPorSolicitud(@PathVariable int solicitudId) {
        return solicitudMedicamentoRepository.findBySolicitudId(solicitudId);
    }

    @GetMapping("/medicamento/{medicamentoId}")
    public List<SolicitudMedicamento> obtenerSolicitudesPorMedicamento(@PathVariable int medicamentoId) {
        return solicitudMedicamentoRepository.findByMedicamentoId(medicamentoId);
    }

    @GetMapping("/medicamento/{medicamentoId}/total-cantidad")
    public Long obtenerTotalCantidadPorMedicamento(@PathVariable int medicamentoId) {
        return solicitudMedicamentoRepository.getTotalCantidadPorMedicamento(medicamentoId);
    }

    @GetMapping("/solicitud/{solicitudId}/peso-total")
    public Double obtenerPesoTotalPorSolicitud(@PathVariable int solicitudId) {
        return solicitudMedicamentoRepository.getPesoTotalPorSolicitud(solicitudId);
    }

    // ✅ POST seguro - individual
    @PostMapping
    public ResponseEntity<?> crearSolicitudMedicamento(@RequestBody SolicitudMedicamento solicitudMedicamento) {
        if (solicitudMedicamento.getMedicamento() == null || solicitudMedicamento.getMedicamento().getId() == 0 ||
            solicitudMedicamento.getSolicitud() == null || solicitudMedicamento.getSolicitud().getId() == 0) {
            return ResponseEntity.badRequest().body("ID de medicamento o solicitud inválido.");
        }

        Optional<Medicamento> medicamentoOpt = medicamentoRepository.findById(solicitudMedicamento.getMedicamento().getId());
        Optional<Solicitud> solicitudOpt = solicitudRepository.findById(solicitudMedicamento.getSolicitud().getId());

        if (medicamentoOpt.isEmpty() || solicitudOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("El medicamento o la solicitud no existen.");
        }

        solicitudMedicamento.setMedicamento(medicamentoOpt.get());
        solicitudMedicamento.setSolicitud(solicitudOpt.get());

        SolicitudMedicamento guardado = solicitudMedicamentoRepository.save(solicitudMedicamento);
        return ResponseEntity.ok(guardado);
    }

    // ✅ POST seguro - lote
    @PostMapping("/lote")
    public ResponseEntity<?> crearSolicitudMedicamentosLote(@RequestBody List<SolicitudMedicamento> solicitudMedicamentos) {
        List<SolicitudMedicamento> listaValidada = new ArrayList<>();

        for (SolicitudMedicamento sm : solicitudMedicamentos) {
            if (sm.getMedicamento() == null || sm.getSolicitud() == null ||
                sm.getMedicamento().getId() == 0 || sm.getSolicitud().getId() == 0) {
                return ResponseEntity.badRequest().body("Uno de los elementos tiene ID nulo o inválido.");
            }

            Optional<Medicamento> medicamentoOpt = medicamentoRepository.findById(sm.getMedicamento().getId());
            Optional<Solicitud> solicitudOpt = solicitudRepository.findById(sm.getSolicitud().getId());

            if (medicamentoOpt.isEmpty() || solicitudOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Uno de los medicamentos o solicitudes no existe.");
            }

            sm.setMedicamento(medicamentoOpt.get());
            sm.setSolicitud(solicitudOpt.get());
            listaValidada.add(sm);
        }

        return ResponseEntity.ok(solicitudMedicamentoRepository.saveAll(listaValidada));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SolicitudMedicamento> actualizarSolicitudMedicamento(@PathVariable int id, @RequestBody SolicitudMedicamento solicitudMedicamentoActualizada) {
        Optional<SolicitudMedicamento> solicitudMedicamentoExistente = solicitudMedicamentoRepository.findById(id);
        if (solicitudMedicamentoExistente.isPresent()) {
            SolicitudMedicamento solicitudMedicamento = solicitudMedicamentoExistente.get();
            solicitudMedicamento.setCantidad(solicitudMedicamentoActualizada.getCantidad());
            // No se permite cambiar solicitud ni medicamento una vez creado
            return ResponseEntity.ok(solicitudMedicamentoRepository.save(solicitudMedicamento));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSolicitudMedicamento(@PathVariable int id) {
        if (solicitudMedicamentoRepository.existsById(id)) {
            solicitudMedicamentoRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}