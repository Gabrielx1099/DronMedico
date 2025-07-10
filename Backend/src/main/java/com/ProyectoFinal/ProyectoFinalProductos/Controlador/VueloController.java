package com.ProyectoFinal.ProyectoFinalProductos.Controlador;

import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Vuelo;
import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Vuelo.EstadoEntrega;
import com.ProyectoFinal.ProyectoFinalProductos.Respositorios.VueloRepository;
import com.ProyectoFinal.ProyectoFinalProductos.Respositorios.SolicitudRepository;
import com.ProyectoFinal.ProyectoFinalProductos.Respositorios.DronRepository;
import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Dron;
import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Solicitud;
import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vuelos")
@CrossOrigin(origins = "*")
public class VueloController {

    @Autowired
    private VueloRepository vueloRepository;

    @Autowired
    private DronRepository dronRepository;

    @Autowired
    private SolicitudRepository solicitudRepository;

    @GetMapping
    public List<Vuelo> obtenerTodosVuelos() {
        return vueloRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vuelo> obtenerVueloPorId(@PathVariable int id) {
        Optional<Vuelo> vuelo = vueloRepository.findById(id);
        return vuelo.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/solicitud/{solicitudId}")
    public List<Vuelo> obtenerVuelosPorSolicitud(@PathVariable int solicitudId) {
        return vueloRepository.findBySolicitudId(solicitudId);
    }

    @GetMapping("/dron/{dronId}")
    public List<Vuelo> obtenerVuelosPorDron(@PathVariable int dronId) {
        return vueloRepository.findByDronId(dronId);
    }

    @GetMapping("/estado/{estado}")
    public List<Vuelo> obtenerVuelosPorEstado(@PathVariable EstadoEntrega estado) {
        return vueloRepository.findByEstadoEntrega(estado);
    }

    @GetMapping("/fecha")
    public List<Vuelo> obtenerVuelosPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        return vueloRepository.findByFechaInicioBetween(fechaInicio, fechaFin);
    }

    @GetMapping("/dron/{dronId}/fecha")
    public List<Vuelo> obtenerVuelosPorDronYFecha(
            @PathVariable int dronId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        return vueloRepository.findVuelosPorDronYFecha(dronId, fechaInicio, fechaFin);
    }

    @GetMapping("/estadisticas/duracion-promedio")
    public Double obtenerPromedioDuracionVuelosExitosos() {
        return vueloRepository.getPromedioDuracionVuelosExitosos();
    }

    @GetMapping("/estadisticas/dron/{dronId}/distancia-total")
    public Double obtenerTotalDistanciaRecorridaPorDron(@PathVariable int dronId) {
        return vueloRepository.getTotalDistanciaRecorridaPorDron(dronId);
    }

    @GetMapping("/estadisticas/contar")
    public Long contarVuelosPorEstadoYFecha(
            @RequestParam EstadoEntrega estado,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        return vueloRepository.countVuelosPorEstadoYFecha(estado, fechaInicio, fechaFin);
    }
        // En VueloController.java
        @GetMapping("/usuario/{usuarioId}")
        public List<Vuelo> obtenerVuelosPorUsuario(@PathVariable int usuarioId) {
            return vueloRepository.findBySolicitud_Usuario_Id(usuarioId);
        }

    // ✅ POST: CREAR VUELO CON VALIDACIÓN Y CAMPOS OPCIONALES
    @PostMapping
    public ResponseEntity<?> crearVuelo(@RequestBody Vuelo vuelo) {
        try {
            System.out.println("📦 POST /api/vuelos");
            System.out.println("Solicitud ID: " + (vuelo.getSolicitud() != null ? vuelo.getSolicitud().getId() : "null"));
            System.out.println("Dron ID: " + (vuelo.getDron() != null ? vuelo.getDron().getId() : "null"));
            System.out.println("Fecha inicio: " + vuelo.getFechaInicio());

            // Validar solicitud
            if (vuelo.getSolicitud() == null || vuelo.getSolicitud().getId() <= 0) {
                return ResponseEntity.badRequest().body("Solicitud inválida o no especificada.");
            }

            Optional<Solicitud> solicitudOpt = solicitudRepository.findById(vuelo.getSolicitud().getId());
            if (solicitudOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("No se encontró la solicitud.");
            }

            // Validar dron
            if (vuelo.getDron() == null || vuelo.getDron().getId() <= 0) {
                return ResponseEntity.badRequest().body("Dron inválido o no especificado.");
            }

            Optional<Dron> dronOpt = dronRepository.findById(vuelo.getDron().getId());
            if (dronOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("No se encontró el dron.");
            }

            // Asignar objetos completos
            vuelo.setSolicitud(solicitudOpt.get());
            vuelo.setDron(dronOpt.get());

            Vuelo guardado = vueloRepository.save(vuelo);
            return ResponseEntity.ok(guardado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Error interno al guardar vuelo: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vuelo> actualizarVuelo(@PathVariable int id, @RequestBody Vuelo vueloActualizado) {
        Optional<Vuelo> vueloExistente = vueloRepository.findById(id);
        if (vueloExistente.isPresent()) {
            Vuelo vuelo = vueloExistente.get();
            vuelo.setFechaInicio(vueloActualizado.getFechaInicio());
            vuelo.setFechaFin(vueloActualizado.getFechaFin());
            vuelo.setDuracionMinutos(vueloActualizado.getDuracionMinutos());
            vuelo.setDistanciaKm(vueloActualizado.getDistanciaKm());
            vuelo.setEstadoEntrega(vueloActualizado.getEstadoEntrega());
            return ResponseEntity.ok(vueloRepository.save(vuelo));
        }
        return ResponseEntity.notFound().build();
    }
@PatchMapping("/{id}/finalizar")
public ResponseEntity<Vuelo> finalizarVuelo(
        @PathVariable int id,
        @RequestParam EstadoEntrega estadoFinal,
        @RequestParam(required = false) BigDecimal distanciaKm) {  // <-- Aquí

    Optional<Vuelo> vueloExistente = vueloRepository.findById(id);
    if (vueloExistente.isPresent()) {
        Vuelo vuelo = vueloExistente.get();

        vuelo.setFechaFin(LocalDateTime.now());
        vuelo.setEstadoEntrega(estadoFinal);

        if (vuelo.getFechaInicio() != null) {
            long duracion = java.time.Duration.between(vuelo.getFechaInicio(), vuelo.getFechaFin()).toMinutes();
            vuelo.setDuracionMinutos((int) duracion);
        }

        if (distanciaKm != null) {
            vuelo.setDistanciaKm(distanciaKm);  // Ahora coincide el tipo
        }

        return ResponseEntity.ok(vueloRepository.save(vuelo));
    }
    return ResponseEntity.notFound().build();
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarVuelo(@PathVariable int id) {
        if (vueloRepository.existsById(id)) {
            vueloRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
