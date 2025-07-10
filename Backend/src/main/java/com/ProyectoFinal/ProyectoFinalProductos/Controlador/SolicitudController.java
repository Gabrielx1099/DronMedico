package com.ProyectoFinal.ProyectoFinalProductos.Controlador;

import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Solicitud;
import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Solicitud.EstadoSolicitud;
import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Solicitud.Prioridad;
import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Solicitud.Region;
import com.ProyectoFinal.ProyectoFinalProductos.Respositorios.SolicitudRepository;
import com.ProyectoFinal.ProyectoFinalProductos.Respositorios.DronRepository;
import com.ProyectoFinal.ProyectoFinalProductos.Respositorios.AppUserRespositorio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "*")
public class SolicitudController {

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private DronRepository dronRepository;

    @Autowired
    private AppUserRespositorio usuarioRepository;

    @GetMapping
    public List<Solicitud> obtenerTodasSolicitudes() {
        return solicitudRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Solicitud> obtenerSolicitudPorId(@PathVariable int id) {
        Optional<Solicitud> solicitud = solicitudRepository.findById(id);
        return solicitud.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Solicitud> obtenerSolicitudesPorUsuario(@PathVariable int usuarioId) {
        return solicitudRepository.findByUsuarioId(usuarioId);
    }

    @GetMapping("/estado/{estado}")
    public List<Solicitud> obtenerSolicitudesPorEstado(@PathVariable EstadoSolicitud estado) {
        return solicitudRepository.findByEstadoSolicitud(estado);
    }

    @GetMapping("/prioridad/{prioridad}")
    public List<Solicitud> obtenerSolicitudesPorPrioridad(@PathVariable Prioridad prioridad) {
        return solicitudRepository.findByPrioridad(prioridad);
    }

    @GetMapping("/region/{region}")
    public List<Solicitud> obtenerSolicitudesPorRegion(@PathVariable Region region) {
        return solicitudRepository.findByRegion(region);
    }

    @GetMapping("/dron/{dronId}")
    public List<Solicitud> obtenerSolicitudesPorDron(@PathVariable int dronId) {
        return solicitudRepository.findByDronAsignadoId(dronId);
    }

    @GetMapping("/pendientes")
    public List<Solicitud> obtenerSolicitudesPendientes() {
        return solicitudRepository.findSolicitudesPendientesOrdenadas();
    }

    @GetMapping("/fecha")
    public List<Solicitud> obtenerSolicitudesPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        return solicitudRepository.findByFechaSolicitudBetween(fechaInicio, fechaFin);
    }

    @GetMapping("/usuario/{usuarioId}/estado/{estado}")
    public List<Solicitud> obtenerSolicitudesPorUsuarioYEstado(@PathVariable int usuarioId, @PathVariable EstadoSolicitud estado) {
        return solicitudRepository.findByUsuarioIdAndEstado(usuarioId, estado);
    }

    @GetMapping("/estadisticas/region/{region}")
    public Long contarSolicitudesActivasPorRegion(@PathVariable Region region) {
        return solicitudRepository.countSolicitudesActivasPorRegion(region);
    }

    @PostMapping
    public ResponseEntity<Solicitud> crearSolicitud(@RequestBody Solicitud solicitud) {
        System.out.println("➡️ JSON recibido en POST /solicitudes:");
        System.out.println("📋 Prioridad: " + solicitud.getPrioridad());
        System.out.println("📋 Región: " + solicitud.getRegion());
        System.out.println("📋 Estado: " + solicitud.getEstadoSolicitud());
        System.out.println("📋 Usuario: " + (solicitud.getUsuario() != null ? solicitud.getUsuario().getId() : "null"));
        System.out.println("📋 Dron: " + (solicitud.getDronAsignado() != null ? solicitud.getDronAsignado().getId() : "null"));
        System.out.println("📋 Destino: " + solicitud.getDestino());

        // Validar dron
        if (solicitud.getDronAsignado() == null || solicitud.getDronAsignado().getId() <= 0) {
            System.err.println("❌ Dron inválido");
            return ResponseEntity.badRequest().body(null);
        }

        var dronOpt = dronRepository.findById(solicitud.getDronAsignado().getId());
        if (dronOpt.isEmpty()) {
            System.err.println("❌ Dron no encontrado");
            return ResponseEntity.badRequest().body(null);
        }

        // Validar usuario
        if (solicitud.getUsuario() == null || solicitud.getUsuario().getId() <= 0) {
            System.err.println("❌ Usuario inválido");
            return ResponseEntity.badRequest().body(null);
        }

        var usuarioOpt = usuarioRepository.findById(solicitud.getUsuario().getId());
        if (usuarioOpt.isEmpty()) {
            System.err.println("❌ Usuario no encontrado");
            return ResponseEntity.badRequest().body(null);
        }

        // Asignar entidades completas
        solicitud.setDronAsignado(dronOpt.get());
        solicitud.setUsuario(usuarioOpt.get());
        solicitud.setFechaSolicitud(LocalDateTime.now());

        Solicitud guardada = solicitudRepository.save(solicitud);
        System.out.println("✅ Solicitud creada con ID: " + guardada.getId());
        return ResponseEntity.ok(guardada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Solicitud> actualizarSolicitud(@PathVariable int id, @RequestBody Solicitud solicitudActualizada) {
        Optional<Solicitud> solicitudExistente = solicitudRepository.findById(id);
        if (solicitudExistente.isPresent()) {
            Solicitud solicitud = solicitudExistente.get();
            solicitud.setPrioridad(solicitudActualizada.getPrioridad());
            solicitud.setDestino(solicitudActualizada.getDestino());
            solicitud.setRegion(solicitudActualizada.getRegion());
            solicitud.setEstadoSolicitud(solicitudActualizada.getEstadoSolicitud());
            solicitud.setDronAsignado(solicitudActualizada.getDronAsignado());
            return ResponseEntity.ok(solicitudRepository.save(solicitud));
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/estado")
public ResponseEntity<Solicitud> cambiarEstadoSolicitud(@PathVariable int id, @RequestParam String nuevoEstado) {
    System.out.println("Intentando cambiar estado de solicitud " + id + " a " + nuevoEstado);
    Optional<Solicitud> solicitudExistente = solicitudRepository.findById(id);
    if (solicitudExistente.isPresent()) {
        Solicitud solicitud = solicitudExistente.get();
        EstadoSolicitud estado;
        try {
estado = EstadoSolicitud.from(nuevoEstado);
        } catch (IllegalArgumentException e) {
            System.out.println("Estado inválido recibido: " + nuevoEstado);
            return ResponseEntity.badRequest().body(null);
        }
        solicitud.setEstadoSolicitud(estado);
        Solicitud guardada = solicitudRepository.save(solicitud);
        System.out.println("Estado actualizado a: " + estado + " para solicitud ID " + id);
        return ResponseEntity.ok(guardada);
    }
    System.out.println("Solicitud con ID " + id + " no encontrada");
    return ResponseEntity.notFound().build();
}



    @PatchMapping("/{id}/asignar-dron")
    public ResponseEntity<Solicitud> asignarDron(@PathVariable int id, @RequestParam int dronId) {
        Optional<Solicitud> solicitudExistente = solicitudRepository.findById(id);
        if (solicitudExistente.isPresent()) {
            Solicitud solicitud = solicitudExistente.get();
            Optional<com.ProyectoFinal.ProyectoFinalProductos.Modelos.Dron> dronOpt = dronRepository.findById(dronId);
            if (dronOpt.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            solicitud.setDronAsignado(dronOpt.get());
            solicitud.setEstadoSolicitud(EstadoSolicitud.asignada);
            return ResponseEntity.ok(solicitudRepository.save(solicitud));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSolicitud(@PathVariable int id) {
        if (solicitudRepository.existsById(id)) {
            solicitudRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // 🛑 Captura cualquier excepción para ver el error exacto en consola
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        e.printStackTrace();
        return ResponseEntity.badRequest().body("❌ Error interno: " + e.getMessage());
    }
}
