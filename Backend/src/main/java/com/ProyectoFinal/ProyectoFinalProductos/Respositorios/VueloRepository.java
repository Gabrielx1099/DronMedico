package com.ProyectoFinal.ProyectoFinalProductos.Respositorios;

import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Solicitud.EstadoSolicitud;
import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Vuelo;
import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Vuelo.EstadoEntrega;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VueloRepository extends JpaRepository<Vuelo, Integer> {
    
    List<Vuelo> findBySolicitudId(int solicitudId);
    
    List<Vuelo> findByDronId(int dronId);
    
    List<Vuelo> findByEstadoEntrega(EstadoEntrega estadoEntrega);
    
    List<Vuelo> findBySolicitud_Usuario_Id(int usuarioId);

    
    @Query("SELECT v FROM Vuelo v WHERE v.fechaInicio BETWEEN :fechaInicio AND :fechaFin")
    List<Vuelo> findByFechaInicioBetween(@Param("fechaInicio") LocalDateTime fechaInicio, 
                                        @Param("fechaFin") LocalDateTime fechaFin);
    
    @Query("SELECT v FROM Vuelo v WHERE v.dron.id = :dronId AND v.fechaInicio BETWEEN :fechaInicio AND :fechaFin")
    List<Vuelo> findVuelosPorDronYFecha(@Param("dronId") int dronId, 
                                       @Param("fechaInicio") LocalDateTime fechaInicio, 
                                       @Param("fechaFin") LocalDateTime fechaFin);
    
    @Query("SELECT AVG(v.duracionMinutos) FROM Vuelo v WHERE v.estadoEntrega = 'exitoso'")
    Double getPromedioDuracionVuelosExitosos();
    
    @Query("SELECT SUM(v.distanciaKm) FROM Vuelo v WHERE v.dron.id = :dronId")
    Double getTotalDistanciaRecorridaPorDron(@Param("dronId") int dronId);
    
    @Query("SELECT COUNT(v) FROM Vuelo v WHERE v.estadoEntrega = :estado AND v.fechaInicio BETWEEN :fechaInicio AND :fechaFin")
    Long countVuelosPorEstadoYFecha(@Param("estado") EstadoEntrega estado, 
                                   @Param("fechaInicio") LocalDateTime fechaInicio, 
                                   @Param("fechaFin") LocalDateTime fechaFin);

    @Query("SELECT v FROM Vuelo v WHERE v.solicitud.usuario.id = :usuarioId AND v.solicitud.estadoSolicitud = :estado")
    List<Vuelo> findByUsuarioIdAndSolicitudEstado(@Param("usuarioId") int usuarioId, @Param("estado") EstadoSolicitud estado);

}