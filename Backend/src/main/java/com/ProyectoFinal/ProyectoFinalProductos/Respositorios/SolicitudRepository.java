package com.ProyectoFinal.ProyectoFinalProductos.Respositorios;

import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Solicitud;
import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Solicitud.EstadoSolicitud;
import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Solicitud.Prioridad;
import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Solicitud.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Integer> {
    
    List<Solicitud> findByUsuarioId(int usuarioId);
    
    List<Solicitud> findByEstadoSolicitud(EstadoSolicitud estadoSolicitud);
    
    List<Solicitud> findByPrioridad(Prioridad prioridad);
    
    List<Solicitud> findByRegion(Region region);
    
    List<Solicitud> findByDronAsignadoId(int dronId);
    
    @Query("SELECT s FROM Solicitud s WHERE s.fechaSolicitud BETWEEN :fechaInicio AND :fechaFin")
    List<Solicitud> findByFechaSolicitudBetween(@Param("fechaInicio") LocalDateTime fechaInicio, 
                                               @Param("fechaFin") LocalDateTime fechaFin);
    
    @Query("SELECT s FROM Solicitud s WHERE s.estadoSolicitud = 'pendiente' ORDER BY s.prioridad ASC, s.fechaSolicitud ASC")
    List<Solicitud> findSolicitudesPendientesOrdenadas();
    
    @Query("SELECT s FROM Solicitud s WHERE s.usuario.id = :usuarioId AND s.estadoSolicitud = :estado")
    List<Solicitud> findByUsuarioIdAndEstado(@Param("usuarioId") int usuarioId, 
                                           @Param("estado") EstadoSolicitud estado);
    
    @Query("SELECT COUNT(s) FROM Solicitud s WHERE s.region = :region AND s.estadoSolicitud IN ('asignada', 'en_proceso')")
    Long countSolicitudesActivasPorRegion(@Param("region") Region region);
}
