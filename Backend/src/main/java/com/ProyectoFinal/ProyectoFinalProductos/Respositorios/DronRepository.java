package com.ProyectoFinal.ProyectoFinalProductos.Respositorios;

import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Dron;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface DronRepository extends JpaRepository<Dron, Integer> {
    
    Optional<Dron> findByIdentificador(String identificador);
    
    List<Dron> findByModelo(String modelo);
    
    List<Dron> findByNivelBateriaGreaterThan(Integer nivelMinimo);
    
    List<Dron> findByCapacidadKgGreaterThanEqual(BigDecimal capacidadMinima);
    
    @Query("SELECT d FROM Dron d WHERE d.nivelBateria > :bateria AND d.capacidadKg >= :capacidad")
    List<Dron> findDronesDisponibles(@Param("bateria") Integer nivelBateria, 
                                   @Param("capacidad") BigDecimal capacidadRequerida);
    
    @Query("SELECT d FROM Dron d WHERE d.id NOT IN (SELECT s.dronAsignado.id FROM Solicitud s WHERE s.estadoSolicitud IN ('asignada', 'en_proceso'))")
    List<Dron> findDronesLibres();
}